import { z } from "zod";

export const registerWebinarSchema = z.object({
    webinarId: z.string()
});

export const calendarSchema = z.object({
    webinarId: z.string()
});

export const createWebinarSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    speaker: z.string().min(2, "Speaker is required"),
    dateTime: z.string().datetime("Invalid webinar date/time"),
    meetingLink: z.string().optional(),
    location: z.string().optional(),
    tag: z.string().min(2, "Tag is required"),
    duration: z.number().int().min(15).max(240).optional()
});