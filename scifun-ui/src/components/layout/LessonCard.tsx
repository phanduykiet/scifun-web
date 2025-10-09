import React from "react";
import "../../styles/LessonCard.css"

interface LessonCardProps {
  title: string;
  image: string;
  onDetail: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ title, image, onDetail }) => {
  return (
    <div
        className="card h-100 text-center"
        style={{
            width: "300px",    // cố định chiều ngang
            height: "350px",   // cố định chiều cao (bạn chỉnh tùy ý)
            margin: "auto"
        }}
        >
        {/* Tiêu đề môn học */}
        <div className="card-header">
            <h5
            className="mb-0"
            style={{
                fontSize: "1rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
            }}
            >
            {title}
            </h5>
        </div>

        {/* Ảnh minh họa */}
        <img
            src={image}
            className="card-img-top"
            alt={title}
            style={{
            width: "100%",
            height: "180px",
            objectFit: "contain"
            }}
        />

        {/* Link xem bài học */}
        <div className="card-body d-flex flex-column">
            <a
                href="#"
                className="text-success mt-auto hover-underline"
                style={{
                    textAlign: "right",
                    display: "block",
                }}
                onClick={(e) => {
                    e.preventDefault();
                    onDetail();
                }}
                >
                Xem bài học →
            </a>
        </div>
        </div>

  );
};

export default LessonCard;
