import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "./auth.model.js";
import PasswordResetToken from "./passwordResetToken.model.js";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/AppError.js";
import { sendMail } from "../../utils/mailer.js";


export const registerUser = async (data) => {

    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
        throw new AppError("Email already registered", 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await User.create({
        name: data.name ? String(data.name).trim() : undefined,
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
        throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign(
        { id: user._id },
        env.jwtSecret,
        { expiresIn: env.jwtExpires }
    );

    return { user, token };
};

const buildAuthToken = (userId) => jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: env.jwtExpires });

export const requestPasswordReset = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        return { message: "If the email exists, a reset link has been sent" };
    }

    await PasswordResetToken.deleteMany({ userId: user._id });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await PasswordResetToken.create({
        userId: user._id,
        tokenHash,
        expiresAt,
    });

    const resetUrl = `${env.frontendUrl || "http://localhost:5173"}/reset-password?token=${rawToken}`;

    await sendMail({
        to: user.email,
        subject: "Career Bridge password reset",
        html: `
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
                <h2>Password reset request</h2>
                <p>We received a request to reset your Career Bridge password.</p>
                <p><a href="${resetUrl}" target="_blank" rel="noreferrer">Reset your password</a></p>
                <p>This link expires in 30 minutes.</p>
            </div>
        `,
    });

    return { message: "If the email exists, a reset link has been sent" };
};

export const resetPassword = async ({ token, password }) => {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const resetRecord = await PasswordResetToken.findOne({
        tokenHash,
        used: false,
        expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
        throw new AppError("Reset token is invalid or expired", 400);
    }

    const user = await User.findById(resetRecord.userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    await user.save();

    resetRecord.used = true;
    await resetRecord.save();

    return {
        user,
        token: buildAuthToken(user._id),
    };
};