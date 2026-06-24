import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { MapPin, Tag, User, Calendar, Users, Sparkles } from "lucide-react";
import { P as PhoneShell, N as NavHeader } from "./PhoneShell-B0f7zx9g.js";
import { M as MapView, A as AREA_COORDS } from "./MapView-_TnCjEcH.js";
import { a as api } from "./api-FjN_DlmY.js";
import { R as Route } from "./router-DMY8zKtu.js";
import "@tanstack/react-router";
import "react";
function MeetingDetail() {
  const {
    id
  } = Route.useParams();
  const qc = useQueryClient();
  const {
    data: m,
    isLoading
  } = useQuery({
    queryKey: ["meeting", id],
    queryFn: () => api.getMeeting(id)
  });
  const {
    data: profile
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.getMyProfile()
  });
  const join = useMutation({
    mutationFn: () => {
      if (!profile) throw new Error("먼저 프로필을 등록해주세요");
      return api.joinMeeting(id, profile.gender);
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["meeting", id]
      });
      qc.invalidateQueries({
        queryKey: ["meetings"]
      });
    }
  });
  return /* @__PURE__ */ jsxs(PhoneShell, { hideNav: true, children: [
    /* @__PURE__ */ jsx(NavHeader, { back: true, title: m?.title ?? "모임" }),
    /* @__PURE__ */ jsxs("div", { className: "scroll-area-no-nav pb-6", children: [
      isLoading && /* @__PURE__ */ jsx("div", { className: "p-6 text-center text-sm text-text-3", children: "불러오는 중…" }),
      m && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "brand-gradient p-6 text-white", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold leading-tight", children: m.title }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 inline-block rounded-full bg-white/25 px-3 py-1 text-xs font-semibold", children: [
            m.ratio,
            " 매칭"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 p-4", children: [
          /* @__PURE__ */ jsx(Facet, { icon: /* @__PURE__ */ jsx(MapPin, { size: 16, className: "text-pink" }), label: "위치", value: m.location }),
          /* @__PURE__ */ jsx(Facet, { icon: /* @__PURE__ */ jsx(Tag, { size: 16, className: "text-pink" }), label: "카테고리", value: m.venueType }),
          /* @__PURE__ */ jsx(Facet, { icon: /* @__PURE__ */ jsx(User, { size: 16, className: "text-pink" }), label: "호스트", value: m.hostNickname ?? "—" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 px-4", children: [
          /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(Calendar, { size: 18, className: "text-pink" }), text: new Date(m.startsAt).toLocaleString("ko-KR", {
            month: "long",
            day: "numeric",
            weekday: "short",
            hour: "numeric",
            minute: "2-digit"
          }) }),
          /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(Users, { size: 18, className: "text-pink" }), text: `남성 ${m.maleCount}/${m.maleCapacity} · 여성 ${m.femaleCount}/${m.femaleCapacity}` })
        ] }),
        m.description && /* @__PURE__ */ jsx("div", { className: "px-4 pt-3", children: /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed text-text-2", children: m.description }) }),
        /* @__PURE__ */ jsx("div", { className: "px-4 pt-3", children: /* @__PURE__ */ jsx(MapView, { lat: (AREA_COORDS[m.location] ?? AREA_COORDS["성수동"]).lat, lng: (AREA_COORDS[m.location] ?? AREA_COORDS["성수동"]).lng, zoom: 15, height: 160, label: `${m.location} · ${m.venueType}` }) }),
        /* @__PURE__ */ jsx("div", { className: "px-4 pt-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 rounded-2xl border border-purple/15 bg-purple-light p-3.5", children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 20, className: "flex-shrink-0 text-purple" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs leading-relaxed text-purple/90", children: "참여 신청하면 채팅방이 열리고, 만남 전까지 AI 사진·대화·장소 코칭이 제공돼요." })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
          !profile && /* @__PURE__ */ jsx("div", { className: "mb-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-700", children: "먼저 프로필 탭에서 닉네임·성별을 등록해주세요." }),
          join.isError && /* @__PURE__ */ jsx("div", { className: "mb-3 rounded-xl bg-red-50 p-3 text-xs text-red-600", children: join.error.message }),
          /* @__PURE__ */ jsx("button", { onClick: () => join.mutate(), disabled: m.status === "CLOSED" || m.joined || join.isPending || !profile, className: "flex h-12 w-full items-center justify-center rounded-2xl bg-pink text-[15px] font-semibold text-white disabled:opacity-50", children: m.status === "CLOSED" ? "마감된 모임" : m.joined || join.isSuccess ? "참여 완료 ✓" : join.isPending ? "신청 중…" : "신청하기" })
        ] })
      ] })
    ] })
  ] });
}
function Facet({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-surface p-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-[11px] text-text-3", children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-1 truncate text-[13px] font-semibold text-foreground", children: value })
  ] });
}
function InfoRow({
  icon,
  text
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-border bg-surface p-4", children: [
    icon,
    /* @__PURE__ */ jsx("div", { className: "text-sm", children: text })
  ] });
}
export {
  MeetingDetail as component
};
