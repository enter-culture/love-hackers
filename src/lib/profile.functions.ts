import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ProfileInput = z.object({
  nickname: z.string().min(1).max(20),
  age: z.number().int().min(19).max(100),
  gender: z.enum(["M", "F"]),
  job: z.string().max(40).optional(),
  bio: z.string().max(300).default(""),
  hobbies: z.array(z.string().max(20)).max(20).default([]),
  photos: z.array(z.string().max(500)).max(10).default([]),
});

export const saveProfileFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ProfileInput.parse(input))
  .handler(async ({ data }) => {
    return { user_id: "demo-user", ...data };
  });

export const getMyProfileFn = createServerFn({ method: "GET" })
  .handler(async () => {
    return null;
  });
