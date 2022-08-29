import "./App.css";

import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";
import Journal from "./pages/Journal";
import CreateLedger from "./pages/CreateLedger";
import CreateEntry from "./pages/CreateEntry";
import ViewLedger from "./pages/ViewLedger";
import EditLedger from "./pages/EditLedger";
import EditEntry from "./pages/EditEntry";
import ViewEntry from "./pages/ViewEntry";

function App() {
  const themeMode = useSelector((state) => state.theme.mode);

  return (
    <div className="App" data-theme={themeMode}>
      <div className="bg-base-200">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="settings" element={<Settings />} />

            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<EditProfile />} />

            <Route path="journal" element={<Journal />} />

            <Route path="entry" element={<CreateEntry />} />
            <Route path="entry/:id" element={<ViewEntry />} />
            <Route path="entry/:id/edit" element={<EditEntry />} />

            <Route path="ledger" element={<CreateLedger />} />
            <Route path="ledger/:id" element={<ViewLedger />} />
            <Route path="ledger/:id/edit" element={<EditLedger />} />
          </Routes>

          <Outlet />
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
