import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import QuizCard from "./QuizCard";
import { getTrendingQuizApi, getQuizsByTopicApi } from "../../util/api";
import { Quiz } from "../../types/quiz";

const TrendingQuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const quizzesPerView = 4;

  const fetchAllQuizzes = async () => {
    setLoading(true);
    try {
      // 1️⃣ Lấy danh sách trending quiz
      const res = await getTrendingQuizApi();
      const trendingData = res.data?.data || [];
      
      // 2️⃣ Nhóm quiz theo topicId để giảm số lần gọi API
      const quizzesByTopic = trendingData.reduce((acc: any, quiz: any) => {
        const topicId = quiz.topic._id;
        if (!acc[topicId]) acc[topicId] = [];
        acc[topicId].push(quiz);
        return acc;
      }, {});

      // 3️⃣ Fetch chi tiết từng topic để lấy accessTier
      const enrichedQuizzes: Quiz[] = [];
      
      for (const topicId of Object.keys(quizzesByTopic)) {
        try {
          const topicRes = await getQuizsByTopicApi(topicId);
          const topicQuizzes = topicRes.data?.quizzes || [];
          
          // Map accessTier từ API topic về quiz trending
          for (const trendingQuiz of quizzesByTopic[topicId]) {
            const fullQuizData = topicQuizzes.find(
              (q: any) => q._id === trendingQuiz._id
            );
            
            enrichedQuizzes.push({
              ...trendingQuiz,
              accessTier: fullQuizData?.accessTier || "FREE",
              // Đảm bảo có đầy đủ thông tin subject
              topic: {
                ...trendingQuiz.topic,
                subject: fullQuizData?.topic?.subject || trendingQuiz.topic.subject
              }
            });
          }
        } catch (err) {
          console.error(`❌ Lỗi lấy topic ${topicId}:`, err);
          // Fallback: Giữ nguyên quiz nhưng set FREE
          quizzesByTopic[topicId].forEach((quiz: any) => {
            enrichedQuizzes.push({ ...quiz, accessTier: "FREE" });
          });
        }
      }
      
      // 4️⃣ Sắp xếp lại theo thứ tự ban đầu (dựa vào score/trending)
      const sortedQuizzes = trendingData.map((tq: any) => 
        enrichedQuizzes.find(eq => eq._id === tq._id) || { ...tq, accessTier: "FREE" }
      );

      console.log("✅ Quizzes enriched:", sortedQuizzes);
      setQuizzes(sortedQuizzes);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách quiz:", err);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchAllQuizzes();
    window.scrollTo(0, 0);
  }, []);

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) =>
      Math.min(prev + 1, Math.max(0, quizzes.length - quizzesPerView))
    );

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2">Đang tải danh sách quiz...</p>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return <p className="mt-4 text-center">Hiện chưa có quiz nào.</p>;
  }

  return (
    <div className="container mt-4 position-relative">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h3
          className="fw-bold mb-0"
          style={{ paddingLeft: "10px", borderLeft: "4px solid #28a745" }}
        >
          Bài kiểm tra được quan tâm nhiều nhất:
        </h3>
      </div>
  
      {/* ✅ SỬA: Thêm padding-top và bỏ overflow-hidden */}
      <div className="position-relative" style={{ paddingTop: "20px" }}>
        <div
          className="d-flex"
          style={{
            gap: "1.5rem",
            transform: `translateX(-${currentIndex * (100 / quizzesPerView)}%)`,
            transition: "transform 0.3s ease-in-out",
            overflow: "visible", // ✅ THÊM: Cho phép nội dung tràn ra
          }}
        >
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              style={{ flex: `0 0 calc(${100 / quizzesPerView}% - 1rem)` }}
            >
              <QuizCard 
                quiz={quiz}
                isPro={quiz.accessTier === "PRO"}
                onClick={() => {
                  const subjectId = typeof quiz.topic.subject === 'string'
                    ? quiz.topic.subject
                    : quiz.topic.subject?._id || quiz.topic.subject;
                    
                  navigate("/test", { 
                    state: { 
                      subjectId, 
                      topicId: quiz.topic._id, 
                      quizId: quiz._id, 
                      duration: quiz.duration
                    } 
                  });
                }} 
              />
            </div>
          ))}
        </div>
  
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="btn btn-success position-absolute top-50 start-0 translate-middle-y"
            style={{ width: 40, height: 40, borderRadius: "50%", zIndex: 10 }} // ✅ THÊM zIndex
          >
            <ChevronLeft size={20} />
          </button>
        )}
  
        {currentIndex < quizzes.length - quizzesPerView && (
          <button
            onClick={handleNext}
            className="btn btn-success position-absolute top-50 end-0 translate-middle-y"
            style={{ width: 40, height: 40, borderRadius: "50%", zIndex: 10 }} // ✅ THÊM zIndex
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TrendingQuizList;