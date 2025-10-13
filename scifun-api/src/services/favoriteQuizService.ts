// services/favoriteQuiz.service.ts
import mongoose from "mongoose";
import FavoriteQuiz, { IFavoriteQuiz } from "../models/FavoriteQuiz";
import Quiz from "../models/Quiz";

// Thêm vào yêu thích (với transaction)
export const addFavoriteQuizSv = async (userId: string, quizId: string) => {
  try {
    // Tạo favorite
    const favorite = await FavoriteQuiz.create({ user: userId, quiz: quizId });
    
    // Tăng favoriteCount
    await Quiz.findByIdAndUpdate(
      quizId,
      { $inc: { favoriteCount: 1 } }
    );

    return favorite;
  } catch (error) {
    throw error;
  }
};

// Bỏ yêu thích (với transaction)
export const removeFavoriteQuizSv = async (userId: string, quizId: string) => {
  try {
    // Xóa favorite
    const result = await FavoriteQuiz.deleteOne({ user: userId, quiz: quizId });
    
    // Giảm favoriteCount nếu xóa thành công
    if (result.deletedCount > 0) {
      await Quiz.findByIdAndUpdate(
        quizId,
        { $inc: { favoriteCount: -1 } }
      );
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách quiz yêu thích với phân trang
export const getFavoriteQuizzesSv = async (
  userId: string,
  page: number,
  limit: number,
  topicId?: string
) => {
  const filter: any = { user: userId };
  const skip = (page - 1) * limit;

  // Build populate options
  const populateOptions: any = {
    path: 'quiz',
    populate: {
      path: 'topic',
      select: 'name'
    }
  };

  // Nếu có filter theo topic
  if (topicId) {
    populateOptions.match = { topic: topicId };
  }

  const [favorites, total] = await Promise.all([
    FavoriteQuiz.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate(populateOptions),
    FavoriteQuiz.countDocuments(filter)
  ]);

  // Filter out null quiz (nếu topic không match)
  const filteredFavorites = favorites.filter(f => f.quiz !== null);

  return {
    page,
    limit,
    total: topicId ? filteredFavorites.length : total,
    totalPages: Math.ceil((topicId ? filteredFavorites.length : total) / limit),
    data: filteredFavorites,
  };
};

// Kiểm tra quiz đã được yêu thích chưa
export const checkIsFavoritedSv = async (userId: string, quizId: string) => {
  const exists = await FavoriteQuiz.exists({ 
    user: userId, 
    quiz: quizId 
  });
  return !!exists;
};

// Lấy số lượng quiz yêu thích của user
export const countFavoriteQuizzesSv = async (userId: string) => {
  const count = await FavoriteQuiz.countDocuments({ user: userId });
  return count;
};

// Lấy quiz phổ biến nhất (sắp xếp theo favoriteCount)
export const getPopularQuizzesSv = async (limit: number = 10) => {
  const quizzes = await Quiz.find()
    .sort({ favoriteCount: -1 })
    .limit(limit)
    .populate('topic', 'name');
  return quizzes;
};