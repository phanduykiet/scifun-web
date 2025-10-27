import React, { useEffect, useState } from "react";
import { Bookmark, Search, Filter } from "lucide-react";
import { getTopicsBySubjectApi } from "../../util/api"; 

interface SavedQuizHeaderProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterType: string;
  setFilterType: (v: string) => void;
}

export default function SavedQuizHeader({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
}: SavedQuizHeaderProps) {
  const [subjects, setSubjects] = useState<any[]>([]); // 🔹 danh sách môn học duy nhất

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        // 🔹 Lấy tất cả topic mà không cần subjectId
        const res = await getTopicsBySubjectApi(undefined, 1, 100);
        const topics = res.data?.topics || [];

        // 🔹 Lấy danh sách môn học duy nhất
        const uniqueSubjects = Array.from(
          new Map(topics.map((t: any) => [t.subject._id, t.subject])).values()
        );

        setSubjects(uniqueSubjects);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách môn học:", err);
      }
    };

    fetchSubjects();
  }, []); // chỉ chạy 1 lần khi mount

  return (
    <div className="bg-white shadow-sm border-bottom">
      <div className="container" style={{ maxWidth: '1140px' }}>
        <div className="px-3 py-4">
          {/* Title */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <Bookmark size={32} className="text-warning" style={{ cursor: "pointer" }} />
            <h1 className="fs-2 fw-bold text-dark mb-0">Bài Kiểm Tra Đã Lưu</h1>
          </div>

          {/* Search and Filter */}
          <div className="row g-3">
            {/* Search Input */}
            <div className="col-12 col-sm-8">
              <div className="position-relative">
                <Search 
                  size={20} 
                  className="position-absolute text-secondary" 
                  style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài kiểm tra..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control ps-5"
                  style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
                />
              </div>
            </div>

            {/* Filter Select */}
            <div className="col-12 col-sm-4">
              <div className="d-flex align-items-center gap-2">
                <Filter size={20} className="text-secondary" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="form-select"
                  style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
                >
                  <option value="all">Tất cả</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
