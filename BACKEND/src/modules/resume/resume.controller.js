import ResumeAnalysis from "./resumeAnalysis.model.js";
import { analyzeResumeService } from "./resume.service.js";

export const analyzeResume = async (req, res) => {
    try {
        let resumeText = "";

        // 📄 If PDF uploaded
        if (req.file) {
            const pdfParse = (await import("pdf-parse")).default;
            const data = await pdfParse(req.file.buffer);
            resumeText = data?.text || "";
        }

        const { jobDescription = "" } = req.body || {};

        if (!jobDescription.trim()) {
            return res.status(400).json({
                message: "jobDescription is required"
            });
        }

        const analysis = await analyzeResumeService(
            resumeText,
            jobDescription
        );

        if (req.user?._id) {
            await ResumeAnalysis.create({
                userId: req.user._id,
                jobDescription,
                score: analysis.score,
                breakdown: analysis.breakdown,
                suggestions: analysis.suggestions,
            });
        }

        res.json({
            message: "Resume analyzed successfully",
            analysis
        });

    } catch (error) {
        res.status(500).json({
            message: error?.message || "Error analyzing resume"
        });
    }
};