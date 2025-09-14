import { Request, Response } from "express";
import * as subjectService from "../services/subjectService";

//  Tao môn học
export const createSubject = async (req: Request, res: Response) => {
  try {
    const { name, description, maxTopics, image } = req.body;
    const subject = await subjectService.createSubjectSv(req.body);
    res.status(200).json({
      status: 200,
      message: "Tạo môn học thành công",
      data: subject,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: "Error creating subject" + err.message,
    });
  }
};

// Cập nhật môn học
export const updateSubject = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { name, description, maxTopics, image } = req.body;

    const subject = await subjectService.updateSubjectSv(_id, req.body);

    res.status(200).json({
      status: 200,
      message: "Cập nhật môn học thành công",
      data: subject,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

//  Xóa môn học
export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;

    await subjectService.deleteSubjectSv(_id);

    res.status(200).json({ 
        status: 200,
        message: "Xóa môn học thành công" 
    });
  } catch (err: any) {
    res.status(400).json({ 
        status: 400,
        message: err.message 
    });
  }
};

// Lấy danh sách môn học với phân trang
export const getSubjects = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const name = req.query.name as string | undefined;

    const result = await subjectService.getSubjectsSv(page, limit, name);

    res.status(200).json({
      status: 200,
      message: "Lấy danh sách môn học thành công",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};

// Lấy chi tiết môn học
export const getSubjectById = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const topic = await subjectService.getSubjectByIdSv(_id);
    res.status(200).json({
      status: 200,
      message: "Lấy chi tiết môn học thành công",
      data: topic
    });
  } catch (err: any) {
    res.status(400).json({ 
      status: 400,
      message: err.message 
    });
  }
};