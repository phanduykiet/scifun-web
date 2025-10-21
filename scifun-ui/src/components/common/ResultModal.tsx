import React from "react";
import "../../styles/ResultModal.css";

interface ResultModalProps {
  show: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ show, title, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // tránh đóng khi click bên trong
      >
        <h3>{title || "Thông báo"}</h3>
        <p>{message}</p>
        <button className="close-modal-btn" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
