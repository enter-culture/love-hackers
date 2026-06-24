import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Search, Utensils, Star, MapPin, ExternalLink } from "lucide-react";
import { useState } from "react";
import { P as PhoneShell, N as NavHeader } from "./PhoneShell-B0f7zx9g.js";
import { M as MapView, A as AREA_COORDS } from "./MapView-_TnCjEcH.js";
import { a as api } from "./api-FjN_DlmY.js";
import "@tanstack/react-router";
const CATEGORIES = ["전체", "카페", "레스토랑", "와인바", "액티비티"];
const AREAS = ["성수동", "한남동", "강남", "홍대", "이태원", "연남동"];
const PRICE = ["전체", "1만원 이하", "1만~3만원", "3만~5만원", "5만원 이상"];
const MOOD = ["전체", "조용함", "감성적", "활기참", "프라이빗", "뷰 맛집"];
const SORT = ["추천순", "평점순", "가까운순"];
function naverMapUrl(name, address) {
  const q = encodeURIComponent(`${name} ${address}`);
  return `https://map.naver.com/v5/search/${q}`;
}
function placeImage(p) {
  const q = encodeURIComponent(p.imageQuery || `${p.category} ${p.name}`);
  return `https://source.unsplash.com/featured/600x400/?${q}`;
}
function Places() {
  const [cat, setCat] = useState("전체");
  const [area, setArea] = useState("성수동");
  const [price, setPrice] = useState("전체");
  const [mood, setMood] = useState("전체");
  const [sort, setSort] = useState("추천순");
  const {
    data: places = [],
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["places", area, cat, price, mood],
    queryFn: () => api.recommendPlaces({
      area,
      category: cat,
      priceRange: price === "전체" ? void 0 : price,
      mood: mood === "전체" ? void 0 : mood
    }),
    staleTime: 5 * 60 * 1e3
  });
  const sorted = [...places].sort((a, b) => {
    if (sort === "평점순") return b.rating - a.rating;
    if (sort === "가까운순") return a.distanceKm - b.distanceKm;
    return 0;
  });
  const main = sorted.filter((p) => !p.isAfter);
  const after = sorted.filter((p) => p.isAfter);
  return /* @__PURE__ */ jsxs(PhoneShell, { children: [
    /* @__PURE__ */ jsx(NavHeader, { back: true, title: "데이트 장소" }),
    /* @__PURE__ */ jsxs("div", { className: "scroll-area", children: [
      /* @__PURE__ */ jsx("div", { className: "px-4 pt-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-2xl border border-border bg-surface px-3.5 py-2.5", children: [
        /* @__PURE__ */ jsx(Search, { size: 16, className: "text-text-3" }),
        /* @__PURE__ */ jsx("select", { value: area, onChange: (e) => setArea(e.target.value), className: "flex-1 bg-transparent text-sm outline-none", children: AREAS.map((a) => /* @__PURE__ */ jsx("option", { value: a, children: a }, a)) }),
        /* @__PURE__ */ jsx("button", { onClick: () => refetch(), className: "rounded-full bg-pink-light px-3 py-1 text-xs font-semibold text-pink", children: "새로 추천" })
      ] }) }),
      /* @__PURE__ */ jsx(FilterRow, { label: "카테고리", items: CATEGORIES, value: cat, onChange: setCat }),
      /* @__PURE__ */ jsx(FilterRow, { label: "가격대", items: PRICE, value: price, onChange: setPrice }),
      /* @__PURE__ */ jsx(FilterRow, { label: "분위기", items: MOOD, value: mood, onChange: setMood }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-4 pt-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] text-text-3", children: "정렬" }),
        SORT.map((s) => /* @__PURE__ */ jsx("button", { onClick: () => setSort(s), className: `text-[12px] ${sort === s ? "text-pink font-semibold" : "text-text-3"}`, children: s }, s))
      ] }),
      /* @__PURE__ */ jsx("div", { className: "px-4 pt-3", children: /* @__PURE__ */ jsx(MapView, { lat: (AREA_COORDS[area] ?? AREA_COORDS["성수동"]).lat, lng: (AREA_COORDS[area] ?? AREA_COORDS["성수동"]).lng, zoom: 14, height: 180, label: `${area} · AI 추천 ${main.length}곳`, pins: main.slice(0, 5).map((p) => ({
        lat: p.lat,
        lng: p.lng,
        label: p.name
      })) }) }),
      /* @__PURE__ */ jsxs("h2", { className: "px-4 pt-5 pb-3 text-base font-semibold", children: [
        area,
        " 소개팅하기 좋은 장소",
        isFetching && !isLoading && /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs text-text-3", children: "갱신 중…" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 px-4", children: [
        isLoading && /* @__PURE__ */ jsx("div", { className: "py-8 text-center text-sm text-text-3 animate-pulse", children: "AI가 장소를 추천 중이에요…" }),
        !isLoading && main.length === 0 && /* @__PURE__ */ jsx("div", { className: "py-8 text-center text-sm text-text-3", children: "추천된 장소가 없어요. 다시 시도해주세요." }),
        main.map((p) => /* @__PURE__ */ jsx(PlaceCard, { p }, p.id))
      ] }),
      after.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "mx-4 mt-5 rounded-2xl border border-purple/15 bg-purple-light p-3.5", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-purple", children: "애프터로 추천" }),
          /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-xs text-purple/80", children: "근처에서 이어가기 좋은 장소예요" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3 px-4 pt-3 pb-6", children: after.map((p) => /* @__PURE__ */ jsx(PlaceCard, { p }, p.id)) })
      ] })
    ] })
  ] });
}
function FilterRow({
  label,
  items,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxs("div", { className: "px-4 pt-3", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-1 text-[11px] text-text-3", children: label }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto", children: items.map((i) => /* @__PURE__ */ jsx("button", { onClick: () => onChange(i), className: `pill ${i === value ? "pill-active" : ""}`, children: i }, i)) })
  ] });
}
function PlaceCard({
  p
}) {
  return /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl border border-border bg-surface", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative aspect-[16/9] w-full bg-secondary", children: [
      /* @__PURE__ */ jsx("img", { src: placeImage(p), alt: p.name, loading: "lazy", className: "h-full w-full object-cover", onError: (e) => {
        e.currentTarget.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=70";
      } }),
      /* @__PURE__ */ jsx("span", { className: "absolute right-2 top-2 tag-base bg-white/90 text-pink", children: p.category })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[15px] font-semibold", children: p.name }),
          /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-xs text-text-3", children: p.address })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[13px] font-semibold text-pink", children: p.priceRange ?? "—" }),
          /* @__PURE__ */ jsx("div", { className: "text-[10px] text-text-3", children: "1인 가격대" })
        ] })
      ] }),
      p.menuExamples && p.menuExamples.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-start gap-1.5 text-xs text-text-2", children: [
        /* @__PURE__ */ jsx(Utensils, { size: 12, className: "mt-0.5 flex-shrink-0 text-text-3" }),
        /* @__PURE__ */ jsx("span", { children: p.menuExamples.join(" · ") })
      ] }),
      p.reason && /* @__PURE__ */ jsx("div", { className: "mt-2 rounded-lg bg-secondary px-2.5 py-1.5 text-xs text-text-2", children: p.reason }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between text-xs text-text-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Star, { size: 14, className: "fill-amber-400 text-amber-400" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: p.rating.toFixed(1) }),
          /* @__PURE__ */ jsxs("span", { className: "text-text-3", children: [
            "(",
            p.reviewCount.toLocaleString(),
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-text-3", children: [
          /* @__PURE__ */ jsx(MapPin, { size: 12 }),
          p.distanceKm.toFixed(1),
          "km"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("a", { href: naverMapUrl(p.name, p.address), target: "_blank", rel: "noopener noreferrer", className: "mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#03C75A] text-[13px] font-semibold text-white", children: [
        /* @__PURE__ */ jsx(ExternalLink, { size: 14 }),
        "네이버 지도에서 예약·길찾기"
      ] })
    ] })
  ] });
}
export {
  Places as component
};
