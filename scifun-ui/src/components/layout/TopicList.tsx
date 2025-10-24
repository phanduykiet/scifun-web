import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const fetchAllTopics = async () => {
    setLoading(true);
    try {
      // 1️⃣ Lấy danh sách tất cả môn học
      const subjectRes = await getLessonListApi("1", "10", "");
      const subjects = subjectRes.data.subjects ?? [];

      // 2️⃣ Lấy topic của từng môn song song và map thêm subjectId + subjectName
      const topicResponses = await Promise.all(
        subjects.map(async (subject: any) => {
          const res = await getTopicsBySubjectApi(subject.id, 1, 10);
          return (res.data.topics ?? []).map((t: Topic) => ({
            ...t,
            subjectId: subject.id,
            subjectName: subject.name,
          }));
        })
      );

      // 3️⃣ Gộp tất cả topic thành một mảng duy nhất
      const allTopics: TopicWithSubject[] = topicResponses.flat();

      // 4️⃣ Giới hạn hiển thị nếu muốn, ví dụ 6 topic
      setTopics(allTopics.slice(0, 6));
    } catch (err) {
      console.error("Lỗi khi tải danh sách chủ đề:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTopics();
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <div className="container mt-4">
      {/* Tiêu đề giống SubjectPage */}
      <div className="mb-4">
        <h3
          className="fw-bold d-inline-block"
          style={{
            color: "#000000",
            paddingLeft: "10px",
            borderLeft: "4px solid #28a745",
          }}
        >
          Ôn tập theo chủ đề
        </h3>
      </div>

      {/* Danh sách chủ đề */}
      <div className="row">
        {topics.length === 0 ? (
          <p>Hiện chưa có chủ đề nào.</p>
        ) : (
          topics.map((topic) => (
            <div
              className="col-md-4 mb-4 d-flex justify-content-start"
              key={topic.id}
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
          ))
        )}
      </div>
    </div>
  );
};

export default TopicList;
