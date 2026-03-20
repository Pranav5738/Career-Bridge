import express from "express";
import {
    getMentors,
    saveMentor,
    bookSession
} from "./marketplace.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

const router = express.Router();

const methodNotAllowed = (req, res) => {
    res.status(405).json({
        message: `Method ${req.method} not allowed on ${req.originalUrl}`
    });
};

router.route("/").post(authMiddleware, saveMentor);
router.route("/mentors").get(getMentors).all(methodNotAllowed);
router.route("/save").post(authMiddleware, saveMentor).all(methodNotAllowed);
router.route("/book").post(authMiddleware, bookSession).all(methodNotAllowed);

export default router;