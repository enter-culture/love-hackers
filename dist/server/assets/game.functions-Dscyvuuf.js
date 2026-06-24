import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { c as createServerFn } from "../server.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
async function callAiGateway(opts) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");
  const body = {
    model: opts.model ?? "google/gemini-3-flash-preview",
    messages: opts.messages,
    temperature: opts.temperature ?? 0.7
  };
  if (opts.responseFormat === "json_object") {
    body.response_format = { type: "json_object" };
  }
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("AI 사용량이 잠시 한도에 도달했어요. 잠시 후 다시 시도해주세요.");
    if (res.status === 402) throw new Error("AI 크레딧이 부족합니다.");
    throw new Error(`AI Gateway ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  return json.choices[0]?.message?.content ?? "";
}
function parseJsonLoose(text, fallback) {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return fallback;
  }
}
const FALLBACK_QUESTIONS = [{
  question: "주말엔 주로 뭐 해?",
  choices: ["집에서 쉬어", "친구랑 놀아", "혼자 여행 가"]
}, {
  question: "좋아하는 계절은?",
  choices: ["따뜻한 봄", "시원한 가을", "눈 오는 겨울"]
}, {
  question: "스트레스 해소법?",
  choices: ["음악 들어", "운동해", "맛있는 거 먹어"]
}, {
  question: "여행 스타일은?",
  choices: ["계획대로", "즉흥으로", "혼자 자유롭게"]
}, {
  question: "데이트 장소 선호는?",
  choices: ["카페", "공원 산책", "맛집 투어"]
}];
const FALLBACK_REACTIONS = ["오, 그렇구나... 나랑 비슷한 것 같은데?", "흠, 예상과 달랐어. 재밌다!", "그거 좋은 선택이야. 나도 그래!", "신기하다, 그런 생각을 하다니!", "맞아, 나도 항상 그게 좋더라고."];
const generateQuestionFn_createServerFn_handler = createServerRpc({
  id: "49337e41df04ef585d2e754016b90c49562c4ad303fc234a35c2f206b6760e25",
  name: "generateQuestionFn",
  filename: "src/lib/game.functions.ts"
}, (opts) => generateQuestionFn.__executeServer(opts));
const generateQuestionFn = createServerFn({
  method: "POST"
}).inputValidator((input) => input).handler(generateQuestionFn_createServerFn_handler, async ({
  data
}) => {
  if (!process.env.LOVABLE_API_KEY) {
    const idx = data.history.length % FALLBACK_QUESTIONS.length;
    return FALLBACK_QUESTIONS[idx];
  }
  const historyText = data.history.map((h) => `Q: ${h.question}
A: ${h.chosen}`).join("\n");
  const text = await callAiGateway({
    messages: [{
      role: "system",
      content: data.character.systemPrompt
    }, {
      role: "user",
      content: `지금까지 나눈 대화:
${historyText || "(아직 없음)"}

다음 질문과 선택지 3개를 JSON으로 반환해줘.
형식: {"question":"...","choices":["...","...","..."]}`
    }],
    responseFormat: "json_object",
    temperature: 0.85
  });
  return parseJsonLoose(text, FALLBACK_QUESTIONS[0]);
});
const generateReactionFn_createServerFn_handler = createServerRpc({
  id: "b947934d47cd79f7ed79062e556df019f56e53fb949bd5171c4ada3eabdab3c8",
  name: "generateReactionFn",
  filename: "src/lib/game.functions.ts"
}, (opts) => generateReactionFn.__executeServer(opts));
const generateReactionFn = createServerFn({
  method: "POST"
}).inputValidator((input) => input).handler(generateReactionFn_createServerFn_handler, async ({
  data
}) => {
  if (!process.env.LOVABLE_API_KEY) {
    const idx = Math.floor(Math.random() * FALLBACK_REACTIONS.length);
    return {
      reaction: FALLBACK_REACTIONS[idx]
    };
  }
  const text = await callAiGateway({
    messages: [{
      role: "system",
      content: data.character.systemPrompt
    }, {
      role: "user",
      content: `상대방이 "${data.chosenText}"라고 답했어. 캐릭터 반응을 1~2문장으로 자연스럽게 써줘. JSON: {"reaction":"..."}`
    }],
    responseFormat: "json_object",
    temperature: 0.9
  });
  return parseJsonLoose(text, {
    reaction: FALLBACK_REACTIONS[0]
  });
});
const generateResultFn_createServerFn_handler = createServerRpc({
  id: "d30ff2461a3f36dc8a025c9203bb04b73f646b645d029a9e7c0b3d5f5226f127",
  name: "generateResultFn",
  filename: "src/lib/game.functions.ts"
}, (opts) => generateResultFn.__executeServer(opts));
const generateResultFn = createServerFn({
  method: "POST"
}).inputValidator((input) => input).handler(generateResultFn_createServerFn_handler, async ({
  data
}) => {
  if (!process.env.LOVABLE_API_KEY) {
    return {
      reaction: `${data.character.displayName}: 오늘 대화 재밌었어! 또 만나고 싶다.`,
      heartScore: 60 + Math.floor(Math.random() * 35)
    };
  }
  const conversationSummary = data.exchanges.map((e) => `Q: ${e.question} / A: ${e.chosen}`).join("\n");
  const text = await callAiGateway({
    messages: [{
      role: "system",
      content: data.character.systemPrompt
    }, {
      role: "user",
      content: `소개팅이 끝났어. 오늘 나눈 대화:
${conversationSummary || "(대화 없음)"}

최종 한마디(30자 이내)와 궁합 점수(0~100 정수)를 JSON으로 반환해줘.
형식: {"reaction":"...","heartScore":숫자}`
    }],
    responseFormat: "json_object",
    temperature: 0.8
  });
  return parseJsonLoose(text, {
    reaction: "또 만나고 싶어!",
    heartScore: 70
  });
});
export {
  generateQuestionFn_createServerFn_handler,
  generateReactionFn_createServerFn_handler,
  generateResultFn_createServerFn_handler
};
