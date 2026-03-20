import { asyncHandler } from "../../utils/asyncHandler.js";
import {
    studentDashboardService,
    mentorDashboardService
} from "./dashboard.service.js";

export const getStudentDashboard = asyncHandler(async (req, res) => {
    const data = await studentDashboardService(req.user._id);

    res.json({
        dashboard: data
    });
});

export const getMentorDashboard = asyncHandler(async (req, res) => {
    const data = await mentorDashboardService(req.user._id);

    res.json({
        dashboard: data
    });
});