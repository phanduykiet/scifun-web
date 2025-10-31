// src/services/zalopayService.ts
import crypto from "crypto";
import fetch from "node-fetch";
import dayjs from "dayjs";
import Order from "../models/Order";
import User from "../models/User";

const {
  ZP_APP_ID,
  ZP_KEY1,
  ZP_CREATE_ENDPOINT,
} = process.env;

export interface ZLPCreateOrderRes {
  return_code: number;
  return_message: string;
  sub_return_code?: number;
  sub_return_message?: string;
  order_url?: string;
  qr_code?: string;
  zp_trans_token?: string;
  zp_trans_id?: number | string;
  mac: string;
}


export const zlpService = {
  // ký request → key1
  sign(input: string) {
    return crypto.createHmac("sha256", ZP_KEY1!).update(input).digest("hex");
  },

  // sinh mã giao dịch
  genAppTransId() {
    const yymmdd = dayjs().format("YYMMDD");
    return `${yymmdd}_${Math.floor(Math.random() * 1_000_000)}`;
  },

  // Tạo order (không redirect/callback)
  async createOrder(
    amount: number,
    userId: string
  ): Promise<ZLPCreateOrderRes & { app_trans_id: string }> {
    const app_trans_id = zlpService.genAppTransId();
    const app_time = Date.now();
    const app_id = Number(ZP_APP_ID);
    const app_user = userId || "guest";
    const embed_data = JSON.stringify({});
    const item = JSON.stringify([]);
    const description = "Thanh toán gói PRO Scifun";

    const macInput = [
      app_id,
      app_trans_id,
      app_user,
      amount,
      app_time,
      embed_data,
      item,
    ].join("|");

    const mac = zlpService.sign(macInput);

    const body = {
      app_id,
      app_user,
      app_time,
      amount,
      app_trans_id,
      embed_data,
      item,
      description,
      mac,
    };

    const resp = await fetch(ZP_CREATE_ENDPOINT!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`ZaloPay create failed: ${resp.status} ${text}`);
    }
    
    const a = ZP_APP_ID!;
    const b = app_trans_id!;
    const c = ZP_KEY1!;
    const data = `${a}|${b}|${c}`;
    const macCheck = crypto.createHmac("sha256", c).update(data).digest("hex");

    const result = (await resp.json()) as ZLPCreateOrderRes;
    return { ...result, app_trans_id, mac: macCheck };
  },

  // Cập nhật DB NẾU thanh toán thành công.
  // returnCode === 1  => cập nhật Order=PAID + cấp PRO cho User
  // returnCode !== 1  => không cập nhật gì
  async applyPaymentIfSuccessSv(appTransId: string, returnCode: number):
    Promise<"NOT_FOUND" | "IGNORED_FAILED" | "ALREADY_PAID" | "PAID"> {

    // chỉ xử lý khi thành công
    if (returnCode !== 1) {
      return "IGNORED_FAILED";
    }

    const order = await Order.findOne({ providerRef: appTransId, provider: "ZALOPAY" });
    if (!order) return "NOT_FOUND";

    if (order.status === "PAID") {
      return "ALREADY_PAID";
    }

    // cập nhật Order
    order.status = "PAID";
    order.currentPeriodEnd = dayjs().add(1, "month").toDate();
    await order.save();

    // cập nhật User (cấp PRO)
    const user = await User.findById(order.user);
    if (user) {
      const curEnd = user.subscription?.currentPeriodEnd ? dayjs(user.subscription.currentPeriodEnd) : null;
      const newEnd = dayjs(order.currentPeriodEnd!);
      const finalEnd = curEnd && curEnd.isAfter(newEnd) ? curEnd.toDate() : newEnd.toDate();

      user.subscription = {
        status: "ACTIVE",
        tier: "PRO",
        currentPeriodEnd: finalEnd,
        provider: "ZALOPAY",
      } as any;
      await user.save();
    }

    return "PAID";
  },
};
