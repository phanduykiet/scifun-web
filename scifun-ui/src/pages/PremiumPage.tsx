import React, { useEffect, useState } from "react";
import PlanCard from "../components/Prenium/PlanCard";
import "../styles/PreniumPage.css";
import { getPlansApi, createPaymentApi, updatePaymentApi } from "../util/api";
import Toast from "../components/common/Toast";
import PaymentResultModal from "../components/Prenium/PaymentResultModal";

interface Plan {
  _id: string;
  name: string;
  price: number;
  durationDays: number;
}

interface ToastState {
  message: string;
  subtitle?: string;
  type?: "success" | "error" | "info";
}

const PreniumPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "error" | "cancel" | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info",
    subtitle?: string
  ) => {
    setToast({ message, subtitle, type });
  };

  const selectPlan = async (plan: Plan) => {
    if (plan.price === 0) {
      showToast(`Bạn đã chọn: ${plan.name}`, "info", "Gói miễn phí");
      return;
    }

    try {
      setProcessing(true);

      // 🧠 Lưu lại thông tin gói để xử lý khi quay lại
      localStorage.setItem(
        "selectedPlan",
        JSON.stringify({
          name: plan.name,
          durationDays: plan.durationDays,
        })
      );

      const res = await createPaymentApi(plan.price);
      const data = res as any;

      if (data.payUrl) {
        showToast("Đang chuyển đến trang thanh toán...", "success");
        setTimeout(() => {
          window.location.href = data.payUrl;
        }, 1000);
      } else {
        showToast("Không lấy được link thanh toán", "error", "Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo thanh toán:", error);
      showToast("Thanh toán thất bại", "error", "Vui lòng thử lại!");
    } finally {
      setProcessing(false);
    }
  };

  // 🧭 Kiểm tra kết quả thanh toán khi quay lại
  useEffect(() => {
    const handlePaymentResult = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const statusParam = urlParams.get("status");
      const apptransid = urlParams.get("apptransid");
  
      console.log("status:", statusParam);
      console.log("apptransid:", apptransid);
  
      const status = statusParam ? Number(statusParam) : null;
  
      if (status !== null && apptransid) {
        const planInfo = JSON.parse(localStorage.getItem("selectedPlan") || "{}");
  
        switch (status) {
          case 1:
            setPaymentStatus("success");
            try {
              const res = await updatePaymentApi(apptransid, status, planInfo.durationDays);
              console.log("Kết quả cập nhật:", res);
              const user = JSON.parse(localStorage.getItem("user") || "{}");
              if (user && Object.keys(user).length > 0) {
                user.isPro = "ACTIVE";
                localStorage.setItem("user", JSON.stringify(user));
              }
            } catch (err) {
              console.error("Lỗi khi cập nhật payment:", err);
            }
            break;
  
          case -49:
            setPaymentStatus("cancel");
            break;
  
          default:
            setPaymentStatus("error");
            break;
        }
      }
    };
  
    handlePaymentResult();
  }, []);  

  // 🧩 Tải danh sách gói
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await getPlansApi();
        setPlans(res.data);
      } catch (error) {
        console.error("Lỗi khi tải gói:", error);
        showToast("Không thể tải danh sách gói", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleCloseModal = () => {
    setPaymentStatus(null);
    localStorage.removeItem("selectedPlan");
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  if (loading) {
    return <p className="loading-text">Đang tải các gói dịch vụ...</p>;
  }

  return (
    <div className="container">
      <h1>Nâng Cấp Tài Khoản</h1>
      <p className="subtitle">Chọn gói phù hợp với nhu cầu của bạn</p>

      <div className="plans-container">
        {/* Gói miễn phí */}
        <PlanCard
          icon="⭐"
          name="Miễn Phí"
          price="0"
          period="free"
          description="Lựa chọn cơ bản với các tính năng miễn phí"
          features={[
            "Trải nghiệm miễn phí cơ bản",
            "Bị giới hạn một số tính năng",
            "Lượt làm bài bị giới hạn",
          ]}
          badge="Trải nghiệm"
          onSelect={() =>
            selectPlan({ _id: "free", name: "Miễn Phí", price: 0, durationDays: 0 })
          }
        />

        {/* Các gói trả phí */}
        {plans.map((plan) => (
          <PlanCard
            key={plan._id}
            icon={plan.durationDays === 7 ? "📅" : "⭐"}
            name={plan.name}
            price={plan.price.toLocaleString()}
            period={`${plan.durationDays} ngày`}
            description={
              plan.durationDays === 7
                ? "Truy cập đầy đủ tính năng trong 7 ngày"
                : "Lựa chọn tiết kiệm cho người dùng thường xuyên"
            }
            features={[
              "Truy cập không giới hạn",
              "Không quảng cáo",
              "Hỗ trợ ưu tiên",
              ...(plan.durationDays === 30
                ? ["Tiết kiệm 30%", "Tài khoản đa thiết bị"]
                : []),
            ]}
            badge={plan.durationDays === 30 ? "Tiết kiệm 30%" : undefined}
            onSelect={() => selectPlan(plan)}
          />
        ))}
      </div>

      {processing && <p className="loading-text mt-3">Đang tạo đơn hàng...</p>}

      {/* Toast thông báo nhỏ */}
      {toast && (
        <Toast
          message={toast.message}
          subtitle={toast.subtitle}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Modal kết quả thanh toán */}
      {paymentStatus && (
        <PaymentResultModal
          show={!!paymentStatus}
          status={paymentStatus}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default PreniumPage;
