import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import resumeRoutes from "./modules/resume/resume.routes.js"; // Import resume routes
import marketplaceRoutes from "./modules/marketplace/marketplace.routes.js";
import interviewsRoutes from "./modules/interviews/interviews.routes.js";
import webinarsRoutes from "./modules/webinars/webinars.routes.js";
import forumRoutes from "./modules/forum/forum.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import skillGapRoutes from "./modules/skill-gap/skillGap.routes.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";


const app = express();

const swaggerDocument = YAML.load("./docs/openai.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(helmet());

app.use(express.json());

app.use(
    cors({
        origin(origin, callback) {
            if (!origin) {
                callback(null, true);
                return;
            }

            const allowList = new Set([
                env.corsOrigin,
                "http://localhost:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174",
            ]);

            const isLocalhostDev = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

            callback(null, allowList.has(origin) || isLocalhostDev);
        }
    })
);

app.use("/api/interviews", interviewsRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/user", userRoutes);

app.use("/api/webinars", webinarsRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/resume", resumeRoutes); // Use resume routes

app.use("/api/forum", forumRoutes);

app.use("/api/skill-gap", skillGapRoutes);

app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({
        message: "DevConnect API running"
    });
});

app.use("/api/marketplace", marketplaceRoutes); // Use marketplace routes

app.use(errorHandler);

export default app;