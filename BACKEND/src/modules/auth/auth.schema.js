import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["student", "mentor"]),
    status: z.string().optional(),
    targetRole: z.string().optional(),
    expertise: z.string().optional()
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required")
});