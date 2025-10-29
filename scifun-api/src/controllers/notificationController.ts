// src/controllers/notificationController.ts
import { Request, Response } from "express";
import * as notificationService from "../services/notificationService";

// Lấy danh sách notifications của user
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await notificationService.getUserNotificationsSv(userId, page, limit);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Lấy danh sách thông báo thành công",
      data: result
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: err.message
    });
  }
};

// Đếm số thông báo chưa đọc
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const unreadCount = await notificationService.getUnreadCountSv(userId);

    res.status(200).json({
      status: 200,
      success: true,
      data: { unreadCount }
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: err.message
    });
  }
};

// Đánh dấu 1 notification đã đọc
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const notification = await notificationService.markAsReadSv(id, userId);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Đã đánh dấu đọc",
      data: notification
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: err.message
    });
  }
};

// Đánh dấu tất cả đã đọc
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    await notificationService.markAllAsReadSv(userId);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Đã đánh dấu tất cả đã đọc"
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: err.message
    });
  }
};

// Xóa notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    await notificationService.deleteNotificationSv(id, userId);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Xóa thông báo thành công"
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: err.message
    });
  }
};

// Xóa tất cả notifications đã đọc
export const deleteAllRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    await notificationService.deleteAllReadSv(userId);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Xóa tất cả thông báo đã đọc thành công"
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: err.message
    });
  }
};