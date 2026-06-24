# 로테이션 소개팅 게임 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 포켓몬 캐릭터를 AI 소개팅 상대로 내세운 로테이션 소개팅 게임을 `/game` 라우트에 구현한다.

**Architecture:** Canvas(R3F 3D 카페 배경) + HTML 오버레이(포켓몬 스프라이트, 타이머, 대화 UI) 레이어 구조. 3D 씬은 분위기용 배경만 담당하고, 게임 UI는 position: absolute HTML로 처리. AI 서버 함수(`LOVABLE_API_KEY`)로 질문·반응·결과를 생성한다.

**Tech Stack:** React 19 · TanStack Start · @react-three/fiber · @react-three/drei · three.js · PokeAPI 공식 아트워크 · Tailwind CSS v4 · Lovable AI Gateway

## Global Constraints

- Tailwind CSS v4 (CSS-first, `@theme` 방식 — `theme.extend` 없음)
- TanStack Start 서버 함수: `createServerFn({ method: 'POST' })`
- 포켓몬 스프라이트: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png`
- AI Gateway: `src/lib/ai-gateway.server.ts`의 `callAiGateway`, `parseJsonLoose` 재사용
- TypeScript strict mode — `as` 캐스팅 최소화, 런타임 검증 병행
- 모든 컴포넌트 파일: 파일당 하나의 export default 컴포넌트 원칙
- `import type` 타입 전용 import 분리

---

## 파일 구조

| 경로 | 역할 |
|---|---|
| `src/lib/game/types.ts` | GameStep, Character, Exchange, ConversationRecord, CharacterResult 타입 |
| `src/lib/game/characters.ts` | 3명 캐릭터 하드코딩 데이터 |
| `src/lib/game/useGameState.ts` | 게임 진행 상태 훅 |
| `src/lib/game.functions.ts` | AI 서버 함수 3개 |
| `src/components/game/CafeBackground.tsx` | R3F Canvas 3D 카페 배경 |
| `src/components/game/PokemonSprite.tsx` | 포켓몬 공식 아트 img + CSS 애니메이션 |
| `src/components/game/TimerRing.tsx` | SVG 원형 카운트다운 타이머 |
| `src/components/game/DialoguePanel.tsx` | 말풍선 + 선택지 3개 버튼 |
| `src/components/game/LobbyView.tsx` | 로비 화면 |
| `src/components/game/RotationView.tsx` | 로테이션 화면 |
| `src/components/game/ResultView.tsx` | 결과 화면 |
| `src/routes/game.tsx` | /game 라우트 (step 관리) |
| `src/routes/index.tsx` | 홈에 "게임 시작" 버튼 추가 |

---

### Task 1: 패키지 설치 + 타입 + 캐릭터 정의

**Files:**
- Create: `src/lib/game/types.ts`
- Create: `src/lib/game/characters.ts`

**Interfaces:**
- Produces: `GameStep`, `RotationCharacter`, `Exchange`, `ConversationRecord`, `CharacterResult` — 이후 모든 태스크가 참조

- [ ] **Step 1: 패키지 설치**

```bash
bun add @react-three/fiber @react-three/drei three
bun add -d @types/three
```

예상 출력: `bun add` 성공 메시지

- [ ] **Step 2: 타입 파일 작성**

`src/lib/game/types.ts`:
```ts
export type GameStep = 'lobby' | 'rotation' | 'result';

export interface Exchange {
  question: string;
  choices: [string, string, string];
  chosenIndex: number;
  reaction: string;
}

export interface ConversationRecord {
  characterId: string;
  exchanges: Exchange[];
}

export interface CharacterResult {
  characterId: string;
  reaction: string;
  heartScore: number;
}

export interface RotationCharacter {
  id: string;
  pokemonId: number;
  displayName: string;
  personality: string;
  systemPrompt: string;
}
```

- [ ] **Step 3: 캐릭터 데이터 작성**

`src/lib/game/characters.ts`:
```ts
import type { RotationCharacter } from './types';

