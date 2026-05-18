import { buildDummyGraph } from './demoData'
import type { DecisionTraceEntry, DemoState, UserIntent } from './types'

export const intentLabels: Record<UserIntent, string> = {
  sharesheet: 'sharesheet에서 문서나 사진이나 텍스트를 공유하는 시나리오',
  nudge: '현재 맥락에 맞는 app을 nudge 형식으로 추천/decision하는 시나리오',
}

export function fillDummyData(state: DemoState): DemoState {
  return { ...state, graph: buildDummyGraph() }
}

export function clearDummyData(state: DemoState): DemoState {
  return { ...state, graph: { nodes: [], edges: [] }, trace: [] }
}

export function selectIntent(state: DemoState, intent: UserIntent): DemoState {
  const trace = buildDecisionTrace(state, intent)
  return {
    ...state,
    selectedIntent: intent,
    trace: [...state.trace, trace],
  }
}

function buildDecisionTrace(state: DemoState, intent: UserIntent): DecisionTraceEntry {
  const featureIds =
    intent === 'sharesheet'
      ? ['feature-share-target-affinity', 'feature-payload-semantics']
      : ['feature-arrival-travel-context']

  const relatedEdges = state.graph.edges.filter(
    (edge) => featureIds.includes(edge.source) || featureIds.includes(edge.target) || edge.kind === 'queriedBy',
  )

  const now = new Date().toISOString()

  if (intent === 'sharesheet') {
    return {
      id: `trace-${intent}-${state.trace.length + 1}`,
      at: now,
      intent,
      selectedLabel: intentLabels[intent],
      usedFeatureIds: featureIds,
      decision: 'Quick Share → Minji, Messages를 상위 후보로 추천',
      reason: 'Payload semantics(photo + text)와 PDE share target affinity가 모두 높은 confidence로 연결되어 있습니다.',
      edgeIds: relatedEdges.map((edge) => edge.id),
    }
  }

  return {
    id: `trace-${intent}-${state.trace.length + 1}`,
    at: now,
    intent,
    selectedLabel: intentLabels[intent],
    usedFeatureIds: featureIds,
    decision: 'Travel app nudge: 지도/교통/예약 앱을 조용한 카드로 추천',
    reason: 'current location arrival signal, ScheduledTravel event, Event 4W schema가 연결되어 현재 맥락에 맞는 app nudge 조건을 만족합니다.',
    edgeIds: relatedEdges.map((edge) => edge.id),
  }
}
