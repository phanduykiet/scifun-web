import React, { useEffect, useState, useRef  } from "react";
import LessonCard from "./LessonCard";

interface Subject {
  _id: string;
  name: string;
  description: string;
  maxTopics: number;
  image: string;
}

interface ApiResponse {
  status: number;
  message: string;
  data: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    subjects: Subject[];
  };
}

const Lessons: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // ref cho danh sách
  const listRef = useRef<HTMLDivElement>(null);

  const fetchSubjects = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/subject/get-subjects?page=${page}&limit=4`
      );
      const json: ApiResponse = await res.json();
      setSubjects(json.data.subjects || []);
      setTotalPages(json.data.totalPages);
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects(page);
  }, [page]);

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
      <h2 className="mb-4 text-center">Danh sách môn học</h2>

      {/* Nút mũi tên trước & sau */}
      <div className="d-flex justify-content-between mb-3">
        <button
          type="button"
          className="btn btn-outline-success"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ← Trước
        </button>

        <button
          type="button"
          className="btn btn-outline-success"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Sau →
        </button>
      </div>

      {/* Danh sách bài học */}
      <div className="row justify-content-center">
        {subjects.map((subject) => (
          <div
            className="col-md-3 mb-4 d-flex justify-content-center"
            key={subject._id}
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
