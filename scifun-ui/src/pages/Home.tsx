import React, { useEffect } from "react";
import Header from "../components/layout/Header";
import Lessons from "../components/layout/Lessons";
import Footer from "../components/layout/Footer";

const Home: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const heroImage =
    "https://img.lovepik.com/photo/60225/6908.jpg_wh860.jpg";

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
        {/* Overlay mờ */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)", // overlay đen mờ
          }}
        />

        {/* Text nổi bật */}
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
          <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}>
            Chào mừng đến với SciFun
          </h1>
          <p style={{ fontSize: "1.5rem", maxWidth: "700px" }}>
            Khám phá các bài học, quiz, và trải nghiệm học tập trực tuyến thú vị!
          </p>
        </div>
      </div>

      {/* Lessons Section */}
      <div id="lessons-section">
        <Lessons />
      </div>

      <Footer />
    </>
  );
};

export default Home;
