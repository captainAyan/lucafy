import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import { AuthHeader } from "../components/Header";

export default function AuthLayout() {
  return (
    <div className="flex flex-col h-screen justify-between">
      <AuthHeader />
      <main className="h-full flex">
        <div className="m-auto w-96">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
