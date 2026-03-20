import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        mode: {
            type: String,
            enum: ["System Design", "DSA", "Behavioral"],
            required: true
        },
        startedAt: Date,
        endedAt: Date,
        status: {
            type: String,
            enum: ["running", "completed"],
            default: "running"
        },
        reviewRequested: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export default mongoose.model("InterviewSession", schema);