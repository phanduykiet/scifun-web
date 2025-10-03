import { Request, Response } from "express";
import * as submissionService from "../services/quizSubmissionService";

// Nộp bài + chấm điểm
export const handleSubmitQuiz = async (req: Request, res: Response) => {
  try {
    const result = await submissionService.handleSubmitQuizSv(req.body);
    res.status(200).json({
        status: 200,
        message: "Thành công",
        data: result
    });
  } catch (err: any) {
    res.status(400).json({
        status: 400,
        message: err.message
    });
  }
};

// Xem chi tiết bài làm + giải thích chi tiết
export const getSubmissionDetail = async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.params;
    const result = await submissionService.getSubmissionDetailSv(submissionId);
    res.status(200).json({
        status: 200,
        message: "Thành công",
        data: result
    });
  } catch (err: any) {
    res.status(400).json({
        status: 400,
        message: err.message
    });
  }
};

export const getResults = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await submissionService.getResultsSV(page, limit);

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