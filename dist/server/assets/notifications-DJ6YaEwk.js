import { jsxs, jsx } from "react/jsx-runtime";
import { Heart, MessageCircle, Sparkles, Bell } from "lucide-react";
import { P as PhoneShell, N as NavHeader } from "./PhoneShell-B0f7zx9g.js";
import "@tanstack/react-router";
const ITEMS = [{
  icon: Heart,
  color: "text-pink bg-pink-light",
  title: "성수 감성 카페 소개팅",
  desc: "여성 1자리가 새로 열렸어요",
  time: "방금"
}, {
  icon: MessageCircle,
  color: "text-purple bg-purple-light",
  title: "AI 대화 코칭이 도착했어요",
  desc: "지난 자기소개 연습 피드백을 확인해보세요",
  time: "2시간 전"
}, {
  icon: Sparkles,
  color: "text-amber-600 bg-amber-50",
  title: "이번 주 추천 모임",
  desc: "한남동 루프탑 번개에 자리가 남아있어요",
  time: "어제"
}];
function Notifications() {
  return /* @__PURE__ */ jsxs(PhoneShell, { children: [
    /* @__PURE__ */ jsx(NavHeader, { back: true, title: "알림" }),
    /* @__PURE__ */ jsxs("div", { className: "scroll-area px-4 pt-2", children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: ITEMS.map(({
        icon: Icon,
        color,
        title,
        desc,
        time
      }, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 rounded-2xl border border-border bg-surface p-4", children: [
        /* @__PURE__ */ jsx("div", { className: `flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${color}`, children: /* @__PURE__ */ jsx(Icon, { size: 18 }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold", children: title }),
          /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-xs text-text-2", children: desc }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 text-[11px] text-text-3", children: time })
        ] })
      ] }, i)) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col items-center gap-2 py-4 text-text-3", children: [
        /* @__PURE__ */ jsx(Bell, { size: 20 }),
        /* @__PURE__ */ jsx("div", { className: "text-xs", children: "새로운 알림이 도착하면 여기에 표시됩니다" })
      ] })
    ] })
  ] });
}
export {
  Notifications as component
};
