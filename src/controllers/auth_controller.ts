import type { Request, Response } from "express";
import { validationResult as validateResult } from "express-validator";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions, Secret } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "fallback_secret";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN ?? "24h";

export default class AuthController {
  public async register(req: Request, res: Response) {
    const errors = validateResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { first_name, last_name, email, password } = req.body;

    try {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({ message: "Email already registered" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      } as SignOptions);

      return res.status(201).json({
        message: "User registered successfully",
        id: user.id,
        token,
        expiresIn: JWT_EXPIRES_IN,
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Registration failed" });
    }
  }
  public async login(req: Request, res: Response) {
    const errors = validateResult(req);
    const { email, password } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const existing = await User.findOne({ where: { email } });
      if (!existing) {
        return res.status(404).json({ message: "User not found" });
      }
      const passwordMatch = await bcrypt.compare(password, existing.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { id: existing.id, email: existing.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as SignOptions
      );
        return res.status(200).json({
          message: "User logged in successfully",
          id: existing.id,
          token,
          expiresIn: JWT_EXPIRES_IN,
        });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Login failed" });
    }
  }
}
