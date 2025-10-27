import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/LessonStatsCard.css";

export interface SubLesson {
  id: string;
  name: string;
  score: number;
  completedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  completed: number;
  total: number;
  subLessons: SubLesson[];
}

interface LessonCardProps {
  lesson: Lesson;
  defaultExpanded?: boolean;
}

const LessonStatsCard: React.FC<LessonCardProps> = ({
  lesson,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const completionRate = Math.round((lesson.completed / lesson.total) * 100);

  return (
    <div className="lesson-stats-card mb-3">
      {/* Header */}
      <button
        className="lesson-stats-header"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        <div className="d-flex align-items-center gap-3">
          <div className="lesson-icon">
            <FileText size={20} />
          </div>
          <div className="text-start">
            <h6 className="lesson-title mb-0">{lesson.title}</h6>
            <small className="lesson-subtitle">
              {completionRate}% hoàn thành
            </small>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="lesson-badge">
            {lesson.completed}/{lesson.total}
          </span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {/* Body */}
      <div className={`lesson-stats-body ${isExpanded ? "expanded" : ""}`}>
        <div className="lesson-stats-content">
          {lesson.subLessons.length > 0 ? (
            <>
              {lesson.subLessons.map((sub, index) => (
                <div
                  key={sub.id}
                  className={`lesson-stats-item ${
                    index === lesson.subLessons.length - 1 ? "last" : ""
                  }`}
                >
                  <div>
                    <div className="fw-medium text-dark">{sub.name}</div>
                    <span className="badge bg-success mt-2">
                      {sub.score} điểm
                    </span>
                  </div>
                  <div className="text-muted small text-end">
                    {sub.completedAt ? (
                      <span className="fst-italic text-dark">Hoàn thành lúc: {sub.completedAt}</span>
                    ) : (
                      <span className="fst-italic text-secondary">Chưa làm bài này</span>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="lesson-stats-empty">Chưa có nội dung chi tiết</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonStatsCard;