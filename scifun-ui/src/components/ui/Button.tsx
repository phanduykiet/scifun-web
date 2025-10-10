import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  rounded?: boolean; // có bo tròn hay không
}

const Button: React.FC<ButtonProps> = ({ children, rounded = true, style, ...rest }) => {
  return (
    <button
      {...rest}
      style={{
        padding: "10px 20px",
        width: "200px",
        border: "none",
        borderRadius: rounded ? "20px" : "4px", // bo tròn
        backgroundColor: "#04bfa9",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
        ...style, // cho phép override style từ ngoài
      }}
    >
      {children}
    </button>
  );
};

export default Button;
