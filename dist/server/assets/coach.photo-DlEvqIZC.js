import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useMutation } from "@tanstack/react-query";
import { RotateCcw, Camera, Smile, Sun, Wand2, Bot } from "lucide-react";
import { useRef, useState } from "react";
import { P as PhoneShell, N as NavHeader } from "./PhoneShell-B0f7zx9g.js";
import { a as api } from "./api-FjN_DlmY.js";
import "@tanstack/react-router";
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error("이미지를 읽을 수 없어요"));
    r.readAsDataURL(file);
  });
}
function PhotoCoach() {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const analyze = useMutation({
    mutationFn: async (file) => {
      const dataUrl = await fileToDataUrl(file);
      return api.analyzePhoto(dataUrl);
    }
  });
  async function onFile(f) {
    if (!f) return;
    setPreview(URL.createObjectURL(f));
    analyze.mutate(f);
  }
  function reset() {
    setPreview(null);
    analyze.reset();
    if (inputRef.current) inputRef.current.value = "";
  }
  const scoreColor = (s) => s >= 85 ? "bg-green-500 text-green-500" : s >= 70 ? "bg-amber-500 text-amber-500" : "bg-pink text-pink";
  return /* @__PURE__ */ jsxs(PhoneShell, { children: [
    /* @__PURE__ */ jsx(NavHeader, { back: true, title: "AI 사진 코칭", right: preview && /* @__PURE__ */ jsx("button", { onClick: reset, "aria-label": "다시", className: "flex h-9 w-9 items-center justify-center rounded-full bg-secondary", children: /* @__PURE__ */ jsx(RotateCcw, { size: 14 }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "scroll-area", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 p-4", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => inputRef.current?.click(), className: "flex aspect-[3/4] max-h-56 flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary", children: [
          /* @__PURE__ */ jsx(Camera, { size: 32, className: "text-text-3" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-text-3", children: preview ? "다른 사진" : "사진 업로드" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex aspect-[3/4] max-h-56 flex-1 items-end overflow-hidden rounded-2xl bg-gradient-to-br from-pink-mid to-purple-light", children: [
          preview ? /* @__PURE__ */ jsx("img", { src: preview, alt: "업로드된 사진", className: "absolute inset-0 h-full w-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center text-white/50", children: /* @__PURE__ */ jsx(Camera, { size: 48 }) }),
          analyze.data && /* @__PURE__ */ jsx("div", { className: "z-10 w-full bg-black/55 p-2.5 backdrop-blur", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-white/70", children: "첫인상 점수" }),
              /* @__PURE__ */ jsxs("div", { className: "text-xl font-bold text-white", children: [
                analyze.data.score,
                "점"
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: `tag-base ${analyze.data.score >= 80 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`, children: analyze.data.score >= 80 ? "좋은 사진" : "개선 여지" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("input", { ref: inputRef, type: "file", accept: "image/*", className: "hidden", onChange: (e) => onFile(e.target.files?.[0]) })
      ] }),
      analyze.isPending && /* @__PURE__ */ jsx("div", { className: "px-4 py-6 text-center text-sm text-text-3 animate-pulse", children: "AI가 사진을 분석 중이에요…" }),
      analyze.isError && /* @__PURE__ */ jsx("div", { className: "mx-4 rounded-xl bg-red-50 p-4 text-sm text-red-600", children: analyze.error.message }),
      !preview && !analyze.isPending && /* @__PURE__ */ jsx("div", { className: "px-4 pt-4", children: /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-purple/15 bg-purple-light p-4 text-sm text-purple", children: "자연광이 들어오는 곳에서 상반신이 보이는 사진을 추천해요. AI가 보정 정도와 AI 생성 여부까지 판단합니다." }) }),
      analyze.data && /* @__PURE__ */ jsx(Result, { data: analyze.data, colorOf: scoreColor })
    ] })
  ] });
}
function Result({
  data,
  colorOf
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h2", { className: "px-4 pt-1 pb-3 text-base font-semibold", children: "분석 결과" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2.5 px-4", children: [
      /* @__PURE__ */ jsx(ScoreBar, { icon: /* @__PURE__ */ jsx(Smile, { size: 18 }), label: "표정 자연스러움", value: data.expression, klass: colorOf(data.expression) }),
      /* @__PURE__ */ jsx(ScoreBar, { icon: /* @__PURE__ */ jsx(Sun, { size: 18 }), label: "밝기 & 배경", value: data.brightness, klass: colorOf(data.brightness) }),
      /* @__PURE__ */ jsx(ScoreBar, { icon: /* @__PURE__ */ jsx(Wand2, { size: 18 }), label: "보정 정도", value: data.retouchScore, klass: colorOf(data.retouchScore), valueText: data.retouchLevel === "natural" ? "자연스러움" : data.retouchLevel === "moderate" ? "보통" : "과함" }),
      /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-border bg-surface p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Bot, { size: 18, className: "text-text-2" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "AI 생성 이미지 여부" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: `tag-base ${data.isAiGenerated ? "bg-red-50 text-red-600" : "bg-green-100 text-green-700"}`, children: data.isAiGenerated ? "AI 생성 의심" : "실사 사진" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("h2", { className: "px-4 pt-5 pb-3 text-base font-semibold", children: "개선 포인트" }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2 px-4 pb-6", children: data.tips.map((t, i) => /* @__PURE__ */ jsxs("div", { className: `rounded-xl p-3 text-sm leading-relaxed ${t.type === "good" ? "bg-purple-light text-purple" : "bg-pink-light text-pink"}`, children: [
      /* @__PURE__ */ jsx("div", { className: "mb-1 text-[11px] font-semibold opacity-70", children: t.type === "good" ? "좋아요" : "개선 포인트" }),
      /* @__PURE__ */ jsx("div", { children: t.text })
    ] }, i)) })
  ] });
}
function ScoreBar({
  icon,
  label,
  value,
  klass,
  valueText
}) {
  const [bg, text] = klass.split(" ");
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-surface p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 ${text}`, children: [
        icon,
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: label })
      ] }),
      /* @__PURE__ */ jsx("span", { className: `text-sm font-bold ${text}`, children: valueText ?? value })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-1.5 overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsx("div", { className: `h-full rounded-full ${bg}`, style: {
      width: `${value}%`
    } }) })
  ] });
}
export {
  PhotoCoach as component
};
