import React, { useRef, useState, useEffect } from "react";
import "../styles/TestPage.css"; 
import TestQuestion from "../components/layout/TestQuestion";
import { BsPatchQuestion } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuestionsByQuizApi, submitQuizApi } from "../util/api";

const TEST_DURATION = 3;

const Test: React.FC = () => {
  const location = useLocation();
  const quizId = (location.state as any)?.quizId;

  const [questions, setQuestions] = useState<any[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isOpen, setIsOpen] = useState(true);
  // Lấy userId từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id;
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const questionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const isMobile = windowWidth <= 900;
  const questionMarginRight = !isMobile ? (isOpen ? "280px" : "60px") : "0";

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

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToQuestion = (index: number) => {
    questionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const handleSubmit = async () => {
    if (!window.confirm("Bạn có chắc muốn nộp bài không?")) return;
  
    const answersPayload = questions.map(q => ({
      questionId: q._id,
      selectedAnswerId: userAnswers[q._id] || "", // phải có giá trị
    }));
  
    // ✅ debug trước khi gửi
    console.log("User ID:", userId);
    console.log("Quiz ID:", quizId);
    console.log("Answers Payload:", answersPayload);
  
    try {
      const res = await submitQuizApi(userId, quizId, answersPayload);
  
      // ✅ debug sau khi submit
      console.log("Response từ API:", res.data);
  
      alert("Bài đã nộp thành công!");
      // Lấy topicId từ câu hỏi đầu tiên
      const topicId = questions[0]?.quiz?.topic;
      if (topicId) {
        navigate(`/topic/${topicId}`);
      }
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
        Thời gian còn lại: {minutes.toString().padStart(2,"0")}:{seconds.toString().padStart(2,"0")}
      </div>

      <div className="test-main">
        {/* Câu hỏi */}
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
                options={q.answers.map((a: any) => a.text)}
                onAnswer={(selectedText: string) => {
                  // Tìm answerId dựa trên text đã chọn
                  const selected = q.answers.find((a: any) => a.text === selectedText);
                  if (!selected) return;
                  
                  setUserAnswers(prev => ({ ...prev, [q._id]: selected._id }));
                  
                  setAnsweredQuestions(prev => {
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
        <div
          className={`question-grid ${isMobile ? "bottom-sheet" : "sidebar"}`}
          style={{
            width: isOpen && !isMobile ? "260px" : "50px",
            transition: "width 0.3s",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen || isMobile ? (
            <div className="grid-content">
              <h4>Câu hỏi</h4>
              <div className="grid-buttons">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    className={`grid-button ${answeredQuestions[idx] ? "answered" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToQuestion(idx);
                    }}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {/* Nút nộp bài trong grid */}
              <button
                className="grid-submit-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit();
                }}
              >
                Nộp bài
              </button>
            </div>
          ) : (
            <div className="grid-icon"><BsPatchQuestion /></div>
          )}
        </div>
      </div>
    </div>

  );
};

export default Test;
