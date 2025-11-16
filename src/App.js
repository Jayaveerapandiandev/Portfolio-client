import React from "react";
import WorkInProgress from "./pages/WorkInProgress";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/common/Navbar";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminCreateUser from "./pages/AdminCreateUser";
import AdminHome from "./pages/AdminHome";
import { ThemeProvider } from "./context/ThemeContext"; // ✅ your theme context
import AdminAbout from "./pages/AdminAbout";
import Main from "./pages/Main";
import AdminProjects from "./pages/AdminProjects";
import AdminExperience from "./pages/AdminExperience";
import AdminSkills from "./pages/AdminSkills";


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
        <Route path="/" element={<Main />} />
       
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-user" element={<AdminCreateUser />} />
          <Route path="/admin/AdminHome" element={<AdminHome />} />
          <Route path="/admin/about" element={<AdminAbout/>}/>
          <Route path="/admin/projects" element={<AdminProjects/>}/>
          <Route path="/admin/experience" element={<AdminExperience/>}/>
          <Route path="/admin/skills" element={<AdminSkills/>}/>
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
