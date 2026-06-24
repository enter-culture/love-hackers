import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { P as PhoneShell, N as NavHeader } from "./PhoneShell-B0f7zx9g.js";
import { a as api } from "./api-FjN_DlmY.js";
const HOBBIES = ["카페", "사진", "영화", "운동", "게임", "와인", "음악", "여행"];
function Profile() {
  const qc = useQueryClient();
  const {
    data: existing
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.getMyProfile()
  });
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState("M");
  const [job, setJob] = useState("");
  const [bio, setBio] = useState("");
  const [hobbies, setHobbies] = useState([]);
  useEffect(() => {
    if (existing) {
      setNickname(existing.nickname);
      setAge(existing.age);
      setGender(existing.gender);
      setJob(existing.job ?? "");
      setBio(existing.bio);
      setHobbies(existing.hobbies);
    }
  }, [existing]);
  const save = useMutation({
    mutationFn: () => api.saveProfile({
      nickname,
      age,
      gender,
      job,
      bio,
      hobbies,
      photos: []
    }),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["profile"]
    })
  });
  function toggleHobby(h) {
    setHobbies((arr) => arr.includes(h) ? arr.filter((x) => x !== h) : [...arr, h]);
  }
  async function logout() {
    await api.signOut();
    location.href = "/login";
  }
  return /* @__PURE__ */ jsxs(PhoneShell, { children: [
    /* @__PURE__ */ jsx(NavHeader, { title: "내 프로필", right: /* @__PURE__ */ jsx("button", { onClick: logout, "aria-label": "로그아웃", className: "flex h-9 w-9 items-center justify-center rounded-full bg-secondary", children: /* @__PURE__ */ jsx(LogOut, { size: 16 }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "scroll-area px-4 pt-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center gap-3 rounded-2xl border border-border bg-surface p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-full bg-pink-mid text-pink", children: /* @__PURE__ */ jsx(User, { size: 28 }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[15px] font-semibold", children: nickname || "닉네임을 등록하세요" }),
          /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-xs text-text-3", children: existing ? "프로필이 저장되어 있어요" : "프로필을 등록하면 모임 참여가 가능해요" })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/coach/photo", className: "rounded-full bg-pink-light px-3 py-1.5 text-xs font-semibold text-pink", children: "사진 분석" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-2xl border border-border bg-surface p-4", children: [
        /* @__PURE__ */ jsx(Row, { label: "닉네임", children: /* @__PURE__ */ jsx("input", { value: nickname, onChange: (e) => setNickname(e.target.value), maxLength: 12, className: "w-full rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm outline-none", placeholder: "닉네임" }) }),
        /* @__PURE__ */ jsx(Row, { label: "나이 · 성별", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("input", { type: "number", min: 19, max: 70, value: age, onChange: (e) => setAge(Number(e.target.value)), className: "w-24 rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm outline-none" }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: ["M", "F"].map((g) => /* @__PURE__ */ jsx("button", { onClick: () => setGender(g), className: `rounded-xl px-4 py-2.5 text-sm font-medium ${g === gender ? "bg-pink text-white" : "border border-border bg-secondary text-text-2"}`, children: g === "M" ? "남성" : "여성" }, g)) })
        ] }) }),
        /* @__PURE__ */ jsx(Row, { label: "직업", children: /* @__PURE__ */ jsx("input", { value: job, onChange: (e) => setJob(e.target.value), placeholder: "예: 개발자", maxLength: 30, className: "w-full rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm outline-none" }) }),
        /* @__PURE__ */ jsx(Row, { label: "자기소개", children: /* @__PURE__ */ jsx("textarea", { value: bio, onChange: (e) => setBio(e.target.value), maxLength: 200, rows: 3, placeholder: "간단한 자기소개를 적어주세요", className: "w-full resize-none rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm outline-none" }) }),
        /* @__PURE__ */ jsx(Row, { label: "관심사", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: HOBBIES.map((h) => /* @__PURE__ */ jsx("button", { onClick: () => toggleHobby(h), className: `pill ${hobbies.includes(h) ? "pill-active" : ""}`, children: h }, h)) }) })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => save.mutate(), disabled: !nickname || save.isPending, className: "mt-5 flex h-12 w-full items-center justify-center rounded-2xl bg-pink text-[15px] font-semibold text-white disabled:opacity-50", children: save.isPending ? "저장 중…" : save.isSuccess ? "저장됨 ✓" : "프로필 저장" }),
      /* @__PURE__ */ jsx("div", { className: "h-6" })
    ] })
  ] });
}
function Row({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "mb-1.5 text-xs text-text-2", children: label }),
    children
  ] });
}
export {
  Profile as component
};
