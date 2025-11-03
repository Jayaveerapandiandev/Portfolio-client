import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const sessionId = localStorage.getItem("sessionId");

  // If no session, redirect to login
  if (!sessionId) {
    return <Navigate to="/admin/login" replace />;
  }

  // Otherwise render the requested child route
  return <Outlet />;
};

export default ProtectedRoute;