export const CHARACTERS: RotationCharacter[] = [
  {
    id: 'eevee',
    pokemonId: 133,
    displayName: '이브이',
    personality: '수줍음 많고 감수성 풍부한',
    systemPrompt: `너는 수줍음 많고 감수성이 풍부한 이브이야. 지금 소개팅 자리에서 상대방에게 질문을 던지고 있어.
규칙:
- 질문은 짧고 자연스럽게 (30자 이내)
- 선택지는 각각 8자 이내, 서로 다른 성격을 나타내도록
- 처음엔 가벼운 일상, 점점 조금씩 개인적인 방향으로
- 말투: 부드럽고 수줍게, 문장 끝에 "...?" 같은 뉘앙스
- 이미 나온 질문과 겹치지 않게`,
  },
  {
    id: 'pikachu',
    pokemonId: 25,
    displayName: '피카',
    personality: '발랄하고 활기찬',
    systemPrompt: `너는 발랄하고 활기찬 피카츄야. 지금 소개팅 자리에서 상대방에게 질문을 던지고 있어.
규칙:
- 질문은 짧고 자연스럽게 (30자 이내)
- 선택지는 각각 8자 이내, 서로 다른 성격을 나타내도록
- 에너지 넘치고 호기심 가득한 질문
- 말투: 신나고 밝게, 가끔 "피카!" 같은 추임새
- 이미 나온 질문과 겹치지 않게`,
  },
  {
    id: 'lucario',
    pokemonId: 448,
    displayName: '루카',
    personality: '쿨하고 카리스마 있는',
    systemPrompt: `너는 쿨하고 카리스마 있는 루카리오야. 지금 소개팅 자리에서 상대방에게 질문을 던지고 있어.
규칙:
- 질문은 짧고 자연스럽게 (30자 이내)
- 선택지는 각각 8자 이내, 서로 다른 성격을 나타내도록
- 심층적이고 날카로운 통찰력 있는 질문
- 말투: 차분하고 자신감 있게, 짧고 명확하게
- 이미 나온 질문과 겹치지 않게`,
  },
];
```

- [ ] **Step 4: 커밋**

```bash
git add src/lib/game/types.ts src/lib/game/characters.ts package.json bun.lock
git commit -m "feat: 로테이션 게임 패키지 설치 + 타입/캐릭터 정의"
```

---

### Task 2: AI 서버 함수

**Files:**
- Create: `src/lib/game.functions.ts`

**Interfaces:**
- Consumes: `RotationCharacter` from `src/lib/game/characters.ts`; `callAiGateway`, `parseJsonLoose` from `src/lib/ai-gateway.server.ts`
- Produces:
  - `generateQuestionFn({ character, history })` → `{ question: string; choices: [string, string, string] }`
  - `generateReactionFn({ character, chosenText, history })` → `{ reaction: string }`
  - `generateResultFn({ character, exchanges })` → `{ reaction: string; heartScore: number }`

- [ ] **Step 1: game.functions.ts 작성**

`src/lib/game.functions.ts`:
```ts
import { createServerFn } from '@tanstack/react-start';

import { callAiGateway, parseJsonLoose } from './ai-gateway.server';
import type { RotationCharacter } from './game/types';

// LOVABLE_API_KEY 미설정 시 목업 반환용 데이터
const FALLBACK_QUESTIONS = [
  { question: '주말엔 주로 뭐 해?', choices: ['집에서 쉬어', '친구랑 놀아', '혼자 여행 가'] as [string,string,string] },
  { question: '좋아하는 계절은?', choices: ['따뜻한 봄', '시원한 가을', '눈 오는 겨울'] as [string,string,string] },
  { question: '스트레스 해소법?', choices: ['음악 들어', '운동해', '맛있는 거 먹어'] as [string,string,string] },
  { question: '여행 스타일은?', choices: ['계획대로', '즉흥으로', '혼자 자유롭게'] as [string,string,string] },
  { question: '데이트 장소 선호는?', choices: ['카페', '공원 산책', '맛집 투어'] as [string,string,string] },
];

const FALLBACK_REACTIONS = [
  '오, 그렇구나... 나랑 비슷한 것 같은데?',
  '흠, 예상과 달랐어. 재밌다!',
  '그거 좋은 선택이야. 나도 그래!',
  '신기하다, 그런 생각을 하다니!',
  '맞아, 나도 항상 그게 좋더라고.',
];

interface GenerateQuestionInput {
  character: RotationCharacter;
  history: { question: string; chosen: string }[];
}

export const generateQuestionFn = createServerFn({ method: 'POST' })
  .inputValidator((input: GenerateQuestionInput) => input)
  .handler(async ({ data }): Promise<{ question: string; choices: [string, string, string] }> => {
    if (!process.env.LOVABLE_API_KEY) {
      const idx = data.history.length % FALLBACK_QUESTIONS.length;
      return FALLBACK_QUESTIONS[idx];
    }

    const historyText = data.history
      .map((h) => `Q: ${h.question}\nA: ${h.chosen}`)
      .join('\n');

    const text = await callAiGateway({
      messages: [
        { role: 'system', content: data.character.systemPrompt },
        {
          role: 'user',
          content: `지금까지 나눈 대화:\n${historyText || '(아직 없음)'}\n\n다음 질문과 선택지 3개를 JSON으로 반환해줘.\n형식: {"question":"...","choices":["...","...","..."]}`,
        },
      ],
      responseFormat: 'json_object',
      temperature: 0.85,
    });

    return parseJsonLoose(text, FALLBACK_QUESTIONS[0]);
  });

interface GenerateReactionInput {
  character: RotationCharacter;
  chosenText: string;
  history: { question: string; chosen: string }[];
}

export const generateReactionFn = createServerFn({ method: 'POST' })
  .inputValidator((input: GenerateReactionInput) => input)
  .handler(async ({ data }): Promise<{ reaction: string }> => {
    if (!process.env.LOVABLE_API_KEY) {
      const idx = Math.floor(Math.random() * FALLBACK_REACTIONS.length);
      return { reaction: FALLBACK_REACTIONS[idx] };
    }

    const text = await callAiGateway({
      messages: [
        { role: 'system', content: data.character.systemPrompt },
        {
          role: 'user',
          content: `상대방이 "${data.chosenText}"라고 답했어. 이에 대한 캐릭터 반응을 1~2문장으로 자연스럽게 써줘. JSON: {"reaction":"..."}`,
        },
      ],
      responseFormat: 'json_object',
      temperature: 0.9,
    });

    return parseJsonLoose(text, { reaction: FALLBACK_REACTIONS[0] });
  });

