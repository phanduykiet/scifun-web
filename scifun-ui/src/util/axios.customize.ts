import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// request interceptor
instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// response interceptor
// ⚡ interceptor này đã unwrap response.data → khi gọi axios.get() sẽ trả thẳng data
instance.interceptors.response.use(
  function (response) {
    return response?.data ?? response;
  },
  function (error) {
    return Promise.reject(error?.response?.data ?? error);
  }
);

export default instance;
