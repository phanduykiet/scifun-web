import React, { useEffect, useState } from "react";
import SavedTestHeader from "../components/SavedTests/SavedQuizHeader";
import SavedTestItem from "../components/SavedTests/SavedQuizItem";
import { Heart } from "lucide-react";
import { getSavedQuizzesApi } from "../util/api";
import axios from "axios";

export default function SavedQuizsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [savedTests, setSavedTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy userId từ localStorage
  const userId = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user._id || null;
    } catch {
      return null;
    }
  })();

  // ✅ Lấy danh sách quiz đã lưu khi trang load
  useEffect(() => {
    const fetchSavedQuizzes = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getSavedQuizzesApi(userId);
        console.log("quiz list: ", data.data);
        
        // map sang định dạng để hiển thị
        const quizzes = data?.data?.data?.map((item: any) => ({
          id: item.quiz?._id || item.quizId,
          name: item.quiz?.title || "Không có tiêu đề",
          description: item.quiz?.description || "",
          questions: item.quiz?.questionCount || 0,
          duration: item.quiz?.durationMinutes || 0,
          savedDate: new Date(item.createdAt).toLocaleDateString("vi-VN"),
          category: item.quiz?.topic?.name || item.topicId?.name || "Khác",
        }));
        
        setSavedTests(quizzes || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách quiz đã lưu:", err);
        setSavedTests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedQuizzes();
  }, [userId]);

  // Lọc theo search + filter
  const filteredTests = savedTests.filter((test) => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || test.category === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
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
                <SavedTestItem key={test.id} test={test} />
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <Heart
                size={64}
                className="text-secondary mx-auto mb-3"
                style={{ opacity: 0.3 }}
              />
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
    </div>
  );
}