import { useEffect } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import ViewEntry from "./pages/ViewEntry";
import ViewLedger from "./pages/ViewLedger";
import SelectLedger from "./pages/SelectLedger";

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
  }, [token, dispatch]);

  return (
    <div className="bg-indigo-50 min-h-screen overflow-x-hidden">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route path="/" element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/ledgers" element={<SelectLedger />} />

              <Route path="/entry/:id" element={<ViewEntry />} />
              <Route path="/ledger/:id" element={<ViewLedger />} />
            </Route>
          </Routes>
        </BrowserRouter>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </div>
  );
}

export default App;
