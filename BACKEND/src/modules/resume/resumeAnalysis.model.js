import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        jobDescription: String,
        score: Number,
        breakdown: [
            {
                label: String,
                value: Number
            }
        ],
        suggestions: [String]
    },
    { timestamps: true }
);

export default mongoose.model("ResumeAnalysis", resumeAnalysisSchema);