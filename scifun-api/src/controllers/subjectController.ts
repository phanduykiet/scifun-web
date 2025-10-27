import { Request, Response } from "express";
import * as subjectService from "../services/subjectService";
import cloudinary from "../config/cloudinary";

//  Tao môn học
export const createSubject = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    // Nếu có file ảnh (từ form-data)
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: "Subject" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        upload.end(req.file.buffer); // đưa buffer ảnh vào stream
      });

      data.image = (uploadResult as any).secure_url;
    }
    const subject = await subjectService.createSubjectSv(data);
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
    const data = req.body;
    // Nếu có file ảnh (từ form-data)
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: "Subject" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        upload.end(req.file.buffer); // đưa buffer ảnh vào stream
      });

      data.image = (uploadResult as any).secure_url;
    }
    const subject = await subjectService.updateSubjectSv(_id, data);
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
      message: err.message,
    });
  }
};

// Lấy danh sách môn học với phân trang + tìm kiếm theo tên môn học
export const getSubjects = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const search = req.query.search as string | undefined;

    const result = await subjectService.getSubjectsSv(page, limit, search);

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
      data: topic,
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
};
