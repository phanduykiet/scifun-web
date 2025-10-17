// src/components/QuizCard.tsx
import React from "react";
import type { Quiz } from "../../types/quiz";
import { FaClock, FaQuestionCircle } from "react-icons/fa";
import { CiHeart, CiBookmark } from "react-icons/ci";

interface QuizCardProps {
  quiz: Quiz;
  onClick?: (quiz: Quiz) => void;
  className?: string;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onClick }) => {
  return (
    <div
      className="card shadow-sm h-100"
      style={{
        borderRadius: "12px",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        padding: "16px",
        backgroundColor: "#f8f9fa",
      }}
      // onClick={() => onClick && onClick(quiz)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 20px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 2px 6px rgba(0,0,0,0.1)";
      }}
    >
      {/* Title */}
      <h5
        className="fw-bold mb-2 text-truncate"
        title={quiz.title}
        style={{ color: "#192137" }}
      >
        {quiz.title}
      </h5>

      {/* Description */}
      {quiz.description && (
        <p className="text-muted mb-3" style={{ fontSize: "0.9rem", flexGrow: 1 }}>
          {quiz.description.length > 100
            ? quiz.description.slice(0, 100) + "..."
            : quiz.description}
        </p>
      )}

      {/* Info */}
      <div className="d-flex justify-content-between mb-3" style={{ fontSize: "0.85rem" }}>
        <span>
          <FaQuestionCircle className="me-1" /> {quiz.questionsCount ?? 0} câu
        </span>
        <span>
          <FaClock className="me-1" /> {quiz.durationMinutes ?? 0} phút
        </span>
      </div>

      {/* Button + icons */}
      <div className="d-flex align-items-center mt-auto" style={{ gap: "8px" }}>
        <button
          className="btn btn-success flex-grow-1"
          onClick={(e) => {
            e.stopPropagation(); // tránh trigger onClick của card
            onClick && onClick(quiz);
          }}
        >
          Bắt đầu
        </button>
        {/* Icons */}
        <CiHeart size={24} className="text-danger" style={{ cursor: "pointer" }} />
        <CiBookmark size={24} className="text-primary" style={{ cursor: "pointer" }} />
      </div>
    </div>
  );
};

export default QuizCard;
