// src/services/subscriptionService.ts
import dayjs from "dayjs";
import User from "../models/User";

export const checkAndUpdateSubscriptionStatus = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Không tìm thấy người dùng");

  const sub = user.subscription;

  // Nếu user chưa từng có gói
  if (!sub || sub.status === "NONE" || !sub.currentPeriodEnd) {
    return user; // không cần cập nhật gì
  }

  // Nếu có hạn nhưng đã hết
  const now = dayjs();
  const expired = dayjs(sub.currentPeriodEnd).isBefore(now);

  if (expired) {
    user.subscription = {
      status: "NONE",
      tier: undefined,
      currentPeriodEnd: undefined,
      provider: undefined,
    };
    await user.save();
    console.log(`Hết hạn gói: ${user.email}`);
  }

  return user;
};
