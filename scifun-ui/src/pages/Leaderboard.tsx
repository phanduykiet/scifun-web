import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Leaderboard.css";
import LeaderboardHeader from "../components/leaderboard/LeaderboardHeader";
import LeaderboardTop3 from "../components/leaderboard/LeaderboardTop3";
import LeaderboardList from "../components/leaderboard/LeaderboardList";

interface Student {
  rank: number;
  name: string;
  score: number;
  avatar: string;
}

const sampleStudents: Student[] = [
  { rank: 1, name: "Nguyễn Văn A", score: 98, avatar: "https://i.pravatar.cc/150?img=1" },
  { rank: 2, name: "Trần Thị B", score: 95, avatar: "https://i.pravatar.cc/150?img=2" },
  { rank: 3, name: "Lê Văn C", score: 93, avatar: "https://i.pravatar.cc/150?img=3" },
  { rank: 4, name: "Phạm D", score: 90, avatar: "https://i.pravatar.cc/150?img=4" },
  { rank: 5, name: "Đặng E", score: 88, avatar: "https://i.pravatar.cc/150?img=5" },
  { rank: 6, name: "Vũ F", score: 85, avatar: "https://i.pravatar.cc/150?img=6" },
];

const subjects = ["Tất cả môn học", "Lý", "Hóa", "Sinh"];

const LeaderboardPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [selectedSubject, setSelectedSubject] = useState<string>("Tất cả môn học");

  const handleRefresh = () => {
    // Giả lập làm mới dữ liệu
    alert("Bảng xếp hạng đã được làm mới!");
  };

  const top3 = students.slice(0, 3);
  const others = students.slice(3);

  return (
    <div className="container py-5 text-center">
      <h2 className="fw-bold mb-4 text-success">🏆 Bảng Xếp Hạng Học Tập 🏆</h2>

      <LeaderboardHeader
        selectedSubject={selectedSubject}
        subjects={subjects}
        onSubjectChange={setSelectedSubject}
        onRefresh={handleRefresh}
      />

      <LeaderboardTop3 top3={top3} />
      <LeaderboardList students={others} />
    </div>
  );
};

export default LeaderboardPage;
