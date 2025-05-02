import React, { useState, useEffect } from "react";
import { getClientId, checkClientId, sendClientIdToAPI } from "../../../services/Service";

const Client = () => {
  const [clientId, setClientId] = useState(""); // ✅ State for client ID
  const [status, setStatus] = useState(""); // ✅ Status for validation

  // ✅ Load stored Client ID on page load
  useEffect(() => {
    const storedClientId = localStorage.getItem("clientId"); // Retrieve from localStorage
    if (storedClientId) {
      setClientId(storedClientId); // ✅ Set stored client ID
      setStatus("✅ Stored Client ID found.");
    }
  }, []);

  const handleClientIdChange = (e) => {
    setClientId(e.target.value);
    setStatus(""); // ✅ Clear status on typing
  };

  const handleValidateClientId = async () => {
    if (!clientId.trim()) {
      setStatus("❌ Please enter a Client ID.");
      return;
    }

    try {
      const isValid = await checkClientId(clientId);
      if (isValid) {
        setStatus("✅ Client ID is valid.");
        localStorage.setItem("clientId", clientId); // ✅ Store client ID
        await sendClientIdToAPI(clientId);
      } else {
        setStatus("❌ Invalid Client ID. Please check.");
      }
    } catch (error) {
      console.error("Error handling Client ID:", error);
      setStatus("⚠ Error validating Client ID.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
    <div className="card p-4 shadow w-50">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6">
          <h4 className="text-center mb-3">Enter Client ID</h4>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter Client ID"
            value={clientId}
            onChange={handleClientIdChange}
          />

          <button className="btn btn-primary w-100 mb-2" onClick={handleValidateClientId}>
            Validate Client ID
          </button>

          {status && <p className="text-center fw-bold mt-2">{status}</p>}
        </div>
      </div>
    </div>
  </div>
);
};

export default Client;