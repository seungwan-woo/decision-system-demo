import mermaid from 'mermaid'
import { useEffect, useId, useState } from 'react'

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'dark',
  themeVariables: {
    background: '#07101f',
    primaryColor: '#172338',
    primaryTextColor: '#eef5ff',
    primaryBorderColor: '#67e8f9',
    lineColor: '#93a4c0',
    secondaryColor: '#0f172a',
    tertiaryColor: '#1e293b',
  },
})

const moduleView = `flowchart TB
  subgraph UI[UI Layer]
    App[App.tsx\nPage composition / state owner]
    GraphView[GraphView.tsx\nContext graph renderer + edge inspector]
    EdgeDetails[EdgeDetails.tsx\nEvidence detail panel]
    TracePanel[TracePanel.tsx\nDecision trace viewer]
    Arch[ArchitectureGuide.tsx\nDemo structure guide]
  end

  subgraph Domain[Domain Layer]
    Types[types.ts\nContextNode / ContextEdge / DemoState]
    DemoData[demoData.ts\nPDE + CE + Current Info dummy graph]
    Store[graphStore.ts\nfill / clear / selectIntent / trace]
  end

  subgraph External[External Boundary]
    Browser[GitHub Pages Browser Runtime]
    Pages[GitHub Actions + gh-pages]
  end

  Browser --> App
  App --> GraphView
  App --> EdgeDetails
  App --> TracePanel
  App --> Arch
  App --> Store
  Store --> DemoData
  Store --> Types
  DemoData --> Types
  Pages --> Browser`

const componentConnectorView = `flowchart LR
  User[User]
  Controls[Dummy Data + Intent Controls]
  GraphDB[(In-memory Graph DB\nContextGraph)]
  Renderer[Context Graph Renderer]
  Inspector[Edge Detail Inspector]
  Decision[Decision Engine\nselectIntent]
  Trace[(Append-only Decision Trace)]

  PDE[PDE Feature Data]
  CE[Context Engine]
  Current[Current Info]

  PDE -->|dummy feature entities| GraphDB
  CE -->|real-time context signals| GraphDB
  Current -->|share payload / time / location| GraphDB

  User -->|fill / clear| Controls
  Controls -->|populate graph| GraphDB
  GraphDB -->|nodes + edges| Renderer
  User -->|inspect edge| Renderer
  Renderer -->|ContextEdge| Inspector

  User -->|sharesheet or nudge intent| Controls
  Controls --> Decision
  Decision -->|queries FeatureKey / Evidence edges| GraphDB
  Decision -->|decision + reason + edgeIds| Trace
  Trace -->|observable history| User`

const featureFlowView = `sequenceDiagram
  actor User
  participant UI as App / Controls
  participant Store as graphStore
  participant Data as demoData
  participant Graph as ContextGraph
  participant Agent as Decision Agent
  participant Trace as Decision Trace

  User->>UI: Fill dummy data
  UI->>Store: fillDummyData(state)
  Store->>Data: buildDummyGraph()
  Data-->>Store: PDE + CE + Current Info nodes/edges
  Store-->>Graph: ContextGraph
  Graph-->>UI: render nodes / edges / inspector chips

  User->>UI: Run nudge scenario
  UI->>Store: selectIntent(state, nudge)
  Store->>Agent: resolve required FeatureKey
  Agent->>Graph: use feature-arrival-travel-context evidence edges
  Agent-->>Store: decision + reason + edgeIds
  Store-->>Trace: append DecisionTraceEntry
  Trace-->>UI: show traceable recommendation`

