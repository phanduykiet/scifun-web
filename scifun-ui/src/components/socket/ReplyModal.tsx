import React, { useEffect, useState, useRef, useCallback } from "react";
import { getReplyCommentsApi } from "../../util/api";
import { socket } from "../../util/socket";

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

interface ReplyModalProps {
  show: boolean;
  testimonial: Testimonial | null;
  onClose: () => void;
}

const ReplyModal: React.FC<ReplyModalProps> = ({ show, testimonial, onClose }) => {
  const [replyMessage, setReplyMessage] = useState("");
  const [replies, setReplies] = useState<Testimonial[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
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

  // Fetch replies với pagination
  const fetchReplies = useCallback(async (pageNum: number) => {
    if (!testimonial) return;
    
    setLoading(true);
    try {
      const res = await getReplyCommentsApi(testimonial._id, pageNum, 10);
      const data = res.data as any;
      
      if (pageNum === 1) {
        setReplies(data.items);
      } else {
        setReplies(prev => [...prev, ...data.items]);
      }
      
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Lỗi khi lấy replies:", err);
    } finally {
      setLoading(false);
    }
  }, [testimonial]);

  // Reset và fetch khi mở modal
  useEffect(() => {
    if (show && testimonial) {
      setReplies([]);
      setPage(1);
      setHasMore(true);
      fetchReplies(1);
    }
  }, [show, testimonial]);

  // Intersection Observer cho lazy loading
  useEffect(() => {
    if (!show || !observerTarget.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchReplies(nextPage);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [show, hasMore, loading, page, fetchReplies]);

  // Lắng nghe reply mới từ socket - FIXED
  useEffect(() => {
    if (!show || !testimonial) return;

    const handleNewReply = (data: any) => {
      console.log("Received reply:", data); // Debug log
      console.log("Current testimonial ID:", testimonial._id); // Debug log
      
      // Kiểm tra nếu reply này thuộc về comment hiện tại
      if (data.parentId === testimonial._id) {
        console.log("Adding reply to list"); // Debug log
        
        // Chuẩn hóa data từ socket về đúng format Testimonial
        const normalizedReply: Testimonial = {
          _id: data.commentId || data._id,
          userId: data.userId || "",
          userName: data.fromUserName || data.userName || "Anonymous",
          userAvatar: data.userAvatar || "",
          content: data.content,
          parentId: data.parentId,
          repliesCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setReplies(prev => {
          // Xóa reply tạm thời (nếu có) và thêm reply thật từ server
          const filtered = prev.filter(r => !r._id.startsWith('temp-'));
          
          // Kiểm tra xem reply từ server đã tồn tại chưa
          const exists = filtered.some(r => r._id === normalizedReply._id);
          if (exists) return prev;
          
          return [normalizedReply, ...filtered];
        });
      }
    };

    // Lắng nghe cả 2 events để đảm bảo nhận được reply
    socket.on("comment:new", handleNewReply);
    socket.on("comment:reply", handleNewReply);

    return () => {
      socket.off("comment:new", handleNewReply);
      socket.off("comment:reply", handleNewReply);
    };
  }, [show, testimonial]);

  const handleSendReply = () => {
    if (!replyMessage.trim() || !testimonial) return;
    
    // Tạo reply tạm thời để hiển thị ngay
    const tempReply: Testimonial = {
      _id: `temp-${Date.now()}`, // ID tạm
      userId: "", // Sẽ được server cập nhật
      userName: "Bạn", // Hoặc lấy từ user context
      userAvatar: "", // Hoặc lấy từ user context
      content: replyMessage,
      parentId: testimonial._id,
      repliesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Thêm reply vào danh sách ngay lập tức
    setReplies(prev => [tempReply, ...prev]);
    
    // Gửi reply lên server qua socket
    socket.emit("comment:new", {
      content: replyMessage,
      parentId: testimonial._id,
    });

    // Reset input
    setReplyMessage("");
  };

  const handleClose = () => {
    setReplyMessage("");
    setReplies([]);
    setPage(1);
    setHasMore(true);
    onClose();
  };

  if (!show || !testimonial) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
      onClick={handleClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Trả lời đánh giá</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          
          <div className="modal-body" style={{ maxHeight: "600px", overflowY: "auto" }}>
            {/* Comment gốc */}
            <div className="d-flex align-items-start mb-4 p-3 bg-light rounded">
              {testimonial.userAvatar ? (
                <img
                  src={testimonial.userAvatar}
                  alt={testimonial.userName}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "15px",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: getRandomColor(testimonial.userName),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    marginRight: "15px",
                    flexShrink: 0,
                  }}
                >
                  {getInitials(testimonial.userName)}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div style={{ fontWeight: "600" }}>
                      {testimonial.userName}
                    </div>
                    <div style={{ color: "#6c757d", fontSize: "0.85rem" }}>
                      {formatDate(testimonial.createdAt)}
                    </div>
                  </div>
                  <span style={{ color: "#ffc107", fontSize: "1.2rem" }}>
                    ★★★★★
                  </span>
                </div>
                <p style={{ marginTop: "10px", marginBottom: 0, color: "#495057" }}>
                  {testimonial.content}
                </p>
              </div>
            </div>

            {/* Form nhập reply */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Viết trả lời của bạn:</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Nhập câu trả lời của bạn..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
                    e.preventDefault();
                    handleSendReply();
                  }
                }}
              ></textarea>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <small className="text-muted">Nhấn Enter để gửi, Ctrl/Shift + Enter để xuống dòng</small>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSendReply}
                  disabled={!replyMessage.trim()}
                >
                  Gửi trả lời
                </button>
              </div>
            </div>

            {/* Danh sách replies */}
            <div>
              <h6 className="mb-3">
                Các trả lời ({replies.length})
              </h6>
              
              {replies.length === 0 && !loading ? (
                <div className="text-center text-muted py-4">
                  <p>Chưa có trả lời nào. Hãy là người đầu tiên!</p>
                </div>
              ) : (
                <div>
                  {replies.map((reply) => (
                    <div
                      key={reply._id}
                      className="d-flex align-items-start mb-3 pb-3 border-bottom"
                    >
                      {reply.userAvatar ? (
                        <img
                          src={reply.userAvatar}
                          alt={reply.userName}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            marginRight: "12px",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: getRandomColor(reply.userName),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                            marginRight: "12px",
                            flexShrink: 0,
                            fontSize: "0.85rem",
                          }}
                        >
                          {getInitials(reply.userName)}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div>
                          <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                            {reply.userName}
                          </span>
                          <span style={{ color: "#6c757d", fontSize: "0.8rem", marginLeft: "8px" }}>
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                        <p style={{ marginTop: "6px", marginBottom: 0, fontSize: "0.95rem" }}>
                          {reply.content}
                        </p>
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
                  {!hasMore && replies.length > 0 && (
                    <div className="text-center text-muted py-3">
                      <small>Đã hiển thị tất cả các trả lời</small>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;