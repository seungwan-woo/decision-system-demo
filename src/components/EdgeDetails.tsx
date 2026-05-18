import type { ContextEdge } from '../domain/types'

interface EdgeDetailsProps {
  edge?: ContextEdge
}

export function EdgeDetails({ edge }: EdgeDetailsProps) {
  if (!edge) {
    return (
      <aside className="panel edge-details">
        <h2>Edge details</h2>
        <p>그래프의 edge(label 또는 line)를 선택하면 evidence(근거), sourceUri, confidence를 확인할 수 있습니다.</p>
      </aside>
    )
  }

  return (
    <aside className="panel edge-details">
      <h2>Edge details</h2>
      <dl>
        <div>
          <dt>id</dt>
          <dd>{edge.id}</dd>
        </div>
        <div>
          <dt>relation</dt>
          <dd>{edge.source} → {edge.target} / {edge.kind}</dd>
        </div>
        <div>
          <dt>confidence</dt>
          <dd>{Math.round(edge.confidence * 100)}%</dd>
        </div>
        <div>
          <dt>evidence source</dt>
          <dd>{edge.evidence.source}</dd>
        </div>
        <div>
          <dt>sourceUri</dt>
          <dd>{edge.evidence.sourceUri}</dd>
        </div>
        <div>
          <dt>collector / analyzer</dt>
          <dd>{edge.evidence.collector} / {edge.evidence.analyzer}</dd>
        </div>
        <div>
          <dt>augmented</dt>
          <dd>{String(edge.evidence.augmented)}</dd>
        </div>
        <div>
          <dt>detail</dt>
          <dd>{edge.evidence.detail}</dd>
        </div>
      </dl>
    </aside>
  )
}
