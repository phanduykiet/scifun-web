import React from "react";
import Header from "../components/layout/Header";
import Lessons from "../components/layout/Lessons";
import TopicList from "../components/layout/TopicList";
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
      <section style={{ padding: "80px 0", backgroundColor: "#fff" }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#2c3e50" }}>
              Học viên nói gì về chúng tôi
            </h2>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "15px" }}>
                <div className="mb-3">
                  <span style={{ color: "#ffc107", fontSize: "1.5rem" }}>★★★★★</span>
                </div>
                <p style={{ color: "#6c757d", fontStyle: "italic", marginBottom: "1.5rem" }}>
                  "SciFun đã giúp con tôi yêu thích môn khoa học hơn. Các bài học rất sinh động và dễ hiểu!"
                </p>
                <div className="d-flex align-items-center">
                  <div style={{ 
                    width: "50px", 
                    height: "50px", 
                    borderRadius: "50%", 
                    backgroundColor: "#007bff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    marginRight: "15px"
                  }}>NH</div>
                  <div>
                    <div style={{ fontWeight: "600" }}>Nguyễn Hải</div>
                    <div style={{ color: "#6c757d", fontSize: "0.9rem" }}>Phụ huynh</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "15px" }}>
                <div className="mb-3">
                  <span style={{ color: "#ffc107", fontSize: "1.5rem" }}>★★★★★</span>
                </div>
                <p style={{ color: "#6c757d", fontStyle: "italic", marginBottom: "1.5rem" }}>
                  "Giao diện đẹp, dễ sử dụng. Các quiz rất hay và giúp em học tập hiệu quả hơn!"
                </p>
                <div className="d-flex align-items-center">
                  <div style={{ 
                    width: "50px", 
                    height: "50px", 
                    borderRadius: "50%", 
                    backgroundColor: "#28a745",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    marginRight: "15px"
                  }}>MA</div>
                  <div>
                    <div style={{ fontWeight: "600" }}>Minh Anh</div>
                    <div style={{ color: "#6c757d", fontSize: "0.9rem" }}>Học sinh lớp 8</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "15px" }}>
                <div className="mb-3">
                  <span style={{ color: "#ffc107", fontSize: "1.5rem" }}>★★★★★</span>
                </div>
                <p style={{ color: "#6c757d", fontStyle: "italic", marginBottom: "1.5rem" }}>
                  "Nền tảng tuyệt vời cho việc học tập! Tôi đã cải thiện đáng kể kiến thức của mình."
                </p>
                <div className="d-flex align-items-center">
                  <div style={{ 
                    width: "50px", 
                    height: "50px", 
                    borderRadius: "50%", 
                    backgroundColor: "#ffc107",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    marginRight: "15px"
                  }}>TH</div>
                  <div>
                    <div style={{ fontWeight: "600" }}>Trần Hưng</div>
                    <div style={{ color: "#6c757d", fontSize: "0.9rem" }}>Học sinh lớp 10</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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