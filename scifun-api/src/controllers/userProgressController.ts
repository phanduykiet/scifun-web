import { Request, Response } from "express";
import * as userProgressService from "../services/userProgressService";

// Lấy tiến độ của 1 subject
export const getUserProgress = async (req: Request, res: Response) => {
  try {
    const { subjectId } = req.params;
    console.log("Subject ID:", subjectId);
    const userId = req.user!.userId;

    const progress = await userProgressService.getUserProgressSv(userId, subjectId);

    res.status(200).json({
      status: 200,
      message: "Lấy tiến độ học tập thành công",
      data: progress
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message
    });
  }
};

// Lấy tất cả tiến độ
export const getAllUserProgress = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const progress = await userProgressService.getAllUserProgressSv(userId);

    res.status(200).json({
      status: 200,
      message: "Lấy tổng quan tiến độ thành công",
      data: progress
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message
    });
  }
};