import { useEffect } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import { logout, updateUser } from "./features/authSlice";
import { GET_PROFILE_URL } from "./constants/api";
import authConfig from "./util/authConfig";

function App() {
  const dispatch = useDispatch();

  const { theme } = useSelector((state) => state.preference);
  const { token } = useSelector((state) => state.auth);

  const queryClient = new QueryClient();

  useEffect(() => {
    // syncing user
    if (token)
      axios
        .get(GET_PROFILE_URL, authConfig(token))
        .then((response) => dispatch(updateUser(response.data)))
        .catch(() => {
          localStorage.setItem("token", "");
          dispatch(logout());
        });
  });

  return (
    <div className="bg-indigo-50 min-h-screen overflow-x-hidden">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route path="/" element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>

        <BrowserRouter>
          <Routes></Routes>
        </BrowserRouter>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </div>
  );
}

export default App;
