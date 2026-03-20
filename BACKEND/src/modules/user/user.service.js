import User from "../auth/auth.model.js";

export const getProfileService = async (userId) => {
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    return user;
};

export const updateProfileService = async (userId, data) => {
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    if (data.status !== undefined) user.status = data.status;
    if (data.targetRole !== undefined) user.targetRole = data.targetRole;
    if (data.expertise !== undefined) user.expertise = data.expertise;

    await user.save();

    return user;
};