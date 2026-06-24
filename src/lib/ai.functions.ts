import { createServerFn } from "@tanstack/react-start";

export interface PhotoAnalysisResult {
  score: number;
  expression: number;
  brightness: number;
  retouchLevel: "natural" | "moderate" | "heavy";
  retouchScore: number;
  isAiGenerated: boolean;
  tips: { type: "good" | "improve"; text: string }[];
}

export const analyzePhotoFn = createServerFn({ method: "POST" })
  .inputValidator((input: { imageDataUrl: string }) => {
    if (!input?.imageDataUrl?.startsWith("data:image/"))
      throw new Error("올바른 이미지가 필요합니다");
    return input;
  })
  .handler(async (): Promise<PhotoAnalysisResult> => {
    throw new Error("AI 기능은 준비 중이에요.");
  });

export interface ChatPracticeResult {
  feedback: string;
  good: string[];
  improve: string[];
  suggestions: string[];
}

export const chatPracticeFn = createServerFn({ method: "POST" })
  .inputValidator((input: { mode: "intro" | "hobby" | "smalltalk"; message: string; history?: { role: "user" | "assistant"; text: string }[] }) => {
    if (!input.message || input.message.length > 500)
      throw new Error("메시지를 입력해주세요 (500자 이내)");
    return input;
  })
  .handler(async (): Promise<ChatPracticeResult> => {
    throw new Error("AI 기능은 준비 중이에요.");
  });

export interface AiPlace {
  id: string;
  name: string;
  category: string;
  address: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  isAfter?: boolean;
  lat: number;
  lng: number;
  reason: string;
  priceRange: string;
  menuExamples: string[];
  imageQuery: string;
}

export const recommendPlacesFn = createServerFn({ method: "POST" })
  .inputValidator((input: { area: string; category: string; priceRange?: string; mood?: string }) => input)
  .handler(async (): Promise<AiPlace[]> => {
    throw new Error("AI 기능은 준비 중이에요.");
  });

export interface LookRecommendation {
  title: string;
  summary: string;
  items: { category: string; description: string; color: string }[];
  tips: string[];
}

export const recommendLookFn = createServerFn({ method: "POST" })
  .inputValidator((input: {
    gender: "M" | "F";
    weather: "sunny" | "cloudy" | "rainy";
    place: string;
    vibe: string;
  }) => input)
  .handler(async (): Promise<LookRecommendation> => {
    throw new Error("AI 기능은 준비 중이에요.");
  });
