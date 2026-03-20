import { z } from "zod";

export const registerWebinarSchema = z.object({
    webinarId: z.string()
});

export const calendarSchema = z.object({
    webinarId: z.string()
});