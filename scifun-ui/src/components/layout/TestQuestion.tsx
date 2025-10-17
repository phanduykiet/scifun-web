import React, { forwardRef } from "react";
import "../../styles/TestPage.css";

interface TestQuestionProps {
  index: number;
  content?: string;
  options?: string[]; // mảng các lựa chọn trắc nghiệm
  onAnswer?: () => void;
}

// forwardRef để truyền ref từ cha
const TestQuestion = forwardRef<HTMLDivElement, TestQuestionProps>(
  ({ index, content, options = [], onAnswer }, ref) => {
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
            {options.map((opt, i) => (
              <label key={i} className="optionLabel">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={opt}
                  onChange={() => onAnswer && onAnswer()}
                />
                {opt}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  }
);

export default TestQuestion;
