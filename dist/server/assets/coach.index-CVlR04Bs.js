import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Sparkles, Camera, MessageCircle, MapPin, Shirt } from "lucide-react";
import { P as PhoneShell } from "./PhoneShell-B0f7zx9g.js";
const ITEMS = [{
  to: "/coach/photo",
  icon: Camera,
  title: "프로필 사진 살펴보기",
  desc: "첫인상이 어떻게 보일지 미리 확인해요",
  color: "from-pink to-pink/70"
}, {
  to: "/coach/chat",
  icon: MessageCircle,
  title: "대화 연습",
  desc: "자기소개, 취미, 가벼운 스몰토크까지",
  color: "from-purple to-purple/70"
}, {
  to: "/places",
  icon: MapPin,
  title: "데이트 장소 둘러보기",
  desc: "분위기 좋은 식당, 카페, 애프터 장소",
  color: "from-amber-400 to-pink"
}, {
  to: "/coach/look",
  icon: Shirt,
  title: "오늘의 데이트 룩",
  desc: "날씨와 장소에 어울리는 코디 제안",
  color: "from-rose-400 to-purple"
}];
function CoachHub() {
  return /* @__PURE__ */ jsx(PhoneShell, { children: /* @__PURE__ */ jsxs("div", { className: "scroll-area bg-pink-light", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-5 pt-8 pb-5", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-pink", children: "소개팅 준비" }),
      /* @__PURE__ */ jsxs("h1", { className: "mt-1 text-2xl font-bold leading-tight text-foreground", children: [
        "만남 전, 무엇부터",
        /* @__PURE__ */ jsx("br", {}),
        "함께 챙겨볼까요?"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-4", children: /* @__PURE__ */ jsxs("div", { className: "brand-gradient mb-4 rounded-3xl p-6 text-white", children: [
      /* @__PURE__ */ jsx(Sparkles, { size: 24 }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xl font-bold leading-snug", children: [
        "사진, 대화, 룩까지",
        /* @__PURE__ */ jsx("br", {}),
        "하나씩 차근차근"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs opacity-80", children: "아래에서 원하는 항목을 골라주세요" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3 px-4 pb-6", children: ITEMS.map(({
      to,
      icon: Icon,
      title,
      desc,
      color
    }) => /* @__PURE__ */ jsxs(Link, { to, className: "flex items-center gap-4 rounded-2xl border border-border bg-surface p-5", children: [
      /* @__PURE__ */ jsx("div", { className: `flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color}`, children: /* @__PURE__ */ jsx(Icon, { size: 28, className: "text-white" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[16px] font-semibold", children: title }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-[12px] leading-relaxed text-text-3", children: desc })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-lg text-text-3", children: "›" })
    ] }, to)) })
  ] }) });
}
export {
  CoachHub as component
};
