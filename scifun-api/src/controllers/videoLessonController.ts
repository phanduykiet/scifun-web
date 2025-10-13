import { Request, Response } from "express";
import * as videoLessonService from "../services/videoLessonService";

// Tạo video lesson
export const createVideoLesson = async (req: Request, res: Response) => {
  try {
    const videoLesson = await videoLessonService.createVideoLessonSv(req.body);

    res.status(200).json({
      status: 200,
      message: "Tạo video lesson thành công",
      data: videoLesson,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: "Error creating video lesson: " + err.message,
    });
  }
};

// Cập nhật video lesson
export const updateVideoLesson = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const videoLesson = await videoLessonService.updateVideoLessonSv(id, req.body);

    res.status(200).json({
      status: 200,
      message: "Cập nhật video lesson thành công",
      data: videoLesson,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

// Xóa video lesson
export const deleteVideoLesson = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await videoLessonService.deleteVideoLessonSv(id);

    res.status(200).json({
      status: 200,
      message: result.message,
      data: result.videoLesson,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

// Lấy danh sách video lessons
export const getVideoLessons = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const topicId = req.query.topicId as string | undefined;

    const result = await videoLessonService.getVideoLessonsSv(page, limit, topicId);

    res.status(200).json({
      status: 200,
      message: "Lấy danh sách video lessons thành công",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

// Lấy chi tiết video lesson
export const getVideoLessonById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const videoLesson = await videoLessonService.getVideoLessonByIdSv(id);

    res.status(200).json({
      status: 200,
      message: "Lấy chi tiết video lesson thành công",
      data: videoLesson,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};