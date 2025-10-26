import React, { useRef, useState, useEffect } from "react";
import "../styles/TestPage.css";
import TestQuestion from "../components/layout/TestQuestion";
import QuestionSidebar from "../components/layout/QuestionSidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuestionsByQuizApi, getAnswersApi } from "../util/api";

const TestReview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { submissionId, topicId, quizId, userAnswers, score, correctCount } =
    (location.state as any) || {};

  const [questions, setQuestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [answers, setAnswers] = useState<any[]>([]);
  const questionRefs = useRef<Array<HTMLDivElement | null>>([]);

  const isMobile = windowWidth <= 900;
  const questionMarginRight = !isMobile ? (isOpen ? "280px" : "60px") : "0";

  useEffect(() => {
    if (!quizId) return;
    const fetchData = async () => {
      try {
        // Lấy câu hỏi
        const qRes = await getQuestionsByQuizApi(quizId);
        setQuestions(qRes.data.data);
  
        // Lấy đáp án (có thể chứa giải thích)
        const aRes = await getAnswersApi(submissionId);
        setAnswers(aRes.data.answers);
      } catch (err) {
        console.error("Lỗi tải dữ liệu review:", err);
      }
    };
    fetchData();
  }, [quizId]);  

  // 🔹 Resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToQuestion = (index: number) => {
    questionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  // Câu đúng → true, sai hoặc chưa chọn → false
  const answeredQuestions = questions.map((q) => {
    const selectedId = userAnswers?.[q._id];
    const correctId = q.answers.find((a: any) => a.isCorrect)?._id;
  
    return selectedId === correctId; // đúng → true, sai/không chọn → false
  });  
  

  return (
    <div className="test-page">
      {/* 🔹 Header hiển thị kết quả */}
      <div
        className="test-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          backgroundColor: "#fff8f2",
          borderBottom: "2px solid #ffd5b5",
          borderRadius: "8px",
          marginBottom: "16px",
        }}
      >
        <h2 style={{ margin: 0 }}>📝 Xem Lại Bài Làm</h2>

        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "center",
            fontSize: "16px",
          }}
        >
          <div>
            <strong>Điểm:</strong>{" "}
            <span style={{ color: "#e67e22", fontWeight: "bold" }}>
              {score ?? 0}
            </span>
          </div>
          <div>
            <strong>Kết quả:</strong>{" "}
            <span style={{ color: "#2ecc71", fontWeight: "bold" }}>
              {correctCount ?? 0}
            </span>{" "}
            / {questions.length} câu đúng
          </div>
          <button
            onClick={() => {
              navigate(`/topic/${topicId}`);
            }}
            style={{
              backgroundColor: "#f39c12",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            ← Quay lại chủ đề
          </button>
        </div>
      </div>

      <div className="test-main">
        {/* 🔹 Danh sách câu hỏi */}
        <div
          className="questions-container"
          style={{ marginRight: questionMarginRight }}
        >
          {questions.length === 0 ? (
            <p>Đang tải câu hỏi...</p>
          ) : (
            questions.map((q, idx) => {
              const selectedAnswerId = userAnswers?.[q._id];
              const correctAnswerId = q.answers.find((a: any) => a.isCorrect)?._id;
              const explanation = answers.find((a) => a.questionId === q._id)?.explanation || "";

              return (
                <TestQuestion
                  key={q._id}
                  ref={(el) => {questionRefs.current[idx] = el}}
                  index={idx}
                  content={q.text}
                  options={q.answers}
                  selectedAnswer={selectedAnswerId}
                  correctAnswer={correctAnswerId}
                  mode="review"
                  explanation={explanation}
                />
              );
            })
          )}
        </div>

        {/* 🔹 Sidebar */}
        <QuestionSidebar
            questions={questions}
            answeredQuestions={answeredQuestions}
            isOpen={isOpen}
            isMobile={isMobile}
            mode="review"
            onToggle={() => setIsOpen(!isOpen)}
            onQuestionClick={(idx) => scrollToQuestion(idx)}
            showSubmitButton={false}
        />
      </div>
    </div>
  );
};

export default TestReview;
