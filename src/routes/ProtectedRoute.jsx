// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// Optionally accept allowedRoles: ['admin', 'agent', 'superadmin']
const ProtectedRoute = ({ children, allowedRoles }) => {
  // const token = localStorage.getItem("token");
  const token = sessionStorage.getItem("token");

  const role = localStorage.getItem("role");

  const isAuthenticated = !!token;

  // If not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If allowedRoles is defined and current role isn't in it, deny access
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
