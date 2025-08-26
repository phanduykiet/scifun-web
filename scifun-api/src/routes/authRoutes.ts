import { Router } from "express";
import { register, verifyOTP, login, forgotPassword, verifyResetOtp, resetPassword  } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Auth routes
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

// User routes (cần login mới được dùng)
router.post("/change-password", authMiddleware, resetPassword);

export default router;
