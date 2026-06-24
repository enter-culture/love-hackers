import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { c as createServerFn } from "../server.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
const analyzePhotoFn_createServerFn_handler = createServerRpc({
  id: "592ee318729f784624985e5ab0621d8fac0783a4dfe02d222b0ec74360a796bc",
  name: "analyzePhotoFn",
  filename: "src/lib/ai.functions.ts"
}, (opts) => analyzePhotoFn.__executeServer(opts));
const analyzePhotoFn = createServerFn({
  method: "POST"
}).inputValidator((input) => {
  if (!input?.imageDataUrl?.startsWith("data:image/")) throw new Error("올바른 이미지가 필요합니다");
  return input;
}).handler(analyzePhotoFn_createServerFn_handler, async () => {
  throw new Error("AI 기능은 준비 중이에요.");
});
const chatPracticeFn_createServerFn_handler = createServerRpc({
  id: "862e530c4855f868d7dc1c0ec0438f883e138c48c7b0ec3d51a7b179f1874d3f",
  name: "chatPracticeFn",
  filename: "src/lib/ai.functions.ts"
}, (opts) => chatPracticeFn.__executeServer(opts));
const chatPracticeFn = createServerFn({
  method: "POST"
}).inputValidator((input) => {
  if (!input.message || input.message.length > 500) throw new Error("메시지를 입력해주세요 (500자 이내)");
  return input;
}).handler(chatPracticeFn_createServerFn_handler, async () => {
  throw new Error("AI 기능은 준비 중이에요.");
});
const recommendPlacesFn_createServerFn_handler = createServerRpc({
  id: "707efd470f463faca7bd6dbe9bc2b4062f1a4f5936b1ea1f3dd2cebd933c2a58",
  name: "recommendPlacesFn",
  filename: "src/lib/ai.functions.ts"
}, (opts) => recommendPlacesFn.__executeServer(opts));
const recommendPlacesFn = createServerFn({
  method: "POST"
}).inputValidator((input) => input).handler(recommendPlacesFn_createServerFn_handler, async () => {
  throw new Error("AI 기능은 준비 중이에요.");
});
const recommendLookFn_createServerFn_handler = createServerRpc({
  id: "f1c25d7cdc675b1925bfb8621637ee64d86a50f3372e50057c2fc995f07ee4a9",
  name: "recommendLookFn",
  filename: "src/lib/ai.functions.ts"
}, (opts) => recommendLookFn.__executeServer(opts));
const recommendLookFn = createServerFn({
  method: "POST"
}).inputValidator((input) => input).handler(recommendLookFn_createServerFn_handler, async () => {
  throw new Error("AI 기능은 준비 중이에요.");
});
export {
  analyzePhotoFn_createServerFn_handler,
  chatPracticeFn_createServerFn_handler,
  recommendLookFn_createServerFn_handler,
  recommendPlacesFn_createServerFn_handler
};
