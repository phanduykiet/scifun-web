// src/components/TopicCard.tsx
import React from "react";
import { Topic } from "../../types/subject";

interface TopicCardProps {
  topic: Topic;
  onClick?: (topic: Topic) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  return (
    <div
      className="card shadow-sm"
      style={{
        width: "18rem",
        height: "25rem",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <img
        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop"
        alt={topic.name}
        style={{
          width: "100%",
          height: "180px",
          objectFit: "cover",
        }}
      />

      {/* Body */}
      <div
        className="card-body"
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          padding: "1rem",
        }}
      >
        <div>
          <h5
            className="card-title mb-2"
            style={{
              color: "rgb(25, 33, 55)",
              fontWeight: "600",
              fontSize: "1.2rem",
              lineHeight: "1.4",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {topic.name}
          </h5>

          <p
            className="card-text"
            style={{
              color: "#6b7280",
              fontSize: "0.95rem",
              lineHeight: "1.4",
              maxHeight: "4.2rem", // giới hạn 3 dòng
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {topic.description ||
              "Khám phá và ôn tập các kiến thức quan trọng trong chủ đề này"}
          </p>
        </div>

        <button
          className="btn btn-success w-100"
          onClick={() => onClick && onClick(topic)}
          style={{
            borderRadius: "8px",
            padding: "10px",
            fontWeight: "500",
            marginTop: "auto",
          }}
        >
          Ôn Tập Chủ Đề
        </button>
      </div>
    </div>
  );
};

export default TopicCard;
