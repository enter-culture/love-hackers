/**
 * 프론트엔드 API facade — 데모용 목업 구현
 */

// ── Types ────────────────────────────────────────────────
export type Gender = "M" | "F";
export type MeetingRatio = "2:2" | "3:3" | "4:4" | "5:5";

export interface Meeting {
  id: string;
  title: string;
  location: string;
  venueType: string;
  ratio: MeetingRatio;
  startsAt: string;
  maleCount: number;
  femaleCount: number;
  maleCapacity: number;
  femaleCapacity: number;
  status: "OPEN" | "CLOSED";
  hostId?: string | null;
  hostNickname?: string | null;
  description?: string | null;
  aiRecommended?: boolean;
  joined?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  age: number;
  gender: Gender;
  bio: string;
  job?: string;
  hobbies: string[];
  photos: string[];
}

export interface PhotoAnalysis {
  score: number;
  expression: number;
  brightness: number;
  retouchLevel: "natural" | "moderate" | "heavy";
  retouchScore: number;
  isAiGenerated: boolean;
  tips: { type: "good" | "improve"; text: string }[];
}

export interface ChatPracticeReply {
  feedback: string;
  good: string[];
  improve: string[];
  suggestions: string[];
}

export interface DatePlace {
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
  reason?: string;
  priceRange?: string;
  menuExamples?: string[];
  imageQuery?: string;
}

// ── Mock data ────────────────────────────────────────────
const MOCK_MEETINGS: Meeting[] = [
  {
    id: "m1",
    title: "성수동 감성 카페 2:2 소개팅",
    location: "성수동",
    venueType: "카페",
    ratio: "2:2",
    startsAt: "2026-07-12T14:00:00",
    maleCount: 1,
    femaleCount: 0,
    maleCapacity: 2,
    femaleCapacity: 2,
    status: "OPEN",
    hostNickname: "민준",
    description: "성수동 힙한 카페에서 여유롭게 대화해요. 조용하고 분위기 좋아 대화하기 딱 좋아요!",
    aiRecommended: true,
    joined: false,
  },
  {
    id: "m2",
    title: "홍대 맛집 탐방 3:3",
    location: "홍대",
    venueType: "레스토랑",
    ratio: "3:3",
    startsAt: "2026-07-15T18:30:00",
    maleCount: 2,
    femaleCount: 1,
    maleCapacity: 3,
    femaleCapacity: 3,
    status: "OPEN",
    hostNickname: "서연",
    description: "홍대 근처 분위기 좋은 이탈리안 레스토랑에서 만나요. 음식 얘기로 아이스브레이킹 해봐요!",
    aiRecommended: false,
    joined: false,
  },
  {
    id: "m3",
    title: "강남 보드게임 카페 2:2",
    location: "강남",
    venueType: "카페",
    ratio: "2:2",
    startsAt: "2026-07-05T15:00:00",
    maleCount: 2,
    femaleCount: 2,
    maleCapacity: 2,
    femaleCapacity: 2,
    status: "CLOSED",
    hostNickname: "지훈",
    description: "강남 보드게임 카페에서 게임하며 자연스럽게 친해져요. 이미 마감됐어요!",
    aiRecommended: false,
    joined: false,
  },
  {
    id: "m4",
    title: "이태원 루프탑 4:4",
    location: "이태원",
    venueType: "바",
    ratio: "4:4",
    startsAt: "2026-07-19T19:00:00",
    maleCount: 2,
    femaleCount: 1,
    maleCapacity: 4,
    femaleCapacity: 4,
    status: "OPEN",
    hostNickname: "예린",
    description: "이태원 뷰 좋은 루프탑에서 멋진 저녁을 함께해요. 경치가 최고예요!",
    aiRecommended: true,
    joined: false,
  },
  {
    id: "m5",
    title: "연남동 브런치 2:2",
    location: "연남동",
    venueType: "카페",
    ratio: "2:2",
    startsAt: "2026-07-20T11:00:00",
    maleCount: 0,
    femaleCount: 0,
    maleCapacity: 2,
    femaleCapacity: 2,
    status: "OPEN",
    hostNickname: "하은",
    description: "연남동 감성 브런치 카페에서 여유로운 주말 아침 어떠세요?",
    aiRecommended: false,
    joined: false,
  },
];

let _profile: UserProfile | null = null;
const _joinedIds = new Set<string>();

// ── API ──────────────────────────────────────────────────
export const api = {
  async signOut() {},

  async currentUser() {
    return null;
  },

  async listMeetings(filter?: { ratio?: string }): Promise<Meeting[]> {
    let meetings = [...MOCK_MEETINGS];
    if (filter?.ratio && filter.ratio !== "전체") {
      meetings = meetings.filter((m) => m.ratio === filter.ratio);
    }
    return meetings
      .sort((a, b) => {
        if (a.status !== b.status) return a.status === "OPEN" ? -1 : 1;
        return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
      })
      .map((m) => ({ ...m, joined: _joinedIds.has(m.id) }));
  },

  async getMeeting(id: string): Promise<Meeting> {
    const m = MOCK_MEETINGS.find((m) => m.id === id);
    if (!m) throw new Error("모임을 찾을 수 없어요");
    return { ...m, joined: _joinedIds.has(m.id) };
  },

  async createMeeting(input: {
    title: string;
    location: string;
    venueType: string;
    ratio: MeetingRatio;
    startsAt: string;
    maleCapacity: number;
    femaleCapacity: number;
    description?: string;
  }): Promise<{ id: string }> {
    const id = `m${Date.now()}`;
    MOCK_MEETINGS.unshift({
      id,
      ...input,
      maleCount: 0,
      femaleCount: 0,
      status: "OPEN",
      hostNickname: _profile?.nickname ?? "나",
      description: input.description ?? null,
      aiRecommended: false,
      joined: false,
    });
    return { id };
  },

  async joinMeeting(id: string, _gender: Gender) {
    _joinedIds.add(id);
    const meeting = await api.getMeeting(id);
    return { ok: true as const, meeting };
  },

  async myMeetings(): Promise<Meeting[]> {
    return MOCK_MEETINGS.filter((m) => _joinedIds.has(m.id)).map((m) => ({
      ...m,
      joined: true,
    }));
  },

  async saveProfile(input: Omit<UserProfile, "id" | "email">): Promise<UserProfile> {
    _profile = { id: "demo-user", email: "demo@example.com", ...input };
    return _profile;
  },

  async getMyProfile(): Promise<UserProfile | null> {
    return _profile;
  },

  analyzePhoto(_imageDataUrl: string): Promise<PhotoAnalysis> {
    return Promise.reject(new Error("AI 기능은 준비 중이에요."));
  },

  chatPractice(
    _mode: "intro" | "hobby" | "smalltalk",
    _message: string,
    _history?: { role: "user" | "assistant"; text: string }[],
  ): Promise<ChatPracticeReply> {
    return Promise.reject(new Error("AI 기능은 준비 중이에요."));
  },

  async recommendPlaces(_input: {
    area: string;
    category: string;
    priceRange?: string;
    mood?: string;
  }): Promise<DatePlace[]> {
    return Promise.reject(new Error("AI 기능은 준비 중이에요."));
  },
};
