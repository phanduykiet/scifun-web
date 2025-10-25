import React from "react";
import { Bookmark, Clock, FileText, Trash2, Play } from "lucide-react";

interface SavedQuizItemProps {
  test: {
    id: number;
    name: string;
    questions: number;
    duration: number;
    savedDate: string;
    category: string;
  };
}

export default function SavedTestItem({ test }: SavedQuizItemProps) {
  return (
    <div className="d-flex align-items-center gap-3 px-4 py-3 border-bottom" 
         style={{ transition: 'background-color 0.2s' }}
         onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
         onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
      
      {/* Bookmark Icon */}
      <button className="btn btn-link p-0 border-0">
        <Bookmark 
          size={24} 
          className="text-warning" 
          style={{ cursor: "pointer" }} 
        />
      </button>

      {/* Test Info */}
      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <h3 className="fw-semibold fs-5 mb-2 text-dark">
          {test.name}
        </h3>
        <div className="d-flex align-items-center gap-3 text-secondary small">
          <div className="d-flex align-items-center gap-1">
            <FileText size={16} />
            <span>{test.questions} câu hỏi</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <Clock size={16} />
            <span>{test.duration} phút</span>
          </div>
        </div>
      </div>

      {/* Category Badge */}
      <div>
        <span className="badge bg-success-subtle text-success d-inline-flex justify-content-center align-items-center" 
              style={{ minWidth: '96px', fontSize: '0.75rem' }}>
          {test.category}
        </span>
      </div>

      {/* Date */}
      <div className="text-secondary small d-none d-sm-block">
        {test.savedDate}
      </div>

      {/* Actions */}
      <div className="d-flex align-items-center gap-2">
        <button 
          className="btn btn-sm btn-outline-secondary btn-hover-danger"
          title="Xóa"
          style={{
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.classList.remove('btn-outline-secondary');
            e.currentTarget.classList.add('btn-outline-danger');
          }}
          onMouseLeave={(e) => {
            e.currentTarget.classList.remove('btn-outline-danger');
            e.currentTarget.classList.add('btn-outline-secondary');
          }}
        >
          <Trash2 size={16} />
        </button>

        <button className="btn btn-sm btn-success d-flex align-items-center gap-2">
          <Play size={16} />
          <span>Bắt đầu</span>
        </button>
      </div>
    </div>
  );
}