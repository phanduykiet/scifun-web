import React, { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function AuthLayout({ title, children }: Props) {
  return (
    <div id="authLayout-id" className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ minWidth: "350px" }}>
        <h2 className="text-center mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}