function MermaidBlock({ title, diagram }: { title: string; diagram: string }) {
  const reactId = useId()
  const diagramId = `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const [renderedSvg, setRenderedSvg] = useState<string | null>(null)
  const [renderError, setRenderError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function renderDiagram() {
      try {
        const { svg } = await mermaid.render(diagramId, diagram)
        if (!cancelled) {
          setRenderedSvg(svg)
          setRenderError(null)
        }
      } catch (error) {
        if (!cancelled) {
          setRenderedSvg(null)
          setRenderError(error instanceof Error ? error.message : 'Failed to render Mermaid diagram')
        }
      }
    }

    void renderDiagram()

    return () => {
      cancelled = true
    }
  }, [diagram, diagramId])

  return (
    <figure className="mermaid-card">
      <figcaption>{title}</figcaption>
      {renderedSvg ? (
        <div
          className="mermaid-rendered"
          data-testid="mermaid-rendered-diagram"
          aria-label={`${title} rendered Mermaid diagram`}
          dangerouslySetInnerHTML={{ __html: renderedSvg }}
        />
      ) : (
        <pre className="mermaid-source"><code>{diagram}</code></pre>
      )}
      {renderError ? <p className="mermaid-error">Mermaid render failed: {renderError}</p> : null}
      <details className="mermaid-source-details">
        <summary>Mermaid source</summary>
        <pre><code>{diagram}</code></pre>
      </details>
    </figure>
  )
}

export function ArchitectureGuide() {
  return (
    <section className="panel architecture-guide" aria-labelledby="architecture-guide-title">
      <p className="eyebrow">Architecture Documentation Page</p>
      <h2 id="architecture-guide-title">Demo Architecture Guide</h2>
      <p>
        이 페이지는 demo의 구조와 각 기능을 설명합니다. 핵심 목표는 PDE Feature Data, Context Engine,
        Current Info를 하나의 traceable context graph로 연결하고, 사용자의 intent 선택이 FeatureKey와
        Evidence edge를 거쳐 decision으로 이어지는 과정을 눈으로 확인하는 것입니다.
      </p>

      <div className="architecture-grid">
        <article>
          <h3>기능 요약</h3>
          <ul>
            <li><strong>Dummy data:</strong> PDE / CE / Current Info node와 evidence edge를 in-memory graph에 채웁니다.</li>
            <li><strong>Context graph:</strong> Entity Graph, Evidence Graph, Usage Graph를 하나의 SVG view로 렌더링합니다.</li>
            <li><strong>Edge inspection:</strong> edge chip을 선택하면 confidence, sourceUri, collector, analyzer, augmented 여부를 확인합니다.</li>
            <li><strong>Intent decision:</strong> sharesheet / nudge scenario를 실행하고 사용 feature와 reason을 trace로 남깁니다.</li>
          </ul>
        </article>
        <article>
          <h3>핵심 설계 원칙</h3>
          <ul>
            <li><strong>Over-spec 방지:</strong> 실제 graph DB 대신 demo 목적의 lightweight in-memory graph DB를 사용합니다.</li>
            <li><strong>Evidence-first:</strong> 모든 edge는 sourceUri, collector, analyzer, confidence를 가집니다.</li>
            <li><strong>Traceability:</strong> decision은 사용한 FeatureKey와 edge id를 append-only trace로 남깁니다.</li>
            <li><strong>Separation of concerns:</strong> UI rendering, domain state transition, dummy graph data를 분리했습니다.</li>
          </ul>
        </article>
      </div>

      <h3>Module View</h3>
      <p>
        Module View(모듈 뷰)는 source code의 정적 구조를 보여줍니다. UI component는 화면 표현을 담당하고,
        domain module은 ContextNode / ContextEdge / DecisionTraceEntry model과 상태 전이를 담당합니다.
      </p>
      <MermaidBlock title="Module view — React UI와 domain graph modules" diagram={moduleView} />

      <h3>Component-and-Connector View</h3>
      <p>
        Component-and-Connector View(C&amp;C 뷰)는 runtime에서 사용자가 control을 누른 뒤 graph, renderer,
        decision engine, trace가 어떻게 connector로 연결되는지 보여줍니다.
      </p>
      <MermaidBlock title="C&amp;C view — runtime connector and data flow" diagram={componentConnectorView} />

      <h3>Interaction / Decision Flow</h3>
      <p>
        아래 sequence는 nudge scenario를 기준으로, dummy graph 구성부터 decision trace가 생성되기까지의 흐름을 설명합니다.
      </p>
      <MermaidBlock title="Decision flow — fill data and run nudge scenario" diagram={featureFlowView} />

      <h3>Module responsibilities</h3>
      <dl className="responsibility-list">
        <div><dt>types.ts</dt><dd>Context graph, evidence edge, user intent, decision trace의 type vocabulary를 정의합니다.</dd></div>
        <div><dt>demoData.ts</dt><dd>PDE Feature Data, Context Engine, Current Info dummy nodes/edges를 생성합니다.</dd></div>
        <div><dt>graphStore.ts</dt><dd>fillDummyData, clearDummyData, selectIntent를 통해 state transition을 수행합니다.</dd></div>
        <div><dt>GraphView.tsx</dt><dd>context graph를 SVG로 렌더링하고 접근성 있는 edge inspector chip을 제공합니다.</dd></div>
        <div><dt>EdgeDetails.tsx</dt><dd>선택한 edge의 evidence detail을 보여줍니다.</dd></div>
        <div><dt>TracePanel.tsx</dt><dd>사용자 선택과 decision 결과를 append-only history로 표시합니다.</dd></div>
      </dl>
    </section>
  )
}
