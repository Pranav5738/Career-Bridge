import { z } from "zod";

export const analyzeResumeSchema = z.object({
    jobDescription: z.string().optional()
});