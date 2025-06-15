// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// const Sidebar = ({ role }) => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const toggleSidebar = () => setIsCollapsed(!isCollapsed);

//   return (
//     <>
//       {/* Top Toggle Button Bar */}
//       <div className="bg-dark text-white p-2">
//         <div className="d-flex justify-content-between align-items-center">
//           {/* Toggle Button for mobile only */}
//           <button
//             className="btn btn-outline-light d-md-none"
//             type="button"
//             data-bs-toggle="offcanvas"
//             data-bs-target="#mobileSidebar"
//           >
//             <i className="fas fa-bars"></i>
//           </button>
//         </div>
//       </div>

//       {/* Mobile Offcanvas Sidebar */}
//       <div
//         className="offcanvas offcanvas-start bg-dark text-white min-vh-100"
//         tabIndex="-1"
//         id="mobileSidebar"
//       >
//         <div className="offcanvas-header">
//           <h5 className="offcanvas-title">
//             {role.charAt(0).toUpperCase() + role.slice(1)}
//           </h5>
//           <button
//             type="button"
//             className="btn-close btn-close-white"
//             data-bs-dismiss="offcanvas"
//             aria-label="Close"
//           ></button>
//         </div>
//         <div className="offcanvas-body p-0">{renderSidebarLinks(role)}</div>
//       </div>

//       {/* Desktop Sidebar */}
//       <div
//         className={`bg-dark text-white p-3 min-vh-100 d-none d-md-flex flex-column sidebar-transition ${
//           isCollapsed ? "collapsed" : ""
//         }`}
//         style={{ minWidth: isCollapsed ? "60px" : "220px" }}
//       >
//         {!isCollapsed && (
//           <h4 className="mb-4">
//             {role.charAt(0).toUpperCase() + role.slice(1)}
//           </h4>
//         )}
//         {renderSidebarLinks(role, isCollapsed)}
//       </div>
//     </>
//   );
// };

// const renderSidebarLinks = (role, isCollapsed = false) => (
//   <ul className="nav flex-column">
//     {role === "admin" && (
//       <>
//         <li className="nav-item mb-2">
//           <Link className="nav-link text-white" to="/admin">
//             <i className="fas fa-home me-2"></i>
//             {!isCollapsed && "Dashboard"}
//           </Link>
//         </li>
//         <li className="nav-item mb-2">
//           <Link className="nav-link text-white" to="/admin/components/setup">
//             <i className="fas fa-ticket-alt me-2"></i>
//             {!isCollapsed && "SETup Atai"}
//           </Link>
//         </li>
//         <li className="nav-item mb-2">
//           <Link
//             className="nav-link text-white"
//             to="/admin/components/updatedelete"
//           >
//             <i className="fas fa-edit me-2"></i>
//             {!isCollapsed && "Manage Options"}
//           </Link>
//         </li>
//         <li className="nav-item mb-2">
//           <Link
//             className="nav-link text-white"
//             to="/admin/components/add-staff"
//           >
//             <i className="fas fa-user-plus me-2"></i>
//             {!isCollapsed && "Add Staff"}
//           </Link>
//         </li>
//         <li className="nav-item mb-2">
//           <Link
//             className="nav-link text-white"
//             to="/admin/components/all-staff"
//           >
//             <i className="fas fa-users me-2"></i>
//             {!isCollapsed && "All Staff"}
//           </Link>
//         </li>
//       </>
//     )}
//     {role === "agent" && (
//       <>
//         <li className="nav-item mb-2">
//           <Link className="nav-link text-white" to="/agent">
//             <i className="fas fa-home me-2"></i>
//             {!isCollapsed && "Dashboard"}
//           </Link>
//         </li>
//         <li className="nav-item mb-2">
//           <Link className="nav-link text-white" to="/agent/components/Tickets">
//             <i className="fas fa-ticket-alt me-2"></i>
//             {!isCollapsed && "Tickets"}
//           </Link>
//         </li>
//         <li className="nav-item mb-2">
//           <Link
//             className="nav-link text-white"
//             to="/agent/components/Selfassesment"
//           >
//             <i className="fas fa-file-alt me-2"></i>
//             {!isCollapsed && "Self Assessment Report"}
//           </Link>
//         </li>

//         <li className="nav-item mb-2">
//           <Link
//             className="nav-link text-white"
//             to="/agent/components/ManageProfile "
//           >
//             <i className="fas fa-user-cog me-2"></i>
//             {!isCollapsed && "My Profile"}
//           </Link>
//         </li>
//         <li className="nav-item mb-2">
//           <Link
//             className="nav-link text-white"
//             to="/agent/components/Notifications"
//           >
//             <i className="fas fa-bell me-2"></i>
//             {!isCollapsed && "Notifications"}
//           </Link>
//         </li>

//         <li className="nav-item mb-2">
//           <Link className="nav-link text-white" to="/agent/components/Help ">
//             <i className="fas fa-question-circle me-2"></i>
//             {!isCollapsed && "Help And Support"}
//           </Link>
//         </li>
//       </>
//     )}
//     {role === "superadmin" && (
//       <>
//         <li className="nav-item mb-2">
//           <Link className="nav-link text-white" to="/superadmin/settings">
//             <i className="fas fa-cogs me-2"></i>
//             {!isCollapsed && "Settings"}
//           </Link>
//         </li>
//         <li className="nav-item mb-2">
//           <Link
//             className="nav-link text-white"
//             to="/superadmin/components/client"
//           >
//             <i className="fas fa-user me-2"></i>
//             {!isCollapsed && "Client"}
//           </Link>
//         </li>
//       </>
//     )}
//   </ul>
// );

