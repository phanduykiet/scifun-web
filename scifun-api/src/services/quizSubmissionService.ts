import mongoose from "mongoose";
import Question from "../models/Question";
import Submission from "../models/Submission";
import Result from "../models/Result";
import Quiz from "../models/Quiz";

export type SubmittedAnswer = {
  questionId: string;
  selectedAnswerId?: string;
};

export interface SubmitQuizPayload {
  quizId: string;
  answers: SubmittedAnswer[];
  userId?: string;
}

// Hàm cập nhật thông tin Quiz (uniqueUserCount và lastAttemptAt)
const updateQuizStatistics = async (quizId: string) => {
  const uniqueUserCount = await Result.countDocuments({ quiz: quizId });
  await Quiz.findByIdAndUpdate(quizId, {
    uniqueUserCount,
    lastAttemptAt: new Date(),
  });
};

// Nộp bài + chấm điểm
export const handleSubmitQuizSv = async (payload: SubmitQuizPayload) => {
  const { quizId, answers, userId } = payload;
  if (!quizId || !Array.isArray(answers)) {
    throw new Error("Thiếu dữ liệu");
  }

  // Lấy câu hỏi
  const questionIds = Array.from(new Set(answers.map((a) => a.questionId)));
  const questions = await Question.find({ _id: { $in: questionIds } });
  const qMap = new Map<string, any>();
  for (const q of questions) qMap.set(q._id.toString(), q);

  let correctCount = 0;

  // Tạo 1 mảng detailedAnswers giống answers của Submission để lưu câu trả lời của user
  const detailedAnswers: {
    question: mongoose.Types.ObjectId;
    selectedAnswer?: string | null;
    isCorrect: boolean;
  }[] = [];

  // Kiểm tra đáp án
  for (const ans of answers) {
    const q = qMap.get(ans.questionId);
    let isCorrect = false;

    if (q) {
      const chosenOption = (q.answers || []).find(
        (a: any) => a._id.toString() === ans.selectedAnswerId
      );
      isCorrect = !!chosenOption && !!chosenOption.isCorrect;
    }
    if (isCorrect) correctCount++;

    detailedAnswers.push({
      question: new mongoose.Types.ObjectId(ans.questionId),
      selectedAnswer: ans.selectedAnswerId ?? null,
      isCorrect,
    });
  }

  // Tính điểm bài làm
  const totalQuestions = questionIds.length;
  const score = correctCount * 100 / totalQuestions;

  if(!userId){
    return {
    quizId,
    score,
    totalQuestions,
    correctAnswers: correctCount,
    };
  }

  // Lưu submission
  const submission = await Submission.create({
    userId,
    quiz: quizId,
    answers: detailedAnswers,
    score,
  });

  // Cập nhật Result
  const oldResult = await Result.findOne({ userId, quiz: quizId });
  if (!oldResult) {
    await Result.create({
      userId,
      quiz: quizId,
      bestScore: score,
      attempts: 1,
      averageScore: score,
      lastSubmissionAt: new Date(),
    });
  } else {
    const newAttempts = (oldResult.attempts ?? 0) + 1;
    const newAvg =
      ((oldResult.averageScore ?? 0) * (newAttempts - 1) + score) / newAttempts;

    oldResult.bestScore = Math.max(oldResult.bestScore ?? 0, score);
    oldResult.attempts = newAttempts;
    oldResult.averageScore = Math.round(newAvg * 100) / 100;
    oldResult.lastSubmissionAt = new Date();
    await oldResult.save();
  }

  // Cập nhật thống kê cho Quiz
  await updateQuizStatistics(quizId);

  // Trả về kết quả chấm điểm
  return {
    submissionId: submission._id,
    quizId,
    score,
    totalQuestions,
    correctAnswers: correctCount,
  };
};

// Xem chi tiết bài làm + giải thích chi tiết
export const getSubmissionDetailSv = async (submissionId: string) => {
  const submission = await Submission.findById(submissionId)
    .populate("quiz","-__v")
    .populate("answers.question");

  if (!submission) throw new Error("Không tìm thấy submission");

  return {
    submissionId: submission._id,
    quiz: submission.quiz,
    score: submission.score,
    answers: submission.answers.map((a: any) => {
      const question = a.question;
      const allAnswers = question.answers || [];

      // Tìm text đáp án user chọn
      const selectedAnswerText = allAnswers.find(
        (opt: any) => opt._id.toString() === a.selectedAnswer
      )?.text;

      // Lấy tất cả đáp án đúng (có thể nhiều)
      const correctAnswers = allAnswers
        .filter((opt: any) => opt.isCorrect)
        .map((opt: any) => opt.text);

      return {
        questionId: question._id,
        questionText: question.text,
        selectedAnswer: selectedAnswerText || a.selectedAnswer, // fallback nếu không tìm thấy
        correctAnswers, // array string
        isCorrect: a.isCorrect,
        explanation: question.explanation,
      };
    }),
  };
};

// Lấy danh sách kết quả (Result) với phân trang
export const getResultsSV = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  // query song song để tăng performance
  const [results, total] = await Promise.all([
    Result.find()
      .populate("quiz", "-__v") 
      .sort({ lastSubmissionAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v"),
    Result.countDocuments(),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: results,
  };
};