interface Exchange {
  question: string;
  chosen: string;
  reaction: string;
}

interface GenerateResultInput {
  character: RotationCharacter;
  exchanges: Exchange[];
}

export const generateResultFn = createServerFn({ method: 'POST' })
  .inputValidator((input: GenerateResultInput) => input)
  .handler(async ({ data }): Promise<{ reaction: string; heartScore: number }> => {
    if (!process.env.LOVABLE_API_KEY) {
      return {
        reaction: `${data.character.displayName}: 오늘 대화 재밌었어! 또 만나고 싶다.`,
        heartScore: 60 + Math.floor(Math.random() * 35),
      };
    }

    const conversationSummary = data.exchanges
      .map((e) => `Q: ${e.question} / A: ${e.chosen}`)
      .join('\n');

    const text = await callAiGateway({
      messages: [
        { role: 'system', content: data.character.systemPrompt },
        {
          role: 'user',
          content: `소개팅이 끝났어. 오늘 나눈 대화 요약:\n${conversationSummary}\n\n이 대화를 바탕으로 상대방에 대한 최종 한마디(동물의 숲 스타일, 30자 이내)와 궁합 점수(0~100 정수)를 JSON으로 반환해줘.\n형식: {"reaction":"...","heartScore":숫자}`,
        },
      ],
      responseFormat: 'json_object',
      temperature: 0.8,
    });

    return parseJsonLoose(text, {
      reaction: `또 만나고 싶다!`,
      heartScore: 70,
    });
  });
```

- [ ] **Step 2: 빌드 에러 없는지 확인**

```bash
bun run build:dev 2>&1 | head -30
```

예상 출력: 에러 없음 또는 R3F 관련 경고만 출력

- [ ] **Step 3: 커밋**

```bash
git add src/lib/game.functions.ts
git commit -m "feat: 게임 AI 서버 함수 (질문/반응/결과 생성)"
```

---

### Task 3: R3F 카페 배경 + 포켓몬 스프라이트 + 타이머

**Files:**
- Create: `src/components/game/CafeBackground.tsx`
- Create: `src/components/game/PokemonSprite.tsx`
- Create: `src/components/game/TimerRing.tsx`
- Modify: `src/styles.css` (CSS 애니메이션 추가)

**Interfaces:**
- `CafeBackground`: `children?: React.ReactNode` — HTML 오버레이 자식 슬롯
- `PokemonSprite`: `{ pokemonId: number; size?: number; glowColor?: string; isActive?: boolean }`
- `TimerRing`: `{ totalSeconds: number; onExpire: () => void }`

- [ ] **Step 1: styles.css에 게임용 CSS 키프레임 추가**

`src/styles.css` 끝에 추가:
```css
/* ── 게임 애니메이션 ──────────────────────────────────── */
@keyframes game-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-14px); }
}

@keyframes game-fade-in-up {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes game-pulse-glow {
  0%, 100% { filter: drop-shadow(0 0 24px rgba(255, 180, 60, 0.55)) drop-shadow(0 0 60px rgba(255, 120, 20, 0.25)); }
  50%       { filter: drop-shadow(0 0 40px rgba(255, 200, 80, 0.80)) drop-shadow(0 0 80px rgba(255, 150, 40, 0.45)); }
}

@keyframes game-entrance {
  0%   { opacity: 0; transform: scale(0.7) translateY(30px); }
  60%  { transform: scale(1.05) translateY(-6px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes game-heart-fill {
  from { width: 0%; }
  to   { width: var(--heart-target); }
}

@keyframes game-card-in {
  from { opacity: 0; transform: translateX(40px); }
  to   { opacity: 1; transform: translateX(0); }
}

.game-float    { animation: game-float 3.2s ease-in-out infinite; }
.game-entrance { animation: game-entrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.game-glow     { animation: game-pulse-glow 2.5s ease-in-out infinite; }
```

- [ ] **Step 2: CafeBackground.tsx 작성**

`src/components/game/CafeBackground.tsx`:
```tsx
import { useRef } from 'react';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#1a0c06" roughness={0.95} metalness={0.05} />
    </mesh>
  );
}

function Ceiling() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, 0]}>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#0e0806" />
    </mesh>
  );
}

interface TableProps {
  position: [number, number, number];
}

function Table({ position }: TableProps) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.4, 0.07, 0.9]} />
        <meshStandardMaterial color="#3d1f0d" roughness={0.55} metalness={0.15} />
      </mesh>
      {([-0.55, 0.55] as const).flatMap((x) =>
        ([-0.35, 0.35] as const).map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.44, z]}>
            <cylinderGeometry args={[0.035, 0.035, 0.88, 8]} />
            <meshStandardMaterial color="#2a1208" />
          </mesh>
        )),
      )}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.18, 8]} />
        <meshStandardMaterial color="#f0ebe0" emissive="#ffcc88" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function Chair({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.55, 0.06, 0.5]} />
        <meshStandardMaterial color="#2e1a0a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.38, -0.22]}>
        <boxGeometry args={[0.55, 0.7, 0.05]} />
        <meshStandardMaterial color="#2e1a0a" roughness={0.7} />
      </mesh>
    </group>
  );
}

