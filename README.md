# Decision System Demo

TypeScript + React + Vite 기반 GitHub Pages demo입니다.

## Demo scope

- PDE, CE(Context Engine), Current Info를 in-memory graph로 구성
- Dummy data fill / clear
- Context graph rendering
- Edge 선택 시 evidence, sourceUri, confidence 등 상세 조회
- 사용자 intent 선택
  - sharesheet에서 문서/사진/텍스트를 공유하는 시나리오
  - 현재 맥락에 맞는 app을 nudge 형식으로 추천/decision하는 시나리오
- 선택 결과를 Decision Trace로 추적
- Demo Architecture Guide 페이지
  - 기능 설명
  - Module View
  - Component-and-Connector View(C&C View)
  - Interaction / Decision Flow
  - Mermaid diagram source 포함

## 설계 매핑

- Entity Graph: User, Person, Preference, Event, Activity, Place, What/When
- Evidence Graph: DataSource, sourceUri, collector, analyzer, confidence, augmented, version
- Usage Graph: Intent, Agent, FeatureKey, Schema, Metadata, Cache

## Local run

```bash
npm install
npm test
npm run build
npm run dev
```

## GitHub Pages

`.github/workflows/deploy-pages.yml`가 `main` push 시 Vite build artifact를 GitHub Pages에 배포합니다. Vite `base`는 CI에서 `BASE_PATH=/decision-system-demo/`로 주입됩니다.
