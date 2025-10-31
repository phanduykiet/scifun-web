import { Request, Response } from "express";
import dayjs from "dayjs";
import Order from "../models/Order";
import User from "../models/User";
import { zlpService } from "../services/zalopayService";
import { createHmac } from "node:crypto";

const PLAN_PRICE = 99000;

export const BillingController = {
  
  // Tạo đơn mua gói PRO qua ZaloPay
  async createCheckout(req: Request, res: Response) {
    try {
      const userId = (req as any)?.user?.userId || (req as any)?.user?._id || "guest";

      // Gọi ZaloPay tạo đơn
      const {
        return_code,
        return_message,
        order_url,
        qr_code,
        app_trans_id,
        mac,
      } = await zlpService.createOrder(PLAN_PRICE, String(userId));

      if (return_code !== 1) {
        return res.status(400).json({
          message: "Tạo thanh toán ZaloPay thất bại",
          return_message,
        });
      }

      // Lưu Order (PENDING)
      const order = await Order.create({
        user: userId,
        total: PLAN_PRICE,
        currency: "VND",
        provider: "ZALOPAY",
        providerRef: app_trans_id, // để đối soát về sau
        status: "PENDING",
        planTier: "PRO",
        period: "month",
      });

      // Trả về link thanh toán / QR cho FE
      return res.json({
        provider: "ZALOPAY",
        payUrl: order_url,
        qrCode: qr_code,
        appTransId: app_trans_id,
        orderId: order._id,
        mac,
        app_id: process.env.ZP_APP_ID,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message || "checkout_error" });
    }
  },

  // Xác nhận thanh toán từ ZaloPay
  async verifyPayment(req: Request, res: Response) {
    try {
      const { appTransId, returnCode } = req.body;

      if (!appTransId) {
        return res.status(400).json({ message: "Thiếu appTransId" });
      }

      // returnCode mặc định = 1 (thành công)
      const result = await zlpService.applyPaymentIfSuccessSv(appTransId, returnCode ?? 1);

      switch (result) {
        case "PAID":
          return res.status(200).json({ message: "Thanh toán thành công, user đã được nâng cấp PRO" });
        case "ALREADY_PAID":
          return res.status(200).json({ message: "Đơn hàng này đã được thanh toán trước đó" });
        case "NOT_FOUND":
          return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        case "IGNORED_FAILED":
          return res.status(200).json({ message: "Chưa hoàn thành thanh toán" });
        default:
          return res.status(200).json({ message: "Không có thay đổi" });
      }
    } catch (err: any) {
      console.error("[ZaloPay Verify Error]", err);
      return res.status(500).json({ message: "Lỗi xác nhận thanh toán", error: err.message });
    }
  },
};
