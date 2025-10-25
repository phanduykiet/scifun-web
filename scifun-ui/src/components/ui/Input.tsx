import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rounded?: boolean;
  error?: string;
  hint?: string;
  onHintChange?: (hasHint: boolean) => void; // ✅ thêm prop này
}

const Input: React.FC<InputProps> = ({
  label,
  rounded = true,
  error,
  hint,
  style,
  type,
  onHintChange,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [hintText, setHintText] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const isPassword = type === "password";
  const isEmail = type === "email";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Gợi ý email
    if (isEmail) {
      if (value && !value.includes("@gmail.com")) {
        setHintText("Email phải có đuôi @gmail.com");
      } else {
        setHintText(null);
      }
    }

    // Gợi ý mật khẩu
    if (isPassword) {
      if (value && value.length < 8) {
        setHintText("Mật khẩu phải dài tối thiểu 8 ký tự");
      } else if (value && !/[A-Z]/.test(value)) {
        setHintText("Mật khẩu phải chứa ít nhất 1 chữ hoa");
      } else if (value && !/[0-9]/.test(value)) {
        setHintText("Mật khẩu phải chứa ít nhất 1 số");
      } else {
        setHintText(null);
      }
    }

    if (rest.onChange) rest.onChange(e);
  };

  // ✅ Báo cho cha biết khi nào có hint lỗi
  useEffect(() => {
    if (onHintChange) {
      onHintChange(!!hintText);
    }
  }, [hintText, onHintChange]);

  return (
    <div style={{ display: "flex", flexDirection: "column", marginBottom: "15px" }}>
      {label && (
        <label style={{ marginBottom: "5px", fontWeight: "bold" }}>{label}</label>
      )}

      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          {...rest}
          type={isPassword && showPassword ? "text" : type}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
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
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              userSelect: "none",
              fontSize: "18px",
              color: "#555",
              display: "flex", alignItems: "center", justifyContent: "center", height: "24px", width: "24px"
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>

      {touched && !error && hintText && (
        <span style={{ color: "red", fontSize: "12px", marginTop: "3px" }}>
          {hintText}
        </span>
      )}

      {error && (
        <span style={{ color: "red", fontSize: "12px", marginTop: "3px" }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
