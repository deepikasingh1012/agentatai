import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthProvider";
import { getRecentInquiries,logoutUser } from "../../services/AgentServices";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
   const [notificationCount, setNotificationCount] = useState(0);
   
    const notificationRef = useRef(null);
    const [recentInquiries, setRecentInquiries] = useState([]);
    const [userName, setUserName] = useState('');

  // ✅ Page title mapping
  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/admin") return "Welcome to Dashboard";
    if (path.includes("/setup")) return " Setup Atai";
    if (path.includes("/updatedelete")) return " Manage Options";
    if (path.includes("/add-staff")) return " Add Staff";
    if (path.includes("/all-staff")) return " All Staff";
    if (path.includes("/atai-tour")) return " ATai Tour";

    return "Admin Panel"; // Default fallback
  };
  const handleLogout = async () => {
  const userId = sessionStorage.getItem("userId");

  try {
    if (userId) {
      await logoutUser(userId); // ⬅️ Call the logout API
    }
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    logout(); // ⬅️ Clear session/context
    navigate('/'); // ⬅️ Redirect to login/home
  }
};

   useEffect(() => {
      const handleClickOutside = (e) => {
        if (
          notificationRef.current &&
          !notificationRef.current.contains(e.target)
        ) {
          setShowNotifications(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  
    useEffect(() => {
      const fetchNotificationCount = async () => {
        // const clientId = localStorage.getItem("clientId");
          const clientId = sessionStorage.getItem("clientId");
        if (clientId) {
          try {
            const { success, newInquiriesCount, recentInquiries } =
              await getRecentInquiries(clientId);
            if (success) {
              setNotificationCount(newInquiriesCount);
              setRecentInquiries(recentInquiries);
            } else {
              setNotificationCount(0);
              setRecentInquiries([]);
            }
          } catch (error) {
            console.error("Failed to fetch notification count:", error);
            setNotificationCount(0);
            setRecentInquiries([]);
          }
        }
      };
      fetchNotificationCount();
    }, []);
  

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
            {/* <div className="input-group">
              <input
                type="text"
                className="form-control border-0"
                placeholder="Search..."
                aria-label="Search"
              />
              <span className="input-group-text bg-secondary text-white border-0">
                <i className="fas fa-search"></i>
              </span>
            </div> */}

            {/* 🔔 Notification Icon */}
             {/* Desktop View: Notification and Logout */}
        <div className="dropdown d-none d-lg-block me-3">
          <button
            className="btn btn-light position-relative dropdown-toggle"
            type="button"
            id="notificationDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            onClick={() => setNotificationCount(0)} // Reset count when clicked
          >
            <i className="fa fa-bell text-primary"></i>
            {notificationCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {notificationCount}
              </span>
            )}
          </button>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="notificationDropdown"
            style={{ maxHeight: "300px", overflowY: "auto", zIndex: 1050 }}
            ref={notificationRef}
          >
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry, index) => (
                <li key={index}>
                  <button
                    className="dropdown-item d-flex align-items-center p-2"
                    // onClick={() => navigate("/agent/components/Tickets")}
                    // onClick={() => navigate('/agent/components/Tickets', { state: { clientId: inquiry.Client_id } })}

                  >
                    <i className="fas fa-bell me-3 text-primary"></i>
                    <span>
                      New ticket from <strong>{inquiry.Client_name}</strong>
                    </span>
                  </button>
                </li>
              ))
            ) : (
              <li>
                <span className="dropdown-item text-muted">
                  No new inquiries
                </span>
              </li>
            )}
          </ul>
        </div>

            {/* 🚪 Logout Button */}
<button
  className="btn btn-outline-light"
  onClick={handleLogout}
>
  <i className="fas fa-sign-out-alt me-1"></i>Logout
</button>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="d-flex flex-grow-1 flex-md-row">
      <Sidebar role="admin" ticketCount={notificationCount} />
        <main className="flex-grow-1 p-4 bg-light overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-2 mt-auto">
        © {new Date().getFullYear()} Powered By ATai
      </footer>
    </div>
  );
};

export default AdminLayout;