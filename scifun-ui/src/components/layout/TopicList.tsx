import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TopicCard from "./TopicCard";
import { getLessonListApi, getTopicsBySubjectApi } from "../../util/api";
import { Topic } from "../../types/topic";

interface TopicWithSubject extends Topic {
  subjectId: string;
  subjectName: string;
}

const TopicList: React.FC = () => {
  const [topics, setTopics] = useState<TopicWithSubject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const topicsPerView = 4; // số topic hiển thị cùng lúc

  const fetchAllTopics = async () => {
    setLoading(true);
    try {
      const res = await getTopicsBySubjectApi("", 1, 10);
      const topics = res.data.topics ?? res.data ?? [];

      setTopics(topics);
      console.debug(`🎯 Đã load ${topics.length} topics`);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách chủ đề:", err);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTopics();
    window.scrollTo(0, 0);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, topics.length - topicsPerView)
    );
  };

  // Cho thêm buffer 1 để chắc ăn card cuối hiện ra hoàn toàn
  // Nút next sẽ ẩn khi: currentIndex + topicsPerView + 1 >= topics.length
  const canScrollNext = currentIndex + topicsPerView + 1 <= topics.length;

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-2">Đang tải danh sách chủ đề...</p>
      </div>
    );
  }

  if (topics.length === 0) {
    return <p className="mt-4 text-center">Hiện chưa có chủ đề nào.</p>;
  }

  return (
    <div className="container mt-4 position-relative">
      {/* Tiêu đề */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h3
          className="fw-bold d-inline-block mb-0"
          style={{
            color: "#000000",
            paddingLeft: "10px",
            borderLeft: "4px solid #28a745",
          }}
        >
          Ôn tập theo chủ đề
        </h3>
        <Link
          to="/subject/"
          className="text-decoration-none text-success fw-semibold"
        >
          Xem tất cả →
        </Link>
      </div>

      {/* Carousel danh sách chủ đề */}
      <div
        className="overflow-hidden position-relative"
        style={{ paddingRight: "50px" }}
      >
        <div
          className="d-flex transition-transform"
          style={{
            gap: "1.5rem",
            transform: `translateX(-${currentIndex * (105 / topicsPerView)}%)`,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          {topics.map((topic) => (
            <div
              key={topic._id}
              style={{ flex: `0 0 calc(${100 / topicsPerView}% - 1.125rem)` }}
            >
              <TopicCard
                topic={topic}
                onClick={() =>
                  navigate(`/topic/${topic._id}`, {
                    state: {
                      ...topic,
                      subjectId: topic.subjectId,
                      subjectName: topic.subjectName,
                    },
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>
      {/* Nút chuyển trái */}
      {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="btn btn-success position-absolute shadow"
            style={{
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              top: "50%",
              left: "-32px",
              marginTop: "-20px",
              zIndex: 10,
            }}
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Nút chuyển phải */}
        {canScrollNext && (
          <button
            onClick={handleNext}
            className="btn btn-success position-absolute shadow"
            style={{
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              top: "50%",
              right: "-16px",
              marginTop: "-20px",
              zIndex: 10,
            }}
          >
            <ChevronRight size={20} />
          </button>
        )}
    </div>
  );
};

export default TopicList;