function CandleFlicker({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!lightRef.current) return;
    const t = clock.elapsedTime;
    lightRef.current.intensity = 1.8 + Math.sin(t * 4.3) * 0.25 + Math.sin(t * 7.1) * 0.1;
  });

  return (
    <pointLight
      ref={lightRef}
      position={position}
      color="#ff7722"
      intensity={1.8}
      distance={7}
      decay={2}
      castShadow
    />
  );
}

interface CafeBackgroundProps {
  children?: React.ReactNode;
}

export function CafeBackground({ children }: CafeBackgroundProps) {
  return (
    <div className="absolute inset-0">
      <Canvas shadows camera={{ position: [0, 0.4, 5.5], fov: 52 }}>
        <color attach="background" args={['#080402']} />
        <fog attach="fog" args={['#080402', 9, 22]} />

        <ambientLight intensity={0.04} />

        <CandleFlicker position={[-2.8, -0.6, 1.8]} />
        <CandleFlicker position={[2.8, -0.6, 1.8]} />
        <CandleFlicker position={[0.2, -0.6, 2.8]} />

        {/* 창문 역광 */}
        <directionalLight position={[0, 6, -6]} color="#334488" intensity={0.4} />

        <Environment preset="night" />

        <Floor />
        <Ceiling />

        <Table position={[-2.8, -1.3, 1.8]} />
        <Table position={[2.8, -1.3, 1.8]} />
        <Table position={[0, -1.3, 3.0]} />

        <Chair position={[-2.8, -1.55, 2.6]} />
        <Chair position={[2.8, -1.55, 2.6]} />
        <Chair position={[0, -1.55, 3.8]} />
      </Canvas>

      {children}
    </div>
  );
}
```

- [ ] **Step 3: PokemonSprite.tsx 작성**

`src/components/game/PokemonSprite.tsx`:
```tsx
interface PokemonSpriteProps {
  pokemonId: number;
  size?: number;
  isActive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function PokemonSprite({
  pokemonId,
  size = 240,
  isActive = true,
  className = '',
  style,
}: PokemonSpriteProps) {
  const src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

  return (
    <img
      src={src}
      alt={`pokemon-${pokemonId}`}
      width={size}
      height={size}
      className={`select-none pointer-events-none object-contain ${isActive ? 'game-float game-glow' : 'opacity-40'} ${className}`}
      style={{ width: size, height: size, ...style }}
      draggable={false}
    />
  );
}
```

- [ ] **Step 4: TimerRing.tsx 작성**

`src/components/game/TimerRing.tsx`:
```tsx
import { useEffect, useRef, useState } from 'react';

interface TimerRingProps {
  totalSeconds: number;
  onExpire: () => void;
}

export function TimerRing({ totalSeconds, onExpire }: TimerRingProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    hasExpiredRef.current = false;
    setRemaining(totalSeconds);

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (!hasExpiredRef.current) {
            hasExpiredRef.current = true;
            onExpire();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [totalSeconds, onExpire]);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = remaining / totalSeconds;
  const strokeDashoffset = circumference * (1 - progress);
  const isWarning = remaining <= 30;

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <div className="relative flex items-center justify-center" style={{ width: 88, height: 88 }}>
      <svg width={88} height={88} className="-rotate-90">
        <circle
          cx={44}
          cy={44}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={6}
        />
        <circle
          cx={44}
          cy={44}
          r={radius}
          fill="none"
          stroke={isWarning ? '#ef4444' : '#f59e0b'}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
        />
      </svg>
      <span
        className="absolute text-sm font-bold tabular-nums"
        style={{ color: isWarning ? '#ef4444' : '#f5f0e0' }}
      >
        {mm}:{ss}
      </span>
    </div>
  );
}
```

- [ ] **Step 5: 시각 확인**

```bash
bun dev
```

아직 라우트가 없으니 빌드 에러 없음만 확인한다.

- [ ] **Step 6: 커밋**

```bash
git add src/components/game/ src/styles.css
git commit -m "feat: R3F 카페 배경 + 포켓몬 스프라이트 + 타이머 컴포넌트"
```

---

### Task 4: 게임 상태 훅 + 로비 + 말풍선 패널

**Files:**
- Create: `src/lib/game/useGameState.ts`
- Create: `src/components/game/DialoguePanel.tsx`
- Create: `src/components/game/LobbyView.tsx`

**Interfaces:**
- Consumes: `GameStep`, `Exchange`, `ConversationRecord`, `CharacterResult` from `types.ts`; `CHARACTERS` from `characters.ts`
- Produces:
  - `useGameState()` → `{ step, currentCharacter, conversations, results, startGame, addExchange, advanceCharacter, setResults, restartGame }`
  - `DialoguePanel({ character, onChoose, isLoading })` → React element
  - `LobbyView({ onStart })` → React element

- [ ] **Step 1: useGameState.ts 작성**

`src/lib/game/useGameState.ts`:
```ts
import { useCallback, useState } from 'react';

import { CHARACTERS } from './characters';
import type { CharacterResult, ConversationRecord, Exchange, GameStep, RotationCharacter } from './types';

interface GameState {
  step: GameStep;
  currentCharacter: RotationCharacter;
  currentCharacterIndex: number;
  conversations: ConversationRecord[];
  results: CharacterResult[];
}

