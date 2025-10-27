import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  const safePercentage = Math.min(Math.max(percentage, 0), 100); // Giới hạn 0–100

  return (
    <div className="my-4 px-2 position-relative">
      {/* Nền thanh tiến trình */}
      <div
        className="progress bg-light"
        style={{
          height: "12px",
          borderRadius: "50px",
          position: "relative",
          overflow: "visible",
        }}
      >
        {/* Thanh màu tiến trình */}
        <div
          className="progress-bar"
          style={{
            width: safePercentage > 0 ? `${safePercentage}%` : "2px",
            backgroundColor: safePercentage > 0 ? "#198754" : "#dcdcdc",
            transition: "width 0.4s ease, background-color 0.3s ease",
            borderRadius: "50px",
          }}
        ></div>

        {/* Số phần trăm di chuyển cùng thanh */}
        <span
          style={{
            position: "absolute",
            top: "-22px",
            left: `calc(${safePercentage}% - 20px)`, // canh theo % và trừ bù nửa chiều rộng text
            color: "#198754",
            fontWeight: 600,
            fontSize: "0.9rem",
            transition: "left 0.4s ease",
          }}
        >
          {safePercentage}%
        </span>
      </div>

      {/* Mốc 0% - 100% phía dưới */}
      <div className="d-flex justify-content-between small fw-medium text-secondary mt-2">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
