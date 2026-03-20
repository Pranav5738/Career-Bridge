import { asyncHandler } from "../../utils/asyncHandler.js";
import {
    createPostService,
    getPostsService
} from "./forum.service.js";

export const createPost = asyncHandler(async (req, res) => {
    const userId = req.user?._id || null;
    const { title, body, tag } = req.body;

    const post = await createPostService(userId, { title, body, tag });

    res.status(201).json({
        message: "Post created",
        post: {
            id: post._id,
            title: post.title,
            tag: post.tag,
            replies: post.repliesCount,
            createdAt: post.createdAt
        }
    });
});

export const getPosts = asyncHandler(async (req, res) => {
    const posts = await getPostsService();

    // map to frontend shape
    const formatted = posts.map((p) => ({
        id: p._id,
        title: p.title,
        tag: p.tag,
        replies: p.repliesCount,
        createdAt: p.createdAt
    }));

    res.json({ posts: formatted });
});