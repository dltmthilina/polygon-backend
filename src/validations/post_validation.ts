import { body } from "express-validator";

export const createPostValidation = [
  body("title")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must not exceed 255 characters"),
  body("content")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Content is required"),
];

export const updatePostValidation = [
  body("title")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 255 })
    .withMessage("Title must not exceed 255 characters"),
  body("content")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty"),
];