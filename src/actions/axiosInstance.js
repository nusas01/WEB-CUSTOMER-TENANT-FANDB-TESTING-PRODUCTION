// axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  response => response,
  error => {

    if (error.response?.data?.code === "TOKEN_EXPIRED") {
      localStorage.setItem("statusExpiredToken", "true"); 
    }

    if (error.response.status === 503) {
      localStorage.setItem("statusServiceMaintenance", "true");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
