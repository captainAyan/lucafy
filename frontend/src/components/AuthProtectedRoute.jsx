import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AuthProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}