interface GameActions {
  startGame: () => void;
  addExchange: (characterId: string, exchange: Exchange) => void;
  advanceCharacter: () => void;
  setResults: (results: CharacterResult[]) => void;
  restartGame: () => void;
}

export function useGameState(): GameState & GameActions {
  const [step, setStep] = useState<GameStep>('lobby');
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [results, setResults] = useState<CharacterResult[]>([]);

  const startGame = useCallback(() => {
    setStep('rotation');
    setCurrentCharacterIndex(0);
    setConversations([]);
    setResults([]);
  }, []);

  const addExchange = useCallback((characterId: string, exchange: Exchange) => {
    setConversations((prev) => {
      const existing = prev.find((c) => c.characterId === characterId);
      if (existing) {
        return prev.map((c) =>
          c.characterId === characterId ? { ...c, exchanges: [...c.exchanges, exchange] } : c,
        );
      }
      return [...prev, { characterId, exchanges: [exchange] }];
    });
  }, []);

  const advanceCharacter = useCallback(() => {
    setCurrentCharacterIndex((prev) => {
      if (prev < CHARACTERS.length - 1) {
        return prev + 1;
      }
      setStep('result');
      return prev;
    });
  }, []);

  const restartGame = useCallback(() => {
    setStep('lobby');
    setCurrentCharacterIndex(0);
    setConversations([]);
    setResults([]);
  }, []);

  return {
    step,
    currentCharacter: CHARACTERS[currentCharacterIndex],
    currentCharacterIndex,
    conversations,
    results,
    startGame,
    addExchange,
    advanceCharacter,
    setResults,
    restartGame,
  };
}
```

- [ ] **Step 2: DialoguePanel.tsx 작성**

`src/components/game/DialoguePanel.tsx`:
```tsx
import type { RotationCharacter } from '@/lib/game/types';

interface DialoguePanelProps {
  character: RotationCharacter;
  question: string;
  choices: [string, string, string];
  onChoose: (index: number, chosenText: string) => void;
  isLoading: boolean;
  chosenIndex: number | null;
  reaction: string | null;
}

