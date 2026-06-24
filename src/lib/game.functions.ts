import { createServerFn } from '@tanstack/react-start';

import { callAiGateway, parseJsonLoose } from './ai-gateway.server';
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
          content: `상대방이 "${data.chosenText}"라고 답했어. 캐릭터 반응을 1~2문장으로 자연스럽게 써줘. JSON: {"reaction":"..."}`,
        },
      ],
      responseFormat: 'json_object',
      temperature: 0.9,
    });

    return parseJsonLoose(text, { reaction: FALLBACK_REACTIONS[0] });
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
          content: `소개팅이 끝났어. 오늘 나눈 대화:\n${conversationSummary || '(대화 없음)'}\n\n최종 한마디(30자 이내)와 궁합 점수(0~100 정수)를 JSON으로 반환해줘.\n형식: {"reaction":"...","heartScore":숫자}`,
        },
      ],
      responseFormat: 'json_object',
      temperature: 0.8,
    });

    return parseJsonLoose(text, { reaction: '또 만나고 싶어!', heartScore: 70 });
  });
