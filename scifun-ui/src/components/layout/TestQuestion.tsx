import React, { forwardRef } from "react";
import "../../styles/TestPage.css";

interface TestQuestionProps {
  index: number;
  content?: string;
  options?: { _id: string; text: string }[];
  onAnswer?: (answerId: string) => void;
  selectedAnswer?: string;
  correctAnswer?: string;
  mode?: "test" | "review";
  explanation?: string;
  isExplanationLocked?: boolean; 
  onUnlockClick?: () => void; 
}

const TestQuestion = forwardRef<HTMLDivElement, TestQuestionProps>(
  (
    {
      index,
      content,
      options = [],
      onAnswer,
      selectedAnswer,
      correctAnswer,
      mode = "test",
      explanation,
      isExplanationLocked, // ✅ Lấy prop
      onUnlockClick,       // ✅ Lấy prop
    },
    ref
  ) => {
    return (
      <div ref={ref} className="questionCard">
        <div className="questionHeader">
          <strong>Câu {index + 1}</strong>
        </div>

        <div className="questionContent">
          {content || "Nội dung câu hỏi"}
        </div>

        {options.length > 0 && (
          <div className="options">
            {options.map((opt) => {
              let bg = "";
              if (mode === "review") {
                if (opt._id === correctAnswer) bg = "#d4edda";
                else if (opt._id === selectedAnswer && opt._id !== correctAnswer)
                  bg = "#f8d7da";
              }

              return (
                <label
                  key={opt._id}
                  className="optionLabel"
                  style={{
                    display: "block",
                    backgroundColor: bg,
                    borderRadius: "6px",
                    padding: "8px",
                    marginBottom: "6px",
                    border:
                      selectedAnswer === opt._id
                        ? "2px solid #007bff"
                        : "1px solid #ccc",
                    cursor: mode === "test" ? "pointer" : "default",
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={opt._id}
                    checked={selectedAnswer === opt._id}
                    disabled={mode === "review"}
                    onChange={() =>
                      mode === "test" && onAnswer && onAnswer(opt._id)
                    }
                    style={{ marginRight: "8px" }}
                  />
                  {opt.text}

                  {mode === "review" && opt._id === correctAnswer && (
                    <span style={{ color: "green", marginLeft: "8px" }}>✔</span>
                  )}
                  {mode === "review" &&
                    opt._id === selectedAnswer &&
                    opt._id !== correctAnswer && (
                      <span style={{ color: "red", marginLeft: "8px" }}>✖</span>
                    )}
                </label>
              );
            })}
          </div>
        )}

        {/* ✅ Hiển thị phần giải thích với Premium Lock */}
        {mode === "review" && explanation && (
          <div
            className="questionExplanation"
            style={{
              backgroundColor: "#fff8f2",
              border: "2px solid #ffd5b5",
              borderRadius: "8px",
              padding: "12px",
              marginTop: "10px",
              fontStyle: "italic",
              position: "relative",
              overflow: "hidden",
              minHeight: isExplanationLocked ? "140px" : "auto",
            }}
          >
            <strong style={{ color: "#e67e22" }}>💡 Giải thích:</strong>{" "}
            
            {isExplanationLocked ? (
              <>
                {/* Phần text bị blur nhẹ - vẫn đọc được 1 chút */}
                <span style={{ 
                  filter: "blur(3px)", 
                  userSelect: "none",
                  color: "#999"
                }}>
                  {explanation}
                </span>
                
                {/* Overlay gradient để tạo hiệu ứng teaser */}
                <div
                  onClick={onUnlockClick}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(to bottom, rgba(255, 248, 242, 0.3) 0%, rgba(255, 248, 242, 0.95) 50%, rgba(255, 248, 242, 0.98) 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: "20px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(to bottom, rgba(255, 248, 242, 0.4) 0%, rgba(255, 248, 242, 0.97) 50%, rgba(255, 248, 242, 1) 100%)";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(to bottom, rgba(255, 248, 242, 0.3) 0%, rgba(255, 248, 242, 0.95) 50%, rgba(255, 248, 242, 0.98) 100%)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <div style={{ 
                    fontSize: "32px", 
                    marginBottom: "6px",
                  }}>
                    🔒
                  </div>
                  <div style={{ 
                    fontSize: "15px", 
                    color: "#e67e22", 
                    fontWeight: "bold",
                    marginBottom: "6px",
                    textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                  }}>
                    Giải Thích Chi Tiết
                  </div>
                  <div style={{ 
                    fontSize: "12px", 
                    color: "#666",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    padding: "5px 12px",
                    borderRadius: "12px",
                    marginTop: "2px"
                  }}>
                    👑 Nâng cấp Premium để xem
                  </div>
                </div>
              </>
            ) : (
              explanation
            )}
          </div>
        )}
      </div>
    );
  }
);

export default TestQuestion;