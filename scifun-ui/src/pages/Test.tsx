import React, { useRef, useState, useEffect } from "react";
import "../styles/TestPage.css";
import TestQuestion from "../components/layout/TestQuestion";
import ConfirmModal from "../components/common/ConfirmModal";
import QuestionSidebar from "../components/layout/QuestionSidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuestionsByQuizApi, submitQuizApi } from "../util/api";
import Toast from "../components/common/Toast";

const Test: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Đọc metadata lưu tạm trong localStorage (dành cho trường hợp reload)
  const savedQuizMeta = JSON.parse(localStorage.getItem("quiz_meta") || "{}");

  // 🔹 Ưu tiên lấy từ location.state (truyền qua navigate), fallback sang localStorage
  const quizId = (location.state as any)?.quizId || savedQuizMeta.quizId;
  const duration = (location.state as any)?.duration || savedQuizMeta.duration;
  const topicId = (location.state as any)?.topicId || savedQuizMeta.topicId;

  // Nếu chưa có dữ liệu nào thì báo lỗi để tránh crash
  if (!quizId || !duration) {
    console.warn("⚠️ Thiếu thông tin bài quiz — có thể do reload mà chưa có meta.");
  }

  const TEST_DURATION = duration ? duration * 60 : 0;

  const [questions, setQuestions] = useState<any[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isOpen, setIsOpen] = useState(true);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [showResultModal, setShowResultModal] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [isSessionRestored, setIsSessionRestored] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id;
  const questionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const STORAGE_KEY = `quiz_session_${userId}_${quizId}`; // 🔹 Key lưu localStorage

  const isMobile = windowWidth <= 900;
  const questionMarginRight = !isMobile ? (isOpen ? "280px" : "60px") : "0";

  // 🔹 Lưu metadata khi có thông tin quiz hợp lệ
  useEffect(() => {
    if (quizId && duration && topicId) {
      localStorage.setItem(
        "quiz_meta",
        JSON.stringify({ quizId, duration, topicId })
      );
    }
  }, [quizId, duration, topicId]);

  // 🔹 Lấy câu hỏi + khôi phục session
  useEffect(() => {
    if (!quizId || !userId) return;

    const fetchQuestions = async () => {
      try {
        // 1️⃣ Khôi phục session trước (nếu có)
        const savedSession = localStorage.getItem(STORAGE_KEY);
        let restoredAnswers: { [key: string]: string } = {};
        let restoredTimeLeft = TEST_DURATION;

        if (savedSession) {
          try {
            const { userAnswers, timeLeft, lastSaved } = JSON.parse(savedSession);
            const elapsed = Math.floor((Date.now() - lastSaved) / 1000);
            restoredTimeLeft = Math.max(timeLeft - elapsed, 0);
            restoredAnswers = userAnswers || {};
            
            setUserAnswers(restoredAnswers);
            setTimeLeft(restoredTimeLeft);
            
            setToast({
              message: "📂 Đã khôi phục phiên làm bài trước đó",
              type: "info",
            });
          } catch (err) {
            console.error("Lỗi khi parse session:", err);
          }
        }

        // 2️⃣ Tải câu hỏi từ API
        const res = await getQuestionsByQuizApi(quizId);
        const fetchedQuestions = res.data.data;
        setQuestions(fetchedQuestions);

        // 3️⃣ Cập nhật trạng thái câu đã trả lời dựa trên session đã khôi phục
        const answered = fetchedQuestions.map((q: any) => 
          restoredAnswers.hasOwnProperty(q._id) && restoredAnswers[q._id] !== ""
        );
        setAnsweredQuestions(answered);
        setIsSessionRestored(true);

      } catch (err) {
        console.error("Lỗi tải câu hỏi:", err);
        setToast({
          message: "❌ Không thể tải câu hỏi. Vui lòng thử lại!",
          type: "error",
        });
      }
    };

    fetchQuestions();
  }, [quizId, userId, STORAGE_KEY, TEST_DURATION]);

  // 🔹 Lưu session mỗi khi thay đổi đáp án hoặc thời gian
  useEffect(() => {
    if (!quizId || !userId || isSubmitted || !isSessionRestored) return;
    
    const sessionData = {
      userAnswers,
      timeLeft,
      lastSaved: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
  }, [userAnswers, timeLeft, isSubmitted, quizId, userId, STORAGE_KEY, isSessionRestored]);

  // 🔹 Đồng hồ đếm ngược
  useEffect(() => {
    if (isSubmitted || !isSessionRestored) return;
    
    if (timeLeft <= 0) {
      handleSubmit(true); // nộp tự động
      return;
    }
    
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, isSessionRestored]);

  // 🔹 Resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔹 Cuộn đến câu hỏi
  const scrollToQuestion = (index: number) => {
    questionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // 🔹 Nộp bài
  const handleSubmit = async (autoSubmit = false) => {
    if (isSubmitted) return;

    if (!autoSubmit) {
      setShowConfirmSubmit(true);
      return;
    }

    if (autoSubmit && timeLeft <= 0) {
      setToast({
        message: "⏰ Hết giờ! Bài kiểm tra được nộp tự động.",
        type: "info",
      });
    }

    setIsSubmitted(true);
    localStorage.removeItem(STORAGE_KEY); // 🔹 Xóa session sau khi nộp
    localStorage.removeItem("quiz_meta");

    const answersPayload = questions.map((q) => ({
      questionId: q._id,
      selectedAnswerId: userAnswers[q._id] || "",
    }));

    try {
      const res = await submitQuizApi(userId, quizId, answersPayload);
      const data = res.data ?? {};
      setScore(data.score ?? 0);
      setCorrectCount(data.correctAnswers ?? 0);
      setSubmissionId(data.submissionId);
      setShowResultModal(true);
      setToast({ message: "✅ Nộp bài thành công!", type: "success" });
    } catch (err: any) {
      console.error("Lỗi khi nộp bài:", err.response?.data || err);
      setToast({
        message: "❌ Nộp bài thất bại, vui lòng thử lại!",
        type: "error",
      });
      setIsSubmitted(false);
    }
  };

  // 🔹 Xác nhận nộp bài từ modal
  const confirmSubmit = () => {
    setShowConfirmSubmit(false);
    handleSubmit(true);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="test-page">
      <div className="test-header">
        <h2>Bài Kiểm Tra</h2>
      </div>

      <div className="timer-fixed">
        Thời gian còn lại:{" "}
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </div>

      <div className="test-main">
        <div
          className="questions-container"
          style={{ marginRight: questionMarginRight }}
        >
          {questions.length === 0 ? (
            <p>Đang tải câu hỏi...</p>
          ) : (
            questions.map((q, idx) => (
              <TestQuestion
                key={q._id}
                ref={(el) => {
                  questionRefs.current[idx] = el;
                }}
                index={idx}
                content={q.text}
                options={q.answers}
                selectedAnswer={userAnswers[q._id]}
                onAnswer={(answerId: string) => {
                  setUserAnswers((prev) => ({ ...prev, [q._id]: answerId }));
                  setAnsweredQuestions((prev) => {
                    const copy = [...prev];
                    copy[idx] = true;
                    return copy;
                  });
                }}
              />
            ))
          )}
        </div>

        <QuestionSidebar
          questions={questions}
          answeredQuestions={answeredQuestions}
          isOpen={isOpen}
          isMobile={isMobile}
          mode="test"
          onToggle={() => setIsOpen(!isOpen)}
          onQuestionClick={(idx) => scrollToQuestion(idx)}
          onSubmit={() => handleSubmit(false)}
          showSubmitButton={true}
        />
      </div>

      {/* Modal xác nhận nộp bài */}
      <ConfirmModal
        show={showConfirmSubmit}
        title="Xác nhận nộp bài"
        message="Bạn có chắc chắn muốn nộp bài kiểm tra này không?"
        confirmText="Nộp bài"
        cancelText="Hủy"
        onConfirm={confirmSubmit}
        onCancel={() => setShowConfirmSubmit(false)}
      />

      {/* Modal kết quả */}
      <ConfirmModal
        show={showResultModal}
        title="🎉 Kết quả bài kiểm tra"
        message={
          <div>
            <p style={{ margin: "0" }}>
              <b>{correctCount}</b> / {questions.length} câu đúng
            </p>
            <p style={{ margin: "2px 0 0 0" }}>
              Điểm: <b>{score ?? 0}</b>
            </p>
          </div>
        }
        confirmText="Xem Chi Tiết"
        cancelText="Đóng"
        onConfirm={() => {
          setShowResultModal(false);
          navigate("/test-review", {
            state: { submissionId, topicId, quizId, userAnswers, questions, score, correctCount },
          });
        }}
        onCancel={() => {
          setShowResultModal(false);
          const topicId = questions[0]?.quiz?.topic;
          if (topicId) navigate(`/topic/${topicId}`);
        }}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
    </div>
  );
};

export default Test;