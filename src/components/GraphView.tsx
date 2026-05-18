import type { ContextEdge, ContextGraph } from '../domain/types'

interface GraphViewProps {
  graph: ContextGraph
  selectedEdgeId?: string
  onSelectEdge: (edge: ContextEdge) => void
}

const radiusByKind = new Map([
  ['DataSource', 28],
  ['FeatureKey', 25],
  ['Agent', 29],
  ['Cache', 26],
])

function position(index: number, total: number) {
  if (total === 0) return { x: 400, y: 260 }
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  const ring = index % 3 === 0 ? 190 : index % 3 === 1 ? 130 : 70
  return {
    x: 420 + Math.cos(angle) * ring,
    y: 260 + Math.sin(angle) * ring,
  }
}

export function GraphView({ graph, selectedEdgeId, onSelectEdge }: GraphViewProps) {
  const positions = new Map(graph.nodes.map((node, index) => [node.id, position(index, graph.nodes.length)]))

  if (graph.nodes.length === 0) {
    return (
      <div className="empty-graph">
        <strong>Context graph is empty.</strong>
        <span>Fill dummy data to create PDE, CE, current info nodes and traceable edges.</span>
      </div>
    )
  }

  return (
    <>
      <svg className="graph-canvas" viewBox="0 0 840 520" role="img" aria-label="context graph renderer">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
          </marker>
        </defs>
      <g className="edges">
        {graph.edges.map((edge) => {
          const source = positions.get(edge.source)
          const target = positions.get(edge.target)
          if (!source || !target) return null
          const selected = edge.id === selectedEdgeId
          const midX = (source.x + target.x) / 2
          const midY = (source.y + target.y) / 2
          return (
            <g key={edge.id} className={selected ? 'edge selected' : 'edge'}>
              <line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                markerEnd="url(#arrow)"
                role="button"
                tabIndex={0}
                aria-label={`edge ${edge.label}`}
                onClick={() => onSelectEdge(edge)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') onSelectEdge(edge)
                }}
              />
              <text x={midX} y={midY} onClick={() => onSelectEdge(edge)}>
                {edge.label}
              </text>
            </g>
          )
        })}
      </g>
      <g className="nodes">
        {graph.nodes.map((node, index) => {
          const p = positions.get(node.id) ?? position(index, graph.nodes.length)
          const radius = radiusByKind.get(node.kind) ?? 22
          return (
            <g key={node.id} className={`node node-${node.source ?? node.kind}`} transform={`translate(${p.x} ${p.y})`}>
              <circle r={radius} />
              <text y={radius + 15}>{node.label}</text>
              <title>{node.summary}</title>
            </g>
          )
        })}
      </g>
      </svg>
      <div className="edge-inspector-list" aria-label="edge inspector list">
        {graph.edges.map((edge) => (
          <button
            key={edge.id}
            type="button"
            className={edge.id === selectedEdgeId ? 'edge-chip selected' : 'edge-chip'}
            onClick={() => onSelectEdge(edge)}
          >
            Inspect {edge.label}
          </button>
        ))}
      </div>
    </>
  )
}
