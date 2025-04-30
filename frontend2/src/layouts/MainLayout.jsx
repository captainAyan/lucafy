import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { MainHeader } from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function MainLayout() {
  const [menuVisible, setMenuVisibility] = useState(false);

  const toggleMenu = () => {
    setMenuVisibility(!menuVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      if (menuVisible && innerWidth >= 1024) setMenuVisibility(false);
    };

    // Add event listener on mount
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [menuVisible]);

  // Redirect to login page
  const { token } = useSelector((state) => state.auth);
  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col h-screen justify-between">
      <div
        onClick={toggleMenu}
        className={`${
          menuVisible ? "" : "hidden opacity-0"
        } overlay fixed inset-0 bg-indigo-900/50 z-40 transition-opacity duration-300`}
      ></div>
      <MainHeader toggleMenu={toggleMenu} />
      <div>
        <div className="pt-16 max-w-6xl mx-auto flex">
          <Sidebar className={`${menuVisible ? "translate-x-0" : ""}`} />
          <main className="flex-1 p-4">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
