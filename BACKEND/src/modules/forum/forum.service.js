import { z } from "zod";
import ForumPost from "./forumPost.model.js";
import ForumComment from "./forumComment.model.js";

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

const ensurePostOwnership = (post, userId) => {
    if (!post) {
        const err = new Error("Post not found");
        err.status = 404;
        throw err;
    }

    if (!userId || String(post.userId) !== String(userId)) {
        const err = new Error("You can only manage your own posts");
        err.status = 403;
        throw err;
    }
};

export const getPostsService = async () => {
    const posts = await ForumPost.find()
        .sort({ createdAt: -1 })
        .populate("userId", "email")
        .lean();
    return posts;
};

export const addCommentSchema = z.object({
    body: z.string().min(1),
});

export const addCommentService = async (userId, postId, body) => {
    const post = await ForumPost.findById(postId);

    if (!post) {
        const err = new Error("Post not found");
        err.status = 404;
        throw err;
    }

    const comment = await ForumComment.create({
        postId,
        userId,
        body,
    });

    await ForumPost.updateOne({ _id: postId }, { $inc: { repliesCount: 1 } });

    return comment;
};

export const getPostCommentsService = async (postId) => {
    const comments = await ForumComment.find({ postId })
        .sort({ createdAt: 1 })
        .populate("userId", "email")
        .lean();

    return comments;
};

export const reactToCommentService = async ({ userId, postId, commentId, reaction }) => {
    const comment = await ForumComment.findOne({ _id: commentId, postId });

    if (!comment) {
        const err = new Error("Comment not found");
        err.status = 404;
        throw err;
    }

    const uid = String(userId);
    const likedSet = new Set(comment.likedBy.map((id) => String(id)));
    const dislikedSet = new Set(comment.dislikedBy.map((id) => String(id)));

    if (reaction === "like") {
        if (likedSet.has(uid)) {
            likedSet.delete(uid);
        } else {
            likedSet.add(uid);
            dislikedSet.delete(uid);
        }
    } else if (reaction === "dislike") {
        if (dislikedSet.has(uid)) {
            dislikedSet.delete(uid);
        } else {
            dislikedSet.add(uid);
            likedSet.delete(uid);
        }
    } else {
        const err = new Error("reaction must be either 'like' or 'dislike'");
        err.status = 400;
        throw err;
    }

    comment.likedBy = Array.from(likedSet);
    comment.dislikedBy = Array.from(dislikedSet);
    await comment.save();

    return comment;
};

export const updatePostService = async (userId, postId, data) => {
    const post = await ForumPost.findById(postId);
    ensurePostOwnership(post, userId);

    if (data.title !== undefined) {
        post.title = String(data.title).trim();
    }

    if (data.body !== undefined) {
        post.body = String(data.body).trim();
    }

    if (data.tag !== undefined) {
        post.tag = String(data.tag).trim() || "General";
    }

    await post.save();

    return post;
};

export const deletePostService = async (userId, postId) => {
    const post = await ForumPost.findById(postId);
    ensurePostOwnership(post, userId);

    await ForumComment.deleteMany({ postId });
    await post.deleteOne();

    return post;
};