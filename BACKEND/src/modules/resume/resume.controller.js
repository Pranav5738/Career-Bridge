import { analyzeResumeService } from "./resume.service.js";

export const analyzeResume = async (req, res) => {
    try {
        let resumeText = "";

        // 📄 If PDF uploaded
        if (req.file) {
            const pdfModule = await import("pdf-parse");
            const parser = new pdfModule.PDFParse({ data: req.file.buffer });
            const data = await parser.getText();
            await parser.destroy();
            resumeText = data.text;
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