import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://68.178.162.203:8080/application-test-v1.1",
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);
