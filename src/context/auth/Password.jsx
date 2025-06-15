import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { updatePassword } from "../services/Service";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Password = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { id } = useParams();

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePassword = (password) => {
    const capitalLetter = /^[A-Z]/.test(password);
    const specialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const minLength = password.length >= 6;
    return {
      capitalLetter,
      specialCharacter,
      minLength,
      isValid: capitalLetter && specialCharacter && minLength,
    };
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const passwordValidation = validatePassword(newPassword);

    if (!passwordValidation.isValid) {
      setError("Password must start with a capital letter, contain a special character, and be at least 6 characters long.");
      setSuccessMessage("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await updatePassword(id, newPassword, confirmPassword);
      setSuccessMessage(response.message || "Password updated successfully!");
      setError(null);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(error.message);
      setSuccessMessage("");
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="text-center mb-4">Change Password</h4>
              <form onSubmit={handlePasswordChange}>
                {/* New Password Field */}
                <div className="mb-3 position-relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-link text-muted position-absolute top-50 end-0 translate-middle-y"
                    onClick={toggleNewPasswordVisibility}
                    aria-label="Toggle password visibility"
                  >
                    {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>

                {/* Validation Message */}
                {!validatePassword(newPassword).isValid && newPassword && (
                  <div className="text-danger small mb-2">
                    Password must start with a capital letter, contain a special character, and be at least 6 characters long.
                  </div>
                )}

                {/* Confirm Password Field */}
                <div className="mb-3 position-relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-link text-muted position-absolute top-50 end-0 translate-middle-y"
                    onClick={toggleConfirmPasswordVisibility}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>

                {/* Error or Success Messages */}
                {error && <div className="text-danger small mb-2">{error}</div>}
                {successMessage && <div className="text-success small mb-2">{successMessage}</div>}

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100">
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Password;
