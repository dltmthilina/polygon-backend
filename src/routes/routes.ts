import { Router } from "express";
import authRoutes from "./auth_routes.js";
import userRoutes from "./user_routes.js";
import postRoutes from "./post_routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/posts", postRoutes);

export default router;
