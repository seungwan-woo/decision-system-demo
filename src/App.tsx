import { useMemo, useState } from 'react'
import './App.css'
import { EdgeDetails } from './components/EdgeDetails'
import { GraphView } from './components/GraphView'
import { TracePanel } from './components/TracePanel'
import { clearDummyData, fillDummyData, intentLabels, selectIntent } from './domain/graphStore'
import type { ContextEdge, DemoState, UserIntent } from './domain/types'

const initialState: DemoState = {
  graph: { nodes: [], edges: [] },
  selectedIntent: 'sharesheet',
  trace: [],
}

function App() {
  const [state, setState] = useState<DemoState>(initialState)
  const [selectedEdge, setSelectedEdge] = useState<ContextEdge | undefined>()

  const sourceCounts = useMemo(() => {
    return state.graph.nodes.reduce<Record<string, number>>((acc, node) => {
      const key = node.source ?? node.kind
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    }, {})
  }, [state.graph.nodes])

  const applyIntent = (intent: UserIntent) => {
    setState((current) => {
      const withData = current.graph.nodes.length === 0 ? fillDummyData(current) : current
      return selectIntent(withData, intent)
    })
  }

  return (
    <main className="app-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">Personal Context Manager · Context Graph Demo</p>
          <h1>Decision System Demo</h1>
          <p>
            PDE Feature Data, Context Engine(CE), Current Info를 작은 in-memory graph DB처럼 구성하고,
            사용자 intent 선택이 어떤 FeatureKey / Evidence edge를 거쳐 decision으로 이어지는지 추적합니다.
          </p>
        </div>
        <div className="hero-stats" aria-label="graph statistics">
          <strong>nodes: {state.graph.nodes.length}</strong>
          <strong>edges: {state.graph.edges.length}</strong>
          <span>PDE: {sourceCounts.PDE ?? 0}</span>
          <span>CE: {sourceCounts.CE ?? 0}</span>
          <span>Current: {sourceCounts.CURRENT_INFO ?? 0}</span>
        </div>
      </header>

      <section className="controls panel">
        <div>
          <h2>Dummy data</h2>
          <p>데모용 PDE, CE, current info node/edge를 채우거나 삭제합니다.</p>
        </div>
        <div className="button-row">
          <button type="button" onClick={() => setState((current) => fillDummyData(current))}>Fill dummy data</button>
          <button type="button" className="secondary" onClick={() => { setState((current) => clearDummyData(current)); setSelectedEdge(undefined) }}>Clear dummy data</button>
        </div>
      </section>

      <section className="intent panel">
        <h2>User intent</h2>
        <label onClick={() => applyIntent('sharesheet')}>
          <input
            type="radio"
            name="intent"
            checked={state.selectedIntent === 'sharesheet'}
            readOnly
          />
          {intentLabels.sharesheet}
        </label>
        <label onClick={() => applyIntent('nudge')}>
          <input
            type="radio"
            name="intent"
            checked={state.selectedIntent === 'nudge'}
            readOnly
          />
          {intentLabels.nudge}
        </label>
        <div className="button-row">
          <button type="button" className="secondary" onClick={() => applyIntent('sharesheet')}>Run sharesheet scenario</button>
          <button type="button" onClick={() => applyIntent('nudge')}>Run nudge scenario</button>
        </div>
      </section>

      <section className="workspace">
        <section className="panel graph-panel">
          <div className="panel-heading">
            <div>
              <h2>Context graph</h2>
              <p>Entity Graph + Evidence Graph + Usage Graph를 한 화면에 합친 demo renderer입니다.</p>
            </div>
            <span className="legend">edge 선택 → detail 조회</span>
          </div>
          <GraphView graph={state.graph} selectedEdgeId={selectedEdge?.id} onSelectEdge={setSelectedEdge} />
        </section>
        <EdgeDetails edge={selectedEdge} />
      </section>

      <TracePanel trace={state.trace} />
    </main>
  )
}

export default App
