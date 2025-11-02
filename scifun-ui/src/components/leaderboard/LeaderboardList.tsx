import React, { useEffect, useState } from "react";

interface Student {
  rank: number;
  name: string;
  score: number;
  avatar: string;
  isPlaceholder?: boolean;
  userId?: string;
  isCurrentUser?: boolean;
}

interface Props {
  students: Student[];
  currentUserId?: string;
}

// Component hiển thị rank của user hiện tại
const MyRankCard: React.FC<{ student: Student }> = ({ student }) => {
  return (
    <div className="my-4">
      <div className="text-center mb-2">
        <h5 className="text-primary fw-bold">📍 Vị trí của bạn</h5>
      </div>
      <div
        className="list-group-item d-flex align-items-center justify-content-between shadow-lg rounded"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "3px solid #ffd700",
          animation: "pulseGlow 2s ease-in-out infinite",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <span 
            className="badge" 
            style={{ 
              fontSize: "1rem", 
              padding: "8px 14px",
              minWidth: "50px",
              backgroundColor: "#ffd700",
              color: "#000",
              fontWeight: "bold",
              position: "static"
            }}
          >
            #{student.rank}
          </span>
          <img
            src={student.avatar}
            alt={student.name}
            className="rounded-circle"
            width={50}
            height={50}
            style={{ border: "3px solid #ffd700" }}
          />
          <div>
            <strong className="text-white d-block">{student.name}</strong>
            <small className="text-white opacity-75">Đó là bạn! 🎯</small>
          </div>
        </div>
        <span className="text-white fw-bold" style={{ fontSize: "1.1rem" }}>
          {student.score} điểm
        </span>
      </div>
    </div>
  );
};

const LeaderboardList: React.FC<Props> = ({ students, currentUserId }) => {
  const [myRank, setMyRank] = useState<Student | null>(null);
  const [displayStudents, setDisplayStudents] = useState<Student[]>(students);

  useEffect(() => {
    // Lấy userId từ localStorage nếu không truyền vào
    const userId = currentUserId || localStorage.getItem("user_id");
    
    if (!userId) {
      setDisplayStudents(students);
      setMyRank(null);
      return;
    }

    // Tìm vị trí của user hiện tại trong danh sách
    const currentUserRank = students.find(s => s.userId === userId);
    
    if (currentUserRank) {
      // Đánh dấu user hiện tại
      const updatedStudents = students.map(s => ({
        ...s,
        isCurrentUser: s.userId === userId
      }));
      
      // Kiểm tra xem user có trong top hiển thị không
      const isInTopList = currentUserRank.rank <= students.length;
      
      if (isInTopList) {
        // User trong top, chỉ highlight
        setDisplayStudents(updatedStudents);
        setMyRank(null);
      } else {
        // User không trong top, hiển thị riêng
        setDisplayStudents(students);
        setMyRank(currentUserRank);
      }
    } else {
      setDisplayStudents(students);
      setMyRank(null);
    }
  }, [students, currentUserId]);

  return (
    <div className="w-75 mx-auto">
      {/* Hiển thị rank của user nếu không trong top */}
      {myRank && <MyRankCard student={myRank} />}

      {/* Divider nếu có myRank */}
      {myRank && (
        <div className="text-center my-3">
          <span className="text-muted">━━━━━ Top Rankings ━━━━━</span>
        </div>
      )}

      {/* Danh sách top rankings */}
      <div className="list-group">
        {displayStudents.map((s) => (
          <div
            key={s.rank}
            className={`list-group-item d-flex align-items-center justify-content-between shadow-sm mb-2 rounded ${
              s.isPlaceholder ? "placeholder-item" : ""
            } ${s.isCurrentUser ? "current-user-item" : ""}`}
            style={s.isCurrentUser ? {
              background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)",
              border: "2px solid #00acc1",
              transform: "scale(1.02)",
              transition: "all 0.3s ease",
            } : {}}
          >
            <div className="d-flex align-items-center gap-3">
              <span 
                className="badge" 
                style={{ 
                  fontSize: "0.9rem", 
                  padding: "6px 12px",
                  minWidth: "45px",
                  backgroundColor: s.isCurrentUser ? "#00acc1" : "#0d6efd",
                  color: "white",
                  position: "static"
                }}
              >
                #{s.rank}
              </span>
              <img
                src={s.avatar}
                alt={s.name}
                className={`rounded-circle ${s.isPlaceholder ? "opacity-50" : ""}`}
                width={45}
                height={45}
                style={{ 
                  filter: s.isPlaceholder ? "grayscale(100%)" : "none",
                  border: s.isCurrentUser ? "2px solid #00acc1" : "none",
                }}
              />
              <div>
                <strong className={s.isPlaceholder ? "text-muted fst-italic" : ""}>
                  {s.name}
                </strong>
                {s.isCurrentUser && (
                  <span className="badge bg-info ms-2" style={{ fontSize: "0.7rem" }}>
                    You
                  </span>
                )}
              </div>
            </div>

            <span className="fw-bold" style={{ 
              color: s.isCurrentUser ? "#00695c" : "#6c757d" 
            }}>
              {s.score} điểm
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
          }
        }

        .current-user-item:hover {
          transform: scale(1.03) !important;
          box-shadow: 0 8px 24px rgba(0, 172, 193, 0.3) !important;
        }

        .placeholder-item {
          opacity: 0.6;
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default LeaderboardList;