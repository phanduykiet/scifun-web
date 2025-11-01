import React from "react";
import "../../styles/UpgradeModal.css";
import { useNavigate } from "react-router-dom";

interface UpgradeModalProps {
  show: boolean;
  onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ show, onClose }) => {
  const navigate = useNavigate();

  if (!show) return null;

  const redirectToUpgrade = () => {
    navigate("/premium");
    onClose();
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="vip-modal" onClick={handleClickOutside}>
      <div className="vip-modal-content">
        <span className="vip-close" onClick={onClose}>
          &times;
        </span>

        {/* Vương miện */}
        <div className="crown-icon">👑</div>

        {/* Badge Premium */}
        <div className="vip-badge">PREMIUM</div>

        <h2 className="vip-title">Nâng cấp Premium</h2>

        <p className="vip-message">
          Tính năng này dành riêng cho thành viên <strong>Premium</strong>.
          Nâng cấp ngay để trải nghiệm đầy đủ!
        </p>

        {/* Lợi ích */}
        <div className="benefits-list">
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span>Truy cập không giới hạn mọi bài kiểm tra</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span>Phân tích chi tiết kết quả học tập</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">✓</span>
            <span>Hỗ trợ ưu tiên 24/7</span>
          </div>
        </div>

        <div className="vip-buttons">
          <button className="vip-btn vip-primary" onClick={redirectToUpgrade}>
            Nâng Cấp Ngay
          </button>
          <button className="vip-btn vip-secondary" onClick={onClose}>
            Để Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;