// middlewares/checkRole.ts
import { Request, Response, NextFunction } from "express";

export const checkRole = (...allowedRoles: ("USER" | "ADMIN")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Lấy role và ép kiểu luôn
      const userRole = req.user?.role as "USER" | "ADMIN";

      // Kiểm tra xem có role không
      if (!userRole) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Không tìm thấy thông tin người dùng"
        });
      }

      // Kiểm tra role có nằm trong danh sách cho phép không
      if (!allowedRoles.includes(userRole)) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Bạn không có quyền truy cập tài nguyên này"
        });
      }

      // Nếu pass hết thì cho qua
      next();
    } catch (error) {
      console.error("Check role error:", error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Lỗi kiểm tra quyền truy cập"
      });
    }
  };
};