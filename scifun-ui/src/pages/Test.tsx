import React, { useRef, useState, useEffect } from "react";
import "../styles/TestPage.css"; // import css
import TestQuestion from "../components/layout/TestQuestion";

const totalQuestions = 30;
const TEST_DURATION = 15 * 60; // 15 phút = 900 giây

const Test: React.FC = () => {
  const questionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);

  const isMobile = windowWidth <= 600;

  const scrollToQuestion = (index: number) => {
    questionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    Array(totalQuestions).fill(false)
  );

  // Cập nhật kích thước màn hình
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Đồng hồ đếm ngược
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const questionMarginRight = !isMobile ? (isOpen ? "280px" : "60px") : "0";
  const sampleOptions = ["A", "B", "C", "D"];

  return (
    <div className="container">
      <h1>Bài Kiểm Tra</h1>
        {/* Đồng hồ đếm ngược */}
        <div className="timer">
        Thời gian còn lại: {minutes.toString().padStart(2,"0")}:{seconds.toString().padStart(2,"0")}
        </div>

        <div className="content">
        <div
            className="questions"
            style={{ marginRight: questionMarginRight }}
        >
            {Array.from({ length: totalQuestions }).map((_, idx) => (
              <TestQuestion
                key={idx}
                ref={(el) => { questionRefs.current[idx] = el; }}
                index={idx}
                content={`Đây là nội dung câu hỏi ${idx + 1}`}
                options={sampleOptions}
                onAnswer={() => {
                  setAnsweredQuestions(prev => {
                    const copy = [...prev];
                    copy[idx] = true; // đánh dấu câu này đã trả lời
                    return copy;
                  });
                }}
              />
            ))}
        </div>

        {/* Thanh lưới câu hỏi */}
        <div
          className="gridNav"
          style={{
            position: "fixed",
            bottom: isMobile ? "0" : undefined,
            left: isMobile ? "0" : undefined,
            right: isMobile ? "0" : "20px",
            top: isMobile ? undefined : "100px",
            width: isOpen ? (isMobile ? "100%" : "260px") : "50px",
            height: isOpen ? "auto" : "50px",
            padding: isOpen ? "10px" : "0",
            borderRadius: isMobile ? "10px 10px 0 0" : "50px",
            cursor: "pointer",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <>
              <h3 style={{ textAlign: "center", margin: "5px 0" }}>Câu hỏi</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? `repeat(auto-fit, minmax(40px, 1fr))`
                    : `repeat(5, 1fr)`,
                  gap: "5px",
                }}
              >
                {Array.from({ length: totalQuestions }).map((_, idx) => (
                  <button
                    key={idx}
                    className="gridButton"
                    style={{
                      backgroundColor: answeredQuestions[idx] ? "lightgreen" : "",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToQuestion(idx);
                    }}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="bubbleIcon">Q</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Test;
