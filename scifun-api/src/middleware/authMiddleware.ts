import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request type để thêm user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

// Kiểm tra JWT từ header Authorization
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    
    // Kiểm tra header tồn tại
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: "Vui lòng đăng nhập để tiếp tục" 
      });
    }
    
    // Kiểm tra format "Bearer <token>"
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false,
        message: "Token không đúng định dạng" 
      });
    }
    
    const token = authHeader.split(" ")[1];
    
    // Kiểm tra token có tồn tại sau "Bearer "
    if (!token || token.trim().length === 0) {
      return res.status(401).json({ 
        success: false,
        message: "Token không tồn tại" 
      });
    }
    
    // Kiểm tra JWT_SECRET
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET không được cấu hình");
    }
    
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      userId: string;
      email: string;
      role: string;
    };
    
    // Validate decoded data
    if (!decoded.userId || !decoded.email || !decoded.role) {
      return res.status(401).json({ 
        success: false,
        message: "Token không hợp lệ" 
      });
    }
    
    // Gắn user vào req với type safety
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    // Xử lý các loại lỗi JWT cụ thể
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Token đã hết hạn, vui lòng đăng nhập lại"
      });
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ"
      });
    }
    
    if (error instanceof jwt.NotBeforeError) {
      return res.status(401).json({
        success: false,
        message: "Token chưa có hiệu lực"
      });
    }
    
    // Lỗi khác
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi xác thực người dùng"
    });
  }
};