import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { CircleCheck, Info, CircleX, X } from "lucide-react";

interface ToastProps {
  message: string;
  subtitle?: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  subtitle,
  type = "info",
  onClose,
  duration = 3000,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(onClose, 300);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  const styleMap = {
    success: {
      iconColor: "text-success",
      borderColor: "border-success",
      Icon: CircleCheck,
    },
    error: {
      iconColor: "text-danger",
      borderColor: "border-danger",
      Icon: CircleX,
    },
    info: {
      iconColor: "text-primary",
      borderColor: "border-primary",
      Icon: Info,
    },
  }[type];

  const { iconColor, borderColor, Icon } = styleMap;

  const toastElement = (
    <div
      className={`position-fixed top-0 end-0 m-3 p-3 border ${borderColor} bg-white rounded shadow d-flex align-items-start transition-all`}
      style={{
        width: "340px",
        zIndex: 2001,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.3s ease-out",
      }}
    >
      <div className="me-3 d-flex align-items-center justify-content-center rounded-circle">
        <Icon className={`me-2 ${iconColor}`} size={20} />
      </div>

      <div className="flex-grow-1">
        <div className="fw-semibold text-dark small">{message}</div>
        {subtitle && (
          <div className="text-muted small mt-1">{subtitle}</div>
        )}
      </div>

      <button
        onClick={() => setVisible(false)}
        type="button"
        className="btn btn-link text-secondary p-0 ms-2"
        aria-label="Close"
        style={{ textDecoration: "none" }}
      >
        <X size={18} />
      </button>
    </div>
  );
  return ReactDOM.createPortal(toastElement, document.body);
};

export default Toast;
