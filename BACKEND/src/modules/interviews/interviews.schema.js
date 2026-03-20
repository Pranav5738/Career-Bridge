import { z } from "zod";

export const interviewSchema = z.object({
    mode: z.enum(["System Design", "DSA", "Behavioral"])
});