import type { DecisionTraceEntry } from '../domain/types'

export function TracePanel({ trace }: { trace: DecisionTraceEntry[] }) {
  return (
    <section className="panel trace-panel">
      <h2>Decision trace</h2>
      {trace.length === 0 ? (
        <p>사용자 intent를 선택하면 feature, edge, decision reason이 append-only trace로 남습니다.</p>
      ) : (
        <ol>
          {trace.toReversed().map((entry) => (
            <li key={entry.id}>
              <strong>{entry.decision}</strong>
              <span>{entry.selectedLabel}</span>
              <p>{entry.reason}</p>
              <code>{entry.usedFeatureIds.join(' · ')}</code>
              <small>edges: {entry.edgeIds.join(', ')}</small>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
