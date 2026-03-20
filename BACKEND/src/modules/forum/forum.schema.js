import { z } from "zod";

export const createPostSchema = z.object({
    title: z.string().min(1),
    body: z.string().optional(),
    tag: z.string().optional()
});