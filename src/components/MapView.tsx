import { MapPin } from "lucide-react";

export function MapView({
  height = 180,
  label,
}: {
  lat?: number;
  lng?: number;
  zoom?: number;
  height?: number;
  pins?: { lat: number; lng: number; label?: string }[];
  label?: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-secondary text-xs text-muted-foreground"
      style={{ height }}
    >
      <MapPin size={16} className="opacity-40" />
      <span>{label ?? "지도 준비 중이에요"}</span>
    </div>
  );
}

export const AREA_COORDS: Record<string, { lat: number; lng: number }> = {
  성수동: { lat: 37.5447, lng: 127.0557 },
  한남동: { lat: 37.5347, lng: 127.0023 },
  강남: { lat: 37.4979, lng: 127.0276 },
  홍대: { lat: 37.5563, lng: 126.9236 },
  이태원: { lat: 37.5347, lng: 126.9947 },
  연남동: { lat: 37.5614, lng: 126.9237 },
};
