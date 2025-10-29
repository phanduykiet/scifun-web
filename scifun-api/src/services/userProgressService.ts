// services/userProgressService.ts
import UserProgress from "../models/UserProgress";
import Subject from "../models/Subject";
import Topic from "../models/Topic";
import Quiz from "../models/Quiz";
import Result from "../models/Result";
import {
  notifyQuizCompleted,
  notifyTopicCompleted,
  notifySubjectCompleted,
  notifyNewBestScore
} from "./notificationService";

// Khởi tạo hoặc cập nhật UserProgress
export const initializeOrUpdateUserProgressSv = async (
  userId: string,
  subjectId: string
) => {
  // Lấy thông tin subject
  const subject = await Subject.findById(subjectId);
  if (!subject) throw new Error("Môn học không tồn tại");

  // Lấy tất cả topics và quizzes
  const topics = await Topic.find({ subject: subjectId });
  const topicsData = [];
  let totalQuizzes = 0;
  let totalCompletedQuizzes = 0;

  for (const topic of topics) {
    const quizzes = await Quiz.find({ topic: topic._id });
    totalQuizzes += quizzes.length;

    const quizzesData = [];
    let topicCompletedQuizzes = 0;
    let topicScoreSum = 0;

    for (const quiz of quizzes) {
      // Kiểm tra xem user đã làm quiz này chưa
      const result = await Result.findOne({ userId, quiz: quiz._id });

      if (result) {
        topicCompletedQuizzes++;
        totalCompletedQuizzes++;
        topicScoreSum += result.averageScore;

        quizzesData.push({
          quizId: quiz._id,
          name: quiz.title,
          score: result.averageScore,
          bestScore: result.bestScore,
          attempts: result.attempts,
          lastSubmissionAt: result.lastSubmissionAt
        });
      } else {
        quizzesData.push({
          quizId: quiz._id,
          name: quiz.title,
          score: null,
          bestScore: 0,
          attempts: 0,
          lastSubmissionAt: null
        });
      }
    }

    // Tính progress và average score của topic
    const topicProgress = quizzes.length > 0 
      ? (topicCompletedQuizzes / quizzes.length) * 100 
      : 0;
    const topicAvgScore = topicCompletedQuizzes > 0 
      ? topicScoreSum / topicCompletedQuizzes 
      : 0;

    topicsData.push({
      topicId: topic._id,
      name: topic.name,
      progress: Math.round(topicProgress * 100) / 100,
      totalQuizzes: quizzes.length,
      completedQuizzes: topicCompletedQuizzes,
      averageScore: Math.round(topicAvgScore * 100) / 100,
      quizzes: quizzesData
    });
  }

  // Tính subject progress
  const percentPerTopic = topics.length > 0 ? 100 / topics.length : 0;
  let subjectProgress = 0;
  let totalScoreSum = 0;
  let completedTopics = 0;

  for (const topic of topicsData) {
    subjectProgress += (topic.progress / 100) * percentPerTopic;
    totalScoreSum += topic.averageScore * topic.completedQuizzes;
    
    if (topic.progress === 100) {
      completedTopics++;
    }
  }

  const subjectAvgScore = totalCompletedQuizzes > 0 
    ? totalScoreSum / totalCompletedQuizzes 
    : 0;

  // Dữ liệu để lưu/cập nhật
  const progressData = {
    userId,
    subjectId,
    subjectName: subject.name,
    progress: Math.round(subjectProgress * 100) / 100,
    totalTopics: topics.length,
    completedTopics,
    totalQuizzes,
    completedQuizzes: totalCompletedQuizzes,
    averageScore: Math.round(subjectAvgScore * 100) / 100,
    topics: topicsData,
    lastUpdatedAt: new Date()
  };

  const userProgress = await UserProgress.findOneAndUpdate(
    { userId, subjectId }, 
    { $set: progressData }, 
    { 
      new: true, 
      upsert: true, 
      setDefaultsOnInsert: true 
    }
  );

  return userProgress;
};

// Lấy tiến độ subject của user
export const getUserProgressSv = async (
  userId: string,
  subjectId: string
) => {
  const userProgress = await initializeOrUpdateUserProgressSv(userId, subjectId);
  return userProgress;
};

// Lấy tất cả tiến độ của user
export const getAllUserProgressSv = async (userId: string) => {
  const progresses = await UserProgress.find({ userId }).sort({ progress: -1 });
  
  const totalSubjects = progresses.length;
  const completedSubjects = progresses.filter(p => p.progress === 100).length;
  const overallProgress = progresses.length > 0
    ? progresses.reduce((sum, p) => sum + p.progress, 0) / progresses.length
    : 0;

  return {
    totalSubjects,
    completedSubjects,
    overallProgress: Math.round(overallProgress * 100) / 100,
    subjects: progresses
  };
};