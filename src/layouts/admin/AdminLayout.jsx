import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthProvider';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();

  // ✅ Page title mapping
  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/admin") return "Welcome to Dashboard";
    if (path.includes("/setup")) return " Setup Atai";
    if (path.includes("/updatedelete")) return " Manage Options";
    if (path.includes("/add-staff")) return " Add Staff";
    if (path.includes("/all-staff")) return " All Staff";

    return "Admin Panel"; // Default fallback
  };

  return (
    <div className="d-flex flex-column vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark navbar-expand-md px-3 ">
        <span className="navbar-brand mb-0  h1">{getPageTitle()}</span>

        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse justify-content-end" id="adminNavbar">
          <div className="d-flex align-items-center gap-3 mt-2 mt-md-0">
            {/* 🔍 Search Bar */}
            <div className="input-group">
              <input
                type="text"
                className="form-control border-0"
                placeholder="Search..."
                aria-label="Search"
              />
              <span className="input-group-text bg-secondary text-white border-0">
                <i className="fas fa-search"></i>
              </span>
            </div>

            {/* 🔔 Notification Icon */}
            <button type="button" className="btn btn-secondary position-relative">
              <i className="fas fa-bell"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
                <span className="visually-hidden">unread messages</span>
              </span>
            </button>

            {/* 🚪 Logout Button */}
            <button
              className="btn btn-outline-light"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <i className="fas fa-sign-out-alt me-1"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="d-flex flex-grow-1">
        <Sidebar role="admin" />
        <main className="flex-grow-1 p-4 bg-light overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-2 mt-auto">
        © {new Date().getFullYear()} Admin Panel
      </footer>
    </div>
  );
};

export default AdminLayout;