// export default Sidebar;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


import './sidebar.css';
const Sidebar = ({ role, ticketCount }) => {
   const location = useLocation();
  const [ataiClicked, setAtaiClicked] = useState(location.pathname === "/admin/components/atai-tour");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  

  const handleAtaiClick = () => {
    setAtaiClicked(true);
  };

  return (
    
    <div className="bg-dark text-white p-3 min-vh-100 d-none d-md-flex flex-column" >
      <h4 className="mb-4">{role.charAt(0).toUpperCase() + role.slice(1)}</h4>
      <ul className="nav flex-column">





        {role === 'admin' && (
          <>
            <li className="nav-item mb-2">
              <Link className="nav-link text-white" to="/admin"><i className="fas fa-home me-2"></i>Dashboard</Link>
            </li>
            <li className="nav-item mb-2">

              <Link className="nav-link text-white" to="/admin/components/setup"><i className="fas fa-ticket-alt me-2"></i>Configure ATai</Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link text-white text-nowrap" to="/admin/components/updatedelete"><i className="fas fa-edit me-2"></i>Manage Options</Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link text-white" to="/admin/components/add-staff"><i className="fas fa-user-plus me-2"></i>Add Staff</Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link text-white" to="/admin/components/all-staff"><i className="fas fa-users me-2"></i>Manage Staff</Link>
            </li>
             <li className="nav-item mb-2">
           <Link
            className="nav-link text-white"
             to="/admin/components/NotificationAdmin"
           >
             <i className="fas fa-bell me-2"></i>
             Notifications
           </Link>
         </li>

            
            {/* <li className="nav-item mb-2">
              <Link className="nav-link text-white" to="/admin/components/atai-tour"> <i className="fas fa-route me-2"></i>ATai Tour</Link>
            </li> */}
            {/* <li className="nav-item mb-2">
              <Link className="nav-link text-white" to="/admin/components/atai-tour">
              {ticketCount === 0 && (
  <i
    className="fas fa-arrow-right me-2"
    style={{
      animation: 'blink 1s infinite',
      color: 'yellow',
    }}
  ></i>
)}
                <i className="fas fa-route me-2"></i>ATai Tour
              </Link>
            </li> */}

            <li className="nav-item mb-2">
              <Link
                className="nav-link text-white"
                to="/admin/components/atai-tour"
                onClick={handleAtaiClick}
              >
                {!ataiClicked && ticketCount === 0 && (
                  <i
                    className="fas fa-arrow-right me-2"
                    style={{
                      animation: 'blink 1s infinite',
                      color: 'yellow',
                    }}
                  ></i>
                )}
                <i className="fas fa-route me-2"></i>ATai Tour
              </Link>
            </li>
          </>
        )}
        {role === 'agent' && (
          <>
            {/* <li className="nav-item mb-2">
                  <Link className="nav-link text-white" to="/agent"><i className="fas fa-home me-2"></i>Dashboard</Link>
                </li> */}

            <li className="nav-item mb-2">
              <Link className="nav-link text-white" to="/agent"> <i className="fas fa-home me-2"></i>Dashboard</Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link text-white" to="/agent/components/Tickets"><i className="fas fa-ticket-alt me-2"></i>Tickets</Link>
            </li>
            {/* <li className="nav-item mb-2">
                      <Link className="nav-link text-white" to="/agent/components/Callbackrequest"><i className="fas fa-phone-alt fa-rotate-90 me-2"></i>Callback Request</Link>
                    </li> */}
            <li className="nav-item mb-2">
              <Link className="nav-link text-white" to="/agent/components/Selfassesment "><i className="fas fa-file-alt me-2"></i>Self Assessment Report</Link>


            </li>
            {/* <li className="nav-item mb-2">
              <Link className="nav-link text-white" to="/agent/components/Help ">
              <i className="fas fa-question-circle me-2"></i>{ 'Help And Support'}</Link>
            </li> */}
            <li className="nav-item mb-2">
                      <Link className="nav-link text-white" to="/agent/components/Help "><i className="fas fa-question-circle me-2"></i>Help And Support</Link>
                    </li>
                     <li className="nav-item mb-2">
           <Link
             className="nav-link text-white"
             to="/agent/components/ManageProfile "
           >
             <i className="fas fa-user-cog me-2"></i>
              My Profile
           </Link>
         </li>
         <li className="nav-item mb-2">
           <Link
            className="nav-link text-white"
             to="/agent/components/Notifications"
           >
             <i className="fas fa-bell me-2"></i>
             Notifications
           </Link>
         </li>
          </>
        )}

        {role === 'superadmin' && (
          <>
            {/* <li className="nav-item mb-2">
              <Link className="nav-link text-white" to="/superadmin/settings"><i className="fas fa-cogs me-2"></i>Settings</Link>
            </li> */}
            {/* <li className="nav-item mb-2">
              <Link className="nav-link text-white" to="/superadmin/components/client"><i className="fas fa-user me-2"></i>Client</Link>
            </li> */}
            <li className="nav-item mb-2">
              <Link className="nav-link text-white" to="/superadmin/components/add-client"><i className="fas fa-user-plus me-2"></i>Add Client</Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link text-white" to="/superadmin/components/all-client"><i className="fas fa-users me-2"></i>All Client</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;


