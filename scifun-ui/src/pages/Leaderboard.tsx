import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Leaderboard.css";
import LeaderboardHeader from "../components/leaderboard/LeaderboardHeader";
import LeaderboardTop3 from "../components/leaderboard/LeaderboardTop3";
import LeaderboardList from "../components/leaderboard/LeaderboardList";
import { getLeaderBoardApi } from "../util/api";

interface Student {
  rank: number;
  name: string;
  score: number;
  avatar: string;
}

const LeaderboardPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>(""); // ✅ subjectId

  // 🟢 Fetch leaderboard khi chọn môn
  const fetchLeaderboard = async (subjectId: string) => {
    try {
      const res = await getLeaderBoardApi(subjectId, 1, 50, "alltime");
  
      console.log("📌 API trả về:", res.data);
  
      const list = res.data || []; // ✅ đúng theo API
  
      const formatted = list.map((item: any) => ({
        rank: item.rank || 0,
        name: item.userName || "Người dùng",
        score: item.totalScore || 0,
        avatar: item.userAvatar || "https://i.pravatar.cc/150",
      }));
  
      setStudents(formatted);
    } catch (error) {
      console.error("❌ Lỗi lấy bảng xếp hạng:", error);
      setStudents([]);
    }
  };  

  // 🟢 Lần đầu có subjectId thì gọi API
  useEffect(() => {
    if (selectedSubject) {
      fetchLeaderboard(selectedSubject);
    }
  }, [selectedSubject]);

  const handleRefresh = () => {
    if (selectedSubject) fetchLeaderboard(selectedSubject);
  };

  const top3 = students.slice(0, 3);
  const others = students.slice(3);

  return (
    <div className="container py-5 text-center">
      <h2 className="fw-bold mb-4 text-success">🏆 Bảng Xếp Hạng Học Tập 🏆</h2>

      <LeaderboardHeader
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        onRefresh={handleRefresh}
      />

      <LeaderboardTop3 top3={top3} />
      <LeaderboardList students={others} />
    </div>
  );
};

export default LeaderboardPage;
