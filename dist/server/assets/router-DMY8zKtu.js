import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
const appCss = "/assets/styles-BBNUAZ7v.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$e = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#FF4B7B" },
      { title: "포테이토 — 소개팅, 더 잘 준비하기" },
      {
        name: "description",
        content: "사진, 대화, 장소까지. 소개팅 전에 차분하게 준비할 수 있도록 도와주는 앱이에요."
      },
      { property: "og:site_name", content: "포테이토" },
      { property: "og:title", content: "포테이토 — 소개팅, 더 잘 준비하기" },
      {
        property: "og:description",
        content: "사진, 대화, 장소까지. 소개팅 전에 차분하게 준비할 수 있도록 도와주는 앱이에요."
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "포테이토 — 소개팅, 더 잘 준비하기" },
      {
        name: "twitter:description",
        content: "사진, 대화, 장소까지. 소개팅 전에 차분하게 준비할 수 있도록 도와주는 앱이에요."
      },
      { name: "twitter:image", content: "/og-image.png" }
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
      },
      { rel: "stylesheet", href: appCss }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "ko", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$e.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(Outlet, {}) });
}
const $$splitComponentImporter$d = () => import("./profile-BYXutAEL.js");
const Route$d = createFileRoute("/profile")({
  head: () => ({
    meta: [{
      title: "내 프로필 — 포테이토"
    }, {
      name: "description",
      content: "닉네임과 취미, 자기소개를 등록하고 모임에 참여해보세요."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./places-Dx2gb7x-.js");
const Route$c = createFileRoute("/places")({
  head: () => ({
    meta: [{
      title: "데이트 장소 — 포테이토"
    }, {
      name: "description",
      content: "동네, 분위기, 예산에 맞는 데이트 장소를 골라보세요."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./notifications-DJ6YaEwk.js");
const Route$b = createFileRoute("/notifications")({
  head: () => ({
    meta: [{
      title: "알림 — 소개팅 AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./me-uzs-rU0O.js");
const Route$a = createFileRoute("/me")({
  head: () => ({
    meta: [{
      title: "내 모임 — 포테이토"
    }, {
      name: "description",
      content: "내가 참여한 소개팅 모임을 한눈에 확인해요."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./login-BbBQnYxh.js");
const Route$9 = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./game-Donx7j70.js");
const Route$8 = createFileRoute("/game")({
  head: () => ({
    meta: [{
      title: "로테이션 소개팅 — Love Hackers"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./create-BhpoIjxW.js");
const Route$7 = createFileRoute("/create")({
  head: () => ({
    meta: [{
      title: "모임 만들기 — 포테이토"
    }, {
      name: "description",
      content: "원하는 장소와 인원으로 소개팅 모임을 직접 열어보세요."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./coach-BFsOu0JM.js");
const Route$6 = createFileRoute("/coach")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./index-BB9GzXVD.js");
const Route$5 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "포테이토 — 모임 둘러보기"
    }, {
      name: "description",
      content: "관심 가는 모임을 둘러보고, 소개팅 전 사진과 대화, 장소까지 차분하게 준비해보세요."
    }, {
      property: "og:title",
      content: "포테이토 — 모임 둘러보기"
    }, {
      property: "og:description",
      content: "관심 가는 모임을 둘러보고, 소개팅 전 사진과 대화, 장소까지 차분하게 준비해보세요."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./coach.index-CVlR04Bs.js");
const Route$4 = createFileRoute("/coach/")({
  head: () => ({
    meta: [{
      title: "소개팅 준비 — 포테이토"
    }, {
      name: "description",
      content: "사진, 대화, 장소, 룩까지. 소개팅 전 필요한 준비를 한곳에서 챙겨보세요."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./meetings._id-BSs8oJsw.js");
const Route$3 = createFileRoute("/meetings/$id")({
  head: () => ({
    meta: [{
      title: "모임 정보 — 포테이토"
    }, {
      name: "description",
      content: "모임의 분위기와 인원, 장소를 확인하고 신청해보세요."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./coach.photo-DlEvqIZC.js");
const Route$2 = createFileRoute("/coach/photo")({
  head: () => ({
    meta: [{
      title: "AI 사진 코칭 — 소개팅 AI"
    }, {
      name: "description",
      content: "프로필 사진의 첫인상·보정·AI 생성 여부를 분석합니다."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./coach.look-BBl_9JEZ.js");
const Route$1 = createFileRoute("/coach/look")({
  head: () => ({
    meta: [{
      title: "오늘의 데이트 룩 — 포테이토"
    }, {
      name: "description",
      content: "날씨와 장소, 분위기에 어울리는 코디를 골라보세요."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./coach.chat-CXT2INdt.js");
const Route = createFileRoute("/coach/chat")({
  head: () => ({
    meta: [{
      title: "AI 대화 연습 — 소개팅 AI"
    }, {
      name: "description",
      content: "자기소개·취미·스몰토크를 AI와 미리 연습하세요."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ProfileRoute = Route$d.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$e
});
const PlacesRoute = Route$c.update({
  id: "/places",
  path: "/places",
  getParentRoute: () => Route$e
});
const NotificationsRoute = Route$b.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => Route$e
});
const MeRoute = Route$a.update({
  id: "/me",
  path: "/me",
  getParentRoute: () => Route$e
});
const LoginRoute = Route$9.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$e
});
const GameRoute = Route$8.update({
  id: "/game",
  path: "/game",
  getParentRoute: () => Route$e
});
const CreateRoute = Route$7.update({
  id: "/create",
  path: "/create",
  getParentRoute: () => Route$e
});
const CoachRoute = Route$6.update({
  id: "/coach",
  path: "/coach",
  getParentRoute: () => Route$e
});
const IndexRoute = Route$5.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$e
});
const CoachIndexRoute = Route$4.update({
  id: "/",
  path: "/",
  getParentRoute: () => CoachRoute
});
const MeetingsIdRoute = Route$3.update({
  id: "/meetings/$id",
  path: "/meetings/$id",
  getParentRoute: () => Route$e
});
const CoachPhotoRoute = Route$2.update({
  id: "/photo",
  path: "/photo",
  getParentRoute: () => CoachRoute
});
const CoachLookRoute = Route$1.update({
  id: "/look",
  path: "/look",
  getParentRoute: () => CoachRoute
});
const CoachChatRoute = Route.update({
  id: "/chat",
  path: "/chat",
  getParentRoute: () => CoachRoute
});
const CoachRouteChildren = {
  CoachChatRoute,
  CoachLookRoute,
  CoachPhotoRoute,
  CoachIndexRoute
};
const CoachRouteWithChildren = CoachRoute._addFileChildren(CoachRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  CoachRoute: CoachRouteWithChildren,
  CreateRoute,
  GameRoute,
  LoginRoute,
  MeRoute,
  NotificationsRoute,
  PlacesRoute,
  ProfileRoute,
  MeetingsIdRoute
};
const routeTree = Route$e._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$3 as R,
  router as r
};
