import React, { useEffect, useState } from "react";
import LessonStatsCard, { Lesson } from "../components/common/LessonStatsCard";
import ProgressBar from "../components/common/ProgressBar";
import Header from "../components/layout/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { getprogressApi, getLessonListApi } from "../util/api";

// --- MAIN COMPONENT ---
const StatisticsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<{ id: string; label: string }[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>("");
  const [lessonsData, setLessonsData] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<number>(0);

  // 🟢 Lấy danh sách môn học khi vào trang
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await getLessonListApi("1", "10", "");
        const subjectList = res.data.subjects.map((s: any) => ({
          id: s._id,
          label: s.name,
        }));
        setSubjects(subjectList);

        // Chọn môn đầu tiên mặc định
        if (subjectList.length > 0) {
          setActiveSubject(subjectList[0].id);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách môn học:", error);
      }
    };

    fetchSubjects();
  }, []);

  // 🟢 Khi đổi môn học → gọi API tiến trình
  useEffect(() => {
    const fetchProgress = async () => {
      if (!activeSubject) return;

      try {
        const res = await getprogressApi(activeSubject);
        console.log("Tiến trình:", res);

        // ✅ Lấy đúng phần data từ API bạn mô tả
        const progressData = res.data;

        setProgress(progressData?.progress || 0);

        // ✅ Nếu API có danh sách topic (bài học con)
        // thì map sang dạng Lesson cho LessonStatsCard
        if (Array.isArray(progressData?.topics)) {
          const lessons: Lesson[] = progressData.topics.map((t: any) => ({
            id: t.topicId,
            title: t.name || "Chủ đề chưa có tên",
            completed: t.completedQuizzes || 0,
            total: t.totalQuizzes || 0,
            subLessons: (t.quizzes || []).map((q: any) => ({
              id: q.quizId,
              name: q.name,
              score: q.score || 0,
              // ✅ Format lại thời gian ở đây
              completedAt: q.lastSubmissionAt
                ? new Date(q.lastSubmissionAt).toLocaleString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "",
            })),
          }));          
          setLessonsData(lessons);
        } else {
          setLessonsData([]);
        }
      } catch (error) {
        console.error("Lỗi lấy tiến trình:", error);
      }
    };

    fetchProgress();
  }, [activeSubject]);

  return (
    <div className="bg-light min-vh-100">
      <Header />

      <header
        className="bg-white border-bottom shadow-sm sticky-top"
        style={{ marginTop: "70px", zIndex: 900 }}
      >
        <div className="container py-3">
          <h4 className="fw-semibold mb-3 text-center">Thống kê học tập</h4>
          <div className="d-flex gap-2 justify-content-center flex-wrap">
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
        </div>
      </header>

      <main className="container py-4">
        <div className="text-center mb-4">
          <h6 className="text-secondary fw-semibold mb-2">
            Tiến độ tổng quan
          </h6>
          <ProgressBar percentage={progress} />
        </div>

        <div className="mx-auto" style={{ maxWidth: "1300px" }}>
          {lessonsData.length > 0 ? (
            lessonsData.map((lesson) => (
              <LessonStatsCard
                key={lesson.id}
                lesson={lesson}
                defaultExpanded={false}
              />
            ))
          ) : (
            <p className="text-center text-muted">Chưa có dữ liệu học tập.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default StatisticsPage;
