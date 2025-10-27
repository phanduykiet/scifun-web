import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { Topic } from "../types/subject";
import { Quiz } from "../types/quiz";
import {
  getQuizsByTopicApi,
  getTopicsBySubjectApi,
  getLessonListApi
} from "../util/api";
import TopicCard from "../components/layout/TopicCard";
import Header from "../components/layout/Header";

const SubjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // --- state ---
  const [subjects, setSubjects] = useState<any[]>([]);
  const [subject, setSubject] = useState<any>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [searchText, setSearchText] = useState("");

  // === Khởi tạo: load danh sách môn học và set môn học mặc định ===
  useEffect(() => {
    const init = async () => {
      try {
        const res = await getLessonListApi("1", "50", "");
        const subjectList = res.data.subjects || [];
        setSubjects(subjectList);

        // Lấy subject từ location.state nếu có
        if (location.state) {
          const s = location.state as any;
          const found = subjectList.find((sub: any) => sub.id === s.id);
          if (found) {
            setSubject(found);
            setSelectedSubject(found._id);
          }
        } else if (id) {
          // fallback: URL param
          const found = subjectList.find((sub: any) => sub.id === id);
          if (found) {
            setSubject(found);
            setSelectedSubject(found._id);
          }
        }
      } catch (err: any) {
        notification.error({
          message: "Lỗi tải danh sách môn học",
          description: err.response?.data?.message || "Không thể tải môn học",
        });
      }
    };

    init();
  }, [id, location.state]);

  // === Lấy chủ đề & quiz theo selectedSubject ===
  useEffect(() => {
    if (!selectedSubject) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [topicRes, quizRes] = await Promise.all([
          getTopicsBySubjectApi(selectedSubject, 1, 50),
          getQuizsByTopicApi(selectedSubject, 1, 50)
        ]);

        const allTopics = topicRes.data.topics ?? [];
        const allQuizzes = quizRes.data.quizzes ?? [];

        setTopics(allTopics);
        setQuizzes(allQuizzes);
        setSelectedTopic(""); // reset topic khi đổi môn
      } catch (err: any) {
        notification.error({
          message: "Lỗi tải dữ liệu",
          description: err.response?.data?.message || "Không thể tải dữ liệu môn học",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSubject]);

  // === Lọc dữ liệu cho hiển thị ===
  const filteredTopics = topics
    .filter(t => t.name.toLowerCase().includes(searchText.toLowerCase()))
    .filter(t => (selectedTopic ? t._id === selectedTopic : true));

  const filteredQuizzes = quizzes
    .filter(q => q.title.toLowerCase().includes(searchText.toLowerCase()));

  const subjectName = subject?.name || "Chi tiết môn học";

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-2">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <>
      <Header />

      {/* Hero Section */}
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "500px",
          backgroundImage:
            "url('https://img.pikbest.com/ai/illus_our/20230427/2a429cfbd5b5d12b9028cd858eb37ea2.jpg!w700wp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: "100px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            zIndex: 1,
          }}
        ></div>

        {/* Search + Filter */}
        <div
          style={{
            width: "90%",
            maxWidth: "1100px",
            background: "white",
            borderRadius: "16px",
            padding: "16px 24px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flex: "1 1 500px",
              gap: "10px",
            }}
          >
            <input
              type="text"
              placeholder="Tìm kiếm chủ đề hoặc bài trắc nghiệm..."
              style={{
                flex: 1,
                border: "1px solid #dcdcdc",
                outline: "none",
                fontSize: "15px",
                padding: "10px 16px",
                borderRadius: "10px",
                background: "white",
                color: "#333",
                height: "45px",
                transition: "all 0.3s ease",
              }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <button
              style={{
                background: "white",
                color: "#2d6a4f",
                border: "1px solid #95d5b2",
                padding: "10px 24px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                height: "45px",
              }}
              onClick={() => {}}
            >
              Tìm kiếm
            </button>
          </div>

          {/* Filter môn học */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              background: "white",
              color: "black",
              border: "1px solid #dcdcdc",
              borderRadius: "10px",
              padding: "10px 16px",
              fontSize: "15px",
              cursor: "pointer",
              fontWeight: 500,
              transition: "all 0.3s ease",
              marginLeft: "12px",
              height: "45px",
            }}
          >
            <option value="">Tất cả môn học</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Filter chủ đề */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            style={{
              background: "white",
              color: "black",
              border: "1px solid #dcdcdc",
              borderRadius: "10px",
              padding: "10px 16px",
              fontSize: "15px",
              cursor: "pointer",
              fontWeight: 500,
              transition: "all 0.3s ease",
              marginLeft: "12px",
              height: "45px",
            }}
          >
            <option value="">Tất cả chủ đề</option>
            {topics.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chủ đề */}
      <div className="container mt-5">
        <h3 className="fw-bold mb-3">
          🧩 Ôn tập theo chủ đề: {subjectName}
        </h3>

        <div className="row">
          {filteredTopics.length === 0 ? (
            <p>Không tìm thấy chủ đề phù hợp.</p>
          ) : (
            filteredTopics.map((topic) => (
              <div className="col-md-3 mb-4" key={topic._id}>
                <TopicCard
                  topic={topic}
                  onClick={() =>
                    navigate(`/topic/${topic._id}`, {
                      state: {
                        ...topic,
                        subjectId: selectedSubject,
                        subjectName: subjectName,
                      },
                    })
                  }
                />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default SubjectPage;
