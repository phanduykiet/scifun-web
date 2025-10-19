import { Request, Response } from "express";
import * as quizService from "../services/quizService";

// Thêm Quiz
export const createQuiz = async (req: Request, res: Response) => {
  try {
    const { title, description, topic, uniqueUserCount, lastAttemptAt } =
      req.body;
    const quiz = await quizService.createQuizSv(req.body);
    await quizService.syncToES();
    res.status(200).json({
      status: 200,
      message: "Thêm thành công",
      data: quiz,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

// Sửa Quiz
export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const quiz = await quizService.updateQuizSv(_id, req.body);
    res.status(200).json({
      status: 200,
      message: "Cập nhật thành công",
      data: quiz,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

// Xóa Quiz
export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const result = await quizService.deleteQuizSv(_id);
    res.status(200).json({
      status: 200,
      message: "Xóa thành công",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

// Lấy danh sách Quiz (phân trang, lọc theo topic)
export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const topicId = req.query.topicId as string;
    const search = req.query.search as string;

    const result = await quizService.getQuizzesSv(page, limit, topicId, search);
    res.status(200).json({
      status: 200,
      message: "Lấy danh sách thành công",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

// Lấy danh sách Quiz thịnh hành
export const getTrendingQuizzes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const timeWeight = parseFloat(req.query.timeWeight as string) || 0.6; // mặc định 0.6
    const popularityWeight = parseFloat(req.query.timeWeight as string) || 0.4; // mặc định 0.6
    const result = await quizService.getTrendingQuizzesSv(
      page,
      limit,
      timeWeight,
      popularityWeight
    );
    res.status(200).json({
      status: 200,
      message: "Lấy danh sách thành công",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

// Lấy chi tiết Quiz
export const getQuizById = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const quiz = await quizService.getQuizByIdSv(_id);
    res.status(200).json({
      status: 200,
      message: "Lấy chi tiết thành công",
      data: quiz,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};
