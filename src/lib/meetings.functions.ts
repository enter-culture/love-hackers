import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CreateInput = z.object({
  title: z.string().min(1).max(80),
  location: z.string().min(1).max(60),
  venueType: z.string().min(1).max(40),
  ratio: z.enum(["2:2", "3:3", "4:4", "5:5"]),
  startsAt: z.string().min(1),
  maleCapacity: z.number().int().min(1).max(10),
  femaleCapacity: z.number().int().min(1).max(10),
  description: z.string().max(500).optional(),
});

export const createMeetingFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => CreateInput.parse(input))
  .handler(async ({ data }) => {
    return { id: `m${Date.now()}`, ...data };
  });

export const joinMeetingFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ meetingId: z.string() }).parse(input),
  )
  .handler(async () => {
    return { ok: true as const };
  });

export const myMeetingsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    return [];
  });
