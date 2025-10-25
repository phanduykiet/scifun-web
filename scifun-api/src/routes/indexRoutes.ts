import { Router } from "express";
import { register, verifyOTP, login, forgotPassword, verifyResetOtp, updateUser, resetPassword, deleteUser, getInfoUser, updatePassword, getUserList, createUser} from "../controllers/userController";
import { createSubject, getSubjects, updateSubject, deleteSubject, getSubjectById } from "../controllers/subjectController";
import { createTopic, getTopics, updateTopic, deleteTopic, getTopicById } from "../controllers/topicController";
import { createQuiz, getQuizzes, updateQuiz, deleteQuiz, getQuizById, getTrendingQuizzes } from "../controllers/quizController";
import { createQuestion, getQuestions, updateQuestion, deleteQuestion, getQuestionById } from "../controllers/questionController";
import { handleSubmitQuiz, getSubmissionDetail, getResults } from "../controllers/quizSubmissionController";
import { addFavoriteQuiz, removeFavoriteQuiz, getFavoriteQuizzes } from "../controllers/favoriteQuizController";
import { createVideoLesson, updateVideoLesson, deleteVideoLesson, getVideoLessons } from "../controllers/videoLessonController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkRole } from "../middleware/checkRole";
import { upload } from "../middleware/upload";
import { getUserProgress } from "../controllers/userProgressController";

const router = Router();

// Auth, User routes
router.post("/user/register", register);
router.post("/user/verify-otp", verifyOTP);
router.post("/user/login", login);
router.post("/user/forgot-password", forgotPassword);
router.post("/user/verify-reset-otp", verifyResetOtp);
router.post("/user/reset-password", resetPassword);
router.put("/user/update-user/:_id", authMiddleware, checkRole("USER", "ADMIN"), upload.single("avatar"), updateUser);
router.put("/user/update-password/:_id", authMiddleware, checkRole("USER", "ADMIN"), updatePassword);
router.get("/user/get-user/:_id", authMiddleware, checkRole("USER", "ADMIN"), getInfoUser);
router.get("/user/get-user-list", authMiddleware, checkRole("ADMIN"), getUserList);
router.post("/user/create-user", authMiddleware, checkRole("ADMIN"), createUser);
router.delete("/delete-user/:_id", authMiddleware, checkRole("ADMIN"), deleteUser);

// Subject routes
router.post("/subject/create-subject", authMiddleware, checkRole("ADMIN"), upload.single("image"), createSubject);
router.get("/subject/get-subjects", getSubjects);
router.get("/subject/get-subjectById/:_id", getSubjectById)
router.put("/subject/update-subject/:_id", authMiddleware, checkRole("ADMIN"), updateSubject);
router.delete("/subject/delete-subject/:_id", authMiddleware, checkRole("ADMIN"), deleteSubject);

// Topic routes
router.post("/topic/create-topic", authMiddleware, checkRole("ADMIN"), createTopic);
router.get("/topic/get-topics", getTopics);
router.get("/topic/get-topicById/:_id", getTopicById)
router.put("/topic/update-topic/:_id", authMiddleware, checkRole("ADMIN"), updateTopic);
router.delete("/topic/delete-topic/:_id", authMiddleware, checkRole("ADMIN"), deleteTopic);

// Quiz routes
router.post("/quiz/create-quiz", authMiddleware, checkRole("ADMIN"), createQuiz);
router.get("/quiz/get-quizzes", getQuizzes);
router.get("/quiz/get-trend-quizzes", getTrendingQuizzes);
router.get("/quiz/get-quizById/:_id", getQuizById)
router.put("/quiz/update-quiz/:_id", authMiddleware, checkRole("ADMIN"), updateQuiz);
router.delete("/quiz/delete-quiz/:_id", authMiddleware, checkRole("ADMIN"), deleteQuiz);

// Question routes
router.post("/question/create-question", authMiddleware, checkRole("ADMIN"), createQuestion);
router.get("/question/get-questions", getQuestions);
router.get("/question/get-questionById/:_id", getQuestionById);
router.put("/question/update-question/:_id", authMiddleware, checkRole("ADMIN"), updateQuestion);
router.delete("/question/delete-question/:_id", authMiddleware, checkRole("ADMIN"), deleteQuestion);

// Submission, Result routes
router.post("/submission/handle-submit", handleSubmitQuiz);
router.get("/submission/get-submissionDetail/:submissionId", getSubmissionDetail)
router.get("/submisstion/get-all", getResults)

// User Progress routes
router.get("/user-progress/:subjectId", authMiddleware, checkRole("ADMIN", "USER"), getUserProgress);

// Favorite Quiz routes
router.post("/favorite-quiz/add", authMiddleware, checkRole("ADMIN", "USER"), addFavoriteQuiz);
router.delete("/favorite-quiz/remove/:quizId", authMiddleware, checkRole("ADMIN", "USER"), removeFavoriteQuiz);
router.get("/favorite-quiz/list", authMiddleware, checkRole("ADMIN", "USER"),  getFavoriteQuizzes);

// Video Lesson routes
router.post("/video-lesson/create", authMiddleware, checkRole("ADMIN"), createVideoLesson);
router.put("/video-lesson/update/:id", authMiddleware, checkRole("ADMIN"), updateVideoLesson);
router.delete("/video-lesson/delete/:id", authMiddleware, checkRole("ADMIN"), deleteVideoLesson);
router.get("/video-lesson/list", getVideoLessons);


export default router;
