import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer } from "react-toastify";

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
import CreateEntry from "./pages/CreateEntry";
import CreateLedger from "./pages/CreateLedger";
import EditLedger from "./pages/EditLedger";
import CreateMenu from "./pages/CreateMenu";
import About from "./pages/About";
import Page404 from "./pages/Page404";
import { logout, updateUser } from "./features/authSlice";
import { GET_PROFILE_URL } from "./constants/api";
import authConfig from "./util/authConfig";
import TrialBalance from "./pages/TrialBalance";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1, // 1 minutes
      cacheTime: 1000 * 60 * 2, // optional: keep in cache longer
    },
  },
});

function App() {
  const dispatch = useDispatch();

  const { theme } = useSelector((state) => state.preference);
  const { token } = useSelector((state) => state.auth);

  // const queryClient = new QueryClient();

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
            <Route path="/about" element={<About />} />

            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route path="/" element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/ledgers" element={<SelectLedger />} />

              <Route path="/create" element={<CreateMenu />} />

              <Route path="/entry" element={<CreateEntry />} />
              <Route path="/entry/:id" element={<ViewEntry />} />

              <Route path="/ledger" element={<CreateLedger />} />
              <Route path="/ledger/:id" element={<ViewLedger />} />
              <Route path="/ledger/:id/edit" element={<EditLedger />} />

              <Route path="/trial-balance" element={<TrialBalance />} />

              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
            </Route>

            <Route path="*" element={<Page404 />} />
          </Routes>
        </BrowserRouter>

        <ReactQueryDevtools />
      </QueryClientProvider>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
}

export default App;
