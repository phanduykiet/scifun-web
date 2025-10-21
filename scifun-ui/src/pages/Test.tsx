import React, { useRef, useState, useEffect } from "react";
import "../styles/TestPage.css";
import TestQuestion from "../components/layout/TestQuestion";
import ConfirmModal from "../components/common/ConfirmModal";
import QuestionSidebar from "../components/layout/QuestionSidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuestionsByQuizApi, submitQuizApi } from "../util/api";

const TEST_DURATION = 3; // 3 giây để test, sau đổi lại 15*60

const Test: React.FC = () => {
  const location = useLocation();
  const quizId = (location.state as any)?.quizId;

  const [questions, setQuestions] = useState<any[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isOpen, setIsOpen] = useState(true);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [showResultModal, setShowResultModal] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id;
  const navigate = useNavigate();
  const questionRefs = useRef<Array<HTMLDivElement | null>>([]);

  const isMobile = windowWidth <= 900;
  const questionMarginRight = !isMobile ? (isOpen ? "280px" : "60px") : "0";

  // 🔹 Lấy câu hỏi
  useEffect(() => {
    if (!quizId) return;
    const fetchQuestions = async () => {
      try {
        const res = await getQuestionsByQuizApi(quizId);
        setQuestions(res.data.data);
        setAnsweredQuestions(Array(res.data.data.length).fill(false));
      } catch (err) {
        console.error("Lỗi tải câu hỏi:", err);
      }
    };
    fetchQuestions();
  }, [quizId]);

  // 🔹 Đồng hồ đếm ngược + tự động nộp khi hết giờ
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(true); // nộp tự động
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // 🔹 Resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔹 Cuộn đến câu hỏi
  const scrollToQuestion = (index: number) => {
    questionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 🔹 Nộp bài (autoSubmit = true khi hết giờ)
  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit) {
      if (!window.confirm("Bạn có chắc muốn nộp bài không?")) return;
    } else {
      alert("⏰ Đã hết giờ làm bài! Bài kiểm tra sẽ được nộp tự động.");
    }

    const answersPayload = questions.map((q) => ({
      questionId: q._id,
      selectedAnswerId: userAnswers[q._id] || "",
    }));

    try {
      const res = await submitQuizApi(userId, quizId, answersPayload);
      const data = res.data ?? {};
      setScore(data.score ?? 0);
      setCorrectCount(data.correctAnswers ?? 0);
      setTotalQuestions(data.totalQuestions ?? questions.length);
      setShowResultModal(true);
    } catch (err: any) {
      console.error("Lỗi khi nộp bài:", err.response?.data || err);
      alert("Nộp bài thất bại, vui lòng thử lại!");
    }
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
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </div>

      <div className="test-main">
        {/* 🔸 Danh sách câu hỏi */}
        <div className="questions-container" style={{ marginRight: questionMarginRight }}>
          {questions.length === 0 ? (
            <p>Đang tải câu hỏi...</p>
          ) : (
            questions.map((q, idx) => (
              <TestQuestion
                key={q._id}
                ref={(el) => { questionRefs.current[idx] = el; }}
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

        {/* Sidebar / Bottom Grid */}
        <QuestionSidebar
          questions={questions}
          answeredQuestions={answeredQuestions}
          isOpen={isOpen}
          isMobile={isMobile}
          mode="test"
          onToggle={() => setIsOpen(!isOpen)}
          onQuestionClick={(idx) => scrollToQuestion(idx)}
          onSubmit={handleSubmit}
          showSubmitButton={true}
        />
      </div>

      {/* Modal hiển thị điểm */}
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
            state: { quizId, userAnswers, questions, score, correctCount },
          });          
        }}
        onCancel={() => {
          setShowResultModal(false);
          const topicId = questions[0]?.quiz?.topic;
          if (topicId) navigate(`/topic/${topicId}`);
        }}
      />
    </div>
  );
};

export default Test;
