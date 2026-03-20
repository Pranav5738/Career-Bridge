import express from "express";
import { analyzeResume } from "./resume.controller.js";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

const methodNotAllowed = (req, res) => {
    res.status(405).json({
        message: `Method ${req.method} not allowed on ${req.originalUrl}`
    });
};

router.route("/analyze").post(upload.single("resume"), analyzeResume).all(methodNotAllowed);

export default router;