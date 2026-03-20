import express from "express";
import { createPost, getPosts } from "./forum.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/posts", getPosts);
router.post("/posts", authMiddleware, createPost);

export default router;