import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rounded?: boolean;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  rounded = true,
  error,
  style,
  type,
  disabled,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div style={{ marginBottom: "16px" }}>
      {label && (
        <label
          style={{ fontWeight: 600, marginBottom: "6px", display: "block" }}
        >
          {label}
        </label>
      )}

      <div style={{ position: "relative" }}>
        <input
          {...rest}
          disabled={disabled}
          type={isPassword && showPassword ? "text" : type}
          style={{
            padding: isPassword ? "10px 42px 10px 12px" : "10px 12px",
            border: error ? "1px solid red" : "1px solid #ccc",
            borderRadius: rounded ? "20px" : "6px",
            fontSize: "14px",
            width: "100%",
            outline: "none",
            boxSizing: "border-box",
            background: disabled ? "#f5f5f5" : "white",
            color: "#000", // ✅ THÊM DÒNG NÀY
            ...style,
          }}
        />

        {isPassword && (
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "18px",
              color: "#666",
              display: "flex",
              alignItems: "center",
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}

        {/* ✅ Hint/Error không đẩy layout + animate */}
        {error && (
          <span
            style={{
              position: "absolute",
              bottom: "-16px",
              left: "2px",
              fontSize: "12px",
              color: "red",
              opacity: 1,
              animation: "fadeIn .15s ease",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            {error}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
