// src/pages/AllLessons.tsx
import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import LessonCard from "../components/layout/LessonCard";
import { getLessonListApi } from "../util/api";
import { Subject, GetSubjectResponse } from "../types/subject";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 8; // số bài học mỗi trang, bạn có thể chỉnh

const AllLessons: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();

  const fetchSubjects = async (page: number) => {
    setLoading(true);
    try {
      const json: GetSubjectResponse = await getLessonListApi(
        String(page),
        String(PAGE_SIZE),
        ""
      );
      setSubjects(json.data.subjects ?? []);
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
    <>
      <Header />
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-success" style={{ color: "black" }}>
          Tất cả môn học
        </h2>

        <div className="row justify-content-center">
          {subjects.map((subject) => (
            <div
              className="col-md-3 mb-4 d-flex justify-content-center"
              key={subject._id}
            >
              <LessonCard
              title={subject.name}
              image={subject.image}
              onDetail={() => 
                navigate(`/subject/${subject._id}`, { state: subject }) // ✅ Truyền state
              }
            />
            </div>
          ))}
        </div>

        {/* Nút phân trang */}
        <div className="d-flex justify-content-center gap-2 my-4 align-items-center">
            <button
                className="btn btn-outline-success"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
            >
                ← Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                key={p}
                className={`btn ${p === page ? "btn-success text-white" : "btn-outline-success"}`}
                onClick={() => setPage(p)}
                >
                {p}
                </button>
            ))}

            <button
                className="btn btn-outline-success"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
            >
                Sau →
            </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllLessons;
