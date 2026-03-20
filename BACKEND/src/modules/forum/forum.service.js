import { z } from "zod";
import ForumPost from "./forumPost.model.js";

export const createPostSchema = z.object({
    title: z.string().min(1),
    body: z.string().optional(),
    tag: z.string().optional()
});

export const createPostService = async (userId, data) => {
    const post = await ForumPost.create({
        userId,
        title: data.title,
        body: data.body || "",
        tag: data.tag || "General"
    });

    return post;
};

export const getPostsService = async () => {
    const posts = await ForumPost.find().sort({ createdAt: -1 }).lean();
    return posts;
};