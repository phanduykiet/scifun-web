import React from "react";
import Header from "../components/layout/Header";
import Lessons from "../components/layout/Lessons";
import TopicList from "../components/layout/TopicList";
import TrendingQuizList from "../components/layout/TrendingQuizList";
import Testimonials from "../components/socket/Testimonials";
import Footer from "../components/layout/Footer";

const Home: React.FC = () => {
  const heroImage =
    "https://previews.123rf.com/images/wavebreakmediamicro/wavebreakmediamicro1708/wavebreakmediamicro170804443/83312177-kids-as-business-executives-interacting-while-meeting-in-conference-room.jpg";

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <div
        style={{
          width: "100%",
          height: "80vh",
          position: "relative",
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            textAlign: "center",
            padding: "0 20px",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Chào mừng đến với SciFun
          </h1>
          <p style={{ fontSize: "1.5rem", maxWidth: "700px" }}>
            Khám phá các bài học, quiz, và trải nghiệm học tập trực tuyến thú vị!
          </p>
        </div>
      </div>

      {/* Features Section */}
      <section style={{ padding: "80px 0", backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#2c3e50" }}>
              Tại sao chọn SciFun?
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#6c757d", maxWidth: "600px", margin: "0 auto" }}>
              Nền tảng học tập hiện đại với nhiều tính năng ưu việt
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4" style={{ borderRadius: "15px" }}>
                <div style={{ fontSize: "3rem", color: "#007bff", marginBottom: "1rem" }}>📚</div>
                <h4 style={{ fontWeight: "600", marginBottom: "1rem" }}>Bài học đa dạng</h4>
                <p style={{ color: "#6c757d" }}>
                  Hàng trăm bài học được thiết kế bài bản, phù hợp với mọi độ tuổi và trình độ
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4" style={{ borderRadius: "15px" }}>
                <div style={{ fontSize: "3rem", color: "#28a745", marginBottom: "1rem" }}>🎯</div>
                <h4 style={{ fontWeight: "600", marginBottom: "1rem" }}>Quiz thú vị</h4>
                <p style={{ color: "#6c757d" }}>
                  Kiểm tra kiến thức qua các bài quiz tương tác, giúp củng cố và ghi nhớ lâu hơn
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4" style={{ borderRadius: "15px" }}>
                <div style={{ fontSize: "3rem", color: "#ffc107", marginBottom: "1rem" }}>🏆</div>
                <h4 style={{ fontWeight: "600", marginBottom: "1rem" }}>Theo dõi tiến độ</h4>
                <p style={{ color: "#6c757d" }}>
                  Hệ thống theo dõi tiến độ học tập chi tiết, giúp bạn luôn nắm rõ kết quả của mình
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lessons Section */}
      <div id="lessons-section">
        <Lessons />
      </div>

      {/* Topics Section */}
      <div id="topics-section">
        <TopicList />
      </div>
      {/* Quizzes Section */}
      <div id="quizzes-section">
        <TrendingQuizList />
      </div>

      {/* Statistics Section */}
      <section style={{ padding: "80px 0", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", marginTop: "24px" }}>
        <div className="container">
          <div className="row text-center text-white">
            <div className="col-md-3 col-6 mb-4 mb-md-0">
              <div style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "0.5rem" }}>1000+</div>
              <div style={{ fontSize: "1.1rem", opacity: 0.9 }}>Học viên</div>
            </div>
            <div className="col-md-3 col-6 mb-4 mb-md-0">
              <div style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "0.5rem" }}>500+</div>
              <div style={{ fontSize: "1.1rem", opacity: 0.9 }}>Bài học</div>
            </div>
            <div className="col-md-3 col-6">
              <div style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "0.5rem" }}>50+</div>
              <div style={{ fontSize: "1.1rem", opacity: 0.9 }}>Chủ đề</div>
            </div>
            <div className="col-md-3 col-6">
              <div style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "0.5rem" }}>98%</div>
              <div style={{ fontSize: "1.1rem", opacity: 0.9 }}>Hài lòng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section style={{ 
        padding: "80px 0", 
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        color: "white"
      }}>
        <div className="container text-center">
          <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
            Sẵn sàng bắt đầu hành trình học tập?
          </h2>
          <p style={{ fontSize: "1.2rem", marginBottom: "2rem", opacity: 0.9 }}>
            Tham gia cùng hàng ngàn học viên đang học tập trên SciFun
          </p>
          <button 
            className="btn btn-light btn-lg px-5 py-3" 
            style={{ 
              borderRadius: "50px", 
              fontWeight: "600",
              fontSize: "1.1rem",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
            }}
          >
            Bắt đầu ngay
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;