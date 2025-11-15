import { Router } from "express";
import UserController from "../controllers/user_controller.js";

const router = Router();
const userController = new UserController();

router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
