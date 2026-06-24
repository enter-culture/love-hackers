import { jsxs, jsx } from "react/jsx-runtime";
import { useMutation } from "@tanstack/react-query";
import { Sun, Cloud, CloudRain, Sparkles, Shirt } from "lucide-react";
import { useState } from "react";
import { P as PhoneShell, N as NavHeader } from "./PhoneShell-B0f7zx9g.js";
import { c as createSsrRpc } from "./createSsrRpc-l1y8KE69.js";
import { c as createServerFn } from "../server.js";
import "@tanstack/react-router";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
createServerFn({
  method: "POST"
}).inputValidator((input) => {
  if (!input?.imageDataUrl?.startsWith("data:image/")) throw new Error("올바른 이미지가 필요합니다");
  return input;
}).handler(createSsrRpc("592ee318729f784624985e5ab0621d8fac0783a4dfe02d222b0ec74360a796bc"));
createServerFn({
  method: "POST"
}).inputValidator((input) => {
  if (!input.message || input.message.length > 500) throw new Error("메시지를 입력해주세요 (500자 이내)");
  return input;
}).handler(createSsrRpc("862e530c4855f868d7dc1c0ec0438f883e138c48c7b0ec3d51a7b179f1874d3f"));
createServerFn({
  method: "POST"
}).inputValidator((input) => input).handler(createSsrRpc("707efd470f463faca7bd6dbe9bc2b4062f1a4f5936b1ea1f3dd2cebd933c2a58"));
const recommendLookFn = createServerFn({
  method: "POST"
}).inputValidator((input) => input).handler(createSsrRpc("f1c25d7cdc675b1925bfb8621637ee64d86a50f3372e50057c2fc995f07ee4a9"));
const WEATHERS = [{
  id: "sunny",
  label: "맑음",
  icon: Sun
}, {
  id: "cloudy",
  label: "흐림",
  icon: Cloud
}, {
  id: "rainy",
  label: "비",
  icon: CloudRain
}];
const VIBES = ["캐주얼", "스마트 캐주얼", "포멀", "스트릿", "러블리"];
const PLACES = ["카페", "레스토랑", "와인바", "전시·미술관", "공원·산책"];
const GENDERS = [{
  id: "M",
  label: "남성"
}, {
  id: "F",
  label: "여성"
}];
function LookCoach() {
  const [gender, setGender] = useState("M");
  const [weather, setWeather] = useState("sunny");
  const [place, setPlace] = useState("카페");
  const [vibe, setVibe] = useState("스마트 캐주얼");
  const rec = useMutation({
    mutationFn: () => recommendLookFn({
      data: {
        gender,
        weather,
        place,
        vibe
      }
    })
  });
  return /* @__PURE__ */ jsxs(PhoneShell, { children: [
    /* @__PURE__ */ jsx(NavHeader, { back: true, title: "오늘 데이트 룩 추천" }),
    /* @__PURE__ */ jsx("div", { className: "scroll-area bg-pink-light", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4 p-4", children: [
      /* @__PURE__ */ jsx(Section, { label: "성별", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: GENDERS.map((g) => /* @__PURE__ */ jsx("button", { onClick: () => setGender(g.id), className: `rounded-xl py-3 text-sm font-medium ${gender === g.id ? "bg-pink text-white" : "bg-surface text-text-2 border border-border"}`, children: g.label }, g.id)) }) }),
      /* @__PURE__ */ jsx(Section, { label: "오늘 날씨", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: WEATHERS.map(({
        id,
        label,
        icon: Icon
      }) => /* @__PURE__ */ jsxs("button", { onClick: () => setWeather(id), className: `flex flex-col items-center gap-1 rounded-xl py-3 text-sm font-medium ${weather === id ? "bg-pink text-white" : "bg-surface text-text-2 border border-border"}`, children: [
        /* @__PURE__ */ jsx(Icon, { size: 20 }),
        label
      ] }, id)) }) }),
      /* @__PURE__ */ jsx(Section, { label: "만나는 장소", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: PLACES.map((p) => /* @__PURE__ */ jsx("button", { onClick: () => setPlace(p), className: `pill ${place === p ? "pill-active" : ""}`, children: p }, p)) }) }),
      /* @__PURE__ */ jsx(Section, { label: "원하는 분위기", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: VIBES.map((v) => /* @__PURE__ */ jsx("button", { onClick: () => setVibe(v), className: `pill ${vibe === v ? "pill-active" : ""}`, children: v }, v)) }) }),
      /* @__PURE__ */ jsxs("button", { onClick: () => rec.mutate(), disabled: rec.isPending, className: "flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-pink text-[15px] font-semibold text-white disabled:opacity-50", children: [
        /* @__PURE__ */ jsx(Sparkles, { size: 16 }),
        rec.isPending ? "코디 추천 중…" : "AI 룩 추천 받기"
      ] }),
      rec.isError && /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-red-50 p-3 text-xs text-red-600", children: rec.error.message }),
      rec.data && /* @__PURE__ */ jsx(Result, { data: rec.data })
    ] }) })
  ] });
}
function Section({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "mb-2 text-[13px] font-medium text-text-2", children: label }),
    children
  ] });
}
function Result({
  data
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-surface p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Shirt, { size: 18, className: "text-pink" }),
        /* @__PURE__ */ jsx("div", { className: "text-[15px] font-semibold", children: data.title })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-[13px] leading-relaxed text-text-2", children: data.summary })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: data.items.map((it, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-surface p-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[13px] font-semibold", children: it.category }),
        /* @__PURE__ */ jsx("span", { className: "tag-base bg-pink-light text-pink", children: it.color })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 text-[12px] text-text-2", children: it.description })
    ] }, i)) }),
    data.tips && data.tips.length > 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-purple/15 bg-purple-light p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[13px] font-semibold text-purple", children: "스타일링 팁" }),
      /* @__PURE__ */ jsx("ul", { className: "mt-2 space-y-1 text-[12px] leading-relaxed text-purple/90", children: data.tips.map((t, i) => /* @__PURE__ */ jsxs("li", { children: [
        "· ",
        t
      ] }, i)) })
    ] })
  ] });
}
export {
  LookCoach as component
};
