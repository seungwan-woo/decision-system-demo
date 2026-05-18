import type { ContextEdge, ContextGraph, ContextNode } from './types'

const observedAt = '2026-05-19T08:30:00+09:00'

const node = (input: ContextNode): ContextNode => input

const edge = (input: ContextEdge): ContextEdge => input

export function buildDummyGraph(): ContextGraph {
  const nodes: ContextNode[] = [
    node({ id: 'user-me', label: 'User', kind: 'User', summary: 'Demo device owner / personal context root' }),
    node({ id: 'pde', label: 'PDE Feature Data', kind: 'DataSource', source: 'PDE', summary: 'Personal Data Engine demo source: profile, preference, memory, app usage.' }),
    node({ id: 'ce', label: 'Context Engine', kind: 'DataSource', source: 'CE', summary: 'Real-time context: motion, place transition, device state.' }),
    node({ id: 'current', label: 'Current Info', kind: 'DataSource', source: 'CURRENT_INFO', summary: 'Current foreground/share payload, time, location, and active task.' }),
    node({ id: 'person-minji', label: 'Minji', kind: 'Person', source: 'PDE', summary: 'Frequently contacted family member', payload: { relationship: 'sister', intimacy: 0.92 } }),
    node({ id: 'preference-share', label: 'Preferred share targets', kind: 'Preference', source: 'PDE', summary: 'Quick Share and Messages are dominant for photos/documents.' }),
    node({ id: 'activity-photo-share', label: 'Photo/document sharing pattern', kind: 'Activity', source: 'PDE', summary: 'Usually shares gallery photos to family in the evening.' }),
    node({ id: 'event-trip', label: 'Scheduled Seoul Trip', kind: 'Event', source: 'PDE', summary: 'Calendar/reminder event with travel place and preparation hints.' }),
    node({ id: 'place-seoul-station', label: 'Seoul Station', kind: 'Place', source: 'CE', summary: 'Resolved current travel arrival area', payload: { lat: 37.5547, lng: 126.9706, augmented: true } }),
    node({ id: 'when-now', label: 'Now: Tue 08:30', kind: 'When', source: 'CURRENT_INFO', summary: 'Current time bucket from device clock.' }),
    node({ id: 'what-share-photo', label: 'Shared payload: photo + text', kind: 'What', source: 'CURRENT_INFO', summary: 'Sharesheet input: 3 photos and a short memo.' }),
    node({ id: 'feature-share-target-affinity', label: 'Feature: share target affinity', kind: 'FeatureKey', source: 'PDE', summary: 'Ranks share targets based on contact affinity, payload type, recency.' }),
    node({ id: 'feature-payload-semantics', label: 'Feature: payload semantics', kind: 'FeatureKey', source: 'CURRENT_INFO', summary: 'Classifies whether current shared item is document, photo, or text.' }),
    node({ id: 'feature-arrival-travel-context', label: 'Feature: arrival travel context', kind: 'FeatureKey', source: 'CE', summary: 'Detects arrival near scheduled trip place and links calendar intent.' }),
    node({ id: 'schema-event-4w', label: 'Schema: Event 4W', kind: 'Schema', summary: 'Event { when, what[], where[], who[], category }' }),
    node({ id: 'metadata-feature-description', label: 'Metadata / Description', kind: 'Metadata', summary: 'Agent-facing descriptions for feature keys and sensitivity policy.' }),
    node({ id: 'cache-os', label: 'OS Cache / AppSearch', kind: 'Cache', summary: 'Simplified demo cache/index for entity, evidence, and usage graph.' }),
    node({ id: 'agent-decision', label: 'Decision Agent', kind: 'Agent', summary: 'Selects scenario-specific features and creates a traceable decision.' }),
  ]

  const e = (
    id: string,
    source: string,
    target: string,
    kind: ContextEdge['kind'],
    label: string,
    confidence: number,
    evidenceSource: ContextEdge['evidence']['source'],
    detail: string,
    augmented = false,
  ): ContextEdge =>
    edge({
      id,
      source,
      target,
      kind,
      label,
      confidence,
      evidence: {
        source: evidenceSource,
        sourceUri: `${evidenceSource.toString().toLowerCase()}://demo/${id}`,
        collector: evidenceSource === 'CE' ? 'CECollector' : evidenceSource === 'CURRENT_INFO' ? 'CurrentInfoCollector' : 'PDEDataCollector',
        analyzer: evidenceSource === 'PDE' ? 'FeatureAnalysisCore' : evidenceSource === 'CE' ? 'ContextEngine' : 'DemoIntentAnalyzer',
        observedAt,
        augmented,
        version: 'demo-schema-v0.1',
        detail,
      },
    })

  const edges: ContextEdge[] = [
    e('edge-user-profile', 'user-me', 'person-minji', 'hasProfile', 'has profile/contact', 0.91, 'PDE', 'PDE relationship analyzer inferred frequent family contact.'),
    e('edge-user-pref-share', 'user-me', 'preference-share', 'hasPreference', 'has share preference', 0.88, 'PDE', 'Dominant share target and channel usage pattern.'),
    e('edge-user-activity', 'user-me', 'activity-photo-share', 'performed', 'performed', 0.82, 'PDE', 'Recent sharing activities aggregated as a feature.'),
    e('edge-user-trip', 'user-me', 'event-trip', 'hasEvent', 'has event', 0.79, 'PDE', 'ScheduledTravel event from calendar/reminder sources.'),
    e('edge-trip-where', 'event-trip', 'place-seoul-station', 'hasWhere', 'has where', 0.86, 'CE', 'CE resolved device arrival near scheduled travel place.', true),
    e('edge-trip-when', 'event-trip', 'when-now', 'hasWhen', 'has when', 0.75, 'CURRENT_INFO', 'Current time bucket aligns with trip window.'),
    e('edge-share-what', 'activity-photo-share', 'what-share-photo', 'hasWhat', 'has what', 0.93, 'CURRENT_INFO', 'Sharesheet payload inspected locally in the demo.'),
    e('edge-share-requires-affinity', 'agent-decision', 'feature-share-target-affinity', 'usesFeature', 'uses feature', 0.94, 'DEMO_ENGINE', 'Sharesheet decision needs target affinity.'),
    e('edge-share-requires-payload', 'agent-decision', 'feature-payload-semantics', 'usesFeature', 'uses feature', 0.9, 'DEMO_ENGINE', 'Sharesheet decision needs payload semantics.'),
    e('edge-nudge-requires-travel', 'agent-decision', 'feature-arrival-travel-context', 'usesFeature', 'uses feature', 0.89, 'DEMO_ENGINE', 'Nudge decision needs arrival and travel context.'),
    e('edge-feature-affinity-pde', 'feature-share-target-affinity', 'pde', 'derivedFrom', 'derived from PDE', 0.9, 'PDE', 'Feature data is built from contacts, recency, app usage.'),
    e('edge-feature-payload-current', 'feature-payload-semantics', 'current', 'derivedFrom', 'derived from current info', 0.96, 'CURRENT_INFO', 'Current share payload provides type and rough semantics.'),
    e('edge-feature-travel-ce', 'feature-arrival-travel-context', 'ce', 'derivedFrom', 'derived from CE', 0.84, 'CE', 'Motion/place transition provides arrival context.', true),
    e('edge-feature-schema', 'feature-arrival-travel-context', 'schema-event-4w', 'representedBy', 'represented by', 0.8, 'PDE', 'Travel context represented as Event 4W schema.'),
    e('edge-feature-metadata', 'feature-share-target-affinity', 'metadata-feature-description', 'hasDescription', 'has description', 0.99, 'PDE', 'Metadata lets an agent discover feature purpose and sensitivity.'),
    e('edge-cache-feature', 'feature-share-target-affinity', 'cache-os', 'storedIn', 'stored in', 0.78, 'PDE', 'Demo approximates OS Cache/AppSearch indexing boundary.'),
    e('edge-agent-cache', 'cache-os', 'agent-decision', 'queriedBy', 'queried by', 0.87, 'DEMO_ENGINE', 'Agent queries demo graph through in-memory graph DB facade.'),
  ]

  return { nodes, edges }
}
