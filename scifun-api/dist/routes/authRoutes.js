"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/register", authController_1.register);
router.post("/verify-otp", authController_1.verifyOTP);
router.post("/login", authController_1.login);
router.post("/forgot-password", authController_1.forgotPassword);
router.post("/verify-reset-otp", authController_1.verifyResetOtp);
router.post("/reset-password", authController_1.resetPassword);
router.post("/change-password", authMiddleware_1.authMiddleware, authController_1.resetPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map