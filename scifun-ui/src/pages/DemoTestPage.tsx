import React from "react";
import "../styles/TestPage.css";
import TestQuestion from "../components/layout/TestQuestion";

const DemoTestPage: React.FC = () => {
  const questions = [
    {
      content: "Thủ đô của Việt Nam là gì?",
      options: ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng"]
    },
    {
      content: "Ngôn ngữ lập trình phổ biến cho web là gì?",
      options: ["Python", "JavaScript", "C++", "Java"]
    },
    {
      content: "Mặt Trăng quay quanh hành tinh nào?",
      options: ["Trái Đất", "Sao Hỏa", "Sao Thủy", "Sao Kim"]
    }
  ];

  return (
    <div className="container">
      <h1>Demo Bài Kiểm Tra</h1>
      <div className="questions">
        {questions.map((q, idx) => (
          <TestQuestion
            key={idx}
            index={idx}
            content={q.content}
            options={q.options}
          />
        ))}
      </div>
    </div>
  );
};

export default DemoTestPage;
