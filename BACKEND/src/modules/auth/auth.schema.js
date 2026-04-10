import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().trim().min(1).max(80).optional(),
    email: z.string().trim().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["student", "mentor"]),
    status: z.string().trim().optional(),
    targetRole: z.string().trim().optional(),
    expertise: z.string().trim().optional()
});

export const loginSchema = z.object({
    email: z.string().trim().email("Invalid email"),
    password: z.string().min(1, "Password is required")
});

export const forgotPasswordSchema = z.object({
    email: z.string().trim().email("Invalid email")
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(8, "Password must be at least 8 characters")
});