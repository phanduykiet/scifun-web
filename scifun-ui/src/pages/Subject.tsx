import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { Topic } from "../types/subject";
import { getTopicsBySubjectApi, getLessonListApi } from "../util/api";
import TopicCard from "../components/layout/TopicCard";
import Header from "../components/layout/Header";

const SubjectPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- state ---
  const [subjects, setSubjects] = useState<any[]>([]);
  const [subject, setSubject] = useState<any>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  // === Lấy danh sách môn học ban đầu ===
  useEffect(() => {
    const init = async () => {
      try {
        const res = await getLessonListApi("1", "50", "");
        const subjectList = res.data.subjects || [];
        setSubjects(subjectList);

        if (location.state) {
          const s = location.state as any;
          const found = subjectList.find((sub: any) => sub._id === s._id);
          if (found) {
            setSubject(found);
            setSelectedSubject(found._id);
          }
        } else {
          // ✅ nếu không truyền state => hiện tất cả
          setSubject(null);
          setSelectedSubject("");
        }
      } catch (err: any) {
        notification.error({
          message: "Lỗi tải danh sách môn học",
          description:
            err.response?.data?.message || "Không thể tải môn học",
        });
      } finally {
        setLoadingPage(false);
      }
    };

    init();
  }, [location.state]);

  // === Lấy chủ đề theo selectedSubject & searchInput ===
  useEffect(() => {
    const fetchTopics = async () => {
      setLoadingTopics(true);
      try {
        const topicRes = await getTopicsBySubjectApi(
          selectedSubject || undefined, // nếu rỗng thì lấy tất cả
          1,
          50,
          searchInput.trim() || undefined // thêm search nếu có
        );
        const allTopics = topicRes.data.topics ?? [];
        setTopics(allTopics);
        setSelectedTopic("");
      } catch (err: any) {
        notification.error({
          message: "Lỗi tải chủ đề",
          description:
            err.response?.data?.message || "Không thể tải chủ đề môn học",
        });
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, [selectedSubject, searchInput]); // ✅ chỉ cần 2 dependency này

  // === Lọc dữ liệu hiển thị ===
  const filteredTopics = topics.filter((t) =>
    selectedTopic ? t._id === selectedTopic : true
  );

  const subjectName = subject?.name || "Tất cả môn học";

  // ✅ Spinner khi tải trang lần đầu
  if (loadingPage) {
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
          {/* Ô tìm kiếm */}
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
              placeholder="Tìm kiếm chủ đề..."
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
              }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {/* Filter môn học */}
          <select
            value={selectedSubject}
            onChange={(e) => {
              const newId = e.target.value;
              setSelectedSubject(newId);
              if (newId === "") {
                setSubject(null);
              } else {
                const found = subjects.find((s) => s._id === newId);
                setSubject(found || null);
              }
            }}
            style={{
              background: "white",
              color: "black",
              border: "1px solid #dcdcdc",
              borderRadius: "10px",
              padding: "10px 16px",
              fontSize: "15px",
              cursor: "pointer",
              fontWeight: 500,
              marginLeft: "12px",
              height: "45px",
            }}
          >
            <option value="">Tất cả môn học</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
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
        <h3 className="fw-bold mb-3">🧩 Ôn tập theo chủ đề {subjectName}:</h3>

        {loadingTopics ? (
          <div className="text-center my-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Đang tải chủ đề...</span>
            </div>
            <p className="mt-2">Đang tải chủ đề...</p>
          </div>
        ) : (
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
        )}
      </div>
    </>
  );
};

export default SubjectPage;
