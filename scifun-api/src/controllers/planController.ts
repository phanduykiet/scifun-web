import { Request, Response } from "express";
import { Types } from "mongoose";
import Plan from "../models/Plan";

// GET /plans  (lấy danh sách)
export const listPlans = async (_req: Request, res: Response) => {
  try {
    const plans = await Plan.find().sort({ durationDays: 1 }).lean();
    res.status(200).json({ status: 200, success: true, data: plans });
  } catch (err: any) {
    res.status(500).json({ status: 500, success: false, message: err.message });
  }
};

// GET /plans/:id  (lấy chi tiết)
export const getPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 400, success: false, message: "ID không hợp lệ" });
    }
    const plan = await Plan.findById(id).lean();
    if (!plan) {
      return res.status(404).json({ status: 404, success: false, message: "Không tìm thấy gói" });
    }
    res.status(200).json({ status: 200, success: true, data: plan });
  } catch (err: any) {
    res.status(500).json({ status: 500, success: false, message: err.message });
  }
};

// POST /plans  (thêm mới)
export const createPlan = async (req: Request, res: Response) => {
  try {
    const { name, price, durationDays } = req.body || {};
    if (!name || typeof price !== "number" || typeof durationDays !== "number") {
      return res.status(400).json({ status: 400, success: false, message: "Thiếu hoặc sai dữ liệu" });
    }

    const existed = await Plan.findOne({ name }).lean();
    if (existed) {
      return res.status(409).json({ status: 409, success: false, message: "Tên gói đã tồn tại" });
    }

    const plan = await Plan.create({ name, price, durationDays });
    res.status(201).json({ status: 201, success: true, data: plan });
  } catch (err: any) {
    res.status(500).json({ status: 500, success: false, message: err.message });
  }
};

// PUT /plans/:id  (sửa toàn phần / bán phần)
export const updatePlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 400, success: false, message: "ID không hợp lệ" });
    }

    const payload: any = {};
    if (typeof req.body.name === "string") payload.name = req.body.name;
    if (typeof req.body.price === "number") payload.price = req.body.price;
    if (typeof req.body.durationDays === "number") payload.durationDays = req.body.durationDays;

    if (!Object.keys(payload).length) {
      return res.status(400).json({ status: 400, success: false, message: "Không có dữ liệu cập nhật" });
    }

    // Nếu đổi name, kiểm tra trùng
    if (payload.name) {
      const dup = await Plan.findOne({ name: payload.name, _id: { $ne: id } }).lean();
      if (dup) {
        return res.status(409).json({ status: 409, success: false, message: "Tên gói đã tồn tại" });
      }
    }

    const plan = await Plan.findByIdAndUpdate(id, { $set: payload }, { new: true });
    if (!plan) {
      return res.status(404).json({ status: 404, success: false, message: "Không tìm thấy gói" });
    }
    res.status(200).json({ status: 200, success: true, data: plan });
  } catch (err: any) {
    res.status(500).json({ status: 500, success: false, message: err.message });
  }
};

// DELETE /plans/:id  (xóa)
export const deletePlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 400, success: false, message: "ID không hợp lệ" });
    }
    const del = await Plan.findByIdAndDelete(id);
    if (!del) {
      return res.status(404).json({ status: 404, success: false, message: "Không tìm thấy gói" });
    }
    res.status(200).json({ status: 200, success: true, message: "Đã xóa gói" });
  } catch (err: any) {
    res.status(500).json({ status: 500, success: false, message: err.message });
  }
};
