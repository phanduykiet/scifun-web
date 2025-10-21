import React, { useEffect, useState } from "react";
import type { Quiz } from "../../types/quiz";
import { FaClock, FaQuestionCircle } from "react-icons/fa";
import { CiHeart, CiBookmark } from "react-icons/ci";
import { getQuestionsByQuizApi } from "../../util/api";
import ConfirmModal from "../ConfirmModal";

interface QuizCardProps {
  quiz: Quiz;
  onClick?: (quiz: Quiz) => void;
  className?: string;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onClick }) => {
  const [questionsCount, setQuestionsCount] = useState<number | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchQuizStats = async () => {
      try {
        setLoading(true);
        const res = await getQuestionsByQuizApi(quiz.id);
        const questions = res.data.data;
        setQuestionsCount(questions.length);
        setDurationMinutes(quiz.durationMinutes ?? 0);
      } catch (err) {
        console.error("Failed to fetch quiz stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizStats();
  }, [quiz.id, quiz.durationMinutes]);

  return (
    <>
      <div
        className="card shadow-sm h-100"
        style={{
          borderRadius: "12px",
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "pointer",
          padding: "16px",
          backgroundColor: "#f8f9fa",
        }}
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
        <h5 className="fw-bold mb-2 text-truncate" title={quiz.title} style={{ color: "#192137" }}>
          {quiz.title}
        </h5>

        {quiz.description && (
          <p className="text-muted mb-3" style={{ fontSize: "0.9rem", flexGrow: 1 }}>
            {quiz.description.length > 100 ? quiz.description.slice(0, 100) + "..." : quiz.description}
          </p>
        )}

        <div className="d-flex justify-content-between mb-3" style={{ fontSize: "0.85rem" }}>
          {loading ? (
            <span>Đang tải...</span>
          ) : (
            <>
              <span>
                <FaQuestionCircle className="me-1" /> {questionsCount ?? 0} câu
              </span>
              <span>
                <FaClock className="me-1" /> {durationMinutes ?? 0} phút
              </span>
            </>
          )}
        </div>

        <div className="d-flex align-items-center mt-auto" style={{ gap: "8px" }}>
          <button className="btn btn-success flex-grow-1" onClick={() => setShowModal(true)}>
            Bắt đầu
          </button>
          <CiHeart size={24} className="text-danger" style={{ cursor: "pointer" }} />
          <CiBookmark size={24} className="text-primary" style={{ cursor: "pointer" }} />
        </div>
      </div>

      {/* Modal */}
      <ConfirmModal
        show={showModal}
        message={
          <>
            <p>Bạn có chắc chắn muốn bắt đầu bài kiểm tra "{quiz.title}"?</p>
            <p>Số câu hỏi: {questionsCount ?? 0}</p>
            <p>Thời gian: {durationMinutes ?? 0} phút</p>
          </>
        }
        onConfirm={() => {
          setShowModal(false);
          onClick && onClick(quiz);
        }}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
};

export default QuizCard;
