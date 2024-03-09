import axios, { AxiosInstance } from "axios";

const API: AxiosInstance = axios.create({
  baseURL: "https://mix-gw.alomerry.com",
  // baseURL: "http://localhost:4790",
  timeout: 5000,
});

export default API;
