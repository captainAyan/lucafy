import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AuthProtectedRoute({ children }) {
  const { token } = useSelector((state) => state.auth2);
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}
