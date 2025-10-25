import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      const subjectRes = await getLessonListApi("1", "10", "");
  
      const subjects = subjectRes.data.subjects ?? subjectRes.data ?? [];
      if (subjects.length === 0) {
        console.warn("⚠️ Không có môn học nào để lấy chủ đề.");
        setTopics([]);
        return;
      }
  
      // Xóa hết trước khi load mới
      setTopics([]);
  
      for (const subject of subjects) {
        try {
          const res = await getTopicsBySubjectApi(subject.id, 1, 10);
  
          const list = (res.data.topics ?? res.data ?? []).map((t: Topic) => ({
            ...t,
            subjectId: subject.id,
            subjectName: subject.name,
          }));
  
          // ⬇️ Cập nhật dần dần mỗi lần load xong 1 môn
          setTopics((prev) => [...prev, ...list]);
        } catch (err) {
          console.error(`❌ Lỗi khi load topic của môn ${subject.name}:`, err);
        }
      }
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
      Math.min(prev + 1, Math.max(0, topics.length - topicsPerView))
    );
  };

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
      </div>

      {/* Carousel danh sách chủ đề */}
      <div className="overflow-hidden position-relative">
        <div
          className="d-flex transition-transform"
          style={{
            gap: "1.5rem",
            transform: `translateX(-${currentIndex * (100 / topicsPerView)}%)`,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          {topics.map((topic) => (
            <div
              key={topic.id}
              style={{ flex: `0 0 calc(${100 / topicsPerView}% - 1rem)` }}
            >
              <TopicCard
                topic={topic}
                onClick={() =>
                  navigate(`/topic/${topic.id}`, {
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

        {/* Nút chuyển trái/phải */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="btn btn-success position-absolute top-50 start-0 translate-middle-y shadow"
            style={{ borderRadius: "50%", width: "40px", height: "40px" }}
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {currentIndex < topics.length - topicsPerView && (
          <button
            onClick={handleNext}
            className="btn btn-success position-absolute top-50 end-0 translate-middle-y shadow"
            style={{ borderRadius: "50%", width: "40px", height: "40px" }}
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TopicList;
