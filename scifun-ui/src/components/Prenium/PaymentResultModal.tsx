import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/PaymentResultModal.css";

interface PaymentResultModalProps {
  show: boolean;
  status: "success" | "error" | "cancel";
  onClose: () => void;
}

const PaymentResultModal: React.FC<PaymentResultModalProps> = ({
  show,
  status,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!show) return null;

  const getStatusContent = () => {
    switch (status) {
      case "success":
        return {
          icon: "🎉",
          title: "Thanh toán thành công!",
          message: "Cảm ơn bạn đã nâng cấp tài khoản Premium 💎",
          color: "#28a745",
          button: "Tận hưởng ngay",
        };
      case "cancel":
        return {
          icon: "❌",
          title: "Thanh toán bị hủy",
          message: "Bạn đã hủy giao dịch hoặc thoát giữa chừng.",
          color: "#dc3545",
          button: "Đóng",
        };
      default:
        return {
          icon: "⚠️",
          title: "Thanh toán thất bại",
          message: "Đã có lỗi xảy ra, vui lòng thử lại sau.",
          color: "#ffc107",
          button: "Thử lại",
        };
    }
  };

  const content = getStatusContent();

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="payment-modal" onClick={handleClickOutside}>
      <div className="payment-modal-content">
        <span className="payment-close" onClick={onClose}>
          &times;
        </span>

        <div
          className="payment-icon"
          style={{ backgroundColor: content.color + "20", color: content.color }}
        >
          {content.icon}
        </div>

        <h2 className="payment-title">{content.title}</h2>
        <p className="payment-message">{content.message}</p>

        <div className="payment-btn-group">
          <button
            className="payment-btn"
            style={{ backgroundColor: content.color }}
            onClick={onClose}
          >
            {content.button}
          </button>
          <button
            className="payment-btn secondary"
            onClick={handleBackHome}
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResultModal;
