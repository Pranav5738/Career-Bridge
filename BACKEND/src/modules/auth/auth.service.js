import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./auth.model.js";
import { env } from "../../config/env.js";


export const registerUser = async (data) => {

    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
        throw new Error("Email already registered");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await User.create({
        email: data.email,
        passwordHash,
        role: data.role,
        status: data.status,
        targetRole: data.targetRole,
        expertise: data.expertise
    });

    const token = jwt.sign(
        { id: user._id },
        env.jwtSecret,
        { expiresIn: env.jwtExpires }
    );

    return { user, token };
};



export const loginUser = async (email, password) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
        { id: user._id },
        env.jwtSecret,
        { expiresIn: env.jwtExpires }
    );

    return { user, token };
};