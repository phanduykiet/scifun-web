import React from "react";
import { Bookmark, Clock, FileText, Trash2, Play } from "lucide-react";

interface SavedQuizItemProps {
  test: {
    id: string;
    name: string;
    questions: number;
    duration: number;
    savedDate: string;
    category: string;
  };
  onDelete: (id: string) => void;
  onStart: (id: string) => void; // ✅ thêm prop mới
}

export default function SavedTestItem({ test, onDelete, onStart }: SavedQuizItemProps) {
  return (
    <div
      className="d-flex align-items-center gap-3 px-4 py-3 border-bottom"
      style={{ transition: "background-color 0.2s" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      <button className="btn btn-link p-0 border-0">
        <Bookmark size={24} className="text-warning" style={{ cursor: "pointer" }} />
      </button>

      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <h3 className="fw-semibold fs-5 mb-2 text-dark">{test.name}</h3>
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

      <div>
        <span
          className="badge bg-success-subtle text-success d-inline-flex justify-content-center align-items-center"
          style={{ minWidth: "96px", fontSize: "0.75rem" }}
        >
          {test.category}
        </span>
      </div>

      <div className="text-secondary small d-none d-sm-block">{test.savedDate}</div>

      <div className="d-flex align-items-center gap-2">
        {/* 🗑️ Nút xóa */}
        <button
          className="btn btn-sm btn-outline-secondary btn-hover-danger"
          title="Xóa"
          onClick={() => onDelete(test.id)}
          style={{ transition: "all 0.2s" }}
        >
          <Trash2 size={16} />
        </button>

        {/* ▶️ Nút bắt đầu */}
        <button
          className="btn btn-sm btn-success d-flex align-items-center gap-2"
          onClick={() => onStart(test.id)} // ✅ gọi hàm cha
        >
          <Play size={16} />
          <span>Bắt đầu</span>
        </button>
      </div>
    </div>
  );
}
