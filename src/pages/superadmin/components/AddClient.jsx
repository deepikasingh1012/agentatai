import React, { useState, useEffect } from "react";
import { addClient } from "../../../services/Service";

const AddClient = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const validateForm = () => {
    let newErrors = {};
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    if (!nameRegex.test(name.trim())) newErrors.name = "Name must contain only letters and at least 3 characters.";
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) newErrors.email = "Enter a valid email address.";
    
    const phoneRegex = /^[6-9][0-9]{9}$/;
if (!phoneRegex.test(phone.trim())) newErrors.phone = "Phone number must start with 6-9 and be exactly 10 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const clientId = localStorage.getItem("clientId");

    const ClientData = {
      action_type: "I",
      client_name: name.trim(),
      client_email: email.trim(),
      client_contact_number: phone.trim(),
      client_gstin: null,
      client_address: null,
      client_description: null,
      client_no_of_emp: null,
      client_profile_photo: null,
      p_page_size: null,
      p_page: null,
    };

    try {
      const response = await addClient(ClientData);
      console.log("✅ client Added:", response);
      setName("");
      setEmail("");
      setPhone("");
      showToast("Client added successfully!", "success");
    } catch (error) {
      console.error("❌ Failed to add client:", error);
      showToast("Already this admin is present.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10 col-12">
          <h2 className="text-center mb-4">Add Client</h2>

          <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm bg-light">
            <div className="mb-3">
              <label className="form-label">
                Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Full Name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Email ID <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter valid Email ID"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
            </div>

            <div className="mb-4">
              <label className="form-label">
                Phone Number <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter 10 digit number"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <div className="text-danger small mt-1">{errors.phone}</div>}
            </div>

            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary w-50" disabled={loading}>
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </form>

          {/* Toast */}
          {toast.show && (
            <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
              <div className={`toast show text-white bg-${toast.type}`} role="alert">
                <div className="toast-body">{toast.message}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddClient;
