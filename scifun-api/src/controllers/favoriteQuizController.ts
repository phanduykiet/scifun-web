// controllers/favoriteQuiz.controller.ts
import { Request, Response } from "express";
import * as favoriteQuizService from "../services/favoriteQuizService";

// Thêm vào yêu thích
export const addFavoriteQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId, userId } = req.body; // Lấy cả userId và quizId từ body

    // Validate
    if (!userId || !quizId) {
      return res.status(400).json({
        status: 400,
        message: "userId và quizId là bắt buộc",
      });
    }

    const favorite = await favoriteQuizService.addFavoriteQuizSv(userId, quizId);

    res.status(200).json({
      status: 200,
      message: "Đã thêm vào yêu thích",
      data: favorite,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({
        status: 400,
        message: "Quiz đã có trong danh sách yêu thích",
      });
    }
    
    res.status(400).json({
      status: 400,
      message: "Error adding favorite: " + err.message,
    });
  }
};

// Bỏ yêu thích
export const removeFavoriteQuiz = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body; // Lấy từ body
    const { quizId } = req.params; // Lấy từ params

    if (!userId) {
      return res.status(400).json({
        status: 400,
        message: "userId là bắt buộc",
      });
    }

    const result = await favoriteQuizService.removeFavoriteQuizSv(userId, quizId);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: "Quiz không có trong danh sách yêu thích",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Đã bỏ yêu thích",
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: "Error removing favorite: " + err.message,
    });
  }
};

// Lấy danh sách quiz yêu thích
export const getFavoriteQuizzes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.query.userId as string | undefined;
    const topicId = req.query.topicId as string | undefined;

    if (!userId) {
      return res.status(400).json({
        status: 400,
        message: "userId là bắt buộc",
      });
    }

    const favorites = await favoriteQuizService.getFavoriteQuizzesSv(
      userId as string,
      page,
      limit,
      topicId
    );

    res.status(200).json({
      status: 200,
      message: "Lấy danh sách yêu thích thành công",
      data: favorites,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: "Error getting favorites: " + err.message,
    });
  }
};