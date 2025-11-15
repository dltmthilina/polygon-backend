import Router from "express";
import AuthController from "../controllers/auth_controller.js";
import { loginValidation, registerValidation } from "../validations/user_validation.js";

const router = Router();
const authController = new AuthController();

router.post("/register", registerValidation, authController.register);
router.post("/login", loginValidation, authController.login);

export default router;