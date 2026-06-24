import { Navigate } from "react-router-dom";

// If user is not logged in, redirect them to /login
// Otherwise show the page they requested
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}