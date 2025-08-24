// axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
