import React, { useEffect, useState, useRef } from "react";
import { socket } from "../../util/socket";
import { getNotificationsApi, markAsReadApi, markAllAsReadApi } from "../../util/api";

// Updated interface to include rank change notifications
interface Notification {
  _id: string;
  userId: string;
  type: "COMMENT_REPLY" | "RANK_CHANGED";
  title: string;
  message: string;
  data: {
    commentId?: string;
    parentId?: string;
    subjectId?: string;
    subjectName?: string;
    period?: "daily" | "weekly" | "monthly" | "alltime";
    oldRank?: number;
    newRank?: number;
    change?: "up" | "down";
  };
  link: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationDropdownProps {
  isHomePage?: boolean;
  isScrolled?: boolean;
  onOpenCommentModal?: (commentId: string, parentId?: string) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  isHomePage = false, 
  isScrolled = false,
  onOpenCommentModal
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const iconColor = isHomePage && !isScrolled ? "#ffffff" : "#198754";

  // Extract user name from message
  const extractUserName = (message: string): string => {
    const match = message.match(/^(.+?)\s+vừa trả lời/);
    return match ? match[1] : "Người dùng";
  };

  // Extract content from message
  const extractContent = (message: string): string => {
    const match = message.match(/: "(.+)"$/);
    return match ? match[1] : message;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (str: string) => {
    if (!str || str.length === 0) return '#6f42c1';
    const colors = ['#6f42c1', '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8'];
    const index = str.charCodeAt(0) % colors.length;
    return colors[index];
  };

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
      day: 'numeric',
      month: 'numeric'
    });
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotificationsApi();
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      } catch (err) {
        console.error("Lỗi khi lấy thông báo:", err);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleNewNotification = async (data: any) => {
      // Nếu server gửi kèm notification ID thật
      if (data.notificationId || data._id) {
        const notification: Notification = {
          _id: data.notificationId || data._id,
          userId: data.userId || "",
          type: data.type || "COMMENT_REPLY",
          title: data.title || "Có phản hồi mới 💬",
          message: data.message || "",
          data: {
            commentId: data.commentId || data.data?.commentId || "",
            parentId: data.parentId || data.data?.parentId,
          },
          link: data.link || "/#comments",
          isRead: false,
          createdAt: data.createdAt || new Date().toISOString(),
        };

        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);

        if (Notification.permission === "granted") {
          new Notification(notification.title, {
            body: notification.message,
          });
        }
      } else {
        // Nếu không có ID, fetch lại toàn bộ notifications
        try {
          const res = await getNotificationsApi();
          setNotifications(res.data.notifications);
          setUnreadCount(res.data.unreadCount);
          
          // Show browser notification cho notification mới nhất
          if (Notification.permission === "granted" && res.data.notifications.length > 0) {
            const latestNotif = res.data.notifications[0];
            new Notification(latestNotif.title, {
              body: latestNotif.message,
            });
          }
        } catch (err) {
          console.error("Lỗi khi fetch notifications:", err);
        }
      }
    };

    // 🔔 Handle rank change notification
    const handleRankChange = (data: any) => {
      const notification: Notification = {
        _id: `rank_${Date.now()}`,
        userId: data.userId || "",
        type: "RANK_CHANGED",
        title: data.change === "up" ? "🎉 Hạng của bạn đã tăng!" : "📉 Hạng của bạn đã thay đổi",
        message: `Hạng của bạn trong môn ${data.subjectName} đã thay đổi: Hạng ${data.oldRank} → Hạng ${data.newRank}`,
        data: {
          subjectId: data.subjectId,
          subjectName: data.subjectName,
          period: data.period,
          oldRank: data.oldRank,
          newRank: data.newRank,
          change: data.change,
        },
        link: `/leaderboard?subject=${data.subjectId}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Browser notification
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: data.change === "up" 
            ? "https://cdn-icons-png.flaticon.com/512/179/179386.png"
            : "https://cdn-icons-png.flaticon.com/512/179/179377.png",
        });
      }
    };

    socket.on("comment:reply", handleNewNotification);
    socket.on("notification:new", handleNewNotification);
    socket.on("leaderboard:rankChanged", handleRankChange);

    return () => {
      socket.off("comment:reply", handleNewNotification);
      socket.off("notification:new", handleNewNotification);
      socket.off("leaderboard:rankChanged", handleRankChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // Skip API call for temporary rank change notifications
      if (notificationId.startsWith('rank_')) {
        setNotifications(prev =>
          prev.map(n =>
            n._id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        return;
      }

      await markAsReadApi(notificationId);
      
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Lỗi khi đánh dấu đã đọc:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadApi();
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Lỗi khi đánh dấu tất cả đã đọc:", err);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Only mark as read if it's unread
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }
    
    // Close dropdown
    setIsOpen(false);
    
    // Handle different notification types
    if (notification.type === "RANK_CHANGED") {
      // Navigate to leaderboard page
      window.location.href = notification.link;
    } else if (notification.type === "COMMENT_REPLY" && onOpenCommentModal) {
      // Open comment modal
      onOpenCommentModal(
        notification.data.commentId!,
        notification.data.parentId
      );
    }
  };

  // Render notification icon based on type
  const renderNotificationIcon = (notification: Notification) => {
    if (notification.type === "RANK_CHANGED") {
      const bgColor = notification.data.change === "up" ? "#28a745" : "#ffc107";
      const emoji = notification.data.change === "up" ? "📈" : "📉";
      
      return (
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
          }}
        >
          {emoji}
        </div>
      );
    } else {
      // Comment reply notification
      const userName = extractUserName(notification.message);
      return (
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: getRandomColor(userName),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "0.9rem",
          }}
        >
          {getInitials(userName)}
        </div>
      );
    }
  };

  // Render notification content based on type
  const renderNotificationContent = (notification: Notification) => {
    if (notification.type === "RANK_CHANGED") {
      return (
        <>
          <div className="mb-1">
            <span className="fw-semibold">Hạng môn {notification.data.subjectName}</span>
            <span className="text-muted ms-1">của bạn đã {notification.data.change === "up" ? "tăng" : "giảm"}</span>
          </div>
          <p
            className="mb-1 text-muted"
            style={{
              fontSize: "0.9rem",
            }}
          >
            Hạng {notification.data.oldRank} → Hạng {notification.data.newRank}
          </p>
        </>
      );
    } else {
      // Comment reply notification
      const userName = extractUserName(notification.message);
      const content = extractContent(notification.message);
      
      return (
        <>
          <div className="mb-1">
            <span className="fw-semibold">{userName}</span>
            <span className="text-muted ms-1">đã trả lời bình luận của bạn</span>
          </div>
          <p
            className="mb-1 text-muted"
            style={{
              fontSize: "0.9rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {content}
          </p>
        </>
      );
    }
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        className="btn btn-link position-relative p-2"
        onClick={handleToggleDropdown}
        style={{
          color: iconColor,
          textDecoration: "none",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C9.24 2 7 4.24 7 7V11L5.29 12.71C4.9 13.1 4.66 13.62 4.62 14.19L4 19C3.9 20.1 4.73 21 5.83 21H18.17C19.27 21 20.1 20.1 20 19L19.38 14.19C19.34 13.62 19.1 13.1 18.71 12.71L17 11V7C17 4.24 14.76 2 12 2ZM10 22C10 23.1 10.9 24 12 24C13.1 24 14 23.1 14 22H10Z" />
        </svg>
        
        {unreadCount > 0 && (
          <span
            className="position-absolute badge rounded-pill bg-danger"
            style={{
              top: "2px",
              right: "0px",
              fontSize: "0.65rem",
              padding: "0.25em 0.45em",
              minWidth: "18px",
              height: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border"
          style={{
            width: "360px",
            maxHeight: "480px",
            zIndex: 1050,
            overflow: "hidden",
          }}
        >
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h6 className="mb-0 fw-bold">Thông báo</h6>
            {unreadCount > 0 && (
              <button
                className="btn btn-link btn-sm text-primary p-0"
                onClick={handleMarkAllAsRead}
                style={{ textDecoration: "none", fontSize: "0.85rem" }}
              >
                Đánh dấu đã đọc tất cả
              </button>
            )}
          </div>

          <div
            style={{
              maxHeight: "420px",
              overflowY: "auto",
            }}
          >
            {notifications.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-3"
                  style={{ opacity: 0.3 }}
                >
                  <path
                    d="M30 10C22.3 10 16 16.3 16 24V31.5L12.9 34.6C12.3 35.2 12 36 12 36.8V42C12 43.7 13.3 45 15 45H45C46.7 45 48 43.7 48 42V36.8C48 36 47.7 35.2 47.1 34.6L44 31.5V24C44 16.3 37.7 10 30 10ZM25 48C25 50.8 27.2 53 30 53C32.8 53 35 50.8 35 48H25Z"
                    fill="currentColor"
                  />
                </svg>
                <p className="mb-0">Chưa có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`d-flex align-items-start p-3 border-bottom cursor-pointer ${
                    !notif.isRead ? "bg-light" : ""
                  }`}
                  onClick={() => handleNotificationClick(notif)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = notif.isRead ? "white" : "#f8f9fa";
                  }}
                  style={{
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                >
                  <div className="position-relative me-3" style={{ flexShrink: 0 }}>
                    {renderNotificationIcon(notif)}
                    
                    {notif.type === "COMMENT_REPLY" && (
                      <div
                        className="position-absolute bottom-0 end-0 bg-primary rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "20px",
                          height: "20px",
                          border: "2px solid white",
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="white"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10.5 2H8.5V1C8.5 0.4 8.1 0 7.5 0H4.5C3.9 0 3.5 0.4 3.5 1V2H1.5C0.9 2 0.5 2.4 0.5 3V11C0.5 11.6 0.9 12 1.5 12H10.5C11.1 12 11.5 11.6 11.5 11V3C11.5 2.4 11.1 2 10.5 2ZM4.5 1H7.5V2H4.5V1ZM3 9.5L1.5 8L2.2 7.3L3 8.1L5.3 5.8L6 6.5L3 9.5Z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {renderNotificationContent(notif)}
                    <div className="d-flex align-items-center">
                      <small className="text-primary">
                        {formatDate(notif.createdAt)}
                      </small>
                      {!notif.isRead && (
                        <span
                          className="ms-2 bg-primary rounded-circle"
                          style={{
                            width: "8px",
                            height: "8px",
                            display: "inline-block",
                          }}
                        ></span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;