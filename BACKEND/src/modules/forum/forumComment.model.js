import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        postId: { type: mongoose.Schema.Types.ObjectId, ref: "ForumPost", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        body: { type: String, required: true, trim: true },
        likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
        dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    },
    { timestamps: true }
);

schema.index({ postId: 1, createdAt: 1 });

export default mongoose.model("ForumComment", schema);