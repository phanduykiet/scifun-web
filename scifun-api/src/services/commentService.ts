// src/services/commentService.ts
import Comment from "../models/Comment";
import { emitNewComment, emitReplyToUser } from "./socketService";
import { notifyCommentReply } from "./notificationService";
import User from "../models/User";

export const createComment = async (userId: string, content: string, parentId?: string) => {
  // Tạo bình luận mới
  const user = await User.findById(userId).lean();
  if (!user) throw new Error("Không tìm thấy người dùng");

  const comment = await Comment.create({
    userId: user._id,
    userName: user.fullname,
    userAvatar: user.avatar,
    content,
    parentId: parentId || null,
  });

  // Nếu là bình luận gốc → gửi realtime cho tất cả client
  if (!parentId) {
    emitNewComment(comment);
  }

  // Nếu là reply → gửi thông báo riêng cho người bị reply
  if (parentId) {
    const parent = await Comment.findById(parentId).lean();

    if (parent && String(parent.userId) !== String(user._id)) {
      // Gửi realtime riêng
      emitReplyToUser(String(parent.userId), {
        fromUserName: user.fullname,
        content,
        commentId: comment._id.toString(),
        parentId: parentId.toString(),
      });
      console.log("✅ Đã gửi realtime reply đến user:", parent.userId);

      // Lưu thông báo trong DB
      await notifyCommentReply({
        targetUserId: String(parent.userId),
        fromUserName: user.fullname,
        content,
        commentId: comment._id.toString(),
        parentId: parentId.toString(),
        persist: true,
        email: false,
      });
    }
  }

  return comment;
};