import { z } from "zod";

export const skillGapSchema = z.object({
    targetRole: z.string(),
    currentSkills: z.array(z.string()).default([])
});