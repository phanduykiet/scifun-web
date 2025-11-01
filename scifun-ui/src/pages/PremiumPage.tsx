// src/pages/UpgradePage.tsx
import React from "react";
import PlanCard from "../components/Prenium/PlanCard";
import "../styles/PreniumPage.css";

const PreniumPage: React.FC = () => {
  const selectPlan = (plan: string) => {
    const planNames: Record<string, string> = {
      free: "Miễn Phí - 0đ",
      week: "Gói Tuần - 99,000đ",
      month: "Gói Tháng - 279,000đ",
    };
    alert(`Bạn đã chọn: ${planNames[plan]}\n\nCảm ơn bạn đã tin tưởng sử dụng dịch vụ!`);
  };

  return (
    <div className="container">
      <h1>Nâng Cấp Tài Khoản</h1>
      <p className="subtitle">Chọn gói phù hợp với nhu cầu của bạn</p>

      <div className="plans-container">
        <PlanCard
          icon="⭐"
          name="Miễn Phí"
          price="0"
          period="free"
          description="Lựa chọn tốt nhất cho người dùng thường xuyên với mức giá siêu tiết kiệm"
          features={[
            "Trải nghiệm miễn phí cơ bản",
            "Bị giới hạn một số tính năng",
            "Lượt làm bài bị giới hạn",
          ]}
          badge="Trải nghiệm"
          onSelect={() => selectPlan("free")}
        />
        <PlanCard
          icon="📅"
          name="Gói Tuần"
          price="99,000"
          period="tuần"
          description="Hoàn hảo cho những ai muốn trải nghiệm các tính năng cao cấp trong thời gian ngắn"
          features={[
            "Truy cập không giới hạn",
            "Không quảng cáo",
            "Hỗ trợ ưu tiên",
            "Tính năng nâng cao",
            "Tải xuống offline",
          ]}
          onSelect={() => selectPlan("week")}
        />

        <PlanCard
          icon="⭐"
          name="Gói Tháng"
          price="279,000"
          period="tháng"
          description="Lựa chọn tốt nhất cho người dùng thường xuyên với mức giá siêu tiết kiệm"
          features={[
            "Tất cả tính năng gói tuần",
            "Tiết kiệm 30% chi phí",
            "Ưu tiên hỗ trợ 24/7",
            "Cập nhật tính năng mới sớm",
            "Tài khoản đa thiết bị",
            "Tặng thêm 3 ngày",
          ]}
          badge="Tiết kiệm 30%"
          onSelect={() => selectPlan("month")}
        />
      </div>
    </div>
  );
};

export default PreniumPage;
