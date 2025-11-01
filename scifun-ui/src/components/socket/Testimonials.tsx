import React, { useEffect, useState } from "react";
import { socket } from "../../util/socket";
import { getCommentsApi } from "../../util/api";
import AllCommentsModal from "./AllCommentsModal";

interface Testimonial {
  _id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  parentId: string | null;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
}

const Testimonials: React.FC = () => {
  const [topTestimonials, setTopTestimonials] = useState<Testimonial[]>([]);
  const [showAllCommentsModal, setShowAllCommentsModal] = useState(false);
  
  useEffect(() => {
    const fetchTopTestimonials = async () => {
      try {
        const res = await getCommentsApi(1, 3); // Chỉ lấy 3 đánh giá đầu tiên
        const data = res.data as any;
        setTopTestimonials(data.items);
      } catch (err) {
        console.error("Lỗi khi lấy testimonials:", err);
      }
    };
  
    fetchTopTestimonials();
  }, []);  
  
  // Lắng nghe testimonial mới từ socket để cập nhật real-time
  useEffect(() => {
    socket.on("comment:new", (data: Testimonial) => {
      setTopTestimonials((prev) => {
        const updated = [data, ...prev];
        return updated.slice(0, 3); // Giữ lại 3 cái mới nhất
      });
    });

    return () => {
      socket.off("comment:new");
    };
  }, []);

  // Hàm format thời gian
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Hàm lấy initials từ userName
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Hàm tạo màu ngẫu nhiên cho avatar nếu không có ảnh
  const getRandomColor = (str: string) => {
    const colors = ['#6f42c1', '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8'];
    const index = str.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <section style={{ padding: "80px 0", backgroundColor: "#fff" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#2c3e50",
            }}
          >
            Học viên nói gì về chúng tôi
          </h2>
          <p style={{ color: "#6c757d", fontSize: "1.1rem", marginTop: "15px" }}>
            Những đánh giá từ học viên của chúng tôi
          </p>
        </div>

        <div className="row g-4">
          {topTestimonials.map((t) => (
            <div key={t._id} className="col-md-4">
              <div
                className="card border-0 shadow-sm p-4"
                style={{ borderRadius: "15px", height: "100%" }}
              >
                <div className="d-flex align-items-center mb-3">
                  {t.userAvatar ? (
                    <img
                      src={t.userAvatar}
                      alt={t.userName}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "15px",
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: getRandomColor(t.userName),
                      display: t.userAvatar ? "none" : "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      marginRight: "15px",
                    }}
                  >
                    {getInitials(t.userName)}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600" }}>{t.userName}</div>
                    <div style={{ color: "#6c757d", fontSize: "0.85rem" }}>
                      {formatDate(t.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <span style={{ color: "#ffc107", fontSize: "1.5rem" }}>
                    ★★★★★
                  </span>
                </div>
                <p
                  style={{
                    color: "#6c757d",
                    fontStyle: "italic",
                    marginBottom: 0,
                    flex: 1,
                  }}
                >
                  "{t.content}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Nút xem tất cả */}
        <div className="text-center mt-4">
          <button
            className="btn btn-link text-decoration-none p-0"
            onClick={() => setShowAllCommentsModal(true)}
            style={{
              color: "#007bff",
              fontSize: "1rem",
              fontWeight: "500",
            }}
          >
            Xem tất cả đánh giá →
          </button>
        </div>
      </div>

      {/* All Comments Modal */}
      <AllCommentsModal
        show={showAllCommentsModal}
        onClose={() => setShowAllCommentsModal(false)}
      />
    </section>
  );
};

export default Testimonials;