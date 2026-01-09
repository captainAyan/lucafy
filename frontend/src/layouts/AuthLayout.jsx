import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import { AuthHeader } from "../components/Header";

export default function AuthLayout() {
  // Redirect to dashboard page
  const { token } = useSelector((state) => state.auth);
  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex flex-col h-screen justify-between">
      <AuthHeader />
      <Outlet />
      <Footer />
    </div>
  );
}
