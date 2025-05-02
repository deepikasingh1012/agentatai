import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthProvider";
import { getRecentInquiries } from "../../services/AgentServices";

const AgentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const notificationRef = useRef(null);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/agent/":
        return "Welcome To Agent Dashboard";
      case "/agent/components/Tickets":
        return "Ticket Summary";
      case "/agent/components/Callbackrequest":
        return "Callback Requests";
      case "/agent/components/Selfassesment":
        return "Self Assessment Report";
      case "/agent/components/help":
        return "Help and Support";
      default:
        return "Welcome To Agent Dashboard";
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
      const clientId = localStorage.getItem("clientId");
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
      {/* Header */}
      <div className="navbar navbar-expand-lg bg-dark text-white px-4 justify-content-center">
        <h5 className="mb-0 text-white">{getPageTitle()}</h5>

        {/* Search Bar */}
        <form className="d-flex ms-auto me-4">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Desktop View: Notification and Logout */}
        <div className="dropdown d-none d-lg-block me-3">
          <button
            className="btn btn-light position-relative"
            type="button"
            onClick={() => {
              setNotificationCount(0);
              navigate("/agent/components/Tickets");
            }}
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
                    className="dropdown-item"
                    onClick={() => {
                      setNotificationCount(0);
                      navigate("/agent/components/Tickets");
                    }}
                  >
                    <i className="fa fa-bell text-primary me-2"></i>
                    Notifications
                    {notificationCount > 0 && (
                      <span className="badge bg-danger ms-2">
                        {notificationCount}
                      </span>
                    )}
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

        <button
          className="btn btn-outline-light"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <i className="fas fa-sign-out-alt me-1"></i>Logout
        </button>
      </div>
      {/* Mobile View: Toggle Menu */}
      <div className="dropdown d-flex d-lg-none">
        <button
          className="btn btn-light dropdown-toggle"
          type="button"
          id="mobileMenu"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fas fa-bars"></i>
        </button>
        <ul
          className="dropdown-menu dropdown-menu-end"
          aria-labelledby="mobileMenu"
        >
          <li>
            <button
              className="dropdown-item"
              onClick={() => {
                setShowNotifications((prev) => !prev);
                setNotificationCount(0);
              }}
            >
              <i className="fa fa-bell text-primary me-2"></i>
              Notifications
              {notificationCount > 0 && (
                <span className="badge bg-danger ms-2">
                  {notificationCount}
                </span>
              )}
            </button>
          </li>
          <li>
            <button
              className="dropdown-item"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <i className="fas fa-sign-out-alt me-2"></i>Logout
            </button>
          </li>
        </ul>
      </div>{" "}
      {/* Correct closing of the navbar div */}
      {/* Layout Content */}
      <div className="d-flex flex-grow-1">
        <Sidebar role="agent" />
        <main className="flex-grow-1 p-4 bg-light overflow-auto">
          <Outlet context={{ searchQuery, setSearchQuery }} />
        </main>
      </div>
      <footer className="bg-dark text-white text-center py-2 mt-auto">
        © {new Date().getFullYear()} powered by ATai
      </footer>
    </div>
  );
};

export default AgentLayout;
