import { Request, Response } from "express";
import { Types } from "mongoose";
import Comment from "../models/Comment";

// -> Lấy danh sách bình luận gốc (parentId = null)
export const listRootComments = async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Comment.find({ parentId: null })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments({ parentId: null }),
    ]);

    res.status(200).json({
      status: 200,
      success: true,
      data: {
        items,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (err: any) {
    res.status(500).json({ status: 500, success: false, message: err.message });
  }
};

// -> Lấy danh sách reply của một comment
export const listReplies = async (req: Request, res: Response) => {
  try {
    const { parentId } = req.params;
    if (!Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({ status: 400, success: false, message: "parentId không hợp lệ" });
    }

    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 100);
    const skip = (page - 1) * limit;

    // (tuỳ chọn) kiểm tra tồn tại comment cha
    const parent = await Comment.findById(parentId).lean();
    if (!parent) {
      return res.status(404).json({ status: 404, success: false, message: "Không tìm thấy comment cha" });
    }

    const [items, total] = await Promise.all([
      Comment.find({ parentId })
        .sort({ createdAt: 1 }) // replies thường hiển thị từ cũ đến mới
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments({ parentId }),
    ]);

    res.status(200).json({
      status: 200,
      success: true,
      data: {
        parentId,
        items,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (err: any) {
    res.status(500).json({ status: 500, success: false, message: err.message });
  }
};

// (Tuỳ chọn) GET /comments/:id  -> Lấy chi tiết 1 comment
export const getCommentDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 400, success: false, message: "id không hợp lệ" });
    }
    const comment = await Comment.findById(id).lean();
    if (!comment) {
      return res.status(404).json({ status: 404, success: false, message: "Không tìm thấy comment" });
    }
    res.status(200).json({ status: 200, success: true, data: comment });
  } catch (err: any) {
    res.status(500).json({ status: 500, success: false, message: err.message });
  }
};
