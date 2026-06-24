import { jsxs, jsx } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { LogOut, User, ChevronRight, Calendar } from "lucide-react";
import { P as PhoneShell, N as NavHeader } from "./PhoneShell-B0f7zx9g.js";
import { Link } from "@tanstack/react-router";
import { a as api } from "./api-FjN_DlmY.js";
function Me() {
  const {
    data: profile
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.getMyProfile()
  });
  const {
    data: mine = []
  } = useQuery({
    queryKey: ["my-meetings"],
    queryFn: () => api.myMeetings()
  });
  const {
    data: user
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: () => api.currentUser()
  });
  async function logout() {
    await api.signOut();
    location.href = "/login";
  }
  return /* @__PURE__ */ jsxs(PhoneShell, { children: [
    /* @__PURE__ */ jsx(NavHeader, { title: "내 모임", right: /* @__PURE__ */ jsx("button", { onClick: logout, "aria-label": "로그아웃", className: "flex h-9 w-9 items-center justify-center rounded-full bg-secondary", children: /* @__PURE__ */ jsx(LogOut, { size: 16 }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "scroll-area px-4 pt-2", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/profile", className: "mb-4 flex items-center gap-3 rounded-2xl border border-border bg-surface p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-full bg-pink-mid text-pink", children: /* @__PURE__ */ jsx(User, { size: 24 }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[15px] font-semibold", children: profile?.nickname ?? user?.email?.split("@")[0] ?? "사용자" }),
          /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-xs text-text-3", children: profile ? `${profile.age}세 · ${profile.gender === "M" ? "남성" : "여성"}${profile.job ? ` · ${profile.job}` : ""}` : "프로필을 등록해주세요" })
        ] }),
        /* @__PURE__ */ jsx(ChevronRight, { size: 18, className: "text-text-3" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "px-1 pb-3 text-base font-semibold", children: "참여 중인 모임" }),
      mine.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed border-border bg-surface p-8 text-center", children: [
        /* @__PURE__ */ jsx(Calendar, { size: 28, className: "mx-auto text-text-3" }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 text-sm text-text-2", children: "아직 참여한 모임이 없어요" }),
        /* @__PURE__ */ jsx(Link, { to: "/", className: "mt-3 inline-block text-xs font-semibold text-pink", children: "모임 둘러보기 →" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: mine.map((m) => /* @__PURE__ */ jsxs(Link, { to: "/meetings/$id", params: {
        id: m.id
      }, className: "block rounded-2xl border border-border bg-surface p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[15px] font-semibold", children: m.title }),
            /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-xs text-text-3", children: new Date(m.startsAt).toLocaleString("ko-KR", {
              month: "long",
              day: "numeric",
              weekday: "short",
              hour: "numeric",
              minute: "2-digit"
            }) })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "tag-base bg-pink-light text-pink", children: m.ratio })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-between text-xs text-text-2", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            m.location,
            " · ",
            m.venueType
          ] }),
          /* @__PURE__ */ jsx("span", { className: m.status === "CLOSED" ? "text-text-3" : "text-green-600", children: m.status === "CLOSED" ? "마감" : "진행 중" })
        ] })
      ] }, m.id)) })
    ] })
  ] });
}
export {
  Me as component
};
