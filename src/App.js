import React from "react";
import WorkInProgress from "./pages/WorkInProgress";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";      
import BackToTop from "./components/common/BacktoTop";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminCreateUser from "./pages/AdminCreateUser";
import AdminHome from "./pages/AdminHome";
import { ThemeProvider } from "./context/ThemeContext";

import AdminAbout from "./pages/AdminAbout";
import Main from "./pages/Main";
import AdminProjects from "./pages/AdminProjects";
import AdminExperience from "./pages/AdminExperience";
import AdminSkills from "./pages/AdminSkills";
import AdminMessages from "./pages/AdminMessages";
import ChangePassword from "./pages/ChangePassword";
import AdminEducation from "./pages/AdminEducation";

const App = () => {
  const location = useLocation();

  // Hide navbar/footer/back-to-top on admin pages
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Public Navbar */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Main />} />

        {/* Admin login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-user" element={<AdminCreateUser />} />
          <Route path="/admin/AdminHome" element={<AdminHome />} />
          <Route path="/admin/about" element={<AdminAbout />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/experience" element={<AdminExperience />} />
          <Route path="/admin/skills" element={<AdminSkills />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/change-password" element={<ChangePassword />} />
          <Route path="/admin/education" element={<AdminEducation/>}/>
        </Route>

        {/* Fallback */}
        <Route path="/admin/:section" element={<WorkInProgress />} />
      </Routes>

      {/* Public-only Components */}
      {!isAdminRoute && <BackToTop />}
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default function AppWrapper() {
  return (
    <Router>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Router>
  );
}
