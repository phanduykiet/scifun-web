  import React from "react";

  interface Student {
    rank: number;
    name: string;
    score: number;
    avatar: string;
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
    );
  };

  export default LeaderboardList;
