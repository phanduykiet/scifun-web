import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { notification } from "antd";
import axios from "axios";
import { Topic } from "../types/subject";
import { Quiz } from "../types/quiz";
import {
  getQuizsByTopicApi,
  getTopicsBySubjectApi,
  getLessonListApi
} from "../util/api";
import TopicCard from "../components/layout/TopicCard";
import QuizCard from "../components/layout/QuizCard";
import Header from "../components/layout/Header";

const SubjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const subjectNameFromState =
    (location.state as any)?.name || "Chi tiết môn học";

  // --- state ---
  const [topics, setTopics] = useState<Topic[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>(id || "");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [searchText, setSearchText] = useState("");

  // === Gọi API lấy môn học ===
  const fetchSubjects = async () => {
    try {
      const res = await getLessonListApi("1", "50", "");
      console.log("Môn học: ", res);
      setSubjects(res.data.subjects || []); // fallback cho định dạng khác
    } catch (err: any) {
      notification.error({
        message: "Lỗi tải danh sách môn học",
        description: err.response?.data?.message || "Không thể tải môn học",
      });
    }
  };

  // === Gọi API lấy chủ đề & quiz theo môn ===
  const fetchData = async (
    subjectId?: string,
    topicId?: string,
    search?: string
  ) => {
    if (!subjectId) return;
    setLoading(true);
    try {
      const [topicRes, quizRes] = await Promise.all([
        getTopicsBySubjectApi(subjectId, 1, 20),
        getQuizsByTopicApi(topicId || subjectId, 1, 20),
      ]);
      console.log("Topic: ", topicRes);
      console.log("Quiz: ", quizRes);
  
      const allTopics = topicRes.data.topics ?? [];
      const allQuizzes = quizRes.data.quizzes ?? [];
  
      // Lọc thêm client-side
      const filteredTopics = allTopics.filter((t: Topic) =>
        t.name.toLowerCase().includes(search?.toLowerCase() || "")
      );
  
      const filteredQuizzes = allQuizzes.filter((q: Quiz) =>
        q.title.toLowerCase().includes(search?.toLowerCase() || "")
      );
  
      setTopics(filteredTopics);
      setQuizzes(filteredQuizzes);
    } catch (err: any) {
      notification.error({
        message: "Lỗi tải dữ liệu",
        description:
          err.response?.data?.message || "Không thể tải dữ liệu môn học",
      });
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchSubjects();
    fetchData(selectedSubject);
  }, [selectedSubject]);

  // === Khi chọn môn, reset chủ đề ===
  useEffect(() => {
    setSelectedTopic("");
  }, [selectedSubject]);

  // === Lọc dữ liệu ===
  const filteredTopics = topics
    .filter((t) =>
      t.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((t) =>
      selectedTopic ? t._id === selectedTopic : true
    );

  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // === Loading ===
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
          alignItems: "flex-start", // 🔥 đẩy khối lên trên
          justifyContent: "center",
          paddingTop: "100px", // 🔥 chỉnh khoảng cách từ trên xuống
        }}
      >
        {/* Lớp phủ tối ảnh */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)", // 🔥 làm tối ảnh
            zIndex: 1,
          }}
        ></div>

        {/* Ô tìm kiếm + bộ lọc */}
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
            zIndex: 2, // 🔥 nổi lên trên lớp phủ tối
          }}
        >
          {/* Ô tìm kiếm + nút tìm kiếm */}
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
              onFocus={(e) => (e.currentTarget.style.border = "1px solid #95d5b2")}
              onBlur={(e) => (e.currentTarget.style.border = "1px solid #dcdcdc")}
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
                transition: "all 0.3s ease",
                height: "45px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#d8f3dc"; // xanh lá nhạt
                e.currentTarget.style.border = "1px solid #74c69d";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.border = "1px solid #95d5b2";
              }}
              onClick={() => fetchData(selectedSubject, selectedTopic, searchText)}
            >
              Tìm kiếm
            </button>
          </div>

          {/* Lọc môn học */}
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
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#d8f3dc";
              e.currentTarget.style.border = "1px solid #95d5b2";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.border = "1px solid #dcdcdc";
            }}
          >
            <option value="">Tất cả môn học</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id} style={{ color: "#333", background: "white" }}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Lọc chủ đề */}
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
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#d8f3dc";
              e.currentTarget.style.border = "1px solid #95d5b2";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.border = "1px solid #dcdcdc";
            }}
          >
            <option value="">Tất cả chủ đề</option>
            {topics.map((t) => (
              <option key={t._id} value={t._id} style={{ color: "#333", background: "white" }}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>



      {/* ===== DANH SÁCH CHỦ ĐỀ ===== */}
      <div className="container mt-5">
        <h3
          className="fw-bold mb-3"
          style={{
            borderLeft: "5px solid #28a745",
            paddingLeft: "10px",
          }}
        >
          🧩 Ôn tập theo chủ đề
        </h3>

        <div className="row">
          {filteredTopics.length === 0 ? (
            <p>Không tìm thấy chủ đề phù hợp.</p>
          ) : (
            filteredTopics.map((topic) => (
              <div className="col-md-4 mb-4" key={topic._id}>
                <TopicCard
                  topic={topic}
                  onClick={() =>
                    navigate(`/topic/${topic._id}`, {
                      state: {
                        ...topic,
                        subjectId: selectedSubject,
                        subjectName: subjectNameFromState,
                      },
                    })
                  }
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== DANH SÁCH QUIZ ===== */}
      <div className="container mt-5 mb-5">
        <h3
          className="fw-bold mb-3"
          style={{
            borderLeft: "5px solid #28a745",
            paddingLeft: "10px",
          }}
        >
          📝 Đề trắc nghiệm
        </h3>

        {filteredQuizzes.length === 0 ? (
          <p>Không có đề trắc nghiệm nào phù hợp.</p>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {filteredQuizzes.map((quiz) => (
              <div className="col d-flex" key={quiz.id}>
                <QuizCard
                  className="flex-fill"
                  quiz={quiz}
                  onClick={() =>
                    navigate("/test", { state: { quizId: quiz.id } })
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SubjectPage;
