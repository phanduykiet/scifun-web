import Notification from "../models/Notification";

export const createNotificationSv = async (
  userId: string,
  message: string,
  type: "quiz" | "system" | "submission" | "other" = "system"
) => {
  const notification = new Notification({
    userId,
    message,
    type,
    read: false,
    createdAt: new Date(),
  });
  return await notification.save();
};

export const getNotificationsSv = async (
  userId: string,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments({ userId }),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    notifications,
  };
};


// services/notificationService.ts
export const markAsReadSv = async (notificationId: string) => {
  return await Notification.findByIdAndUpdate(
    notificationId,
    { read: true },
    { new: true }
  );
};

// services/notificationService.ts
export const markAllAsReadSv = async (userId: string) => {
  return await Notification.updateMany(
    { userId, read: false },
    { $set: { read: true } }
  );
};
