// axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const statusCode = error.response?.data?.code;

    if (statusCode === "TOKEN_EXPIRED") {
      localStorage.setItem("statusExpiredToken", "true");
    }

    if (statusCode === "TOKEN_USER_EXPIRED") {
        localStorage.setItem("statusUserExpiredToken", "true");
    }

    if (statusCode === "SERVICE_ON_MAINTENANCE") {
      localStorage.setItem("statusServiceMaintenance", "true");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
