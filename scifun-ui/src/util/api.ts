import axios from "./axios.customize";
import { LoginResponse, UpdateUserData } from "../types/auth";
import { GetSubjectResponse } from "../types/subject";

// Đăng ký user
const createUserApi = (email: string, password: string) => {
  return axios.post("/api/v1/user/register", { email, password });
};

// Xác thực OTP
const otpVerify = (email: string, otp: string) => {
  return axios.post("/api/v1/user/verify-otp", { email, otp });
};

// Login
const loginApi = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const res: LoginResponse = await axios.post("/api/v1/user/login", {
    email,
    password,
  });
  return res; // interceptor trả về response.data
};

// Lấy danh sách môn học
const getLessonListApi = async (
  page: string,
  limit: string,
  search: string
): Promise<GetSubjectResponse> => {
  const res: GetSubjectResponse = await axios.get(
    `/api/v1/subject/get-subjects`,
    {
      params: { page, limit, search },
    }
  );
  return res;
};
const updateProfileApi = async (userId: string, formData: FormData) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`/api/v1/user/update-user/${userId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};
// Quên mật khẩu (gửi OTP hoặc link reset)
const forgotPasswordApi = async (email: string) => {
  const res = await axios.post("/api/v1/user/forgot-password", { email });
  return res;
};

const resetPasswordApi = async (email: string, newPassword: string) => {
  const res = await axios.post("/api/v1/user/reset-password", { email, newPassword });
  return res;
};

const changePasswordApi = async (
  idUser: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  const token = localStorage.getItem("token"); // lấy token đã lưu khi login

  const res = await axios.put(
    `/api/v1/user/update-password/${idUser}`, 
    { oldPassword, newPassword, confirmPassword }, 
    { 
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    }
  );
  return res;
};

export { createUserApi, loginApi, otpVerify, getLessonListApi, updateProfileApi, forgotPasswordApi, resetPasswordApi, changePasswordApi };
