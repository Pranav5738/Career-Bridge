import { z } from "zod";

export const updateProfileSchema = z.object({
    status: z.string().optional(),
    targetRole: z.string().optional(),
    expertise: z.string().optional()
});