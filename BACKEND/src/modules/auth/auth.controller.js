import { registerUser, loginUser, requestPasswordReset, resetPassword } from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.schema.js";

const toPublicUser = (user) => ({
    id: user?._id || user?.id,
    name: user?.name || "",
    email: user?.email,
    role: user?.role,
    status: user?.status,
    targetRole: user?.targetRole,
    expertise: user?.expertise,
    github: user?.github,
    location: user?.location,
    membershipPlan: user?.membershipPlan,
    skills: Array.isArray(user?.skills) ? user.skills : []
});

export const register = asyncHandler(async (req, res) => {
    const { user, token } = await registerUser(req.body);

    res.status(201).json({
        user: toPublicUser(user),
        token
    });
});

export const login = asyncHandler(async (req, res) => {
    const { user, token } = await loginUser(req.body.email, req.body.password);

    res.status(200).json({
        user: toPublicUser(user),
        token
    });
});

export const me = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res.status(200).json({
            user: null
        });
    }

    res.status(200).json({
        user: toPublicUser(req.user)
    });
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = forgotPasswordSchema.parse(req.body);
    const result = await requestPasswordReset(email);

    res.status(200).json(result);
});

export const confirmResetPassword = asyncHandler(async (req, res) => {
    const { token, password } = resetPasswordSchema.parse(req.body);
    const result = await resetPassword({ token, password });

    res.status(200).json({
        message: "Password reset successful",
        user: toPublicUser(result.user),
        token: result.token,
    });
});