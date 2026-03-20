import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const env = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpires: process.env.JWT_EXPIRES_IN,
    corsOrigin: process.env.CORS_ORIGIN,
    requireAuthStrict: process.env.REQUIRE_AUTH_STRICT === "true",
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFrom: process.env.SMTP_FROM,
    frontendUrl: process.env.FRONTEND_URL
};