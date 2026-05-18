import { describe, expect, it } from 'vitest'
import { buildDummyGraph } from './demoData'
import { clearDummyData, fillDummyData, selectIntent } from './graphStore'
import type { DemoState } from './types'

const emptyState = (): DemoState => ({
  graph: { nodes: [], edges: [] },
  selectedIntent: 'sharesheet',
  trace: [],
})

describe('decision system demo graph model', () => {
  it('builds dummy PDE, CE, and current info data as one traceable context graph', () => {
    const graph = buildDummyGraph()

    expect(graph.nodes.some((node) => node.source === 'PDE')).toBe(true)
    expect(graph.nodes.some((node) => node.source === 'CE')).toBe(true)
    expect(graph.nodes.some((node) => node.source === 'CURRENT_INFO')).toBe(true)
    expect(graph.nodes.some((node) => node.kind === 'FeatureKey' && node.id === 'feature-share-target-affinity')).toBe(true)
    expect(graph.edges.every((edge) => edge.evidence.sourceUri.length > 0)).toBe(true)
  })

  it('fills and clears dummy data without losing user intent defaults', () => {
    const filled = fillDummyData(emptyState())
    expect(filled.graph.nodes.length).toBeGreaterThan(8)
    expect(filled.graph.edges.length).toBeGreaterThan(8)

    const cleared = clearDummyData(filled)
    expect(cleared.graph.nodes).toEqual([])
    expect(cleared.graph.edges).toEqual([])
    expect(cleared.selectedIntent).toBe('sharesheet')
  })

  it('records sharesheet intent as a decision trace linked to required feature edges', () => {
    const selected = selectIntent(fillDummyData(emptyState()), 'sharesheet')
    const latest = selected.trace.at(-1)

    expect(selected.selectedIntent).toBe('sharesheet')
    expect(latest?.selectedLabel).toContain('sharesheet')
    expect(latest?.usedFeatureIds).toContain('feature-share-target-affinity')
    expect(latest?.decision).toContain('Quick Share')
    expect(latest?.edgeIds.length).toBeGreaterThan(0)
  })

  it('records nudge intent as a decision trace linked to app recommendation features', () => {
    const selected = selectIntent(fillDummyData(emptyState()), 'nudge')
    const latest = selected.trace.at(-1)

    expect(selected.selectedIntent).toBe('nudge')
    expect(latest?.selectedLabel).toContain('nudge')
    expect(latest?.usedFeatureIds).toContain('feature-arrival-travel-context')
    expect(latest?.decision).toContain('Travel app nudge')
    expect(latest?.reason).toContain('current location')
  })
})
