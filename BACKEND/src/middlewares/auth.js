import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../modules/auth/auth.model.js";

export const authMiddleware = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization || "";

		if (!authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ message: "Authorization token missing" });
		}

		const token = authHeader.slice(7);
		const payload = jwt.verify(token, env.jwtSecret);

																										const user = await User.findById(payload.id).select("_id name email role status targetRole expertise github location membershipPlan skills");

		if (!user) {
			return res.status(401).json({ message: "Invalid token user" });
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
};

export const optionalAuth = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization || "";

		if (!authHeader.startsWith("Bearer ")) {
			return next();
		}

		const token = authHeader.slice(7);
		const payload = jwt.verify(token, env.jwtSecret);
		const user = await User.findById(payload.id).select("_id name email role status targetRole expertise github location membershipPlan skills");

		if (!user) {
			if (env.requireAuthStrict) {
				return res.status(401).json({ message: "Invalid token user" });
			}

			return next();
		}

		req.user = user;
		return next();
	} catch (error) {
		if (env.requireAuthStrict) {
			return res.status(401).json({ message: "Invalid or expired token" });
		}

		return next();
	}
};
