import { Request, Response } from "express";
import * as questionService from "../services/questionService";

// Thêm câu hỏi 
export const createQuestion = async (req: Request, res: Response) => {
  try {
    const {text, quiz, answers} = req.body;
    const question = await questionService.createQuestionSv(req.body);
    res.status(200).json({
      status: 200,
      message: "Thêm thành công",
      data: question,
    });
  } catch (err : any) {
    res.status(400).json({ 
      status: 400,
      message: err.message 
    });
  }
};

// Sửa câu hỏi
export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const question = await questionService.updateQuestionSv(_id, req.body);
    res.status(200).json({
      status: 200,
      message: "Cập nhật thành công",
      data: question
    });
  } catch (err : any) {
    res.status(400).json({ 
      status: 400,
      message: err.message 
    });
  }
};

// Xóa câu hỏi
export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const result = await questionService.deleteQuestionSv(_id);
    res.status(200).json({
      status: 200,
      message: "Xóa thành công",
      data: result
    });
  } catch (err : any) {
    res.status(400).json({ 
      status: 400,
      message: err.message 
    });
  }
};

// Lấy danh sách câu hỏi (phân trang, lọc theo quiz nếu có)
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const quizId = req.query.quizId as string;

    const result = await questionService.getQuestionsSv(page, limit, quizId);
    res.status(200).json({
      status: 200,
      message: "Lấy danh sách thành công",
      data: result
    });
  } catch (err : any) {
    res.status(400).json({ 
      status: 400,
      message: err.message 
    });
  }
};

// Lấy chi tiết câu hỏi
export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const quiz = await questionService.getQuestionByIdSv(_id);
    res.status(200).json({
      status: 200,
      message: "Lấy chi tiết thành công",
      data: quiz
    });
  } catch (err : any) {
    res.status(400).json({ 
      status: 400,
      message: err.message 
    });
  }
};
