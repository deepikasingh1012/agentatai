
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import Password from '../auth/Password';
import AdminLayout from "../layouts/admin/AdminLayout";
import AgentLayout from "../layouts/agent/AgentLayout";
import SuperAdminLayout from "../layouts/superadmin/SuperAdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AgentDashboard from "../pages/agent/AgentDashboard";
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";
import ChatbotPage from "../pages/public/ChatbotPage";

//  Agent
import Dashboard from "../pages/agent/components/Dashboard";
import Callbackrequest from "../pages/agent/components/Callbackrequest";
import Help from "../pages/agent/components/Help";
import Tickets from "../pages/agent/components/Tickets";
import Userconversation from "../pages/agent/components/Userconversation";
import Selfassesment from "../pages/agent/components/Selfassesment";
import Notifications from "../pages/agent/components/Notifications";
import NotificationAdmin from "../pages/admin/components/NotificationAdmin";

import ManageProfile from "../pages/agent/components/ManageProfile";


// ✅ Updated imports with correct paths

import Setup from '../pages/admin/components/Setup';
import UpdateDelete from '../pages/admin/components/UpdateDelete';
import AddStaff from '../pages/admin/components/AddStaff';
import AllStaff from '../pages/admin/components/AllStaff';
import AtaiTour from '../pages/admin/components/AtaiTour';


// ✅ Updated imports with correct paths superadmin
import Client from '../pages/superadmin/components/Client';
import AddClient from '../pages/superadmin/components/AddClient';
import AllClient from '../pages/superadmin/components/AllClient';
import ProtectedRoute from '../routes/ProtectedRoute';



const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
       <Route path="/setup-password/:id" element={<Password />} />
            <Route path="/chatbot/:clientId" element={<ChatbotPage />} />



      {/* Admin Routes */}


       <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
        <Route index element={<AdminDashboard />} />
       
        <Route path="components/setup" element={<Setup />} />
        <Route path="components/updatedelete" element={<UpdateDelete />} />
        <Route path="components/add-staff" element={<AddStaff />} />
        <Route path="components/all-staff" element={<AllStaff />} />
         <Route path="components/NotificationAdmin" element={<NotificationAdmin />} />
         <Route path="components/atai-tour" element={<AtaiTour />} />
      </Route>


         {/* Protected Agent Routes */}
            <Route
              path="/agent"
              element={
                <ProtectedRoute>
                  <AgentLayout />
                </ProtectedRoute>
              }
            >
  <Route index element={<Dashboard />} />
  <Route path="components/Callbackrequest" element={<Callbackrequest />} />
  <Route path="components/Help" element={<Help />} />
  <Route path="components/Tickets" element={<Tickets />} />
  <Route path="components/Userconversation" element={<Userconversation />} />
  <Route path="components/selfassesment" element={<Selfassesment />} />
  <Route path="components/Notifications" element={<Notifications />} />
   <Route path="components/manageprofile" element={<ManageProfile />} />
</Route>


      {/* Agent Routes */}

     
     


      {/* SuperAdmin Routes */}
       <Route
              path="/superadmin"
              element={
                <ProtectedRoute>
                  <SuperAdminLayout />
                </ProtectedRoute>
              }
            ></Route>

 <Route path="/superadmin" element={<SuperAdminLayout />}>
        <Route index element={<SuperAdminDashboard />} />
        <Route path="components/client" element={<Client />} />
        <Route path="components/add-client" element={<AddClient />} />
        <Route path="components/all-client" element={<AllClient />} />
        
      </Route>
      </Routes>

 



  );
};



export default AppRoutes;


