import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Sun, Cloud, CloudRain } from "lucide-react";
import { useState } from "react";
import { PhoneShell, NavHeader } from "@/components/PhoneShell";

export const Route = createFileRoute("/coach/look")({
  head: () => ({
    meta: [
      { title: "오늘의 데이트 룩 — 포테이토" },
      { name: "description", content: "날씨와 장소, 분위기에 어울리는 코디를 골라보세요." },
    ],
  }),
  component: LookCoach,
});

const WEATHERS = [
  { id: "sunny", label: "맑음", icon: Sun },
  { id: "cloudy", label: "흐림", icon: Cloud },
  { id: "rainy", label: "비", icon: CloudRain },
] as const;

const VIBES = ["캐주얼", "스마트 캐주얼", "포멀", "스트릿", "러블리"];
const PLACES = ["카페", "레스토랑", "와인바", "전시·미술관", "공원·산책"];
const GENDERS: { id: "M" | "F"; label: string }[] = [
  { id: "M", label: "남성" },
  { id: "F", label: "여성" },
];

function LookCoach() {
  const [gender, setGender] = useState<"M" | "F">("M");
  const [weather, setWeather] = useState<"sunny" | "cloudy" | "rainy">("sunny");
  const [place, setPlace] = useState("카페");
  const [vibe, setVibe] = useState("스마트 캐주얼");
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <PhoneShell>
      <NavHeader back title="오늘 데이트 룩 추천" />
      <div className="scroll-area bg-pink-light">
        <div className="space-y-4 p-4">
          <Section label="성별">
            <div className="grid grid-cols-2 gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGender(g.id)}
                  className={`rounded-xl py-3 text-sm font-medium ${
                    gender === g.id ? "bg-pink text-white" : "bg-surface text-text-2 border border-border"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </Section>

          <Section label="오늘 날씨">
            <div className="grid grid-cols-3 gap-2">
              {WEATHERS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setWeather(id)}
                  className={`flex flex-col items-center gap-1 rounded-xl py-3 text-sm font-medium ${
                    weather === id ? "bg-pink text-white" : "bg-surface text-text-2 border border-border"
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </div>
          </Section>

          <Section label="만나는 장소">
            <div className="flex flex-wrap gap-2">
              {PLACES.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlace(p)}
                  className={`pill ${place === p ? "pill-active" : ""}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </Section>

          <Section label="원하는 분위기">
            <div className="flex flex-wrap gap-2">
              {VIBES.map((v) => (
                <button
                  key={v}
                  onClick={() => setVibe(v)}
                  className={`pill ${vibe === v ? "pill-active" : ""}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </Section>

          <button
            onClick={() => setShowComingSoon(true)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-pink text-[15px] font-semibold text-white"
          >
            <Sparkles size={16} />
            AI 룩 추천 받기
          </button>

          {showComingSoon && (
            <div className="rounded-xl bg-pink-light p-3 text-center text-sm text-pink">
              AI 코디 추천 기능 준비 중이에요 ✨
            </div>
          )}
        </div>
      </div>
    </PhoneShell>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[13px] font-medium text-text-2">{label}</div>
      {children}
    </div>
  );
}

