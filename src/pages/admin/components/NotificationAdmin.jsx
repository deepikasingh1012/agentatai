import React, { useEffect, useState } from "react";
import { getTodaysFollowups }from "../../../services/AgentServices";

const NotificationAdmin = () => {
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clientId = sessionStorage.getItem("clientId");
    
    const fetchData = async () => {
      const { success, followups } = await getTodaysFollowups(clientId);
      if (success) {
        setFollowups(followups);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="container my-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">📅 Today's Follow-ups</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading...</p>
          ) : followups.length === 0 ? (
            <p className="text-muted">No follow-ups scheduled for today.</p>
          ) : (
            <ul className="list-group">
              {followups.map((item, index) => (
                <li key={index} className="list-group-item">
                  <strong>User ID:</strong>  {`CBR-${item.User_id}`} <br />
                  <strong>Remarks:</strong> {item.agent_remarks} <br />
                  <strong>Next Follow-up:</strong>{" "}
                  {new Date(item.Next_followup).toLocaleDateString("en-GB")}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationAdmin;

