import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend lại Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      } | null;
    }
  }
}

/**
 * Middleware xác thực tuỳ chọn:
 * - Nếu có token hợp lệ → gắn req.user
 * - Nếu không có token hoặc token lỗi → req.user = null (không throw)
 */
export const optionalAuthMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];

    // Nếu không có token → user = null
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];
    if (!token || !process.env.JWT_SECRET) {
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    // Nếu decode thành công → gắn user
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    // Nếu token lỗi hoặc hết hạn → bỏ qua, không throw
    req.user = null;
  }

  next();
};
