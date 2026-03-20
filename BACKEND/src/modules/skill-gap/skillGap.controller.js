import { asyncHandler } from "../../utils/asyncHandler.js";
import { analyzeSkillGapService } from "./skillGap.service.js";

export const analyzeSkillGap = asyncHandler(async (req, res) => {
    const { targetRole, currentSkills } = req.body;

    const result = await analyzeSkillGapService(
        targetRole,
        currentSkills || []
    );

    res.json({
        message: "Skill gap analyzed",
        result
    });
});