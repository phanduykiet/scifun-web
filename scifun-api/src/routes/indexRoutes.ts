import { Router } from "express";
import { register, verifyOTP, login, forgotPassword, verifyResetOtp, updateUser, resetPassword, deleteUser, getInfoUser, updatePassword} from "../controllers/userController";
import { createSubject, getSubjects, updateSubject, deleteSubject, getSubjectById } from "../controllers/subjectController";
import { createTopic, getTopics, updateTopic, deleteTopic, getTopicById } from "../controllers/topicController";
import { createQuiz, getQuizzes, updateQuiz, deleteQuiz, getQuizById, getTrendingQuizzes } from "../controllers/quizController";
import { createQuestion, getQuestions, updateQuestion, deleteQuestion, getQuestionById } from "../controllers/questionController";
import { handleSubmitQuiz, getSubmissionDetail, getResults } from "../controllers/quizSubmissionController";
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
router.get("/subject/get-subjectById/:_id", getSubjectById)
router.put("/subject/update-subject/:_id", updateSubject);
router.delete("/subject/delete-subject/:_id", deleteSubject);

// Topic routes
router.post("/topic/create-topic", createTopic);
router.get("/topic/get-topics", getTopics);
router.get("/topic/get-topicById/:_id", getTopicById)
router.put("/topic/update-topic/:_id", updateTopic);
router.delete("/topic/delete-topic/:_id", deleteTopic);

// Quiz routes
router.post("/quiz/create-quiz", createQuiz);
router.get("/quiz/get-quizzes", getQuizzes);
router.get("/quiz/get-trend-quizzes", getTrendingQuizzes);
router.get("/quiz/get-quizById/:_id", getQuizById)
router.put("/quiz/update-quiz/:_id", updateQuiz);
router.delete("/quiz/delete-quiz/:_id", deleteQuiz);

// Question routes
router.post("/question/create-question", createQuestion);
router.get("/question/get-questions", getQuestions);
router.get("/question/get-questionById/:_id", getQuestionById);
router.put("/question/update-question/:_id", updateQuestion);
router.delete("/question/delete-question/:_id", deleteQuestion);

// Submission, Result routes
router.post("/submission/handle-submit", handleSubmitQuiz);
router.get("/submission/get-submissionDetail/:submissionId", getSubmissionDetail)
router.get("/submisstion/get-all", getResults)

// Favorite Quiz routes
import { addFavoriteQuiz, removeFavoriteQuiz, getFavoriteQuizzes } from "../controllers/favoriteQuizController";
router.post("/favorite-quiz/add", addFavoriteQuiz);
router.delete("/favorite-quiz/remove/:quizId", removeFavoriteQuiz);
router.get("/favorite-quiz/list", getFavoriteQuizzes);


export default router;
