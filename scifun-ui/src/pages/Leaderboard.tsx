import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Leaderboard.css";
import LeaderboardHeader from "../components/leaderboard/LeaderboardHeader";
import LeaderboardTop3 from "../components/leaderboard/LeaderboardTop3";
import LeaderboardList from "../components/leaderboard/LeaderboardList";
import { getLeaderBoardApi, resetLeaderBoardApi } from "../util/api";
import Header from "../components/layout/Header";

interface Student {
  rank: number;
  name: string;
  score: number;
  avatar: string;
  isPlaceholder?: boolean;
}

const LeaderboardPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ Tạo danh sách placeholder
  const createPlaceholders = (count: number, startRank: number): Student[] => {
    return Array.from({ length: count }, (_, i) => ({
      rank: startRank + i,
      name: "Chưa có người chơi",
      score: 0,
      avatar: "https://png.pngtree.com/png-vector/20220616/ourmid/pngtree-trophy-cartoon-illustration-png-image_5102874.png",
      isPlaceholder: true,
    }));
  };

  // 🟢 Fetch leaderboard khi chọn môn
  const fetchLeaderboard = async (subjectId: string) => {
    try {
      const res = await getLeaderBoardApi(subjectId, 1, 50, "alltime");

      const list = res.data || [];

      const formatted = list.map((item: any) => ({
        rank: item.rank || 0,
        name: item.userName || "Người dùng",
        score: item.totalScore || 0,
        avatar: item.userAvatar || "https://i.pravatar.cc/150",
        isPlaceholder: false,
      }));

      // ✅ Thêm placeholder nếu không đủ 5 người
      let finalList = [...formatted];
      const totalNeeded = 5;
      
      if (finalList.length < totalNeeded) {
        const placeholdersNeeded = totalNeeded - finalList.length;
        const startRank = finalList.length + 1;
        const placeholders = createPlaceholders(placeholdersNeeded, startRank);
        finalList = [...finalList, ...placeholders];
      }

      setStudents(finalList);
    } catch (error) {
      console.error("❌ Lỗi lấy bảng xếp hạng:", error);
      // ✅ Nếu lỗi API, hiển thị 5 placeholder
      setStudents(createPlaceholders(5, 1));
    }
  };

  // 🔄 Hàm rebuild leaderboard và fetch lại dữ liệu
  const rebuildAndFetchLeaderboard = async (subjectId: string) => {
    try {
      setIsRefreshing(true);
      await resetLeaderBoardApi(subjectId);
      await fetchLeaderboard(subjectId);
    } catch (error) {
      console.error("❌ Lỗi rebuild leaderboard:", error);
      // Vẫn cố gắng fetch lại dữ liệu dù rebuild thất bại
      await fetchLeaderboard(subjectId);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 🟢 Gọi rebuild khi chọn môn (khi load trang)
  useEffect(() => {
    if (selectedSubject) {
      rebuildAndFetchLeaderboard(selectedSubject);
    }
  }, [selectedSubject]);

  // 🔄 Xử lý nút Refresh
  const handleRefresh = () => {
    if (selectedSubject) {
      rebuildAndFetchLeaderboard(selectedSubject);
    }
  };

  const top3 = students.slice(0, 3);
  const others = students.slice(3);

  return (
    <>
      <Header />
      <div className="container py-5 text-center" style={{ marginTop: "50px" }}>
        <h2 className="fw-bold mb-4 text-success">🏆 Bảng Xếp Hạng Học Tập 🏆</h2>

        <LeaderboardHeader
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
          onRefresh={handleRefresh}
        />

        {isRefreshing && (
          <div className="alert alert-info my-3">
            <span className="spinner-border spinner-border-sm me-2"></span>
            Đang cập nhật bảng xếp hạng...
          </div>
        )}

        <LeaderboardTop3 top3={top3} />
        <LeaderboardList students={others} />
      </div>
    </>
  );
};

export default LeaderboardPage;