// src/components/QuizCard.tsx
import React from "react";

export interface Quiz {
  _id: string;
  title: string;
  description?: string;
  subject?: string;
  questionsCount?: number;  // số câu hỏi
  durationMinutes?: number; // thời gian làm bài
}

interface QuizCardProps {
  quiz: Quiz;
  onClick?: (quiz: Quiz) => void; // callback khi bấm "Bắt đầu"
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onClick }) => {
  return (
    <div className="card" style={{ width: "18rem", borderRadius: "12px" }}>
      <div
        className="card-header"
        style={{ fontWeight: "bold", backgroundColor: "#f8f9fa", color: "#192137" }}
      >
        {quiz.title}
      </div>
      <div className="card-body d-flex flex-column">
        {quiz.description && <p className="card-text">{quiz.description}</p>}
        <p className="card-text mb-1"><strong>Số câu hỏi:</strong> {quiz.questionsCount ?? 0}</p>
        <p className="card-text mb-2"><strong>Thời gian:</strong> {quiz.durationMinutes ?? 0} phút</p>
        <button
          className="btn btn-success mt-auto"
          onClick={() => onClick && onClick(quiz)}
        >
          Bắt đầu
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
