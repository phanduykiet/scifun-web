import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Leaderboard.css"; // file CSS tùy chỉnh

interface Student {
  rank: number;
  name: string;
  score: number;
  avatar: string;
}

const students: Student[] = [
  { rank: 1, name: "Nguyễn Văn A", score: 98, avatar: "https://i.pravatar.cc/150?img=1" },
  { rank: 2, name: "Trần Thị B", score: 95, avatar: "https://i.pravatar.cc/150?img=2" },
  { rank: 3, name: "Lê Văn C", score: 93, avatar: "https://i.pravatar.cc/150?img=3" },
  { rank: 4, name: "Phạm D", score: 90, avatar: "https://i.pravatar.cc/150?img=4" },
  { rank: 5, name: "Đặng E", score: 88, avatar: "https://i.pravatar.cc/150?img=5" },
  { rank: 6, name: "Vũ F", score: 85, avatar: "https://i.pravatar.cc/150?img=6" },
];

const Leaderboard: React.FC = () => {
  const top3 = students.slice(0, 3);
  const others = students.slice(3);

  return (
    <div className="container py-5 text-center">
      <h2 className="fw-bold mb-4 text-success">🏆 Bảng Xếp Hạng Học Tập 🏆</h2>

      {/* Top 3 */}
      <div className="row justify-content-center align-items-end mb-5">
        {/* Hạng 2 */}
        <div className="col-4 col-md-3">
          <div className="leader-card second">
            <img src={top3[1].avatar} alt={top3[1].name} className="avatar" />
            <h5>{top3[1].name}</h5>
            <p className="score">{top3[1].score} điểm</p>
            <span className="badge bg-secondary">#2</span>
          </div>
        </div>

        {/* Hạng 1 */}
        <div className="col-4 col-md-3">
          <div className="leader-card first">
            <img src={top3[0].avatar} alt={top3[0].name} className="avatar" />
            <h4>{top3[0].name}</h4>
            <p className="score">{top3[0].score} điểm</p>
            <span className="badge bg-warning text-dark">#1</span>
          </div>
        </div>

        {/* Hạng 3 */}
        <div className="col-4 col-md-3">
          <div className="leader-card third">
            <img src={top3[2].avatar} alt={top3[2].name} className="avatar" />
            <h5>{top3[2].name}</h5>
            <p className="score">{top3[2].score} điểm</p>
            <span className="badge bg-danger">#3</span>
          </div>
        </div>
      </div>

      {/* Các hạng còn lại */}
      <div className="list-group w-75 mx-auto">
        {others.map((s) => (
          <div
            key={s.rank}
            className="list-group-item d-flex align-items-center justify-content-between shadow-sm mb-2 rounded"
          >
            <div className="d-flex align-items-center">
              <span className="badge bg-primary me-3">#{s.rank}</span>
              <img
                src={s.avatar}
                alt={s.name}
                className="rounded-circle me-3"
                width={45}
                height={45}
              />
              <strong>{s.name}</strong>
            </div>
            <span className="text-muted">{s.score} điểm</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
