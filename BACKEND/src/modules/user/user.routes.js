import express from "express";
import {
    getProfile,
    updateProfile
} from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { updateProfileSchema } from "./user.schema.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.patch("/profile", authMiddleware, validate(updateProfileSchema), updateProfile);

export default router;