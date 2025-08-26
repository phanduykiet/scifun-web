import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Kiểm tra JWT từ header Authorization
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer token"

  if (!token) {
    return res.status(401).json({ message: "Token không tồn tại" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded; // gắn user vào req để controller dùng
    next();
  } catch (err) {
    res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};
