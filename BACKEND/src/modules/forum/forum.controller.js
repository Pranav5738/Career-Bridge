import { asyncHandler } from "../../utils/asyncHandler.js";
import {
    createPostService,
    getPostsService,
    addCommentService,
    getPostCommentsService,
    reactToCommentService,
    updatePostService,
    deletePostService,
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
            body: post.body,
            tag: post.tag,
            replies: post.repliesCount,
            createdAt: post.createdAt,
            userId: post.userId,
        }
    });
});

export const getPosts = asyncHandler(async (req, res) => {
    const posts = await getPostsService();

    // map to frontend shape
    const formatted = posts.map((p) => ({
        id: p._id,
        title: p.title,
        body: p.body,
        tag: p.tag,
        replies: p.repliesCount,
        createdAt: p.createdAt,
        userId: p.userId?._id || p.userId || null,
        authorEmail: p.userId?.email || "community",
    }));

    res.json({ posts: formatted });
});

export const updatePost = asyncHandler(async (req, res) => {
    const userId = req.user?._id || null;
    const { postId } = req.params;

    const post = await updatePostService(userId, postId, req.body);

    res.json({
        message: "Post updated",
        post: {
            id: post._id,
            title: post.title,
            body: post.body,
            tag: post.tag,
            replies: post.repliesCount,
            createdAt: post.createdAt,
            userId: post.userId,
        },
    });
});

export const deletePost = asyncHandler(async (req, res) => {
    const userId = req.user?._id || null;
    const { postId } = req.params;

    await deletePostService(userId, postId);

    res.json({
        message: "Post deleted",
    });
});

export const addComment = asyncHandler(async (req, res) => {
    const userId = req.user?._id || null;
    const { postId } = req.params;
    const { body } = req.body || {};

    if (!body || !String(body).trim()) {
        res.status(400).json({ message: "Comment body is required" });
        return;
    }

    const comment = await addCommentService(userId, postId, String(body).trim());

    res.status(201).json({
        message: "Reply added",
        comment: {
            id: comment._id,
            postId: comment.postId,
            body: comment.body,
            createdAt: comment.createdAt,
            likes: 0,
            dislikes: 0,
            viewerReaction: null,
        },
    });
});

export const getPostComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const comments = await getPostCommentsService(postId);

    res.json({
        comments: comments.map((comment) => ({
            id: comment._id,
            postId: comment.postId,
            body: comment.body,
            userEmail: comment?.userId?.email || "anonymous",
            createdAt: comment.createdAt,
            likes: Array.isArray(comment.likedBy) ? comment.likedBy.length : 0,
            dislikes: Array.isArray(comment.dislikedBy) ? comment.dislikedBy.length : 0,
            viewerReaction: req.user
                ? (
                    (comment.likedBy || []).some((id) => String(id) === String(req.user._id))
                        ? "like"
                        : (comment.dislikedBy || []).some((id) => String(id) === String(req.user._id))
                            ? "dislike"
                            : null
                )
                : null,
        })),
    });
});

export const reactToComment = asyncHandler(async (req, res) => {
    const userId = req.user?._id || null;
    const { postId, commentId } = req.params;
    const { reaction } = req.body || {};

    const updated = await reactToCommentService({
        userId,
        postId,
        commentId,
        reaction,
    });

    const uid = String(userId);
    const likedBy = Array.isArray(updated.likedBy) ? updated.likedBy : [];
    const dislikedBy = Array.isArray(updated.dislikedBy) ? updated.dislikedBy : [];

    res.json({
        message: "Reaction updated",
        comment: {
            id: updated._id,
            postId: updated.postId,
            likes: likedBy.length,
            dislikes: dislikedBy.length,
            viewerReaction: likedBy.some((id) => String(id) === uid)
                ? "like"
                : dislikedBy.some((id) => String(id) === uid)
                    ? "dislike"
                    : null,
        },
    });
});