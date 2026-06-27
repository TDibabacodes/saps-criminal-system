import axios from "axios";

const API = axios.create({
  baseURL: "https://saps-criminal-system.onrender.com/api"
});

// Attach JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// If token expires redirect to login automatically
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login?expired=true";
    }
    return Promise.reject(error);
  }
);

export default API;