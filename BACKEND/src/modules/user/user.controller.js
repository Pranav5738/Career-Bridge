import { asyncHandler } from "../../utils/asyncHandler.js";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import {
    getProfileService,
    updateProfileService,
    updateUserAvatarService
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
            avatarUrl: user.avatarUrl,
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
            avatarUrl: user.avatarUrl,
            skills: Array.isArray(user.skills) ? user.skills : []
        }
    });
});

export const uploadProfileAvatar = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "Avatar file is required" });
    }

    if (!file.mimetype?.startsWith("image/")) {
        return res.status(400).json({ message: "Only image files are allowed" });
    }

    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
        return res.status(400).json({ message: "Image must be 5MB or smaller" });
    }

    const extension = (file.mimetype.split("/")[1] || "png").toLowerCase();
    const safeExt = extension === "jpeg" ? "jpg" : extension;
    const fileName = `${req.user._id}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${safeExt}`;

    const uploadDir = path.join(process.cwd(), "uploads", "avatars");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, file.buffer);

    const avatarUrl = `/uploads/avatars/${fileName}`;
    const user = await updateUserAvatarService(req.user._id, avatarUrl);

    res.status(200).json({
        message: "Profile picture updated",
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
            avatarUrl: user.avatarUrl,
            skills: Array.isArray(user.skills) ? user.skills : []
        }
    });
});