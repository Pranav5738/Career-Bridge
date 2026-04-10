import express from "express";
import {
	addComment,
	createPost,
	deletePost,
	getPostComments,
	getPosts,
	updatePost,
	reactToComment,
} from "./forum.controller.js";
import { authMiddleware, optionalAuth } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/posts", getPosts);
router.post("/posts", authMiddleware, createPost);
router.patch("/posts/:postId", authMiddleware, updatePost);
router.delete("/posts/:postId", authMiddleware, deletePost);
router.get("/posts/:postId/comments", optionalAuth, getPostComments);
router.post("/posts/:postId/comments", authMiddleware, addComment);
router.post("/posts/:postId/comments/:commentId/reaction", authMiddleware, reactToComment);

export default router;