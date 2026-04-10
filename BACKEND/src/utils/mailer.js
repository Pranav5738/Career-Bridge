import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter;

export const getTransporter = async () => {
    if (transporter) return transporter;

    // If SMTP not provided, create Ethereal account
    if (!env.smtpUser) {
        const testAccount = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });

        console.log("📧 Ethereal test account created");
    } else {
        transporter = nodemailer.createTransport({
            host: env.smtpHost,
            port: env.smtpPort,
            auth: {
                user: env.smtpUser,
                pass: env.smtpPass
            }
        });
    }

    return transporter;
};

export const sendMail = async (options) => {
    const t = await getTransporter();

    const info = await t.sendMail({
        from: env.smtpFrom,
        to: options.to,
        subject: options.subject,
        html: options.html
    });

    console.log("📧 Email sent:", info.messageId);

    // Preview link (Ethereal)
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log("🔗 Preview URL:", preview);

    return info;
};