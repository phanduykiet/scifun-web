import React, { useState } from "react";
import LessonStatsCard, { Lesson } from "../components/common/LessonStatsCard";
import ProgressBar from "../components/common/ProgressBar";
import Header from "../components/layout/Header";
import "bootstrap/dist/css/bootstrap.min.css";

const StatisticsPage: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<
    "physics" | "chemistry" | "biology"
  >("physics");

  const subjects = [
    { id: "physics" as const, label: "Vật lý" },
    { id: "chemistry" as const, label: "Hóa học" },
    { id: "biology" as const, label: "Sinh học" },
  ];

  const lessonsData: Lesson[] = [
    {
      id: "1",
      title: "Bài 1: Dao động cơ học",
      completed: 2,
      total: 2,
      subLessons: [
        {
          id: "1-1",
          name: "Khái niệm cơ bản",
          score: 10,
          completedAt: "15:30 20/3/2024",
        },
        {
          id: "1-2",
          name: "Công thức dao động",
          score: 9,
          completedAt: "17:00 21/3/2024",
        },
      ],
    },
    {
      id: "2",
      title: "Bài 2: Sóng cơ",
      completed: 1,
      total: 3,
      subLessons: [],
    },
  ];

  return (
    <div className="bg-light min-vh-100">
      <Header />

      <header
        className="bg-white border-bottom p-3 sticky-top shadow-sm"
        style={{ marginTop: "70px" }}
      >
        <h4 className="fw-semibold mb-3 text-center">Thống kê học tập</h4>

        <div className="d-flex gap-2 justify-content-center">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              className={`btn rounded-pill px-4 fw-medium ${
                activeSubject === subject.id
                  ? "btn-success text-white shadow-sm"
                  : "btn-outline-success"
              }`}
              onClick={() => setActiveSubject(subject.id)}
            >
              {subject.label}
            </button>
          ))}
        </div>
      </header>

      <main className="container py-4">
        <div className="text-center mb-3">
          <h6 className="text-secondary fw-semibold">Tiến độ tổng quan</h6>
        </div>
        <ProgressBar percentage={80} />

        {lessonsData.map((lesson, index) => (
          <LessonStatsCard
            key={lesson.id}
            lesson={lesson}
            defaultExpanded={index === 0}
          />
        ))}
      </main>
    </div>
  );
};

export default StatisticsPage;
