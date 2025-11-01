import React, { useEffect, useState } from "react";
import type { Quiz } from "../../types/quiz";
import { FaClock, FaQuestionCircle, FaBookmark, FaCrown } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import {
  saveQuizApi,
  delSavedQuizApi,
  getSavedQuizzesApi,
} from "../../util/api";
import ConfirmModal from "../common/ConfirmModal";
import Toast from "../common/Toast";
import UpgradeModal from "../Prenium/UpgradeModal";

interface QuizCardProps {
  quiz: Quiz;
  onClick?: (quiz: Quiz) => void;
  className?: string;
  isPro?: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onClick, isPro = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    subtitle?: string;
    type?: "success" | "error" | "info";
  } | null>(null);

  // ✅ Lấy userId và trạng thái Pro từ localStorage
  const userId = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user._id || null;
    } catch {
      return null;
    }
  })();

  const userIsPro = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.isPro === "ACTIVE";
    } catch {
      return false;
    }
  })();

  // ✅ Kiểm tra quiz đã lưu chưa
  useEffect(() => {
    const fetchSaved = async () => {
      if (!userId) return;
      try {
        const res = await getSavedQuizzesApi(userId, quiz.topic._id);
        const savedQuizzes = res.data?.data?.map(
          (item: any) => item.quiz?._id ?? item.quizId
        );
        if (savedQuizzes?.includes(quiz._id)) setBookmarked(true);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách quiz đã lưu:", err);
      }
    };
    fetchSaved();
  }, [quiz._id, userId]);

  // ✅ Lưu hoặc xóa quiz khỏi kho
  const handleBookmark = async () => {
    if (!userId) {
      setToast({
        message: "Bạn cần đăng nhập để lưu bài kiểm tra!",
        type: "info",
      });
      return;
    }

    try {
      if (bookmarked) {
        await delSavedQuizApi(quiz._id, userId);
        setBookmarked(false);
        setToast({
          message: "Đã xóa khỏi kho bài kiểm tra!",
          type: "info",
        });
      } else {
        await saveQuizApi(userId, quiz._id);
        setBookmarked(true);
        setToast({
          message: "Đã thêm vào kho bài kiểm tra!",
          type: "success",
        });
      }
    } catch (err) {
      console.error("Lỗi khi lưu/xóa quiz:", err);
      setToast({
        message: "Không thể lưu bài kiểm tra.",
        subtitle: "Vui lòng thử lại sau.",
        type: "error",
      });
    }
  };

  // ✅ Xử lý khi nhấn nút "Bắt đầu"
  const handleStartQuiz = () => {
    if (isPro && !userIsPro) {
      setShowUpgradeModal(true);
    } else {
      setShowModal(true);
    }
  };

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
          border: isPro ? "3px solid #FFD700" : "1px solid #dee2e6",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
        }}
      >
        {/* ✅ Badge Pro với icon vương miện */}
        {isPro && (
          <div
            style={{
              position: "absolute",
              top: "-10px",
              right: "10px",
              backgroundColor: "#FFD700",
              color: "#000",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              boxShadow: "0 2px 8px rgba(255, 215, 0, 0.5)",
            }}
          >
            <FaCrown size={14} />
            PRO
          </div>
        )}

        <h5
          className="fw-bold mb-2 text-truncate"
          title={quiz.title}
          style={{ color: "#192137" }}
        >
          {quiz.title}
        </h5>

        {quiz.description && (
          <p className="text-muted mb-3" style={{ fontSize: "0.9rem", flexGrow: 1 }}>
            {quiz.description.length > 100
              ? quiz.description.slice(0, 100) + "..."
              : quiz.description}
          </p>
        )}

        {/* ✅ Số câu hỏi + thời gian */}
        <div
          className="d-flex justify-content-between mb-3"
          style={{ fontSize: "0.85rem" }}
        >
          <span>
            <FaQuestionCircle className="me-1" /> {quiz.questionCount ?? 0} câu
          </span>
          <span>
            <FaClock className="me-1" /> {quiz.duration ?? 0} phút
          </span>
        </div>

        {/* ✅ Nút và bookmark */}
        <div className="d-flex align-items-center mt-auto" style={{ gap: "8px" }}>
          <button className="btn btn-success flex-grow-1" onClick={handleStartQuiz}>
            Bắt đầu
          </button>

          {bookmarked ? (
            <FaBookmark
              size={24}
              className="text-warning"
              style={{ cursor: "pointer" }}
              onClick={handleBookmark}
              title="Xóa khỏi kho"
            />
          ) : (
            <CiBookmark
              size={24}
              className="text-warning"
              style={{ cursor: "pointer" }}
              onClick={handleBookmark}
              title="Lưu vào kho"
            />
          )}
        </div>
      </div>

      {/* ✅ Modal xác nhận */}
      <ConfirmModal
        show={showModal}
        message={
          <>
            <p>Bạn có chắc chắn muốn bắt đầu bài kiểm tra "{quiz.title}"?</p>
            <p>Số câu hỏi: {quiz.questionCount ?? 0}</p>
            <p>Thời gian: {quiz.duration ?? 0} phút</p>
          </>
        }
        onConfirm={() => {
          setShowModal(false);
          onClick && onClick(quiz);
        }}
        onCancel={() => setShowModal(false)}
      />

      {/* ✅ Toast */}
      {toast && (
        <Toast
          message={toast.message}
          subtitle={toast.subtitle}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ✅ Modal nâng cấp */}
      <UpgradeModal
        show={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </>
  );
};

export default QuizCard;
