import { Router } from "express";
import PostController from "../controllers/post_controller.js";
import {
  createPostValidation,
  updatePostValidation,
} from "../validations/post_validation.js";

const router = Router();
const postController = new PostController();

router.post("/", createPostValidation, postController.createPost);
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.put("/:id", updatePostValidation, postController.updatePost);
router.delete("/:id", postController.deletePost);
router.get("/user/:userId", postController.getPostsByUserId);

export default router;