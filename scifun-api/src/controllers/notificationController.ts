import { Request, Response } from "express";
import * as notificationService from "../services/notificationService";

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { userId, message, type } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ error: "Thiếu userId hoặc message" });
    }

    const notification = await notificationService.createNotificationSv(userId, message, type);

    res.status(201).json({
      message: "Tạo thông báo thành công",
      data: notification,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId; // hoặc lấy từ token
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await notificationService.getNotificationsSv(userId, page, limit);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await notificationService.markAsReadSv(id);
    if (!updated) return res.status(404).json({ error: "Notification not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId; // hoặc lấy từ token
    const result = await notificationService.markAllAsReadSv(userId);

    res.json({
      message: "Đã đánh dấu tất cả thông báo là đã đọc",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
