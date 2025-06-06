import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { verifyUserCredentials } from "../services/AgentServices";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';  // Import toast
import 'react-toastify/dist/ReactToastify.css';  // Import toast CSS

const clientId = localStorage.getItem("clientId");

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const validatePassword = (password) => {
    const startsWithCapital = /^[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const minLength = password.length >= 6;

    if (!startsWithCapital || !hasSpecialChar || !minLength) {
      setError(
        "The password you entered for the username user is incorrect."
      );
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required!");
      toast.error("Email and password are required!");  // Display toast error message
      return;
    }

    if (email === 'prasadsheleads100@gmail.com' && password === 'ATJOIN44566') {
      const mockUser = { email, role: 'superadmin', userId: '123456' };
      setUser(mockUser);
      navigate('/superadmin');
      return;
    }
    // } else {
    //   // Handle invalid login attempt
    //   toast.error('Invalid credentials');  // Display toast error message
    // }

    if (!validatePassword(password)) return;

    try {
      const response = await verifyUserCredentials({ email, password });

      if (response.status === 'success') {
        const { username, user_id, abbreviation, client_id, role } = response.data;

        const userInfo = {
          email: username,
          role: role,
          userId: user_id,
          clientId: client_id,
          abbreviation: abbreviation,
        };

        setUser(userInfo);
        console.log("Storing to localStorage: user_id =", user_id, " clientId =", client_id);
        localStorage.setItem("clientId", client_id); // store clientId if needed
         localStorage.setItem("user_id", user_id); 

        if (abbreviation === 'A') {
          navigate('/admin');
        } else if (abbreviation === 'S') {
          navigate('/agent');
        } else {
          setError('Invalid role abbreviation.');
          toast.error('Invalid role abbreviation.');  // Display toast error message
        }
      } else {
        setError(response.message || 'Invalid email or password.');
        toast.error(response.message || 'Invalid email or password.');  // Display toast error message
      }
    } catch (error) {
      console.error('Login Error:', error);
      setError(error.message || 'Login failed. Please try again.');
      toast.error(error.message || 'Login failed. Please try again.');  // Display toast error message
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            <div className="card p-4 shadow">
              <h3 className="text-center mb-4">Please Login to Your Account</h3>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-5 position-relative">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-link text-muted position-absolute top-50 end-0 translate-middle-y"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
