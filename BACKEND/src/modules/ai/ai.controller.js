import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateLearningPlanService } from "./ai.service.js";

export const generatePlan = asyncHandler(async (req, res) => {
    const { skillGaps, targetRole } = req.body || {};

    const plan = await generateLearningPlanService({
        skillGaps,
        targetRole,
    });

    res.json({
        message: "Learning plan generated",
        plan,
    });
});