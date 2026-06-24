import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, Plus } from "lucide-react";
import { P as PhoneShell, N as NavHeader } from "./PhoneShell-B0f7zx9g.js";
import { a as api } from "./api-FjN_DlmY.js";
const AREA_THUMB = {
  성수동: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=70&auto=format&fit=crop",
  한남동: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=70&auto=format&fit=crop",
  강남: "https://images.unsplash.com/photo-1538485399081-7c8970d8a4f7?w=800&q=70&auto=format&fit=crop",
  홍대: "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=800&q=70&auto=format&fit=crop",
  이태원: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=70&auto=format&fit=crop",
  연남동: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=800&q=70&auto=format&fit=crop"
};
const FALLBACK_THUMB = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=70&auto=format&fit=crop";
function thumbFor(m) {
  return AREA_THUMB[m.location] ?? FALLBACK_THUMB;
}
function Home() {
  const {
    data: meetings = [],
    isLoading
  } = useQuery({
    queryKey: ["meetings"],
    queryFn: () => api.listMeetings()
  });
  return /* @__PURE__ */ jsxs(PhoneShell, { children: [
    /* @__PURE__ */ jsx(NavHeader, { subtitle: "안녕하세요", title: "오늘은 어떤 모임이 끌리세요?", right: /* @__PURE__ */ jsx(Link, { to: "/notifications", className: "flex h-9 w-9 items-center justify-center rounded-full bg-secondary", "aria-label": "알림", children: /* @__PURE__ */ jsx(Bell, { size: 18 }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "scroll-area", children: [
      /* @__PURE__ */ jsx(Link, { to: "/game", className: "relative mx-4 mt-3 block overflow-hidden rounded-2xl p-5", style: {
        background: "linear-gradient(135deg, #0d0805 0%, #1c0e05 100%)",
        border: "1px solid rgba(245,158,11,0.25)",
        boxShadow: "0 4px 20px rgba(245,158,11,0.12)"
      }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex -space-x-2", children: [133, 25, 448].map((id) => /* @__PURE__ */ jsx("img", { src: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`, alt: "", className: "w-10 h-10 object-contain drop-shadow-lg", style: {
          imageRendering: "pixelated"
        } }, id)) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold", style: {
            color: "#f59e0b"
          }, children: "NEW · 로테이션 소개팅" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold mt-0.5", style: {
            color: "#f5f0e8"
          }, children: "AI 포켓몬과 소개팅 게임 💫" })
        ] }),
        /* @__PURE__ */ jsx("span", { style: {
          color: "rgba(245,158,11,0.7)",
          fontSize: 18
        }, children: "→" })
      ] }) }),
      /* @__PURE__ */ jsxs(Link, { to: "/coach", className: "brand-gradient relative mx-4 mt-3 block overflow-hidden rounded-2xl p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs opacity-80", children: "소개팅 전, 잠깐" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-1 text-lg font-bold leading-tight", children: [
          "사진부터 대화까지",
          /* @__PURE__ */ jsx("br", {}),
          "함께 준비해드릴게요"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "mt-3 inline-block rounded-full bg-white/25 px-3 py-1 text-xs font-semibold", children: "준비 시작하기 →" }),
        /* @__PURE__ */ jsx("div", { className: "absolute -right-3 -top-3 h-20 w-20 rounded-full bg-white/10" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 pt-5 pb-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold", children: "모집 중인 모임" }),
        /* @__PURE__ */ jsxs(Link, { to: "/create", className: "flex items-center gap-1 rounded-full bg-pink-light px-3 py-1.5 text-xs font-semibold text-pink", children: [
          /* @__PURE__ */ jsx(Plus, { size: 14 }),
          " 모임 만들기"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 px-4", children: [
        isLoading && /* @__PURE__ */ jsx("div", { className: "py-8 text-center text-sm text-text-3", children: "불러오는 중…" }),
        meetings.map((m) => /* @__PURE__ */ jsx(MeetingCard, { m }, m.id))
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-6" })
    ] })
  ] });
}
function MeetingCard({
  m
}) {
  const closed = m.status === "CLOSED";
  const dt = new Date(m.startsAt);
  const dateStr = `${dt.getMonth() + 1}월 ${dt.getDate()}일 ${["일", "월", "화", "수", "목", "금", "토"][dt.getDay()]}요일 ${dt.getHours() < 12 ? "오전" : "오후"} ${(dt.getHours() + 11) % 12 + 1}시`;
  const femaleLeft = m.femaleCapacity - m.femaleCount;
  const maleLeft = m.maleCapacity - m.maleCount;
  return /* @__PURE__ */ jsxs(Link, { to: "/meetings/$id", params: {
    id: m.id
  }, className: `block overflow-hidden rounded-2xl border border-border bg-surface ${closed ? "opacity-55" : ""}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "relative aspect-[16/9] w-full overflow-hidden bg-secondary", children: [
      /* @__PURE__ */ jsx("img", { src: thumbFor(m), alt: `${m.location} ${m.venueType}`, loading: "lazy", className: "h-full w-full object-cover" }),
      /* @__PURE__ */ jsx("div", { className: "absolute right-2 top-2", children: /* @__PURE__ */ jsx("span", { className: `tag-base ${closed ? "bg-black/60 text-white" : m.ratio === "2:2" ? "bg-purple text-white" : "bg-pink text-white"}`, children: m.ratio }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[15px] font-semibold text-foreground", children: m.title }),
      /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-xs text-text-3", children: dateStr }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-3 gap-2 text-[11px]", children: [
        /* @__PURE__ */ jsx(Info, { label: "위치", value: m.location }),
        /* @__PURE__ */ jsx(Info, { label: "카테고리", value: m.venueType }),
        /* @__PURE__ */ jsx(Info, { label: "호스트", value: m.hostNickname ?? "—" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-text-3", children: [
          "남성 ",
          m.maleCount,
          "/",
          m.maleCapacity,
          " · 여성 ",
          m.femaleCount,
          "/",
          m.femaleCapacity
        ] }),
        closed ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-xs text-text-3", children: [
          /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-red-500" }),
          " 마감"
        ] }) : femaleLeft > 0 && m.femaleCount === 0 ? /* @__PURE__ */ jsx("span", { className: "tag-base bg-amber-50 text-amber-600", children: "여성 모집중" }) : /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-xs text-text-3", children: [
          /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-green-500" }),
          femaleLeft > 0 ? `여성 ${femaleLeft}자리` : `남성 ${maleLeft}자리`
        ] })
      ] })
    ] })
  ] });
}
function Info({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-secondary px-2 py-1.5", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[10px] text-text-3", children: label }),
    /* @__PURE__ */ jsx("div", { className: "mt-0.5 truncate text-[12px] font-medium text-foreground", children: value })
  ] });
}
export {
  Home as component
};
