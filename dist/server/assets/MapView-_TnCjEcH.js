import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
function loadKakaoSdk() {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (window.kakao?.maps) return Promise.resolve(window.kakao);
  return Promise.reject(new Error("VITE_KAKAO_MAP_KEY missing"));
}
function MapView({
  lat,
  lng,
  zoom = 4,
  height = 180,
  pins,
  label
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  useEffect(() => {
    let cancelled = false;
    loadKakaoSdk().then((kakao) => {
      if (cancelled || !containerRef.current) return;
      mapRef.current = new kakao.maps.Map(containerRef.current, {
        center: new kakao.maps.LatLng(lat, lng),
        level: zoom
      });
    }).catch((err) => {
      console.warn("[MapView] Kakao SDK 로드 실패:", err);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    const kakao = window.kakao;
    const map = mapRef.current;
    if (!kakao?.maps || !map) return;
    map.setCenter(new kakao.maps.LatLng(lat, lng));
    map.setLevel(zoom);
  }, [lat, lng, zoom]);
  useEffect(() => {
    const kakao = window.kakao;
    const map = mapRef.current;
    if (!kakao?.maps || !map) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    const center = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(lat, lng),
      map
    });
    markersRef.current.push(center);
    if (label) {
      const iw = new kakao.maps.InfoWindow({
        position: new kakao.maps.LatLng(lat, lng),
        content: `<div style="padding:4px 8px;font-size:11px;font-weight:500;">${label}</div>`
      });
      iw.open(map, center);
      markersRef.current.push({ setMap: () => iw.close() });
    }
    pins?.forEach((p) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(p.lat, p.lng),
        map
      });
      markersRef.current.push(marker);
      if (p.label) {
        const iw = new kakao.maps.InfoWindow({
          position: new kakao.maps.LatLng(p.lat, p.lng),
          content: `<div style="padding:3px 6px;font-size:10px;">${p.label}</div>`
        });
        iw.open(map, marker);
        markersRef.current.push({ setMap: () => iw.close() });
      }
    });
  }, [lat, lng, label, pins]);
  {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center justify-center rounded-2xl border border-border bg-secondary text-xs text-muted-foreground",
        style: { height },
        children: [
          /* @__PURE__ */ jsx(MapPin, { size: 14, className: "mr-1" }),
          " 지도를 불러올 수 없어요"
        ]
      }
    );
  }
}
const AREA_COORDS = {
  성수동: { lat: 37.5447, lng: 127.0557 },
  한남동: { lat: 37.5347, lng: 127.0023 },
  강남: { lat: 37.4979, lng: 127.0276 },
  홍대: { lat: 37.5563, lng: 126.9236 },
  이태원: { lat: 37.5347, lng: 126.9947 },
  연남동: { lat: 37.5614, lng: 126.9237 }
};
export {
  AREA_COORDS as A,
  MapView as M
};
