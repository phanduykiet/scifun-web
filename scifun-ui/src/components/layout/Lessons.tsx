import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LessonCard from "./LessonCard";
import { getLessonListApi } from "../../util/api";
import { Subject, GetSubjectResponse } from "../../types/subject";

const Lessons: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // dùng navigate để chuyển trang

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const json: GetSubjectResponse = await getLessonListApi("1", "4", "");
      setSubjects(json.data.subjects ?? []);
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);
  // Trong Lessons.tsx
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-2">Đang tải danh sách môn học...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2
          className="mb-0 fw-bold position-relative"
          style={{
            color: "#000000",
            paddingBottom: "5px",
          }}
        >
          Danh sách môn học
          <span
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "50px",
              height: "4px",
              backgroundColor: "#28a745",
              borderRadius: "2px",
            }}
          ></span>
        </h2>
        <Link to="/all-lessons" className="text-decoration-none text-success fw-semibold">
          Xem tất cả →
        </Link>
      </div>

      <div className="row justify-content-center">
        {subjects.map((subject) => (
          <div
            className="col-md-3 mb-4 d-flex justify-content-center"
            key={subject.id}
          >
            <LessonCard
              title={subject.name}
              image={subject.image}
              onDetail={() => 
                navigate(`/subject/${subject.id}`, { state: subject }) // ✅ Truyền state
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lessons;
