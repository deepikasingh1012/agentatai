
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
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



// ✅ Updated imports with correct paths
import Client from '../pages/superadmin/components/Client';
import Setup from '../pages/admin/components/Setup';
import UpdateDelete from '../pages/admin/components/UpdateDelete';
import AddStaff from '../pages/admin/components/AddStaff';
import AllStaff from '../pages/admin/components/AllStaff';



const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />



      {/* Admin Routes */}


      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
       
        <Route path="components/setup" element={<Setup />} />
        <Route path="components/updatedelete" element={<UpdateDelete />} />
        <Route path="components/add-staff" element={<AddStaff />} />
        <Route path="components/all-staff" element={<AllStaff />} />
      </Route>


      <Route path="/agent" element={<AgentLayout />}>
  <Route index element={<Dashboard />} />
  <Route path="components/Callbackrequest" element={<Callbackrequest />} />
  <Route path="components/Help" element={<Help />} />
  <Route path="components/Tickets" element={<Tickets />} />
  <Route path="components/Userconversation" element={<Userconversation />} />
  <Route path="components/selfassesment" element={<Selfassesment />} />
</Route>


      {/* Agent Routes */}

      <Route path="/agent" element={<AgentLayout />}>
        <Route index element={<AgentDashboard />} />
      </Route>


      {/* SuperAdmin Routes */}


      <Route path="/superadmin" element={<SuperAdminLayout />}>
        <Route index element={<SuperAdminDashboard />} />
        <Route path="components/client" element={<Client />} />
      </Route>

      {/* Chatbot Public Route */}
      <Route path="/chatbot/:clientId" element={<ChatbotPage />} />
    </Routes>



  );
};



export default AppRoutes;


