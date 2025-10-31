// src/controllers/notificationController.ts
import { Request, Response } from "express";
import Notification from "../models/Notification";

// GET /notifications?page=&limit=
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "20", 10);
    const skip = (page - 1) * limit;

    const [items, total, unreadCount] = await Promise.all([
      Notification.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments({ userId }),
      Notification.countDocuments({ userId, isRead: false }),
    ]);

    res.status(200).json({
      status: 200,
      success: true,
      data: {
        notifications: items,
        total,
        unreadCount,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    res.status(400).json({ status: 400, success: false, message: err.message });
  }
};

// GET /notifications/unread-count
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });
    res.status(200).json({ status: 200, success: true, data: { unreadCount } });
  } catch (err: any) {
    res.status(400).json({ status: 400, success: false, message: err.message });
  }
};

// PATCH /notifications/:id/read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id;
    const doc = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );
    if (!doc) return res.status(404).json({ status: 404, success: false, message: "Không tìm thấy" });
    res.status(200).json({ status: 200, success: true, message: "Đã đánh dấu đọc", data: doc });
  } catch (err: any) {
    res.status(400).json({ status: 400, success: false, message: err.message });
  }
};

// PATCH /notifications/read-all
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    res.status(200).json({ status: 200, success: true, message: "Đã đánh dấu tất cả đã đọc" });
  } catch (err: any) {
    res.status(400).json({ status: 400, success: false, message: err.message });
  }
};
