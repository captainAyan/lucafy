import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AuthProtectedRoute({ children }) {
  const { token } = useSelector((state) => state.auth);
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}
