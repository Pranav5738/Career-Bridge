import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        title: { type: String, required: true },
        body: { type: String, default: "" },
        tag: { type: String, default: "General" },
        repliesCount: { type: Number, default: 0 }
    },
    { timestamps: true }
);

export default mongoose.model("ForumPost", schema);