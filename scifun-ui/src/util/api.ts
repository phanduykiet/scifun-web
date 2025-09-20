import axios from './axios.customize';
import { LoginResponse } from '../types/auth';

const createUserApi = (email: string, password: string) => {
  const URL_API = "/api/v1/user/register";
  return axios.post(URL_API, { email, password });
};

const otpVerify = (email: string, otp: string) => {
  const URL_API = "/api/v1/user/verify-otp";
  return axios.post(URL_API, { email, otp });
};

const loginApi = async (email: string, password: string): Promise<LoginResponse> => {
    const URL_API = "/api/v1/user/login";
    const res = await axios.post<any, LoginResponse>(URL_API, { email, password });
    return res; // vì interceptor đã return response.data => res = LoginResponse
};
  

export {
  createUserApi,
  loginApi,
  otpVerify
};
