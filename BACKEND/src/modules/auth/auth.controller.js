import { registerUser, loginUser } from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { registerSchema, loginSchema } from "./auth.schema.js";

export const register = asyncHandler(async (req, res) => {
    const { user, token } = await registerUser(req.body);

    res.status(201).json({
        user,
        token
    });
});

export const login = asyncHandler(async (req, res) => {
    const { user, token } = await loginUser(req.body.email, req.body.password);

    res.status(200).json({
        user,
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
        user: {
            id: req.user._id,
            email: req.user.email,
            role: req.user.role,
            status: req.user.status,
            targetRole: req.user.targetRole,
            expertise: req.user.expertise
        }
    });
});