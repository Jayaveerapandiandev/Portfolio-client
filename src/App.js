import React from "react";
import WorkInProgress from "./pages/WorkInProgress";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminCreateUser from "./pages/AdminCreateUser";
import AdminHome from "./pages/AdminHome";
import { ThemeProvider } from "./context/ThemeContext"; // ✅ your theme context

const App = () => {
  const location = useLocation();

  // Hide navbar on admin pages (login, dashboard, etc.)
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      {/* ✅ Navbar only on public routes */}
      {!hideNavbar && <Navbar />}

      {/* ✅ Page Routes */}
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-user" element={<AdminCreateUser />} />
          <Route path="/admin/AdminHome" element={<AdminHome />} />
        </Route>

        {/* Fallback */}
        <Route path="/admin/:section" element={<WorkInProgress />} />
      </Routes>
    </>
  );
};

export default function AppWrapper() {
  return (
    <Router>
      {/* ✅ ThemeProvider wraps entire app and provides global bg/text */}
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Router>
  );
}
