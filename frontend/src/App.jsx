import "./App.css";
import { useEffect } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useDispatch, useSelector } from "react-redux";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";
import Journal from "./pages/Journal";
import TrialBalance from "./pages/TrialBalance";
import CreateLedger from "./pages/CreateLedger";
import CreateEntry from "./pages/CreateEntry";
import ViewLedger from "./pages/ViewLedger";
import EditLedger from "./pages/EditLedger";
import EditEntry from "./pages/EditEntry";
import ViewEntry from "./pages/ViewEntry";
import SelectLedger from "./pages/SelectLedger";
import Export from "./pages/Export";

import { logout, updateUser } from "./features/auth/authSlice";
import AuthProtectedRoute from "./components/AuthProtectedRoute";
import axios from "axios";
import { GET_PROFILE_URL } from "./constants/api";
import authConfig from "./util/authConfig";
import SearchEntry from "./pages/SearchEntry";

function App() {
  const dispatch = useDispatch();

  const { theme } = useSelector((state) => state.preference);
  const { token } = useSelector((state) => state.auth);

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

  const queryClient = new QueryClient();

  return (
    <div className="App" data-theme={theme}>
      <div className="bg-base-200">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <div className="flex flex-col h-screen justify-between">
              <Header />

              <Routes>
                <Route
                  path="/"
                  element={
                    <AuthProtectedRoute>
                      <Home />
                    </AuthProtectedRoute>
                  }
                />

                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
                <Route
                  path="settings"
                  element={
                    <AuthProtectedRoute>
                      <Settings />
                    </AuthProtectedRoute>
                  }
                />
                <Route
                  path="export"
                  element={
                    <AuthProtectedRoute>
                      <Export />
                    </AuthProtectedRoute>
                  }
                />

                <Route
                  path="profile"
                  element={
                    <AuthProtectedRoute>
                      <Profile />
                    </AuthProtectedRoute>
                  }
                />
                <Route
                  path="profile/edit"
                  element={
                    <AuthProtectedRoute>
                      <EditProfile />
                    </AuthProtectedRoute>
                  }
                />

                <Route
                  path="journal"
                  element={
                    <AuthProtectedRoute>
                      <Journal />
                    </AuthProtectedRoute>
                  }
                />
                <Route
                  path="search-entry"
                  element={
                    <AuthProtectedRoute>
                      <SearchEntry />
                    </AuthProtectedRoute>
                  }
                />
                <Route
                  path="trial-balance"
                  element={
                    <AuthProtectedRoute>
                      <TrialBalance />
                    </AuthProtectedRoute>
                  }
                />

                <Route
                  path="entry"
                  element={
                    <AuthProtectedRoute>
                      <CreateEntry />
                    </AuthProtectedRoute>
                  }
                />
                <Route
                  path="entry/:id"
                  element={
                    <AuthProtectedRoute>
                      <ViewEntry />
                    </AuthProtectedRoute>
                  }
                />
                <Route
                  path="entry/:id/edit"
                  element={
                    <AuthProtectedRoute>
                      <EditEntry />
                    </AuthProtectedRoute>
                  }
                />

                <Route
                  path="ledgers"
                  element={
                    <AuthProtectedRoute>
                      <SelectLedger />
                    </AuthProtectedRoute>
                  }
                />
                <Route
                  path="ledger"
                  element={
                    <AuthProtectedRoute>
                      <CreateLedger />
                    </AuthProtectedRoute>
                  }
                />
                <Route
                  path="ledger/:id"
                  element={
                    <AuthProtectedRoute>
                      <ViewLedger />
                    </AuthProtectedRoute>
                  }
                />
                <Route
                  path="ledger/:id/edit"
                  element={
                    <AuthProtectedRoute>
                      <EditLedger />
                    </AuthProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>

              <Footer />
            </div>
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </div>
    </div>
  );
}

export default App;
