import axios from "./axios.customize";
import { LoginResponse, UpdateUserData } from "../types/auth";
import { GetSubjectResponse, GetSubjectByIdResponse } from "../types/subject";

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
const updateProfileApi = async (userId: string, data: { fullname: string, avatar: string }) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`/api/v1/user/update-user/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
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
const getTopicsBySubjectApi = async (
  subjectId: string,
  page: number = 1,
  limit: number = 10
) => {
  const res = await axios.get(`/api/v1/topic/get-topics`, {
    params: { subjectId, page, limit },
  });
  return res;
};
const getQuizsByTopicApi = async (
  topicId: string,
  page: number = 1,
  limit: number = 10
) => {
  const res = await axios.get(`/api/v1/quiz/get-quizzes`, {
    params: { topicId, page, limit },
  });
  return res;
};
const getQuestionsByQuizApi = async (
  quizId: string,
  page: number = 1,
  limit: number = 10
) => {
  const res = await axios.get(`/api/v1/question/get-questions`, {
    params: { quizId, page, limit },
  });
  return res;
};
const submitQuizApi = async (userId: string, quizId: string, answers: { questionId: string, selectedAnswerId: string }[]) => {
  const res = await axios.post("/api/v1/submission/handle-submit", {
    userId,
    quizId,
    answers,
  });
  return res;
};
const saveQuizApi = async (userId: string, quizId: string) => {
  const res = await axios.post("/api/v1/favorite-quiz/add", { userId, quizId });
  return res;
};
const delSavedQuizApi = async (quizId: string, userId: string) => {
  const res = await axios.delete(`/api/v1/favorite-quiz/remove/${quizId}`, {
    data: { userId },
  });
  return res;
};
const getSavedQuizzesApi = async (userId: string, topicId?: string) => {
  const res = await axios.get(`/api/v1/favorite-quiz/list`, {
    params: { userId, topicId, page: 1, limit: 100 },
  });
  return res;
};

export { createUserApi, loginApi, otpVerify, getLessonListApi, updateProfileApi, forgotPasswordApi, resetPasswordApi, changePasswordApi,
  getTopicsBySubjectApi, getQuizsByTopicApi, getQuestionsByQuizApi, submitQuizApi, saveQuizApi, delSavedQuizApi, getSavedQuizzesApi };