export function DialoguePanel({
  character,
  question,
  choices,
  onChoose,
  isLoading,
  chosenIndex,
  reaction,
}: DialoguePanelProps) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-0"
      style={{ zIndex: 20 }}
    >
      {/* 말풍선 */}
      <div
        className="relative rounded-2xl p-5 mb-4"
        style={{
          background: 'rgba(10, 6, 3, 0.82)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,180,60,0.2)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,200,100,0.08)',
        }}
      >
        <p className="text-xs font-semibold mb-2" style={{ color: '#f59e0b' }}>
          {character.displayName}
        </p>

        {isLoading ? (
          <div className="flex gap-1 items-center h-6">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  background: '#f59e0b',
                  animation: `game-float 0.9s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        ) : reaction ? (
          <p className="text-sm leading-relaxed" style={{ color: '#f0ebe0', animation: 'game-fade-in-up 0.4s ease both' }}>
            {reaction}
          </p>
        ) : (
          <p className="text-base font-medium leading-snug" style={{ color: '#f5f0e8' }}>
            {question}
          </p>
        )}
      </div>

      {/* 선택지 버튼 */}
      {!reaction && !isLoading && (
        <div className="flex flex-col gap-2.5">
          {choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => onChoose(i, choice)}
              disabled={chosenIndex !== null}
              className="w-full py-3.5 px-5 rounded-xl text-sm font-semibold text-left transition-all"
              style={{
                background:
                  chosenIndex === i
                    ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                    : 'rgba(255,255,255,0.07)',
                border: `1px solid ${chosenIndex === i ? 'transparent' : 'rgba(255,255,255,0.12)'}`,
                color: chosenIndex === i ? '#fff' : '#e0d8cc',
                backdropFilter: 'blur(12px)',
                boxShadow: chosenIndex === i ? '0 4px 20px rgba(245,158,11,0.4)' : 'none',
                transform: chosenIndex === i ? 'scale(1.01)' : 'scale(1)',
              }}
            >
              <span className="mr-2 opacity-50">{['①', '②', '③'][i]}</span>
              {choice}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: LobbyView.tsx 작성**

`src/components/game/LobbyView.tsx`:
```tsx
import { CafeBackground } from './CafeBackground';
import { PokemonSprite } from './PokemonSprite';
import { CHARACTERS } from '@/lib/game/characters';

interface LobbyViewProps {
  onStart: () => void;
}

export function LobbyView({ onStart }: LobbyViewProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#080402' }}>
      <CafeBackground />

      {/* 오버레이 */}
      <div className="absolute inset-0 flex flex-col items-center justify-between py-12 px-4" style={{ zIndex: 10 }}>
        {/* 타이틀 */}
        <div className="text-center game-entrance">
          <p className="text-xs tracking-widest mb-1" style={{ color: '#f59e0b', opacity: 0.7 }}>
            LOVE HACKERS
          </p>
          <h1 className="text-3xl font-bold" style={{ color: '#f5f0e8' }}>
            로테이션 소개팅
          </h1>
          <p className="text-sm mt-1.5" style={{ color: 'rgba(240,235,220,0.5)' }}>
            오늘의 소개팅 상대
          </p>
        </div>

        {/* 캐릭터 3명 */}
        <div className="flex items-end justify-center gap-6 w-full max-w-sm">
          {CHARACTERS.map((c, i) => (
            <div
              key={c.id}
              className="flex flex-col items-center gap-2"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <PokemonSprite
                pokemonId={c.pokemonId}
                size={110 + (i === 1 ? 20 : 0)}
                className="game-entrance"
                style={{ animationDelay: `${i * 0.12}s` }}
              />
              <div className="text-center">
                <p className="text-sm font-bold" style={{ color: '#f5f0e8' }}>
                  {c.displayName}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(240,235,220,0.45)' }}>
                  {c.personality}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 시작 버튼 */}
        <button
          onClick={onStart}
          className="w-full max-w-xs py-4 rounded-2xl text-base font-bold"
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
            color: '#fff',
            boxShadow: '0 8px 32px rgba(245,158,11,0.4), 0 2px 8px rgba(0,0,0,0.4)',
            border: 'none',
          }}
        >
          소개팅 시작하기 💫
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 커밋**

```bash
git add src/lib/game/useGameState.ts src/components/game/DialoguePanel.tsx src/components/game/LobbyView.tsx
git commit -m "feat: 게임 상태 훅 + 말풍선 패널 + 로비 화면"
```

---

### Task 5: 로테이션 화면 + 결과 화면 + 라우트 연결

**Files:**
- Create: `src/components/game/RotationView.tsx`
- Create: `src/components/game/ResultView.tsx`
- Create: `src/routes/game.tsx`
- Modify: `src/routes/index.tsx`

**Interfaces:**
- Consumes: 모든 이전 태스크의 컴포넌트/함수/훅
- `RotationView({ character, onComplete })` — 캐릭터 1명과 대화, 타이머 완료 시 onComplete 호출
- `ResultView({ results, conversations, onRestart })` — 결과 카드 3장

- [ ] **Step 1: RotationView.tsx 작성**

`src/components/game/RotationView.tsx`:
```tsx
import { useCallback, useEffect, useState } from 'react';

import { generateQuestionFn, generateReactionFn } from '@/lib/game.functions';
import type { Exchange, RotationCharacter } from '@/lib/game/types';

import { CafeBackground } from './CafeBackground';
import { DialoguePanel } from './DialoguePanel';
import { PokemonSprite } from './PokemonSprite';
import { TimerRing } from './TimerRing';

interface RotationViewProps {
  character: RotationCharacter;
  onComplete: (exchanges: Exchange[]) => void;
}

interface QuestionState {
  question: string;
  choices: [string, string, string];
}

export function RotationView({ character, onComplete }: RotationViewProps) {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionState | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);
  const [reaction, setReaction] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const loadNextQuestion = useCallback(
    async (history: { question: string; chosen: string }[]) => {
      setIsLoadingQuestion(true);
      setChosenIndex(null);
      setReaction(null);

      try {
        const result = await generateQuestionFn({
          data: { character, history },
        });
        setCurrentQuestion(result as QuestionState);
      } catch {
        setCurrentQuestion({
          question: '오늘 기분이 어때?',
          choices: ['좋아!', '보통이야', '피곤해'],
        });
      } finally {
        setIsLoadingQuestion(false);
      }
    },
    [character],
  );

  useEffect(() => {
    setExchanges([]);
    setIsExpired(false);
    loadNextQuestion([]);
  }, [character.id, loadNextQuestion]);

  const handleChoose = useCallback(
    async (index: number, chosenText: string) => {
      if (!currentQuestion || chosenIndex !== null) return;

      setChosenIndex(index);
      setIsLoadingQuestion(true);

      let reactionText = '흥미롭네...';
      try {
        const res = await generateReactionFn({
          data: {
            character,
            chosenText,
            history: exchanges.map((e) => ({ question: e.question, chosen: e.choices[e.chosenIndex] })),
          },
        });
        reactionText = res.reaction;
      } catch {
        // 폴백 유지
      }

      const newExchange: Exchange = {
        question: currentQuestion.question,
        choices: currentQuestion.choices,
        chosenIndex: index,
        reaction: reactionText,
      };

      setReaction(reactionText);
      setIsLoadingQuestion(false);

      const updatedExchanges = [...exchanges, newExchange];
      setExchanges(updatedExchanges);

      if (!isExpired) {
        setTimeout(() => {
          loadNextQuestion(
            updatedExchanges.map((e) => ({ question: e.question, chosen: e.choices[e.chosenIndex] })),
          );
        }, 2000);
      }
    },
    [currentQuestion, chosenIndex, character, exchanges, isExpired, loadNextQuestion],
  );

  const handleTimerExpire = useCallback(() => {
    setIsExpired(true);
    setTimeout(() => onComplete(exchanges), 1800);
  }, [exchanges, onComplete]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <CafeBackground />

      {/* 만료 오버레이 */}
      {isExpired && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 30, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        >
          <div className="text-center game-entrance">
            <p className="text-4xl mb-2">🔔</p>
            <p className="text-lg font-bold" style={{ color: '#f5f0e8' }}>
              시간이 다 됐어요!
            </p>
            <p className="text-sm mt-1" style={{ color: 'rgba(240,235,220,0.5)' }}>
              다음 상대로 넘어가요...
            </p>
          </div>
        </div>
      )}

      {/* 타이머 */}
      <div className="absolute top-5 right-5" style={{ zIndex: 20 }}>
        <TimerRing totalSeconds={180} onExpire={handleTimerExpire} />
      </div>

      {/* 캐릭터 이름 */}
      <div className="absolute top-5 left-5" style={{ zIndex: 20 }}>
        <p className="text-xs font-semibold tracking-widest mb-0.5" style={{ color: '#f59e0b', opacity: 0.7 }}>
          지금 만나는 상대
        </p>
        <p className="text-xl font-bold" style={{ color: '#f5f0e8' }}>
          {character.displayName}
        </p>
        <p className="text-xs" style={{ color: 'rgba(240,235,220,0.4)' }}>
          {character.personality}
        </p>
      </div>

      {/* 포켓몬 스프라이트 */}
      <div
        className="absolute inset-0 flex items-center justify-center pb-56"
        style={{ zIndex: 10 }}
      >
        <PokemonSprite
          pokemonId={character.pokemonId}
          size={260}
          isActive={!isExpired}
          className="game-entrance"
        />
      </div>

      {/* 대화 패널 */}
      {!isExpired && currentQuestion && (
        <DialoguePanel
          character={character}
          question={currentQuestion.question}
          choices={currentQuestion.choices}
          onChoose={handleChoose}
          isLoading={isLoadingQuestion}
          chosenIndex={chosenIndex}
          reaction={reaction}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: ResultView.tsx 작성**

`src/components/game/ResultView.tsx`:
```tsx
import { useEffect, useState } from 'react';

import { generateResultFn } from '@/lib/game.functions';
import { CHARACTERS } from '@/lib/game/characters';
import type { CharacterResult, ConversationRecord } from '@/lib/game/types';

import { PokemonSprite } from './PokemonSprite';

interface ResultViewProps {
  conversations: ConversationRecord[];
  onRestart: () => void;
  onResultsReady: (results: CharacterResult[]) => void;
  cachedResults: CharacterResult[];
}

function HeartGauge({ score }: { score: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 400);
    return () => clearTimeout(t);
  }, [score]);

  const color =
    score >= 80 ? '#ef4444' : score >= 60 ? '#f59e0b' : score >= 40 ? '#84cc16' : '#64748b';

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs" style={{ color: 'rgba(240,235,220,0.45)' }}>
          궁합도
        </span>
        <span className="text-sm font-bold" style={{ color }}>
          {score}%
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </div>
    </div>
  );
}

