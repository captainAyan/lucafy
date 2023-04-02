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

import { getAll, ledgersReset } from "./features/ledger/ledgerSlice";
import { get } from "./features/auth/authSlice";
import AuthProtectedRoute from "./components/AuthProtectedRoute";

function App() {
  const dispatch = useDispatch();

  const { theme } = useSelector((state) => state.preference);
  const { user } = useSelector((state) => state.auth);
  const { gotAll } = useSelector((state) => state.ledger);

  useEffect(() => {
    if (user && !gotAll) {
      dispatch(getAll());

      // syncing user
      dispatch(get());
    }
    if (!user) {
      dispatch(ledgersReset());
    }
  }, [user, dispatch, gotAll]);

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
                <Route path="settings" element={<Settings />} />
                <Route path="export" element={<Export />} />

                <Route path="profile" element={<Profile />} />
                <Route path="profile/edit" element={<EditProfile />} />

                <Route path="journal" element={<Journal />} />
                <Route path="trial-balance" element={<TrialBalance />} />

                <Route path="entry" element={<CreateEntry />} />
                <Route path="entry/:id" element={<ViewEntry />} />
                <Route path="entry/:id/edit" element={<EditEntry />} />

                <Route path="ledgers" element={<SelectLedger />} />
                <Route path="ledger" element={<CreateLedger />} />
                <Route path="ledger/:id" element={<ViewLedger />} />
                <Route path="ledger/:id/edit" element={<EditLedger />} />

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
