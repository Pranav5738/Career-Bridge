import { z } from "zod";

export const updateProfileSchema = z.object({
    status: z.string().trim().optional(),
    targetRole: z.string().trim().optional(),
    expertise: z.string().trim().optional(),
    github: z.string().trim().optional(),
    location: z.string().trim().optional(),
    membershipPlan: z.string().trim().optional(),
    skills: z.array(z.string().trim()).optional()
});