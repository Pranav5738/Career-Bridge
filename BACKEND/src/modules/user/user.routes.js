import express from "express";
import {
    getProfile,
    updateProfile,
    uploadProfileAvatar
} from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { updateProfileSchema } from "./user.schema.js";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.patch("/profile", authMiddleware, validate(updateProfileSchema), updateProfile);
router.patch("/profile/avatar", authMiddleware, upload.single("avatar"), uploadProfileAvatar);

export default router;