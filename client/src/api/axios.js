import axios from "axios";

// All API calls will go to our backend at port 5000
const API = axios.create({ baseURL: "http://localhost:5000/api" });

// This automatically attaches the JWT token to every request
// so you don't have to do it manually on every page
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;