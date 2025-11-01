import React from "react";
import { BsPatchQuestion } from "react-icons/bs";

interface QuestionSidebarProps {
    questions: any[];
    answeredQuestions: boolean[]; // đúng/sai hoặc đã chọn
    isOpen: boolean;
    isMobile: boolean;
    mode: "test" | "review"; // thêm trường mode
    onToggle: () => void;
    onQuestionClick: (index: number) => void;
    onSubmit?: () => void;
    showSubmitButton?: boolean;
  }
  

const QuestionSidebar: React.FC<QuestionSidebarProps> = ({
  questions,
  answeredQuestions,
  isOpen,
  isMobile,
  mode,
  onToggle,
  onQuestionClick,
  onSubmit,
  showSubmitButton = true,
}) => {
  return (
    <div
      className={`question-grid ${isMobile ? "bottom-sheet" : "sidebar"}`}
      style={{
        width: isOpen && !isMobile ? "260px" : "50px",
        transition: "width 0.3s",
      }}
      onClick={onToggle}
    >
      {isOpen || isMobile ? (
        <div className="grid-content">
          <h4>Câu hỏi</h4>
          <div className="grid-buttons">
            {questions.map((_, idx) => (
              <button
                key={idx}
                className={`grid-button ${
                    mode === "test"
                      ? answeredQuestions[idx] ? "answered" : ""     // test mode
                      : answeredQuestions[idx] ? "answered" : "wrong" // review mode
                  }`}                  
                onClick={(e) => {
                  e.stopPropagation();
                  onQuestionClick(idx);
                }}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Nút nộp bài (chỉ hiển thị khi cần) */}
          {showSubmitButton && onSubmit && (
            <button
              className="grid-submit-button"
              onClick={(e) => {
                e.stopPropagation();
                onSubmit();
              }}
            >
              Nộp bài
            </button>
          )}
        </div>
      ) : (
        <div className="grid-icon">
          <BsPatchQuestion />
        </div>
      )}
    </div>
  );
};
export default QuestionSidebar;
