import React from 'react';
import { useAuth } from '../../context/AuthProvider';
 
const AgentDashboard = () => {
  const { user } = useAuth();
 
  return (
    <div>
      <h2>Agent Dashboard</h2>
      <p>Welcome Agent for Client ID: {user?.clientId}</p>
      {/* Add assigned chats, performance, lead tasks etc. */}
    </div>
  );
};
 
export default AgentDashboard;
 