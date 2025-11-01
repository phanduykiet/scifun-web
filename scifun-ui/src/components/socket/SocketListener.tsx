import { useEffect } from "react";
import { socket } from "../../util/socket";

export default function SocketListener() {
  useEffect(() => {
    // Khi có bình luận mới
    socket.on("comment:new", (comment) => {
      console.log("💬 Bình luận mới:", comment);
      // TODO: cập nhật state hoặc gọi API refresh danh sách
    });

    // Khi có phản hồi tới user hiện tại
    socket.on("comment:reply", (reply) => {
      console.log("🔁 Có phản hồi:", reply);
    });

    // Khi thay đổi hạng
    socket.on("leaderboard:rankChanged", (data) => {
      console.log("🏆 Thay đổi thứ hạng:", data);
      // TODO: hiển thị toast hoặc notification
    });

    return () => {
      socket.off("comment:new");
      socket.off("comment:reply");
      socket.off("leaderboard:rankChanged");
    };
  }, []);

  return null;
}
