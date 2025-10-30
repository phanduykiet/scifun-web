import React from "react";
import "../../styles/Leaderboard.css";

interface Student {
  rank: number;
  name: string;
  score: number;
  avatar: string;
}

interface Props {
  top3: Student[];
}

const LeaderboardTop3: React.FC<Props> = ({ top3 }) => {
  return (
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
  );
};

export default LeaderboardTop3;
