import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthProvider';
 
const SuperAdminLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
 
  return (
    <div className="d-flex flex-column vh-100">
      <nav className="navbar navbar-dark bg-dark px-3 justify-content-between">
        <span className="navbar-brand">Super Admin</span>
        <button className="btn btn-outline-light" onClick={() => { logout(); navigate('/login'); }}>
          <i className="fas fa-sign-out-alt me-1"></i>Logout
        </button>
      </nav>
 
      <div className="d-flex flex-grow-1">
        <Sidebar role="superadmin" />
        <main className="flex-grow-1 p-4 bg-light overflow-auto">
          <Outlet />
        </main>
      </div>
 
      <footer className="bg-dark text-white text-center py-2 mt-auto">
        © {new Date().getFullYear()} SuperAdmin Panel
      </footer>
    </div>
  );
};
 
export default SuperAdminLayout;
 
 