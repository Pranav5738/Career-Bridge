import User from "../auth/auth.model.js";
import { AppError } from "../../utils/AppError.js";

export const getProfileService = async (userId) => {
    const user = await User.findById(userId);

    if (!user) throw new AppError("User not found", 404);

    return user;
};

export const updateProfileService = async (userId, data) => {
    const user = await User.findById(userId);

    if (!user) throw new AppError("User not found", 404);

    if (data.name !== undefined) user.name = String(data.name).trim();
    if (data.status !== undefined) user.status = data.status;
    if (data.targetRole !== undefined) user.targetRole = data.targetRole;
    if (data.expertise !== undefined) user.expertise = data.expertise;
    if (data.github !== undefined) user.github = String(data.github).trim().replace(/^@+/, "");
    if (data.location !== undefined) user.location = String(data.location).trim();
    if (data.membershipPlan !== undefined) user.membershipPlan = String(data.membershipPlan).trim();
    if (Array.isArray(data.skills)) {
        user.skills = data.skills
            .map((skill) => String(skill).trim())
            .filter(Boolean);
    }

    await user.save();

    return user;
};