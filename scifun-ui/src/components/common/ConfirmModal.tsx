import React from "react";

interface ConfirmModalProps {
  show: boolean;
  title?: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ show, title = "Xác nhận", message, onConfirm, onCancel, confirmText, cancelText }) => {
  if (!show) return null;

  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 1050
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "20px",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
        }}
      >
        {title && <h5>{title}</h5>}
        <div>
            {message}
        </div>
        <div className="d-flex justify-content-end" style={{ gap: "10px" }}>
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelText || "Hủy"}
          </button>
          <button className="btn btn-success" onClick={onConfirm}>
            {confirmText || "Bắt đầu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