export function ResultView({ conversations, onRestart, onResultsReady, cachedResults }: ResultViewProps) {
  const [results, setResults] = useState<CharacterResult[]>(cachedResults);
  const [isLoading, setIsLoading] = useState(cachedResults.length === 0);

  useEffect(() => {
    if (cachedResults.length > 0) return;

    const generate = async () => {
      const generated = await Promise.all(
        CHARACTERS.map(async (c) => {
          const conv = conversations.find((conv) => conv.characterId === c.id);
          const exchanges = (conv?.exchanges ?? []).map((e) => ({
            question: e.question,
            chosen: e.choices[e.chosenIndex],
            reaction: e.reaction,
          }));

          try {
            const res = await generateResultFn({ data: { character: c, exchanges } });
            return { characterId: c.id, reaction: res.reaction, heartScore: res.heartScore };
          } catch {
            return { characterId: c.id, reaction: '또 만나고 싶어!', heartScore: 65 };
          }
        }),
      );

      setResults(generated);
      onResultsReady(generated);
      setIsLoading(false);
    };

    generate();
  }, [conversations, cachedResults, onResultsReady]);

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center px-4 py-12"
      style={{ background: 'linear-gradient(180deg, #080402 0%, #100806 100%)' }}
    >
      {/* 헤더 */}
      <div className="text-center mb-8 game-entrance">
        <p className="text-3xl mb-2">✨</p>
        <h2 className="text-2xl font-bold" style={{ color: '#f5f0e8' }}>
          오늘의 소개팅 결과
        </h2>
        <p className="text-sm mt-1" style={{ color: 'rgba(240,235,220,0.4)' }}>
          상대방의 솔직한 한마디
        </p>
      </div>

      {/* 결과 카드 */}
      {isLoading ? (
        <div className="flex flex-col items-center gap-3 mt-12">
          <div className="text-4xl" style={{ animation: 'game-float 1.5s ease-in-out infinite' }}>
            💭
          </div>
          <p className="text-sm" style={{ color: 'rgba(240,235,220,0.5)' }}>
            상대방의 반응을 분석 중...
          </p>
        </div>
      ) : (
        <div className="w-full max-w-sm flex flex-col gap-4">
          {CHARACTERS.map((c, i) => {
            const result = results.find((r) => r.characterId === c.id);
            if (!result) return null;

            return (
              <div
                key={c.id}
                className="rounded-2xl p-5 flex gap-4 items-start"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,180,60,0.12)',
                  backdropFilter: 'blur(12px)',
                  animation: `game-card-in 0.5s ease ${i * 0.18}s both`,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                }}
              >
                <PokemonSprite pokemonId={c.pokemonId} size={72} isActive className="" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold mb-1" style={{ color: '#f59e0b' }}>
                    {c.displayName}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#e0d8cc' }}>
                    "{result.reaction}"
                  </p>
                  <HeartGauge score={result.heartScore} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 다시 하기 */}
      {!isLoading && (
        <button
          onClick={onRestart}
          className="mt-8 w-full max-w-sm py-4 rounded-2xl text-base font-bold game-entrance"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#e0d8cc',
            animationDelay: '0.6s',
          }}
        >
          다시 하기 🔄
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: game.tsx 라우트 작성**

`src/routes/game.tsx`:
```tsx
import { createFileRoute } from '@tanstack/react-router';

import { LobbyView } from '@/components/game/LobbyView';
import { ResultView } from '@/components/game/ResultView';
import { RotationView } from '@/components/game/RotationView';
import { CHARACTERS } from '@/lib/game/characters';
import { useGameState } from '@/lib/game/useGameState';
import type { CharacterResult, Exchange } from '@/lib/game/types';

export const Route = createFileRoute('/game')({
  head: () => ({
    meta: [{ title: '로테이션 소개팅 — Love Hackers' }],
  }),
  component: GamePage,
});

function GamePage() {
  const {
    step,
    currentCharacter,
    currentCharacterIndex,
    conversations,
    results,
    startGame,
    addExchange,
    advanceCharacter,
    setResults,
    restartGame,
  } = useGameState();

  const handleRotationComplete = (exchanges: Exchange[]) => {
    exchanges.forEach((e) => addExchange(currentCharacter.id, e));
    advanceCharacter();
  };

  const handleResultsReady = (ready: CharacterResult[]) => {
    setResults(ready);
  };

  if (step === 'lobby') {
    return <LobbyView onStart={startGame} />;
  }

  if (step === 'rotation') {
    return (
      <div key={currentCharacter.id}>
        {/* 진행 표시 */}
        <div
          className="absolute top-0 left-0 right-0 flex justify-center gap-2 pt-3"
          style={{ zIndex: 50 }}
        >
          {CHARACTERS.map((c, i) => (
            <div
              key={c.id}
              className="h-1 rounded-full"
              style={{
                width: 40,
                background:
                  i < currentCharacterIndex
                    ? '#f59e0b'
                    : i === currentCharacterIndex
                      ? 'rgba(245,158,11,0.5)'
                      : 'rgba(255,255,255,0.1)',
                transition: 'background 0.4s',
              }}
            />
          ))}
        </div>

        <RotationView
          character={currentCharacter}
          onComplete={handleRotationComplete}
        />
      </div>
    );
  }

  return (
    <ResultView
      conversations={conversations}
      cachedResults={results}
      onResultsReady={handleResultsReady}
      onRestart={restartGame}
    />
  );
}
```

- [ ] **Step 4: index.tsx에 게임 시작 버튼 추가**

`src/routes/index.tsx`의 홈 컴포넌트 상단 배너 또는 NavHeader 아래에 게임 배너 추가.

`function Home()` 내부 return JSX 최상단 `<PhoneShell>` 바로 안쪽에 추가:

```tsx
import { Link } from '@tanstack/react-router';
// ... 기존 imports 유지

// Home 컴포넌트의 return 안에 기존 콘텐츠 앞에 추가:
<Link
  to="/game"
  className="block mx-4 mt-4 mb-2 rounded-2xl overflow-hidden"
  style={{
    background: 'linear-gradient(135deg, #0a0604 0%, #1a0e06 100%)',
    border: '1px solid rgba(245,158,11,0.3)',
    boxShadow: '0 4px 20px rgba(245,158,11,0.15)',
  }}
>
  <div className="flex items-center gap-4 p-4">
    <span className="text-3xl">⚡</span>
    <div className="flex-1">
      <p className="text-sm font-bold" style={{ color: '#f59e0b' }}>
        로테이션 소개팅
      </p>
      <p className="text-xs mt-0.5" style={{ color: 'rgba(240,235,220,0.5)' }}>
        AI 포켓몬 캐릭터와 소개팅 게임
      </p>
    </div>
    <span className="text-xl">→</span>
  </div>
</Link>
```

실제 삽입 위치: `<PhoneShell>` → `<NavHeader>` 다음 줄

- [ ] **Step 5: 로컬에서 전체 플로우 시각 확인**

```bash
bun dev
```

1. `http://localhost:3000` 접속 → 홈에 "로테이션 소개팅" 배너 확인
2. 배너 클릭 → `/game` 로비 화면: 이브이·피카츄·루카리오 3명 표시
3. "소개팅 시작하기" → 로테이션 화면: 3D 카페 배경 + 포켓몬 + 타이머
4. 선택지 버튼 3개 정상 동작 확인
5. 타이머 만료 또는 전체 라운드 종료 → 결과 화면 카드 3장 확인

- [ ] **Step 6: 빌드 확인**

```bash
bun run build 2>&1 | tail -20
```

예상: `✓ built in` 메시지, 에러 없음

- [ ] **Step 7: 커밋**

```bash
git add src/routes/game.tsx src/routes/index.tsx src/components/game/RotationView.tsx src/components/game/ResultView.tsx
git commit -m "feat: 로테이션/결과 화면 + /game 라우트 + 홈 진입 배너"
```
