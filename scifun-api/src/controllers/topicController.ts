import { Request, Response } from "express";
import * as topicService from "../services/topicService";

//  Tao chủ đề
export const createTopic = async (req: Request, res: Response) => {
  try {
    const subject = await topicService.createTopicSv(req.body);
    res.status(200).json({
      status: 200,
      message: "Tạo chủ đề thành công",
      data: subject,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

// Cập nhật chủ đề
export const updateTopic = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;

    const subject = await topicService.updateTopicSv(_id, req.body);

    res.status(200).json({
      status: 200,
      message: "Cập nhật chủ đề thành công",
      data: subject,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

//  Xóa chủ đề
export const deleteTopic = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;

    await topicService.deleteTopicSv(_id);

    res.status(200).json({ 
        status: 200,
        message: "Xóa chủ đề thành công" 
    });
  } catch (err: any) {
    res.status(400).json({ 
        status: 400,
        message: err.message 
    });
  }
};

// Lấy danh sách chủ đề với phân trang
export const getTopics = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await topicService.getTopicsSv(page, limit, req.query.subjectId as string);

    res.status(200).json({
      status: 200,
      message: "Lấy danh sách chủ đề thành công",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};