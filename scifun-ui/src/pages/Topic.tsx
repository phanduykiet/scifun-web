import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // ✅ Thêm useLocation
import { Quiz } from "../types/quiz";
import { Topic as TopicType } from "../types/subject"; // ✅ Đổi alias để không trùng với component
import { getQuizsByTopicApi } from "../util/api";
import QuizCard from "../components/layout/QuizCard";
import Header from "../components/layout/Header";
import { FaBookOpen } from "react-icons/fa";

const Topic: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const topic = location.state as TopicType;
    const demoVideos = [
      "https://www.youtube.com/embed/CKJcL7DJyok", // video demo 1
      "https://www.youtube.com/embed/T729TGPof6g?si=eEuQ2cuKcnBot6om", // video demo 2
    ];    

  
    useEffect(() => {
      const fetchQuizzes = async () => {
        if (!topicId) return;
        try {
          setLoading(true);
          const res = await getQuizsByTopicApi(topicId);
          setQuizzes(res.data.quizzes || []);
        } catch (error) {
          console.error("Failed to fetch quizzes", error);
        } finally {
          setLoading(false);
        }
      };
      fetchQuizzes();
    }, [topicId]);
  
    return (
      <>
        <Header/>
        <div className="container mt-4">
          {/* Heading */}
          <h1 className="fw-bold mb-2 fs-3 d-flex align-items-center">
            <FaBookOpen className="me-2" /> Chủ đề - {topic?.name}
          </h1>
          <p className="text-muted mb-4">{topic?.description}</p>

          {/* Section Video */}
          <div className="mb-4">
            <h3
              className="fw-bold d-inline-block"
              style={{
                color: "#000000",
                paddingLeft: "15px",
                borderLeft: "4px solid #28a745",
              }}
            >
              Bài giảng
            </h3>

            {/* Danh sách Video YouTube */}
            <div className="row mt-3" style={{ maxWidth: "1000px" }}>
              {demoVideos.length > 0 ? (
                demoVideos.map((videoUrl, index) => (
                  <div className="col-md-6 mb-3" key={index}>
                    <div className="ratio ratio-16x9">
                      <iframe
                        src={videoUrl}
                        title={`video-${index}`}
                        allowFullScreen
                        style={{ border: "none" }}
                      ></iframe>
                    </div>
                  </div>
                ))
              ) : (
                <p className="ms-2">Chưa có video nào cho chủ đề này.</p>
              )}
            </div>
          </div>

          {/* Section Quiz */}
          <div className="mb-4">
            <h3
              className="fw-bold d-inline-block"
              style={{
                color: "#000000",
                paddingLeft: "15px",       // khớp với padding mặc định của container
                borderLeft: "4px solid #28a745",
              }}
            >
              Đề trắc nghiệm
            </h3>
          </div>

          {/* Danh sách quiz */}
          {quizzes.length === 0 ? (
            <p className="ms-2">Chưa có quiz nào cho môn học này.</p>
          ) : (
            <div className="row gx-3"> {/* gx-3: khoảng cách giữa các cột */}
              {quizzes.map((quiz) => (
                <div className="col-md-3 mb-4" key={quiz._id}>
                  <QuizCard 
                    quiz={quiz} 
                    onClick={() => navigate("/test", { state: { quizId: quiz._id } })} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };
  
  export default Topic;
