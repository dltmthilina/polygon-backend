import { Op } from "sequelize";
import User from "../models/user.js";
import type { Request, Response } from "express";

export default class UserController {
  public async updateUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id!, 10);
    const { first_name, last_name, email } = req.body;
    try {
        const user = await User.findByPk(userId);
        console.log("Found user:", user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (first_name !== undefined) user.first_name = first_name;
      if (last_name !== undefined) user.last_name = last_name;
        if (email !== undefined) user.email = email;
      await user.save();
      return res
        .status(200)
        .json({ message: "User updated successfully", user });
    } catch (error) {
      console.error("Update error:", error);
      return res.status(500).json({ message: "Update failed" });
    }
  }

  public async deleteUser(req: Request, res: Response) {
    const userId = req.params.id;
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await user.destroy();
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete error:", error);
      return res.status(500).json({ message: "Delete failed" });
    }
  }
}
