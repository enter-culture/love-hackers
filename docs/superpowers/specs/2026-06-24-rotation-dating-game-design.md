# 로테이션 소개팅 게임 설계

**작성일:** 2026-06-24  
**컨텍스트:** 동아리 해커톤 데모용, 저작권 무관  
**스택:** TanStack Start · React Three Fiber · PokeAPI 스프라이트 · AI (서버 함수)

---

## 개요

포켓몬 캐릭터를 소개팅 상대로 내세운 AI 로테이션 소개팅 게임.  
고급 식당/카페 3D 배경 위에서 포켓몬 스프라이트와 타이머 기반 객관식 대화를 나누고, 종료 후 각 캐릭터가 동물의 숲 말투로 반응을 남긴다.

---

## 게임 플로우

```
로비
 └─ 오늘의 캐릭터 카드 목록 (3명)
 └─ "소개팅 시작하기" 버튼
     │
     ▼
로테이션 (캐릭터별 반복)
 └─ 3D 장면: 고급 식당/카페 배경 + 포켓몬 스프라이트 (빌보드)
 └─ AI가 캐릭터 페르소나로 질문 생성 → 선택지 3개 버튼
 └─ 유저 선택 → AI 캐릭터 반응 + 다음 질문
 └─ 타이머(3분) 만료 → 대화 잠금 → 다음 캐릭터 전환
     │
     ▼
결과 화면
 └─ 캐릭터별 최종 반응 카드 (동숲 말투 한마디 + 하트 게이지)
 └─ "다시 하기" 버튼
```

---

## 화면 상세

### ① 로비 (`/game`)

- R3F 장면: 카메라가 식당/카페를 위에서 내려보는 앵글
- 오늘의 포켓몬 3명이 떠 있음 (Y축 idle bounce 애니메이션)
- 각 포켓몬 아래 이름 + 성격 태그 (예: "장난기 많은", "수줍음 많은")
- 하단: "소개팅 시작하기" 버튼

### ② 로테이션 방 (`game` step=rotation)

- **배경**: R3F로 렌더링한 고급 식당 또는 카페 내부
  - 테이블, 의자, 창문(빛줄기), 캔들 등 geometry + 머티리얼로 구현
  - 사실적 모델 불필요, stylized low-poly
- **캐릭터**: `<Billboard>` + `<useTexture>` 로 PokeAPI 스프라이트 표시
  - 스프라이트 크기 1.5×1.5 유닛, 화면 중앙
  - idle: 0.15 유닛 상하 bounce (useFrame)
- **타이머**: 우상단 원형 프로그레스 (180초 → 0)
  - 30초 이하 시 빨간색으로 전환
  - 만료 시 "시간이 다 됐어요 🔔" 오버레이 + 1.5초 후 다음으로
- **대화 UI**: 화면 하단 고정 (R3F 위에 HTML overlay)
  - 말풍선: 캐릭터 이름 + 질문 텍스트
  - 선택지 버튼 3개 (full-width, 선택 후 비활성화)
  - 캐릭터 반응 텍스트 (선택 후 0.5초 딜레이로 표시)

### ③ 결과 화면 (`game` step=result)

- 캐릭터 카드 3장 순차 등장 (stagger 애니메이션)
- 각 카드:
  - 포켓몬 스프라이트
  - 이름 + 동숲 말투 한마디 (AI 생성)
  - 하트 게이지 (AI가 0~100 점수 생성, 시각화)
- "다시 하기" 버튼 → 로비로

---

## 데이터 구조

### 캐릭터 정의 (하드코딩, 3명)

```ts
interface RotationCharacter {
  id: string;
  pokemonId: number;        // PokeAPI 스프라이트 ID (예: 25 = 피카츄)
  displayName: string;      // 한국어 이름 (예: "피카", "이브이")
  personality: string;      // 성격 태그 (예: "활발하고 장난기 많은")
  systemPrompt: string;     // AI 페르소나 지시문
}

// 초기 캐릭터 3명 예시
const CHARACTERS: RotationCharacter[] = [
  {
    id: "c1",
    pokemonId: 133,           // 이브이
    displayName: "이브이",
    personality: "수줍음 많고 감수성 풍부한",
    systemPrompt: "너는 수줍음 많고 감수성이 풍부한 이브이야. 소개팅 상대에게 부드럽고 따뜻하게 질문해. 말 끝에 '~냥'은 쓰지 말고, 이브이답게 '~이에요', '~이야' 말투를 써.",
  },
  {
    id: "c2",
    pokemonId: 39,            // 푸린
    displayName: "푸린",
    personality: "발랄하고 노래 좋아하는",
    systemPrompt: "너는 발랄하고 노래를 좋아하는 푸린이야. 소개팅 상대와 신나게 대화해. '~뿌잉', '~이야!' 같은 귀여운 말투를 써.",
  },
  {
    id: "c3",
    pokemonId: 448,           // 루카리오
    displayName: "루카",
    personality: "쿨하고 직선적인",
    systemPrompt: "너는 쿨하고 직선적인 루카리오야. 소개팅 상대에게 솔직하고 간결하게 질문해. 말투는 차분하고 자신감 있게.",
  },
];
```

### 게임 상태 (클라이언트 메모리)

```ts
interface GameState {
  step: "lobby" | "rotation" | "result";
  currentCharacterIndex: number;
  conversations: {
    characterId: string;
    exchanges: { question: string; choices: string[]; chosen: number; reaction: string }[];
  }[];
  results: {
    characterId: string;
    reaction: string;      // AI 생성 한마디
    heartScore: number;    // 0~100
  }[];
}
```

---

## AI 서버 함수

### `generateQuestionFn`

**입력:** `{ characterId, exchangeHistory }`  
**출력:** `{ question: string; choices: [string, string, string] }`  
**동작:** 캐릭터 systemPrompt + 이전 대화 맥락으로 다음 질문과 선택지 3개 생성

### `generateReactionFn`

**입력:** `{ characterId, chosen: string }`  
**출력:** `{ reaction: string }`  
**동작:** 선택지에 대한 캐릭터 반응 1~2문장 생성

### `generateResultFn`

**입력:** `{ characterId, fullConversation }`  
**출력:** `{ reaction: string; heartScore: number }`  
**동작:** 전체 대화 기반 최종 반응 한마디 + 궁합 점수 생성

---

## 라우트

| 경로 | 설명 |
|---|---|
| `/game` | 로비 → 로테이션 → 결과, step 상태로 전환 |

기존 `/` 홈 화면에 "게임 시작" 버튼 추가

---

## 추가 패키지

```
@react-three/fiber
@react-three/drei
three
@types/three
```

---

## 환경 변수 필요

| 변수 | 설명 |
|---|---|
| `LOVABLE_API_KEY` | AI 질문/반응 생성용. OpenAI 키 또는 Lovable 게이트웨이 키 |

기존 `src/lib/ai-gateway.server.ts` 패턴 재사용. 키 없으면 AI 호출 실패 — 해커톤 발표 전 설정 필요.

---

## 스코프 제외 (해커톤 범위 밖)

- 유저 인증 / 저장
- 멀티플레이어 실시간
- 커스텀 3D 모델
- 모바일 최적화 (데스크탑 우선)
