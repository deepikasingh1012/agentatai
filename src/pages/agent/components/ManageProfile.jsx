import React, { useEffect, useState } from "react";
import { fetchUserById } from "../../../services/AgentServices";

function ManageProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!user_id) return;

    setIsLoading(true);
    fetchUserById(user_id)
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user_id]);
//review
  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }
  if (isLoading) {
    return <div className="alert alert-info">Loading user…</div>;
  }
  if (!user) {
    return <div className="alert alert-warning">No user found for ID {user_id}</div>;
  }

  return (
<div className="container mt-5">
      <div className="row justify-content-center">
        
      <div className="col-12 col-sm-10 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0 text-center">My Profile</h5>
            </div>
             <div className="card-body">
          <p className="mb-2">
            <i className="fas fa-user me-2"></i>
            <strong>Name:</strong> {user.user_name}
          </p>
          <p className="mb-2">
            <i className="fas fa-envelope me-2"></i>
            <strong>Email:</strong> {user.email}
          </p>
          <p className="mb-2">
            <i className="fas fa-phone me-2"></i>
            <strong>Phone:</strong> {user.mobile}
          </p>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageProfile;
