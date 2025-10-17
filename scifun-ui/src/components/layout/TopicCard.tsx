// src/components/TopicCard.tsx
import React from "react";
import { Topic } from "../../types/subject";

interface TopicCardProps {
  topic: Topic;
  onClick?: (topic: Topic) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  return (
    <div className="card" style={{ width: "30rem", borderRadius: "12px", overflow: "hidden" }}>
      {/* Card header */}
      <div
        className="card-header"
        style={{ backgroundColor: "rgb(25, 33, 55)", color: "#ffffff" }}
      >
        Chủ đề - {topic.name}
      </div>

      <div className="card-body d-flex flex-column"
      style={{ backgroundColor: "rgb(229, 231, 235)", color: "#ffffff" }}>
        <button
          className="btn btn-success mt-2"
          onClick={() => onClick && onClick(topic)}
        >
          Ôn Tập Chủ Đề
        </button>
      </div>
    </div>
  );
};

export default TopicCard;
