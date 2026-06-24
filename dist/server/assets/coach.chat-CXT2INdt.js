import { jsxs, jsx } from "react/jsx-runtime";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, Send, Mic } from "lucide-react";
import { useState } from "react";
import { P as PhoneShell, N as NavHeader } from "./PhoneShell-B0f7zx9g.js";
import { a as api } from "./api-FjN_DlmY.js";
import "@tanstack/react-router";
const MODES = [{
  id: "intro",
  label: "자기소개"
}, {
  id: "hobby",
  label: "취미·관심사"
}, {
  id: "smalltalk",
  label: "스몰토크"
}];
function ChatPractice() {
  const [mode, setMode] = useState("intro");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{
    role: "ai",
    text: "안녕하세요! 지금부터 소개팅 자기소개를 연습해볼게요. 먼저 30초 자기소개를 해보세요 😊"
  }]);
  const send = useMutation({
    mutationFn: (text) => {
      const history = messages.map((m) => ({
        role: m.role === "me" ? "user" : "assistant",
        text: m.text
      }));
      return api.chatPractice(mode, text, history);
    },
    onSuccess: (reply, text) => {
      setMessages((m) => [...m, {
        role: "me",
        text
      }, {
        role: "ai",
        text: reply.feedback,
        reply
      }]);
      setInput("");
    }
  });
  function switchMode(next) {
    setMode(next);
    const intro = {
      intro: "안녕하세요! 지금부터 소개팅 자기소개를 연습해볼게요. 먼저 30초 자기소개를 해보세요 😊",
      hobby: "취미·관심사 이야기를 연습해볼게요. 요즘 가장 빠져있는 게 뭔가요? 🎨",
      smalltalk: "스몰토크를 연습해볼게요. 가볍게 날씨나 주말 이야기로 말 걸어보세요."
    };
    setMessages([{
      role: "ai",
      text: intro[next]
    }]);
    setInput("");
  }
  return /* @__PURE__ */ jsxs(PhoneShell, { hideNav: true, children: [
    /* @__PURE__ */ jsx(NavHeader, { back: true, title: "대화 연습" }),
    /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 bg-surface px-4 pb-3", children: /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: MODES.map((m) => /* @__PURE__ */ jsx("button", { onClick: () => switchMode(m.id), className: `pill ${mode === m.id ? "pill-active" : ""}`, children: m.label }, m.id)) }) }),
    /* @__PURE__ */ jsx("div", { className: "scroll-area-no-nav px-4 pt-4 pb-32", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      messages.map((msg, i) => msg.role === "me" ? /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx("div", { className: "max-w-[80%] rounded-2xl rounded-br-md bg-pink px-3.5 py-2.5 text-sm text-white", children: msg.text }) }, i) : /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink to-purple", children: /* @__PURE__ */ jsx(Sparkles, { size: 14, className: "text-white" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsx("div", { className: "inline-block max-w-[85%] rounded-2xl rounded-bl-md bg-secondary px-3.5 py-2.5 text-sm", children: msg.text }),
          msg.reply && /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            msg.reply.good.map((g, gi) => /* @__PURE__ */ jsx(Tip, { kind: "good", children: g }, "g" + gi)),
            msg.reply.improve.map((g, gi) => /* @__PURE__ */ jsx(Tip, { kind: "improve", children: g }, "i" + gi)),
            msg.reply.suggestions.length > 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-surface p-3.5", children: [
              /* @__PURE__ */ jsx("div", { className: "mb-2 text-xs font-semibold text-purple", children: "💬 이렇게 이어가보세요" }),
              /* @__PURE__ */ jsx("div", { className: "space-y-1.5", children: msg.reply.suggestions.map((s, si) => /* @__PURE__ */ jsx("button", { onClick: () => setInput(s), className: `block w-full rounded-lg px-3 py-2 text-left text-sm ${si === 0 ? "bg-purple-light text-foreground" : "bg-secondary text-foreground"}`, children: s }, si)) })
            ] })
          ] })
        ] })
      ] }, i)),
      send.isPending && /* @__PURE__ */ jsx("div", { className: "text-xs text-text-3", children: "AI가 답변 중…" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-x-0 bottom-0 mx-auto w-full max-w-[420px] border-t border-border bg-surface px-4 py-3 pb-6", children: /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      if (input.trim() && !send.isPending) send.mutate(input.trim());
    }, className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("input", { value: input, onChange: (e) => setInput(e.target.value), placeholder: "메시지를 입력하세요...", className: "flex-1 rounded-full bg-secondary px-4 py-2.5 text-sm outline-none" }),
      /* @__PURE__ */ jsx("button", { type: "submit", className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pink text-white", "aria-label": input.trim() ? "보내기" : "음성 입력", children: input.trim() ? /* @__PURE__ */ jsx(Send, { size: 16 }) : /* @__PURE__ */ jsx(Mic, { size: 18 }) })
    ] }) })
  ] });
}
function Tip({
  kind,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-surface p-3 text-xs", children: [
    /* @__PURE__ */ jsx("span", { className: kind === "good" ? "font-semibold text-green-600" : "font-semibold text-pink", children: kind === "good" ? "✓ 좋은 점" : "💡 개선 포인트" }),
    /* @__PURE__ */ jsx("div", { className: "mt-1 text-text-2", children })
  ] });
}
export {
  ChatPractice as component
};
