import ResumeAnalysis from "./resumeAnalysis.model.js";
import { analyzeResumeService } from "./resume.service.js";
import { PDFParse } from "pdf-parse";

export const analyzeResume = async (req, res) => {
    try {
        let resumeText = "";

        // 📄 If PDF uploaded
        if (req.file) {
            const parser = new PDFParse({ data: req.file.buffer });
            const data = await parser.getText();
            await parser.destroy();
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