import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rounded?: boolean;
  error?: string;
  hint?: string;
  onHintChange?: (hasHint: boolean) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  rounded = true,
  error,
  hint,
  style,
  type,
  onHintChange,
  disabled,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [hintText, setHintText] = useState<string | null>(hint || null);

  const isPassword = type === "password";
  const isEmail = type === "email";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // ✅ Hint email
    if (isEmail) {
      if (value && !value.includes("@gmail.com")) {
        setHintText("Email phải có đuôi @gmail.com");
      } else {
        setHintText(null);
      }
    }

    // ✅ Hint password
    if (isPassword) {
      if (!value) setHintText(null);
      else if (value.length < 8) setHintText("Mật khẩu phải dài tối thiểu 8 ký tự");
      else if (!/[A-Z]/.test(value)) setHintText("Mật khẩu phải có ít nhất 1 chữ hoa");
      else if (!/[0-9]/.test(value)) setHintText("Mật khẩu phải có ít nhất 1 số");
      else setHintText(null);
    }

    rest.onChange?.(e);
  };

  useEffect(() => {
    onHintChange?.(!!hintText);
  }, [hintText]);

  return (
    <div style={{ marginBottom: "16px" }}>
      {label && <label style={{ fontWeight: 600, marginBottom: "6px", display: "block" }}>{label}</label>}

      <div style={{ position: "relative" }}>
      <input
        {...rest}
        disabled={disabled}
        type={isPassword && showPassword ? "text" : type}
        onChange={handleChange}
        style={{
          padding: isPassword ? "10px 42px 10px 12px" : "10px 12px",
          border: error ? "1px solid red" : "1px solid #ccc",
          borderRadius: rounded ? "20px" : "6px",
          fontSize: "14px",
          width: "100%",
          outline: "none",
          boxSizing: "border-box",
          background: disabled ? "#f5f5f5" : "white",
          color: "#000",            // ✅ THÊM DÒNG NÀY
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
        {(hintText || error) && (
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
              whiteSpace: "nowrap"
            }}
          >
            {error || hintText}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
