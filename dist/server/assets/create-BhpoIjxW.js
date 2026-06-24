import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { P as PhoneShell, N as NavHeader } from "./PhoneShell-B0f7zx9g.js";
import { M as MapView, A as AREA_COORDS } from "./MapView-_TnCjEcH.js";
import { a as api } from "./api-FjN_DlmY.js";
const CATEGORIES = ["카페", "레스토랑", "게임", "영화", "액티비티", "공연"];
const RATIOS = ["2:2", "3:3", "4:4", "5:5"];
function CreatePage() {
  const nav = useNavigate();
  const [title, setTitle] = useState("성수 감성 카페 소개팅");
  const [category, setCategory] = useState("카페");
  const [ratio, setRatio] = useState("3:3");
  const [date, setDate] = useState("2026-06-15");
  const [time, setTime] = useState("16:00");
  const [location, setLocation] = useState("성수동 어반소스 카페");
  const create = useMutation({
    mutationFn: () => api.createMeeting({
      title,
      location: location.split(" ")[0],
      venueType: category,
      ratio,
      startsAt: (/* @__PURE__ */ new Date(`${date}T${time}:00+09:00`)).toISOString(),
      maleCapacity: Number(ratio[0]),
      femaleCapacity: Number(ratio[2]),
      description: void 0
    }),
    onSuccess: () => nav({
      to: "/"
    })
  });
  return /* @__PURE__ */ jsxs(PhoneShell, { children: [
    /* @__PURE__ */ jsx(NavHeader, { back: true, title: "모임 만들기" }),
    /* @__PURE__ */ jsxs("div", { className: "scroll-area", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-4 pt-3 pb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-2 text-xs text-text-3", children: "3단계 중 1단계" }),
        /* @__PURE__ */ jsx("div", { className: "h-1.5 overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsx("div", { className: "h-full w-1/3 rounded-full bg-pink" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5 px-4 pb-2", children: [
        /* @__PURE__ */ jsx(Field, { label: "모임 이름", children: /* @__PURE__ */ jsx("input", { className: "w-full rounded-xl border border-border bg-secondary px-3.5 py-3 text-sm outline-none focus:border-pink", value: title, onChange: (e) => setTitle(e.target.value), maxLength: 50 }) }),
        /* @__PURE__ */ jsx(Field, { label: "카테고리", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: CATEGORIES.map((c) => /* @__PURE__ */ jsx("button", { onClick: () => setCategory(c), className: `pill ${category === c ? "pill-active" : ""}`, children: c }, c)) }) }),
        /* @__PURE__ */ jsx(Field, { label: "인원 구성", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: RATIOS.map((r) => {
          const active = r === ratio;
          return /* @__PURE__ */ jsxs("button", { onClick: () => setRatio(r), className: `rounded-xl p-3.5 text-center ${active ? "bg-pink text-white" : "border border-border bg-secondary text-text-2"}`, children: [
            /* @__PURE__ */ jsx("div", { className: "text-xl font-bold", children: r }),
            /* @__PURE__ */ jsxs("div", { className: `mt-0.5 text-[11px] ${active ? "opacity-80" : "text-text-3"}`, children: [
              r[0],
              "명 × ",
              r[2],
              "명"
            ] })
          ] }, r);
        }) }) }),
        /* @__PURE__ */ jsx(Field, { label: "날짜 & 시간", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-border bg-secondary px-3.5 py-3", children: [
            /* @__PURE__ */ jsx(Calendar, { size: 16, className: "text-pink" }),
            /* @__PURE__ */ jsx("input", { type: "date", className: "flex-1 bg-transparent text-sm outline-none", value: date, onChange: (e) => setDate(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-border bg-secondary px-3.5 py-3", children: [
            /* @__PURE__ */ jsx(Clock, { size: 16, className: "text-pink" }),
            /* @__PURE__ */ jsx("input", { type: "time", className: "flex-1 bg-transparent text-sm outline-none", value: time, onChange: (e) => setTime(e.target.value) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(Field, { label: "장소", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-border bg-secondary px-3.5 py-3", children: [
            /* @__PURE__ */ jsx(MapPin, { size: 16, className: "text-pink" }),
            /* @__PURE__ */ jsx("input", { className: "flex-1 bg-transparent text-sm outline-none", value: location, onChange: (e) => setLocation(e.target.value) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(MapView, { lat: (AREA_COORDS[location.split(" ")[0]] ?? AREA_COORDS["성수동"]).lat, lng: (AREA_COORDS[location.split(" ")[0]] ?? AREA_COORDS["성수동"]).lng, zoom: 15, height: 160, label: location }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-purple/15 bg-purple-light p-3.5", children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 22, className: "flex-shrink-0 text-purple" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-purple", children: "AI가 이 장소를 추천해요" }),
            /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-xs text-purple/70", children: "소개팅 분위기 점수 92점 · 접근성 좋음" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => create.mutate(), disabled: create.isPending, className: "flex h-12 w-full items-center justify-center rounded-2xl bg-pink text-[15px] font-semibold text-white disabled:opacity-50", children: create.isPending ? "만드는 중…" : "모임 만들기" })
      ] })
    ] })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "mb-1.5 text-xs text-text-2", children: label }),
    children
  ] });
}
export {
  CreatePage as component
};
