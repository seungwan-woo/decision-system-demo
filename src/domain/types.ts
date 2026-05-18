export type DataSourceKind = 'PDE' | 'CE' | 'CURRENT_INFO'

export type NodeKind =
  | 'User'
  | 'Person'
  | 'Preference'
  | 'Event'
  | 'Activity'
  | 'Place'
  | 'When'
  | 'What'
  | 'Who'
  | 'FeatureKey'
  | 'Schema'
  | 'Metadata'
  | 'Cache'
  | 'Agent'
  | 'Intent'
  | 'Decision'
  | 'DataSource'
  | 'Evidence'

export type EdgeKind =
  | 'hasProfile'
  | 'hasPreference'
  | 'hasEvent'
  | 'performed'
  | 'hasWhen'
  | 'hasWhere'
  | 'hasWho'
  | 'hasWhat'
  | 'requires'
  | 'representedBy'
  | 'hasDescription'
  | 'storedIn'
  | 'queriedBy'
  | 'derivedFrom'
  | 'generatedBy'
  | 'hasConfidence'
  | 'selectedIntent'
  | 'producedDecision'
  | 'usesFeature'

export type UserIntent = 'sharesheet' | 'nudge'

export interface ContextNode {
  id: string
  label: string
  kind: NodeKind
  source?: DataSourceKind
  summary?: string
  payload?: Record<string, unknown>
}

export interface ContextEdge {
  id: string
  source: string
  target: string
  kind: EdgeKind
  label: string
  confidence: number
  evidence: {
    source: DataSourceKind | 'USER_SELECTION' | 'DEMO_ENGINE'
    sourceUri: string
    collector: string
    analyzer?: string
    observedAt: string
    augmented: boolean
    version: string
    detail: string
  }
}

export interface ContextGraph {
  nodes: ContextNode[]
  edges: ContextEdge[]
}

export interface DecisionTraceEntry {
  id: string
  at: string
  intent: UserIntent
  selectedLabel: string
  usedFeatureIds: string[]
  decision: string
  reason: string
  edgeIds: string[]
}

export interface DemoState {
  graph: ContextGraph
  selectedIntent: UserIntent
  trace: DecisionTraceEntry[]
}
