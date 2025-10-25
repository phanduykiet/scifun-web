import React from "react";
import "../../styles/LessonCard.css";

interface LessonCardProps {
  title: string;
  image: string;
  onDetail: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ title, image, onDetail }) => {
  return (
    <div
      className="lesson-card"
      onClick={onDetail}
      role="button"
      aria-label={`Xem chi tiết ${title}`}
    >
      {/* Ảnh nền dùng thẻ img để dễ scale */}
      <img src={image} alt={title} className="lesson-card__img" />

      {/* Overlay ánh sáng */}
      <div className="lesson-card__overlay" />

      {/* Gradient phía dưới để chữ nổi */}
      <div className="lesson-card__gradient" />

      {/* Tiêu đề đè lên ảnh */}
      <div className="lesson-card__title-wrap">
        <h5 className="lesson-card__title">{title}</h5>
      </div>
    </div>
  );
};

export default LessonCard;
