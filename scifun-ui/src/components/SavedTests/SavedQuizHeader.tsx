import React from "react";
import { Bookmark, Search, Filter } from "lucide-react";

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
  return (
    <div className="bg-white shadow-sm border-bottom">
      <div className="container" style={{ maxWidth: '1140px' }}>
        <div className="px-3 py-4">
          {/* Title */}
          <div className="d-flex align-items-center gap-3 mb-4">
          <Bookmark 
            size={32} 
            className="text-warning" 
            style={{ cursor: "pointer" }} 
          />
            <h1 className="fs-2 fw-bold text-dark mb-0">
              Bài Kiểm Tra Đã Lưu
            </h1>
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
                  <option value="Toán học">Toán học</option>
                  <option value="Ngôn ngữ">Ngôn ngữ</option>
                  <option value="Khoa học">Khoa học</option>
                  <option value="Lịch sử">Lịch sử</option>
                  <option value="Văn học">Văn học</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}