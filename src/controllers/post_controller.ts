import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import Post from "../models/post.js";
import User from "../models/user.js";

export default class PostController {
  // Create a new post
  public async createPost(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const user_id = req.body.user_id; // TODO: Get from authenticated user in JWT middleware

    try {
      if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Verify user exists
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const post = await Post.create({
        user_id,
        title,
        content,
      });

      return res.status(201).json({
        message: "Post created successfully",
        post,
      });
    } catch (error) {
      console.error("Create post error:", error);
      return res.status(500).json({ message: "Failed to create post" });
    }
  }

  // Get all posts
  public async getAllPosts(req: Request, res: Response) {
    try {
      const posts = await Post.findAll({
        include: [
          {
            model: User,
            as: "author",
            attributes: ["id", "first_name", "last_name", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({ posts });
    } catch (error) {
      console.error("Get posts error:", error);
      return res.status(500).json({ message: "Failed to fetch posts" });
    }
  }

  // Get a single post by ID
  public async getPostById(req: Request, res: Response) {
    const postId = parseInt(req.params.id!, 10);

    try {
      const post = await Post.findByPk(postId, {
        include: [
          {
            model: User,
            as: "author",
            attributes: ["id", "first_name", "last_name", "email"],
          },
        ],
      });

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json({ post });
    } catch (error) {
      console.error("Get post error:", error);
      return res.status(500).json({ message: "Failed to fetch post" });
    }
  }

  // Update a post
  public async updatePost(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const postId = parseInt(req.params.id!, 10);
    const { title, content } = req.body;

    try {
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // TODO: Check if authenticated user is the post author

      if (title !== undefined) post.title = title;
      if (content !== undefined) post.content = content;

      await post.save();

      return res.status(200).json({
        message: "Post updated successfully",
        post,
      });
    } catch (error) {
      console.error("Update post error:", error);
      return res.status(500).json({ message: "Failed to update post" });
    }
  }

  // Delete a post
  public async deletePost(req: Request, res: Response) {
    const postId = parseInt(req.params.id!, 10);

    try {
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // TODO: Check if authenticated user is the post author

      await post.destroy();

      return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Delete post error:", error);
      return res.status(500).json({ message: "Failed to delete post" });
    }
  }

  // Get posts by user ID
  public async getPostsByUserId(req: Request, res: Response) {
    const userId = parseInt(req.params.userId!, 10);

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const posts = await Post.findAll({
        where: { user_id: userId },
        include: [
          {
            model: User,
            as: "author",
            attributes: ["id", "first_name", "last_name", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({ posts });
    } catch (error) {
      console.error("Get user posts error:", error);
      return res.status(500).json({ message: "Failed to fetch user posts" });
    }
  }
}
