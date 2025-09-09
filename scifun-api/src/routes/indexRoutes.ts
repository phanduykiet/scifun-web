import { Router } from "express";
import { register, verifyOTP, login, forgotPassword, verifyResetOtp, updateUser, resetPassword, deleteUser, getInfoUser, updatePassword} from "../controllers/userController";
import { createSubject, getSubjects, updateSubject, deleteSubject } from "../controllers/subjectController";
import { createTopic, getTopics, updateTopic, deleteTopic } from "../controllers/topicController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Auth, User routes
router.post("/user/register", register);
router.post("/user/verify-otp", verifyOTP);
router.post("/user/login", login);
router.post("/user/forgot-password", forgotPassword);
router.post("/user/verify-reset-otp", verifyResetOtp);
router.post("/user/reset-password", resetPassword);
router.put("/user/update-user/:_id", authMiddleware, updateUser);
router.put("/user/update-password/:_id", authMiddleware, updatePassword);
router.get("/user/get-user/:_id", authMiddleware, getInfoUser);

// Admin routes
router.delete("/delete-user/:_id", deleteUser);

// Subject routes
router.post("/subject/create-subject", createSubject);
router.get("/subject/get-subjects", getSubjects);
router.put("/subject/update-subject/:_id", updateSubject);
router.delete("/subject/delete-subject/:_id", deleteSubject);

// Topic routes
router.post("/topic/create-topic", createTopic);
router.get("/topic/get-topics", getTopics);
router.put("/topic/update-topic/:_id", updateTopic);
router.delete("/topic/delete-topic/:_id", deleteTopic);

export default router;
