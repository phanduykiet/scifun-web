import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { Topic } from "../types/subject";
import { getTopicsBySubjectApi, getQuizsByTopicApi } from "../util/api";
import TopicCard from "../components/layout/TopicCard";
import QuizCard from "../components/layout/QuizCard";
import { Quiz } from "../types/quiz";
import Header from "../components/layout/Header";

const SubjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const subjectNameFromState = (location.state as any)?.name || "Chi tiết môn học";
  const navigate = useNavigate();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loadingTopics, setLoadingTopics] = useState<boolean>(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState<boolean>(true);

  // Lấy danh sách chương
  const fetchTopics = async () => {
    if (!id) return;
    setLoadingTopics(true);
    try {
      const res = await getTopicsBySubjectApi(id, 1, 10);
      setTopics(res.data.topics ?? []);
    } catch (err: any) {
      console.error(err);
      notification.error({
        message: "Lỗi",
        description: err.response?.data?.message || "Không thể tải danh sách chương",
      });
    } finally {
      setLoadingTopics(false);
    }
  };

  // Lấy danh sách quiz
  const fetchQuizzes = async () => {
    if (!id) return;
    setLoadingQuizzes(true);
    try {
      const res = await getQuizsByTopicApi(id, 1, 10);
      setQuizzes(res.data.quizzes ?? []);
    } catch (err: any) {
      console.error(err);
      notification.error({
        message: "Lỗi",
        description: err.response?.data?.message || "Không thể tải danh sách quiz",
      });
    } finally {
      setLoadingQuizzes(false);
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchQuizzes();
  }, [id]);

  // Loading chung
  if (loadingTopics || loadingQuizzes) {
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

      {/* Tiêu đề môn học */}
      <h2 className="text-left mb-4" style={{ margin: "10px 0 0 20px" }}>
        {subjectNameFromState}
      </h2>

      <div className="progress" style={{ margin: "0 20px 20px 20px", height: "15px" }}>
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{ width: "25%", height: "15px" }}
          aria-valuenow={25}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          25%
        </div>
      </div>

      {/* Danh sách chương */}
      <div className="container mt-4">
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
        <div className="row">
          {topics.length === 0 ? (
            <p>Chưa có chủ đề nào cho môn học này.</p>
          ) : (
            topics.map((topic) => (
              <div className="col-md-4 mb-4 d-flex justify-content-start" key={topic.id}>
                <TopicCard
                  topic={topic}
                  onClick={() => navigate(`/topic/${topic.id}`, { 
                    state: { 
                      ...topic,
                      subjectId: id,
                      subjectName: subjectNameFromState
                    }
                  })}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Danh sách quiz */}
      <div className="container mt-4">
        {/* Heading */}
        <div className="mb-4">
          <h3
            className="fw-bold d-inline-block"
            style={{
              color: "#000000",
              paddingLeft: "15px",
              borderLeft: "4px solid #28a745",
            }}
          >
            Đề trắc nghiệm
          </h3>
        </div>

        {/* Quiz grid */}
        {quizzes.length === 0 ? (
          <p>Chưa có quiz nào cho môn học này.</p>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {quizzes.map((quiz) => (
              <div className="col d-flex flex-column" key={quiz.id}>
                {/* Card chiếm toàn bộ chiều cao col, các card cùng hàng cao bằng nhau */}
                <QuizCard
                  className="flex-fill"
                  quiz={quiz}
                  onClick={() => navigate("/test", { state: { quizId: quiz.id } })}
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
