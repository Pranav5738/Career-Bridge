import { asyncHandler } from "../../utils/asyncHandler.js";
import {
    getProfileService,
    updateProfileService
} from "./user.service.js";

export const getProfile = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res.status(200).json({ user: null });
    }

    const user = await getProfileService(req.user._id);

    res.json({
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
            status: user.status,
            targetRole: user.targetRole,
            expertise: user.expertise
        }
    });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const user = await updateProfileService(req.user._id, req.body);

    res.json({
        message: "Profile updated",
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
            status: user.status,
            targetRole: user.targetRole,
            expertise: user.expertise
        }
    });
});