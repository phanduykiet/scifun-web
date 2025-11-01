import React from "react";

interface Student {
  rank: number;
  name: string;
  score: number;
  avatar: string;
  isPlaceholder?: boolean;
}

interface Props {
  students: Student[];
}

const LeaderboardList: React.FC<Props> = ({ students }) => {
  return (
    <div className="list-group w-75 mx-auto">
      {students.map((s) => (
        <div
          key={s.rank}
          className={`list-group-item d-flex align-items-center justify-content-between shadow-sm mb-2 rounded ${
            s.isPlaceholder ? "placeholder-item" : ""
          }`}
        >
          {/* ✅ Bên trái: Badge + Avatar + Tên */}
          <div className="d-flex align-items-center gap-3">
            <span 
              className="badge bg-primary" 
              style={{ 
                fontSize: "0.9rem", 
                padding: "6px 12px",
                minWidth: "45px",
                position: "static" // ✅ GHI ĐÈ position: absolute
              }}
            >
              #{s.rank}
            </span>
            <img
              src={s.avatar}
              alt={s.name}
              className={`rounded-circle ${s.isPlaceholder ? "opacity-50" : ""}`}
              width={45}
              height={45}
              style={{ filter: s.isPlaceholder ? "grayscale(100%)" : "none" }}
            />
            <strong className={s.isPlaceholder ? "text-muted fst-italic" : ""}>
              {s.name}
            </strong>
          </div>

          {/* ✅ Bên phải: Điểm số */}
          <span className="text-muted fw-bold">{s.score} điểm</span>
        </div>
      ))}
    </div>
  );
};

export default LeaderboardList;