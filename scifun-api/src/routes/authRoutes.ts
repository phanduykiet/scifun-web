import { Router } from "express";
import { register, verifyOTP, login } from "../controllers/authController";

const router = Router();

// Auth routes
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);

export default router;
