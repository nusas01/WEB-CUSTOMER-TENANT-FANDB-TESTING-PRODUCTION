// axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.data?.code === "TOKEN_EXPIRED") {
      localStorage.setItem("statusExpiredToken", "true"); // ⬅️ untuk dibaca useEffect
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
