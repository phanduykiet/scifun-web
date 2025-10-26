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
  explanation?: string; // ✅ Thêm prop giải thích
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
      explanation, // ✅ Lấy prop giải thích
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
                if (opt._id === correctAnswer) bg = "#d4edda"; // xanh nhạt
                else if (opt._id === selectedAnswer && opt._id !== correctAnswer)
                  bg = "#f8d7da"; // đỏ nhạt
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

        {/* ✅ Hiển thị phần giải thích khi review */}
        {mode === "review" && explanation && (
          <div
            className="questionExplanation"
            style={{
              backgroundColor: "#f1f1f1",
              borderRadius: "6px",
              padding: "10px",
              marginTop: "10px",
              fontStyle: "italic",
            }}
          >
            <strong>Giải thích:</strong> {explanation}
          </div>
        )}
      </div>
    );
  }
);

export default TestQuestion;
