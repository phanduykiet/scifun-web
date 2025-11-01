import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Quiz } from "../types/quiz";
import { Topic as TopicType } from "../types/subject";
import { getQuizsByTopicApi, getVideoLessonApi } from "../util/api";
import QuizCard from "../components/layout/QuizCard";
import Header from "../components/layout/Header";
import VideoCard from "../components/layout/VideoCard";
import VideoCarousel from "../components/layout/VideoCarousel";
import { FaBookOpen } from "react-icons/fa";

const Topic: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [topic, setTopic] = useState<TopicType | null>(null);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<{ _id: string; url: string; title?: string }[]>([]);
  const navigate = useNavigate();

  // Lấy video
  useEffect(() => {
    const fetchVideos = async () => {
      if (!topicId) return;
      try {
        const res = await getVideoLessonApi(topicId, 1, 10);
        setVideos(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch videos", err);
      }
    };
    fetchVideos();
  }, [topicId]);

  // Lấy quiz + thông tin topic
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!topicId) return;
      try {
        setLoading(true);
        const res = await getQuizsByTopicApi(topicId);
        const data = res.data;

        setQuizzes(data.quizzes || []);

        // ✅ Nếu API có trả về topic (ví dụ: data.topic hoặc từ data.quizzes[0].topic)
        const topicInfo = data.topic || data.quizzes?.[0]?.topic;
        if (topicInfo) setTopic(topicInfo);
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
      <div className="container mt-4" style={{ paddingTop: "60px" }}>
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

          {/* Danh sách Video với Carousel */}
          <VideoCarousel videos={videos} />
        </div>

        {/* Section Quiz */}
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

        {/* Danh sách quiz */}
        {quizzes.length === 0 ? (
          <p className="ms-2">Chưa có quiz nào cho môn học này.</p>
        ) : (
          <div className="row gx-3">
            {quizzes.map((quiz) => (
              <div className="col-md-3 mb-4" key={quiz._id}>
                <QuizCard 
                  quiz={quiz}
                  isPro={quiz.accessTier === "PRO"}
                  onClick={() => navigate("/test", { 
                    state: { 
                      subjectId: quiz.topic.subject._id, 
                      topicId: quiz.topic._id, 
                      quizId: quiz._id, 
                      duration: quiz.duration
                    } 
                  })} 
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