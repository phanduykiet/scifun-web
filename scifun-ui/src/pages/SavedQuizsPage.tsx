import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SavedTestHeader from "../components/SavedTests/SavedQuizHeader";
import SavedTestItem from "../components/SavedTests/SavedQuizItem";
import ConfirmModal from "../components/common/ConfirmModal";
import Toast from "../components/common/Toast";
import Header from "../components/layout/Header";
import { Heart } from "lucide-react";
import { getSavedQuizzesApi, delSavedQuizApi, getTopicsBySubjectApi } from "../util/api";

export default function SavedQuizsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [savedTests, setSavedTests] = useState<any[]>([]);
  const [filteredTests, setFilteredTests] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Modal & Toast ---
  const [showConfirm, setShowConfirm] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [quizToStart, setQuizToStart] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const navigate = useNavigate();

  const userId = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user._id || null;
    } catch {
      return null;
    }
  })();

  // --- 1️⃣ Lấy danh sách topic (để biết topic thuộc môn nào) ---
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await getTopicsBySubjectApi(undefined, 1, 100);
        const data = res.data?.topics || res.data?.data?.topics || [];
        setTopics(data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách chủ đề:", err);
      }
    };
    fetchTopics();
  }, []);

  // --- 2️⃣ Lấy danh sách quiz đã lưu ---
  useEffect(() => {
    const fetchSavedQuizzes = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getSavedQuizzesApi(userId);
        const quizzes = data?.data?.data?.map((item: any) => ({
          id: item.quiz._id || item.quizId,
          name: item.quiz.title || "Không có tiêu đề",
          description: item.quiz.description || "",
          questions: item.quiz.questionCount || 0,
          duration: item.quiz.duration || 0,
          savedDate: new Date(item.createdAt).toLocaleDateString("vi-VN"),
          category: item.quiz.topic?.name || "Khác",
          topicId: item.quiz.topic?._id,
        }));
        setSavedTests(quizzes || []);
        setFilteredTests(quizzes || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách quiz đã lưu:", err);
        setSavedTests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedQuizzes();
  }, [userId]);

  // --- 3️⃣ Lọc danh sách khi chọn subject ---
  useEffect(() => {
    let filtered = savedTests;

    // Lọc theo subject
    if (filterType !== "all") {
      // Lấy danh sách topicId thuộc subject được chọn
      const topicIds = topics
        .filter((t: any) => t.subject?._id === filterType)
        .map((t: any) => t._id);

      filtered = filtered.filter((q) => topicIds.includes(q.topicId));
    }

    // Lọc theo từ khóa tìm kiếm gần đúng
    if (searchTerm.trim()) {
      const normalizeText = (str: string) =>
        str
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

      filtered = filtered.filter((test) =>
        normalizeText(test.name).includes(normalizeText(searchTerm))
      );
    }
    setFilteredTests(filtered);
  }, [filterType, searchTerm, savedTests, topics]);

  // --- Xử lý xóa ---
  const handleDeleteClick = (quizId: string) => {
    setQuizToDelete(quizId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!quizToDelete || !userId) return;
    try {
      await delSavedQuizApi(quizToDelete, userId);
      setSavedTests((prev) => prev.filter((t) => t.id !== quizToDelete));
      setToast({ message: "Đã xóa bài kiểm tra khỏi danh sách lưu.", type: "success" });
    } catch (err) {
      console.error("Lỗi khi xóa quiz:", err);
      setToast({ message: "Xóa thất bại, vui lòng thử lại.", type: "error" });
    } finally {
      setShowConfirm(false);
      setQuizToDelete(null);
    }
  };

  // --- Xử lý bắt đầu ---
  const handleStartClick = (testId: string) => {
    setQuizToStart(testId);
    setShowStartConfirm(true);
  };

  const confirmStart = () => {
    if (!quizToStart) return;
    const quiz = savedTests.find((q) => q.id === quizToStart);
    if (!quiz) return;

    setShowStartConfirm(false);
    navigate("/test", {
      state: {
        topicId: quiz.topicId,
        quizId: quiz.id,
        duration: quiz.duration,
      },
    });
  };

  return (
    <div>
      <Header />
      <div style={{ marginTop: "70px", minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        {/* 🔹 Header có filter theo subject */}
        <SavedTestHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
        />

        <div className="container py-4" style={{ maxWidth: "1140px" }}>
          <p className="text-secondary mb-3">
            {loading ? "Đang tải..." : `${filteredTests.length} bài kiểm tra`}
          </p>

          <div className="bg-white rounded shadow-sm border">
            {loading ? (
              <div className="text-center py-5">Đang tải dữ liệu...</div>
            ) : filteredTests.length > 0 ? (
              <div>
                {filteredTests.map((test) => (
                  <SavedTestItem
                    key={test.id}
                    test={test}
                    onDelete={handleDeleteClick}
                    onStart={handleStartClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <Heart size={64} className="text-secondary mx-auto mb-3" style={{ opacity: 0.3 }} />
                <p className="text-secondary fs-5 mb-2">Không tìm thấy bài kiểm tra nào</p>
                <p className="text-muted small">
                  {savedTests.length === 0
                    ? "Bạn chưa lưu bài kiểm tra nào"
                    : "Thử tìm kiếm với từ khóa khác"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal xác nhận xóa */}
        <ConfirmModal
          show={showConfirm}
          title="Xóa bài kiểm tra"
          message="Bạn có chắc chắn muốn xóa bài kiểm tra này khỏi danh sách lưu không?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirm(false)}
          confirmText="Xóa"
          cancelText="Hủy"
        />

        {/* Modal xác nhận bắt đầu */}
        <ConfirmModal
          show={showStartConfirm}
          title="Bắt đầu bài kiểm tra"
          message="Bạn có chắc chắn muốn bắt đầu làm bài kiểm tra này không?"
          onConfirm={confirmStart}
          onCancel={() => setShowStartConfirm(false)}
          confirmText="Bắt đầu"
          cancelText="Hủy"
        />

        {/* Toast thông báo */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
            duration={2500}
          />
        )}
      </div>
    </div>
  );
}
