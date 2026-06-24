import { createServerFn } from '@tanstack/react-start';

import type { RotationCharacter } from './game/types';

const FALLBACK_QUESTIONS = [
  { question: '주말엔 주로 뭐 해?', choices: ['집에서 쉬어', '친구랑 놀아', '혼자 여행 가'] as [string, string, string] },
  { question: '좋아하는 계절은?', choices: ['따뜻한 봄', '시원한 가을', '눈 오는 겨울'] as [string, string, string] },
  { question: '스트레스 해소법?', choices: ['음악 들어', '운동해', '맛있는 거 먹어'] as [string, string, string] },
  { question: '여행 스타일은?', choices: ['계획대로', '즉흥으로', '혼자 자유롭게'] as [string, string, string] },
  { question: '데이트 장소 선호는?', choices: ['카페', '공원 산책', '맛집 투어'] as [string, string, string] },
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
    const idx = data.history.length % FALLBACK_QUESTIONS.length;
    return FALLBACK_QUESTIONS[idx];
  });

interface GenerateReactionInput {
  character: RotationCharacter;
  chosenText: string;
  history: { question: string; chosen: string }[];
}

export const generateReactionFn = createServerFn({ method: 'POST' })
  .inputValidator((input: GenerateReactionInput) => input)
  .handler(async (): Promise<{ reaction: string }> => {
    const idx = Math.floor(Math.random() * FALLBACK_REACTIONS.length);
    return { reaction: FALLBACK_REACTIONS[idx] };
  });

interface ExchangeSummary {
  question: string;
  chosen: string;
  reaction: string;
}

interface GenerateResultInput {
  character: RotationCharacter;
  exchanges: ExchangeSummary[];
}

export const generateResultFn = createServerFn({ method: 'POST' })
  .inputValidator((input: GenerateResultInput) => input)
  .handler(async ({ data }): Promise<{ reaction: string; heartScore: number }> => {
    return {
      reaction: `${data.character.displayName}: 오늘 대화 재밌었어! 또 만나고 싶다.`,
      heartScore: 60 + Math.floor(Math.random() * 35),
    };
  });
