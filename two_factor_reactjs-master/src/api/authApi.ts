import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1/";

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

authApi.defaults.headers.common["Content-Type"] = "application/json";
authApi.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
authApi.defaults.headers.common['Access-Control-Allow-Methods'] = '*';