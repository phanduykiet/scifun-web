import React, { useEffect, useState, useRef, useCallback } from "react";
import { getCommentsApi } from "../../util/api";
import { socket } from "../../util/socket";
import ReplyModal from "./ReplyModal";

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

interface AllCommentsModalProps {
  show: boolean;
  onClose: () => void;
}

const AllCommentsModal: React.FC<AllCommentsModalProps> = ({ show, onClose }) => {
  const [comments, setComments] = useState<Testimonial[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Testimonial | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Hàm lấy initials từ userName
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Hàm tạo màu ngẫu nhiên cho avatar
  const getRandomColor = (str: string) => {
    const colors = ['#6f42c1', '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8'];
    const index = str.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Hàm format thời gian
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Fetch comments với pagination
  const fetchComments = useCallback(async (pageNum: number) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const res = await getCommentsApi(pageNum, 10);
      const data = res.data as any;
      
      if (pageNum === 1) {
        setComments(data.items);
      } else {
        setComments(prev => [...prev, ...data.items]);
      }
      
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Lỗi khi lấy comments:", err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Reset và fetch khi mở modal
  useEffect(() => {
    if (show) {
      setComments([]);
      setPage(1);
      setHasMore(true);
      fetchComments(1);
    }
  }, [show]);

  // Intersection Observer cho lazy loading
  useEffect(() => {
    if (!show || !observerTarget.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchComments(nextPage);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [show, hasMore, loading, page, fetchComments]);

  // Lắng nghe comment mới từ socket
  useEffect(() => {
    if (!show) return;

    const handleNewComment = (data: Testimonial) => {
      // Nếu là comment gốc (không có parentId)
      if (!data.parentId) {
        setComments(prev => [data, ...prev]);
      } else {
        // Nếu là reply, chỉ cập nhật repliesCount của comment cha
        setComments(prev => prev.map(comment => 
          comment._id === data.parentId 
            ? { ...comment, repliesCount: comment.repliesCount + 1 }
            : comment
        ));
      }
    };

    socket.on("comment:new", handleNewComment);

    return () => {
      socket.off("comment:new", handleNewComment);
    };
  }, [show]);

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    
    // Gửi lên server qua socket
    socket.emit("comment:new", {
      content: newComment,
      parentId: null, // comment gốc không có parentId
    });

    // Reset input
    setNewComment("");
  };

  const handleOpenReply = (comment: Testimonial) => {
    setSelectedComment(comment);
    setShowReplyModal(true);
  };

  const handleCloseReply = () => {
    setShowReplyModal(false);
    setSelectedComment(null);
  };

  const handleClose = () => {
    setNewComment("");
    setComments([]);
    setPage(1);
    setHasMore(true);
    onClose();
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1040 }}
        onClick={handleClose}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-xl"
          style={{ maxWidth: "900px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tất cả đánh giá</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>
            
            <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              {/* Form thêm comment mới */}
              <div className="mb-4 p-3 bg-light rounded">
                <h6 className="mb-3">Thêm đánh giá của bạn 💬</h6>
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Nhập cảm nghĩ của bạn..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSendComment();
                    }}
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={handleSendComment}
                    disabled={!newComment.trim()}
                  >
                    Gửi
                  </button>
                </div>
              </div>

              {/* Danh sách comments */}
              <div>
                {comments.length === 0 && !loading ? (
                  <div className="text-center text-muted py-5">
                    <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                  </div>
                ) : (
                  <div>
                    {comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="d-flex align-items-start mb-3 pb-3 border-bottom"
                      >
                        {comment.userAvatar ? (
                          <img
                            src={comment.userAvatar}
                            alt={comment.userName}
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              marginRight: "12px",
                              flexShrink: 0,
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
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: getRandomColor(comment.userName),
                            display: comment.userAvatar ? "none" : "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                            marginRight: "12px",
                            flexShrink: 0,
                            fontSize: "0.85rem",
                          }}
                        >
                          {getInitials(comment.userName)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <div>
                              <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                                {comment.userName}
                              </span>
                              <span style={{ color: "#6c757d", fontSize: "0.8rem", marginLeft: "8px" }}>
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <span style={{ color: "#ffc107", fontSize: "1rem" }}>
                              ★★★★★
                            </span>
                          </div>
                          <p style={{ marginTop: "6px", marginBottom: "8px", fontSize: "0.95rem" }}>
                            {comment.content}
                          </p>
                          <div className="d-flex gap-3 align-items-center">
                            <button
                              className="btn btn-link text-decoration-none p-0"
                              style={{ color: "#007bff", fontSize: "0.85rem" }}
                              onClick={() => handleOpenReply(comment)}
                            >
                              💬 Trả lời
                            </button>
                            {comment.repliesCount > 0 && (
                              <span style={{ color: "#6c757d", fontSize: "0.85rem" }}>
                                • {comment.repliesCount} phản hồi
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Loading indicator */}
                    {loading && (
                      <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted mt-2 mb-0">Đang tải...</p>
                      </div>
                    )}
                    
                    {/* Intersection observer target */}
                    {hasMore && !loading && (
                      <div ref={observerTarget} style={{ height: "20px" }}></div>
                    )}
                    
                    {/* No more data */}
                    {!hasMore && comments.length > 0 && (
                      <div className="text-center text-muted py-3">
                        <small>Đã hiển thị tất cả đánh giá</small>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Modal - zIndex cao hơn để hiển thị trên AllCommentsModal */}
      {showReplyModal && (
        <ReplyModal
          show={showReplyModal}
          testimonial={selectedComment}
          onClose={handleCloseReply}
        />
      )}
    </>
  );
};

export default AllCommentsModal;