import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LessonCard from "./LessonCard";
import { getLessonListApi } from "../../util/api";
import { Subject, GetSubjectResponse } from "../../types/subject";

const Lessons: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      // Giới hạn 4 để hiển thị mẫu, còn trang "Xem tất cả" sẽ load đầy đủ
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
            color: "#000000", // chữ màu đen
            paddingBottom: "5px",
          }}
        >
          Danh sách môn học
          {/* gạch chân màu xanh lá */}
          <span
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "50px",
              height: "4px",
              backgroundColor: "#28a745", // xanh lá
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
              onDetail={() => alert(`Xem chi tiết: ${subject.name}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lessons;
