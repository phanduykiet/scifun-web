import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/LessonStatsCard.css"; // 🔥 Thêm file CSS riêng để custom thêm hiệu ứng

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

const LessonStatsCard: React.FC<LessonCardProps> = ({ lesson, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const completionRate = Math.round((lesson.completed / lesson.total) * 100);

  return (
    <div className="lesson-card card mb-4 border-0 rounded-4 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        className="lesson-header btn w-100 d-flex justify-content-between align-items-center text-start p-3 bg-white"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="d-flex align-items-center gap-3">
          <div className="icon-box bg-success bg-opacity-10 p-2 rounded-circle">
            <FileText className="text-success" size={20} />
          </div>
          <div>
            <h6 className="fw-semibold text-dark mb-0">{lesson.title}</h6>
            <small className="text-muted">{completionRate}% hoàn thành</small>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-success-subtle text-success fw-medium">
            {lesson.completed}/{lesson.total}
          </span>
          {isExpanded ? (
            <ChevronUp className="text-muted" size={20} />
          ) : (
            <ChevronDown className="text-muted" size={20} />
          )}
        </div>
      </button>

      {/* Nội dung chi tiết */}
      <div
        className={`lesson-body bg-light bg-gradient px-4 pb-3 ${isExpanded ? "expanded" : "collapsed"}`}
      >
        {isExpanded && (
          <>
            {lesson.subLessons.length > 0 ? (
              lesson.subLessons.map((sub) => (
                <div key={sub.id} className="lesson-item py-2 border-bottom">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small text-dark fw-medium">{sub.name}</span>
                    <span className="small fw-semibold text-success">
                      {sub.score} điểm
                    </span>
                  </div>
                  <div className="text-muted small">
                    <i className="bi bi-clock me-1"></i>Hoàn thành lúc: {sub.completedAt}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted small fst-italic py-2">
                Chưa có nội dung chi tiết
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LessonStatsCard;
