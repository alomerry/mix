import axios, { AxiosInstance } from "axios";

const API: AxiosInstance = axios.create({
  // baseURL: "https://mix-gw.alomerry.com",
  timeout: 5000,
});

export default API;
