import { jsxs, jsx } from "react/jsx-runtime";
import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles, Home, Search, CalendarHeart, User } from "lucide-react";
function PhoneShell({ children, hideNav }) {
  return /* @__PURE__ */ jsxs("div", { className: "phone-frame", children: [
    children,
    !hideNav && /* @__PURE__ */ jsx(BottomNav, {})
  ] });
}
function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const item = (to, Icon, label) => {
    const active = path === to || to !== "/" && path.startsWith(to);
    return /* @__PURE__ */ jsxs(
      Link,
      {
        to,
        className: "flex flex-1 flex-col items-center gap-1 py-2",
        "aria-label": label,
        children: [
          /* @__PURE__ */ jsx(Icon, { size: 22, className: active ? "text-pink" : "text-text-3" }),
          /* @__PURE__ */ jsx("span", { className: `text-[10px] ${active ? "text-pink font-medium" : "text-text-3"}`, children: label })
        ]
      }
    );
  };
  return /* @__PURE__ */ jsxs("nav", { className: "fixed inset-x-0 bottom-0 mx-auto flex h-[68px] w-full max-w-[420px] items-stretch justify-around border-t border-border bg-surface px-2 pb-[env(safe-area-inset-bottom)]", children: [
    item("/", Home, "홈"),
    item("/places", Search, "장소"),
    /* @__PURE__ */ jsxs(
      Link,
      {
        to: "/coach",
        className: "flex flex-1 flex-col items-center justify-center gap-1",
        "aria-label": "AI 소개팅 도우미",
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink to-purple shadow-[0_6px_16px_rgba(255,75,123,0.35)]", children: /* @__PURE__ */ jsx(Sparkles, { size: 22, className: "text-white" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-pink", children: "AI 도우미" })
        ]
      }
    ),
    item("/me", CalendarHeart, "내 모임"),
    item("/profile", User, "프로필")
  ] });
}
function NavHeader({
  title,
  back,
  right,
  subtitle
}) {
  return /* @__PURE__ */ jsxs("header", { className: "relative flex flex-shrink-0 items-center bg-surface px-5 pt-4 pb-3", children: [
    /* @__PURE__ */ jsx("div", { className: "flex w-10 items-center justify-start", children: back && /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground",
        "aria-label": "뒤로",
        children: "←"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: `flex-1 ${back ? "text-center" : ""}`, children: [
      subtitle && !back && /* @__PURE__ */ jsx("div", { className: "text-xs text-text-3", children: subtitle }),
      title && /* @__PURE__ */ jsx("h1", { className: "truncate text-[17px] font-semibold text-foreground", children: title })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex w-10 items-center justify-end", children: right })
  ] });
}
export {
  NavHeader as N,
  PhoneShell as P
};
