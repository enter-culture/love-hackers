import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useState, useEffect, useCallback } from "react";
import { Environment } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { c as createSsrRpc } from "./createSsrRpc-l1y8KE69.js";
import { c as createServerFn } from "../server.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router";
import "@tanstack/react-router/ssr/server";
const CHARACTERS = [
  {
    id: "eevee",
    pokemonId: 133,
    displayName: "이브이",
    personality: "수줍음 많고 감수성 풍부한",
    systemPrompt: `너는 수줍음 많고 감수성이 풍부한 이브이야. 지금 소개팅 자리에서 상대방에게 질문을 던지고 있어.
규칙:
- 질문은 짧고 자연스럽게 (30자 이내)
- 선택지는 각각 8자 이내, 서로 다른 성격을 나타내도록
- 처음엔 가벼운 일상, 점점 조금씩 개인적인 방향으로
- 말투: 부드럽고 수줍게
- 이미 나온 질문과 겹치지 않게`
  },
  {
    id: "pikachu",
    pokemonId: 25,
    displayName: "피카",
    personality: "발랄하고 활기찬",
    systemPrompt: `너는 발랄하고 활기찬 피카츄야. 지금 소개팅 자리에서 상대방에게 질문을 던지고 있어.
규칙:
- 질문은 짧고 자연스럽게 (30자 이내)
- 선택지는 각각 8자 이내, 서로 다른 성격을 나타내도록
- 에너지 넘치고 호기심 가득한 질문
- 말투: 신나고 밝게
- 이미 나온 질문과 겹치지 않게`
  },
  {
    id: "lucario",
    pokemonId: 448,
    displayName: "루카",
    personality: "쿨하고 카리스마 있는",
    systemPrompt: `너는 쿨하고 카리스마 있는 루카리오야. 지금 소개팅 자리에서 상대방에게 질문을 던지고 있어.
규칙:
- 질문은 짧고 자연스럽게 (30자 이내)
- 선택지는 각각 8자 이내, 서로 다른 성격을 나타내도록
- 심층적이고 날카로운 통찰력 있는 질문
- 말투: 차분하고 자신감 있게
- 이미 나온 질문과 겹치지 않게`
  }
];
function Floor() {
  return /* @__PURE__ */ jsxs("mesh", { rotation: [-Math.PI / 2, 0, 0], position: [0, -1.8, 0], receiveShadow: true, children: [
    /* @__PURE__ */ jsx("planeGeometry", { args: [40, 40] }),
    /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#1a0c06", roughness: 0.95, metalness: 0.05 })
  ] });
}
function Ceiling() {
  return /* @__PURE__ */ jsxs("mesh", { rotation: [Math.PI / 2, 0, 0], position: [0, 4, 0], children: [
    /* @__PURE__ */ jsx("planeGeometry", { args: [40, 40] }),
    /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#0e0806" })
  ] });
}
function WallBack() {
  return /* @__PURE__ */ jsxs("mesh", { position: [0, 1.2, -6], children: [
    /* @__PURE__ */ jsx("planeGeometry", { args: [20, 8] }),
    /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#120a04", roughness: 0.9 })
  ] });
}
function Table({ position }) {
  return /* @__PURE__ */ jsxs("group", { position, children: [
    /* @__PURE__ */ jsxs("mesh", { castShadow: true, receiveShadow: true, children: [
      /* @__PURE__ */ jsx("boxGeometry", { args: [1.4, 0.07, 0.9] }),
      /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#3d1f0d", roughness: 0.55, metalness: 0.15 })
    ] }),
    [-0.55, 0.55].flatMap(
      (x) => [-0.35, 0.35].map((z) => /* @__PURE__ */ jsxs("mesh", { position: [x, -0.44, z], children: [
        /* @__PURE__ */ jsx("cylinderGeometry", { args: [0.035, 0.035, 0.88, 8] }),
        /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#2a1208" })
      ] }, `${x}-${z}`))
    ),
    /* @__PURE__ */ jsxs("mesh", { position: [0, 0.1, 0], children: [
      /* @__PURE__ */ jsx("cylinderGeometry", { args: [0.04, 0.04, 0.18, 8] }),
      /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#f0ebe0", emissive: "#ffcc88", emissiveIntensity: 0.3 })
    ] })
  ] });
}
function Chair({ position }) {
  return /* @__PURE__ */ jsxs("group", { position, children: [
    /* @__PURE__ */ jsxs("mesh", { children: [
      /* @__PURE__ */ jsx("boxGeometry", { args: [0.55, 0.06, 0.5] }),
      /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#2e1a0a", roughness: 0.7 })
    ] }),
    /* @__PURE__ */ jsxs("mesh", { position: [0, 0.38, -0.22], children: [
      /* @__PURE__ */ jsx("boxGeometry", { args: [0.55, 0.7, 0.05] }),
      /* @__PURE__ */ jsx("meshStandardMaterial", { color: "#2e1a0a", roughness: 0.7 })
    ] })
  ] });
}
function CandleFlicker({ position }) {
  const lightRef = useRef(null);
  useFrame(({ clock }) => {
    if (!lightRef.current) return;
    const t = clock.elapsedTime;
    lightRef.current.intensity = 1.8 + Math.sin(t * 4.3) * 0.25 + Math.sin(t * 7.1) * 0.1;
  });
  return /* @__PURE__ */ jsx(
    "pointLight",
    {
      ref: lightRef,
      position,
      color: "#ff7722",
      intensity: 1.8,
      distance: 7,
      decay: 2,
      castShadow: true
    }
  );
}
function CafeBackground({ children }) {
  return /* @__PURE__ */ jsxs("div", { className: "absolute inset-0", children: [
    /* @__PURE__ */ jsxs(Canvas, { shadows: true, camera: { position: [0, 0.4, 5.5], fov: 52 }, gl: { antialias: true }, children: [
      /* @__PURE__ */ jsx("color", { attach: "background", args: ["#080402"] }),
      /* @__PURE__ */ jsx("fog", { attach: "fog", args: ["#080402", 9, 22] }),
      /* @__PURE__ */ jsx("ambientLight", { intensity: 0.04 }),
      /* @__PURE__ */ jsx(CandleFlicker, { position: [-2.8, -0.6, 1.8] }),
      /* @__PURE__ */ jsx(CandleFlicker, { position: [2.8, -0.6, 1.8] }),
      /* @__PURE__ */ jsx(CandleFlicker, { position: [0.2, -0.6, 2.8] }),
      /* @__PURE__ */ jsx("directionalLight", { position: [0, 6, -6], color: "#334488", intensity: 0.4 }),
      /* @__PURE__ */ jsx(Environment, { preset: "night" }),
      /* @__PURE__ */ jsx(Floor, {}),
      /* @__PURE__ */ jsx(Ceiling, {}),
      /* @__PURE__ */ jsx(WallBack, {}),
      /* @__PURE__ */ jsx(Table, { position: [-2.8, -1.3, 1.8] }),
      /* @__PURE__ */ jsx(Table, { position: [2.8, -1.3, 1.8] }),
      /* @__PURE__ */ jsx(Table, { position: [0, -1.3, 3.2] }),
      /* @__PURE__ */ jsx(Chair, { position: [-2.8, -1.55, 2.6] }),
      /* @__PURE__ */ jsx(Chair, { position: [2.8, -1.55, 2.6] }),
      /* @__PURE__ */ jsx(Chair, { position: [0, -1.55, 4] })
    ] }),
    children
  ] });
}
function PokemonSprite({
  pokemonId,
  size = 240,
  isActive = true,
  className = "",
  style
}) {
  const src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  return /* @__PURE__ */ jsx(
    "img",
    {
      src,
      alt: `pokemon-${pokemonId}`,
      width: size,
      height: size,
      className: `select-none pointer-events-none object-contain ${isActive ? "game-float game-glow" : "opacity-40"} ${className}`,
      style: { width: size, height: size, ...style },
      draggable: false
    }
  );
}
function LobbyView({ onStart }) {
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full h-screen overflow-hidden", style: { background: "#080402" }, children: [
    /* @__PURE__ */ jsx(CafeBackground, {}),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "absolute inset-0 flex flex-col items-center justify-between py-14 px-4",
        style: { zIndex: 10 },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center game-entrance", children: [
            /* @__PURE__ */ jsx(
              "p",
              {
                className: "text-xs tracking-widest mb-1 font-semibold",
                style: { color: "#f59e0b", opacity: 0.7 },
                children: "LOVE HACKERS"
              }
            ),
            /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", style: { color: "#f5f0e8" }, children: "로테이션 소개팅" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm mt-2", style: { color: "rgba(240,235,220,0.45)" }, children: "오늘의 소개팅 상대를 만나보세요 ✨" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-end justify-center gap-4 w-full max-w-xs", children: CHARACTERS.map((c, i) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              PokemonSprite,
              {
                pokemonId: c.pokemonId,
                size: i === 1 ? 130 : 100,
                className: "game-entrance",
                style: { animationDelay: `${i * 0.15}s` }
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold", style: { color: "#f5f0e8" }, children: c.displayName }),
              /* @__PURE__ */ jsx("p", { className: "text-xs mt-0.5", style: { color: "rgba(240,235,220,0.4)" }, children: c.personality })
            ] })
          ] }, c.id)) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onStart,
              className: "w-full max-w-xs py-4 rounded-2xl text-base font-bold",
              style: {
                background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                color: "#fff",
                boxShadow: "0 8px 32px rgba(245,158,11,0.4), 0 2px 8px rgba(0,0,0,0.4)",
                border: "none"
              },
              children: "소개팅 시작하기 💫"
            }
          )
        ]
      }
    )
  ] });
}
const generateQuestionFn = createServerFn({
  method: "POST"
}).inputValidator((input) => input).handler(createSsrRpc("49337e41df04ef585d2e754016b90c49562c4ad303fc234a35c2f206b6760e25"));
const generateReactionFn = createServerFn({
  method: "POST"
}).inputValidator((input) => input).handler(createSsrRpc("b947934d47cd79f7ed79062e556df019f56e53fb949bd5171c4ada3eabdab3c8"));
const generateResultFn = createServerFn({
  method: "POST"
}).inputValidator((input) => input).handler(createSsrRpc("d30ff2461a3f36dc8a025c9203bb04b73f646b645d029a9e7c0b3d5f5226f127"));
function HeartGauge({ score }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 500);
    return () => clearTimeout(t);
  }, [score]);
  const color = score >= 80 ? "#ef4444" : score >= 60 ? "#f59e0b" : score >= 40 ? "#84cc16" : "#64748b";
  return /* @__PURE__ */ jsxs("div", { className: "mt-2.5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-1", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs", style: { color: "rgba(240,235,220,0.45)" }, children: "궁합도" }),
      /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold", style: { color }, children: [
        score,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-2 rounded-full overflow-hidden", style: { background: "rgba(255,255,255,0.08)" }, children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "h-full rounded-full",
        style: {
          width: `${width}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          transition: "width 1.4s cubic-bezier(0.22, 1, 0.36, 1)"
        }
      }
    ) })
  ] });
}
function ResultView({ conversations, cachedResults, onResultsReady, onRestart }) {
  const [results, setResults] = useState(cachedResults);
  const [isLoading, setIsLoading] = useState(cachedResults.length === 0);
  useEffect(() => {
    if (cachedResults.length > 0) return;
    const generate = async () => {
      const generated = await Promise.all(
        CHARACTERS.map(async (c) => {
          const conv = conversations.find((cv) => cv.characterId === c.id);
          const exchanges = (conv?.exchanges ?? []).map((e) => ({
            question: e.question,
            chosen: e.choices[e.chosenIndex],
            reaction: e.reaction
          }));
          try {
            const res = await generateResultFn({ data: { character: c, exchanges } });
            return { characterId: c.id, reaction: res.reaction, heartScore: res.heartScore };
          } catch {
            return { characterId: c.id, reaction: "또 만나고 싶어!", heartScore: 65 };
          }
        })
      );
      setResults(generated);
      onResultsReady(generated);
      setIsLoading(false);
    };
    generate();
  }, [conversations, cachedResults, onResultsReady]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative w-full min-h-screen flex flex-col items-center px-4 py-14",
      style: { background: "linear-gradient(180deg, #080402 0%, #100806 100%)" },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-8 game-entrance", children: [
          /* @__PURE__ */ jsx("p", { className: "text-4xl mb-3", children: "✨" }),
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", style: { color: "#f5f0e8" }, children: "오늘의 소개팅 결과" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm mt-1.5", style: { color: "rgba(240,235,220,0.4)" }, children: "상대방의 솔직한 한마디" })
        ] }),
        isLoading ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 mt-12", children: [
          /* @__PURE__ */ jsx("div", { className: "text-5xl", style: { animation: "game-float 1.5s ease-in-out infinite" }, children: "💭" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: "rgba(240,235,220,0.5)" }, children: "상대방의 반응을 분석 중이에요..." })
        ] }) : /* @__PURE__ */ jsx("div", { className: "w-full max-w-sm flex flex-col gap-4", children: CHARACTERS.map((c, i) => {
          const result = results.find((r) => r.characterId === c.id);
          if (!result) return null;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "rounded-2xl p-5 flex gap-4 items-start",
              style: {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,180,60,0.12)",
                backdropFilter: "blur(12px)",
                animation: `game-card-in 0.5s ease ${i * 0.2}s both`,
                boxShadow: "0 4px 24px rgba(0,0,0,0.5)"
              },
              children: [
                /* @__PURE__ */ jsx(PokemonSprite, { pokemonId: c.pokemonId, size: 72, isActive: false, className: "opacity-100" }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold mb-1", style: { color: "#f59e0b" }, children: c.displayName }),
                  /* @__PURE__ */ jsxs("p", { className: "text-sm leading-relaxed", style: { color: "#e0d8cc" }, children: [
                    '"',
                    result.reaction,
                    '"'
                  ] }),
                  /* @__PURE__ */ jsx(HeartGauge, { score: result.heartScore })
                ] })
              ]
            },
            c.id
          );
        }) }),
        !isLoading && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onRestart,
            className: "mt-8 w-full max-w-sm py-4 rounded-2xl text-base font-bold",
            style: {
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#e0d8cc",
              animation: "game-fade-in-up 0.5s ease 0.7s both"
            },
            children: "다시 하기 🔄"
          }
        )
      ]
    }
  );
}
function DialoguePanel({
  character,
  question,
  choices,
  onChoose,
  isLoading,
  chosenIndex,
  reaction
}) {
  return /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 px-4 pb-10 pt-0", style: { zIndex: 20 }, children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative rounded-2xl p-5 mb-3",
        style: {
          background: "rgba(10, 6, 3, 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,180,60,0.2)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,200,100,0.08)"
        },
        children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold mb-2 tracking-wide", style: { color: "#f59e0b" }, children: character.displayName }),
          isLoading ? /* @__PURE__ */ jsx("div", { className: "flex gap-1.5 items-center h-6", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx(
            "span",
            {
              className: "w-2 h-2 rounded-full",
              style: {
                background: "#f59e0b",
                animation: `game-float 0.9s ease-in-out ${i * 0.2}s infinite`
              }
            },
            i
          )) }) : reaction ? /* @__PURE__ */ jsx(
            "p",
            {
              className: "text-sm leading-relaxed",
              style: { color: "#f0ebe0", animation: "game-fade-in-up 0.4s ease both" },
              children: reaction
            }
          ) : /* @__PURE__ */ jsx("p", { className: "text-base font-medium leading-snug", style: { color: "#f5f0e8" }, children: question })
        ]
      }
    ),
    !reaction && !isLoading && /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2.5", children: choices.map((choice, i) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => onChoose(i, choice),
        disabled: chosenIndex !== null,
        className: "w-full py-3.5 px-5 rounded-xl text-sm font-semibold text-left transition-all",
        style: {
          background: chosenIndex === i ? "linear-gradient(135deg, #f59e0b, #ef4444)" : "rgba(255,255,255,0.07)",
          border: `1px solid ${chosenIndex === i ? "transparent" : "rgba(255,255,255,0.12)"}`,
          color: chosenIndex === i ? "#fff" : "#e0d8cc",
          backdropFilter: "blur(12px)",
          boxShadow: chosenIndex === i ? "0 4px 20px rgba(245,158,11,0.4)" : "none",
          transform: chosenIndex === i ? "scale(1.01)" : "scale(1)"
        },
        children: [
          /* @__PURE__ */ jsx("span", { className: "mr-2 opacity-50", children: ["①", "②", "③"][i] }),
          choice
        ]
      },
      i
    )) })
  ] });
}
function TimerRing({ totalSeconds, onExpire }) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef(null);
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
    }, 1e3);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [totalSeconds, onExpire]);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = remaining / totalSeconds;
  const strokeDashoffset = circumference * (1 - progress);
  const isWarning = remaining <= 30;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  return /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center", style: { width: 88, height: 88 }, children: [
    /* @__PURE__ */ jsxs("svg", { width: 88, height: 88, className: "-rotate-90", children: [
      /* @__PURE__ */ jsx(
        "circle",
        {
          cx: 44,
          cy: 44,
          r: radius,
          fill: "none",
          stroke: "rgba(255,255,255,0.1)",
          strokeWidth: 6
        }
      ),
      /* @__PURE__ */ jsx(
        "circle",
        {
          cx: 44,
          cy: 44,
          r: radius,
          fill: "none",
          stroke: isWarning ? "#ef4444" : "#f59e0b",
          strokeWidth: 6,
          strokeLinecap: "round",
          strokeDasharray: circumference,
          strokeDashoffset,
          style: { transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      "span",
      {
        className: "absolute text-sm font-bold tabular-nums",
        style: { color: isWarning ? "#ef4444" : "#f5f0e0" },
        children: [
          mm,
          ":",
          ss
        ]
      }
    )
  ] });
}
function RotationView({ character, onComplete }) {
  const [exchanges, setExchanges] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [chosenIndex, setChosenIndex] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const exchangesRef = useRef([]);
  exchangesRef.current = exchanges;
  const loadNextQuestion = useCallback(
    async (history) => {
      setIsLoadingQuestion(true);
      setChosenIndex(null);
      setReaction(null);
      try {
        const result = await generateQuestionFn({ data: { character, history } });
        setCurrentQuestion(result);
      } catch {
        setCurrentQuestion({ question: "오늘 기분이 어때?", choices: ["좋아!", "보통이야", "피곤해"] });
      } finally {
        setIsLoadingQuestion(false);
      }
    },
    [character]
  );
  useEffect(() => {
    setExchanges([]);
    setIsExpired(false);
    setCurrentQuestion(null);
    setChosenIndex(null);
    setReaction(null);
    loadNextQuestion([]);
  }, [character.id, loadNextQuestion]);
  const handleChoose = useCallback(
    async (index, chosenText) => {
      if (!currentQuestion || chosenIndex !== null) return;
      setChosenIndex(index);
      setIsLoadingQuestion(true);
      let reactionText = "흥미롭네...";
      try {
        const res = await generateReactionFn({
          data: {
            character,
            chosenText,
            history: exchangesRef.current.map((e) => ({
              question: e.question,
              chosen: e.choices[e.chosenIndex]
            }))
          }
        });
        reactionText = res.reaction;
      } catch {
      }
      const newExchange = {
        question: currentQuestion.question,
        choices: currentQuestion.choices,
        chosenIndex: index,
        reaction: reactionText
      };
      setReaction(reactionText);
      setIsLoadingQuestion(false);
      const updatedExchanges = [...exchangesRef.current, newExchange];
      setExchanges(updatedExchanges);
      if (!isExpired) {
        setTimeout(() => {
          loadNextQuestion(
            updatedExchanges.map((e) => ({ question: e.question, chosen: e.choices[e.chosenIndex] }))
          );
        }, 2200);
      }
    },
    [currentQuestion, chosenIndex, character, isExpired, loadNextQuestion]
  );
  const handleTimerExpire = useCallback(() => {
    setIsExpired(true);
    setTimeout(() => onComplete(exchangesRef.current), 1800);
  }, [onComplete]);
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full h-screen overflow-hidden", children: [
    /* @__PURE__ */ jsx(CafeBackground, {}),
    isExpired && /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 flex items-center justify-center",
        style: { zIndex: 30, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" },
        children: /* @__PURE__ */ jsxs("div", { className: "text-center game-entrance", children: [
          /* @__PURE__ */ jsx("p", { className: "text-5xl mb-3", children: "🔔" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-bold", style: { color: "#f5f0e8" }, children: "시간이 다 됐어요!" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm mt-1", style: { color: "rgba(240,235,220,0.5)" }, children: "다음 상대로 넘어가요..." })
        ] })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute top-14 right-4", style: { zIndex: 20 }, children: /* @__PURE__ */ jsx(TimerRing, { totalSeconds: 180, onExpire: handleTimerExpire }) }),
    /* @__PURE__ */ jsxs("div", { className: "absolute top-14 left-4", style: { zIndex: 20 }, children: [
      /* @__PURE__ */ jsx(
        "p",
        {
          className: "text-xs font-semibold tracking-widest mb-0.5",
          style: { color: "#f59e0b", opacity: 0.7 },
          children: "지금 만나는 상대"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-xl font-bold", style: { color: "#f5f0e8" }, children: character.displayName }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mt-0.5", style: { color: "rgba(240,235,220,0.4)" }, children: character.personality })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 flex items-center justify-center pb-64",
        style: { zIndex: 10 },
        children: /* @__PURE__ */ jsx(
          PokemonSprite,
          {
            pokemonId: character.pokemonId,
            size: 260,
            isActive: !isExpired,
            className: "game-entrance"
          }
        )
      }
    ),
    !isExpired && currentQuestion && /* @__PURE__ */ jsx(
      DialoguePanel,
      {
        character,
        question: currentQuestion.question,
        choices: currentQuestion.choices,
        onChoose: handleChoose,
        isLoading: isLoadingQuestion,
        chosenIndex,
        reaction
      }
    )
  ] });
}
function useGameState() {
  const [step, setStep] = useState("lobby");
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [results, setResults] = useState([]);
  const startGame = useCallback(() => {
    setStep("rotation");
    setCurrentCharacterIndex(0);
    setConversations([]);
    setResults([]);
  }, []);
  const addExchange = useCallback((characterId, exchange) => {
    setConversations((prev) => {
      const existing = prev.find((c) => c.characterId === characterId);
      if (existing) {
        return prev.map(
          (c) => c.characterId === characterId ? { ...c, exchanges: [...c.exchanges, exchange] } : c
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
      setStep("result");
      return prev;
    });
  }, []);
  const restartGame = useCallback(() => {
    setStep("lobby");
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
    restartGame
  };
}
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
    restartGame
  } = useGameState();
  const handleRotationComplete = (exchanges) => {
    exchanges.forEach((e) => addExchange(currentCharacter.id, e));
    advanceCharacter();
  };
  const handleResultsReady = (ready) => {
    setResults(ready);
  };
  if (step === "lobby") {
    return /* @__PURE__ */ jsx(LobbyView, { onStart: startGame });
  }
  if (step === "rotation") {
    return /* @__PURE__ */ jsxs("div", { className: "relative w-full h-screen overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 right-0 flex justify-center gap-2 pt-3.5", style: {
        zIndex: 50
      }, children: CHARACTERS.map((c, i) => /* @__PURE__ */ jsx("div", { className: "rounded-full", style: {
        width: 40,
        height: 4,
        background: i < currentCharacterIndex ? "#f59e0b" : i === currentCharacterIndex ? "rgba(245,158,11,0.45)" : "rgba(255,255,255,0.1)",
        transition: "background 0.4s"
      } }, c.id)) }),
      /* @__PURE__ */ jsx(RotationView, { character: currentCharacter, onComplete: handleRotationComplete })
    ] }, currentCharacter.id);
  }
  return /* @__PURE__ */ jsx(ResultView, { conversations, cachedResults: results, onResultsReady: handleResultsReady, onRestart: restartGame });
}
export {
  GamePage as component
};
