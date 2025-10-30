import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { getLessonListApi } from "../../util/api";
import { Subject } from "../../types/subject";

interface LeaderboardHeaderProps {
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  onRefresh: () => void;
}

const LeaderboardHeader: React.FC<LeaderboardHeaderProps> = ({
  selectedSubject,
  onSubjectChange,
  onRefresh,
}) => {
  const [subjects, setSubjects] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await getLessonListApi("1", "100", "");
        const list = res.data.subjects.map((s: any) => ({
          id: s._id,
          label: s.name,
        }));

        setSubjects(list);

        // ✅ Chọn môn đầu tiên nếu chưa chọn
        if (!selectedSubject && list.length > 0) {
          onSubjectChange(list[0].id);
        }
      } catch (err) {
        console.error("Lỗi lấy môn học:", err);
        setSubjects([]);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div className="text-center mb-4">
      <h5 className="fw-semibold mb-3">Bảng xếp hạng</h5>

      {/* ✅ Button chọn môn giống StatisticsPage */}
      <div className="d-flex gap-2 justify-content-center flex-wrap mb-3">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            className={`btn rounded-pill px-4 fw-medium ${
              selectedSubject === subject.id
                ? "btn-success text-white shadow-sm"
                : "btn-outline-success"
            }`}
            onClick={() => onSubjectChange(subject.id)}
          >
            {subject.label}
          </button>
        ))}
      </div>

      {/* ✅ nút refresh */}
      <Button variant="success" onClick={onRefresh}>
        🔄 Làm mới
      </Button>
    </div>
  );
};

export default LeaderboardHeader;
