import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rounded?: boolean;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, rounded = true, error, style, type, ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div style={{ display: "flex", flexDirection: "column", marginBottom: "15px", position: "relative" }}>
      {label && <label style={{ marginBottom: "5px", fontWeight: "bold" }}>{label}</label>}
      <input
        {...rest}
        type={isPassword && showPassword ? "text" : type}
        style={{
          padding: isPassword ? "10px 40px 10px 12px" : "10px 12px",
          border: error ? "1px solid red" : "1px solid #ccc",
          borderRadius: rounded ? "20px" : "4px",
          fontSize: "14px",
          outline: "none",
          boxSizing: "border-box",
          width: "100%",
          backgroundColor: "white",
          color: "#000",
          ...style,
        }}
      />
      {isPassword && (
        <span
          onClick={() => setShowPassword(prev => !prev)}
          style={{
            position: "absolute",
            right: 12,
            top: "67%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            userSelect: "none",
            fontSize: "18px",
            color: "#555",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "24px",
            width: "24px",
          }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
      {error && <span style={{ color: "red", fontSize: "12px", marginTop: "3px" }}>{error}</span>}
    </div>
  );
};

export default Input;
