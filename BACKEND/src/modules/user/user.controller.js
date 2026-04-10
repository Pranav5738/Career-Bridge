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
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            targetRole: user.targetRole,
            expertise: user.expertise,
            github: user.github,
            location: user.location,
            membershipPlan: user.membershipPlan,
            skills: Array.isArray(user.skills) ? user.skills : []
        }
    });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const user = await updateProfileService(req.user._id, req.body);

    res.json({
        message: "Profile updated",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            targetRole: user.targetRole,
            expertise: user.expertise,
            github: user.github,
            location: user.location,
            membershipPlan: user.membershipPlan,
            skills: Array.isArray(user.skills) ? user.skills : []
        }
    });
});