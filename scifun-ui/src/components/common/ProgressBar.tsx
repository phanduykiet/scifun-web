import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  return (
    <div className="my-4 px-2">
      <div className="d-flex justify-content-between small fw-medium text-secondary mb-2">
        <span>0%</span>
        <span>{percentage}%</span>
        <span>100%</span>
      </div>
      <div className="progress bg-light" style={{ height: "10px", borderRadius: "50px" }}>
        <div
          className="progress-bar bg-success"
          style={{
            width: `${percentage}%`,
            transition: "width 0.4s ease",
            borderRadius: "50px",
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
