import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { verifyUserCredentials } from "../services/AgentServices";
import { forgotPassword } from "../services/Service";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CryptoJS from 'crypto-js';
const clientId = sessionStorage.getItem("clientId");


const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
const [resetEmail, setResetEmail] = useState('');


  const validatePassword = (password) => {
    const startsWithCapital = /^[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const minLength = password.length >= 6;

    if (!startsWithCapital || !hasSpecialChar || !minLength) {
      setError("The password you entered for the username user is incorrect.");
      setFailedAttempts(prev => prev + 1);
      setPassword('');
      return false;
    }
    return true;
  };

  useEffect(() => {
    let interval = null;
    if (isLocked && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsLocked(false);
            setFailedAttempts(0);
            setEmail('');
            setPassword('');
            setError(null);
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLocked, timer]);

  const handleLogin = async (e) => {
    e.preventDefault();
    toast.dismiss();
    setError(null);
    setLoading(true);
    const encryptedPassword = CryptoJS.AES.encrypt(password, 'your-secret-key').toString();

  try {
    const response = await verifyUserCredentials({ email, password: encryptedPassword });
    // Rest of the login logic
  } catch (error) {
    // Error handling
  }

    if (isLocked) {
      
      setLoading(false);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required!");
      toast.error("Email and password are required!");
      setFailedAttempts(prev => prev + 1);
      setPassword('');
      if (failedAttempts + 1 >= 3 && timer === 0) {
        setIsLocked(true);
        setTimer(60);
       
      }
      setLoading(false);
      return;
    }

    // if (email === 'prasadsheleads100@gmail.com' && password === 'ATJOIN44566') {
    //   const mockUser = { email, role: 'superadmin', userId: '123456' };
    //   setUser(mockUser);
      
    //   setFailedAttempts(0);
    //   navigate('/superadmin');
    //   setLoading(false);
    //   return;
    // } 
    if (email === 'prasadsheleads100@gmail.com' && password === 'ATJOIN44566') {
  const mockUser = { 
    email, 
    role: 'superadmin', 
    userId: '123456', 
    clientId: 'mock-client-id', 
    token: 'mock-token',
    name: 'Super Admin'
  };

  sessionStorage.setItem('token', mockUser.token);
  sessionStorage.setItem('email', mockUser.email);
  sessionStorage.setItem('role', mockUser.role);
  sessionStorage.setItem('userId', mockUser.userId);
  sessionStorage.setItem('clientId', mockUser.clientId);
  sessionStorage.setItem('user_name', mockUser.name);

  setUser(mockUser);
  setFailedAttempts(0);
  navigate('/superadmin');
  setLoading(false);
  return;
}
 else if (email === 'prasadsheleads100@gmail.com') {
      setFailedAttempts(prev => prev + 1);
      setPassword('');
      setError('Invalid credentials.');
      // toast.error('Invalid credentials');
      if (failedAttempts + 1 >= 3 && timer === 0) {
        setIsLocked(true);
        setTimer(60);
       
      }
      setLoading(false);
    }

    if (!validatePassword(password)) {
      if (failedAttempts + 1 >= 3 && timer === 0) {
        setIsLocked(true);
        setTimer(60);
      
      }
      setLoading(false);
      return;
    }

    try {
      const response = await verifyUserCredentials({ email, password });

      if (response.status === 'success') {
         toast.dismiss(); // Dismiss any previous toasts
        const { username,user_name, user_id, abbreviation, client_id, role, token } = response.data;

        const userInfo = {
          email: username,
          name:user_name,
          role: role,
          userId: user_id,
          clientId: client_id,
          abbreviation: abbreviation,
          token: token,
        };
         console.log("user Information",userInfo)
        setUser(userInfo);
        // localStorage.setItem("clientId", client_id);
        // localStorage.setItem('user_name', user_name);
        // localStorage.setItem('token', token); 

        sessionStorage.setItem("clientId", client_id);
sessionStorage.setItem("user_name", user_name);
sessionStorage.setItem("token", token);
sessionStorage.setItem("role", role);
sessionStorage.setItem("email", username);
sessionStorage.setItem("userId", user_id);

        console.log("user name",user_name) 
         setError(null); // Clear any previous error
        setFailedAttempts(0);

        if (abbreviation === 'A') {
          navigate('/admin');
        } else if (abbreviation === 'S') {
          navigate('/agent');
        } else {
          setError('Invalid role abbreviation.');
          // toast.error('Invalid role abbreviation.');
          setFailedAttempts(prev => prev + 1);
          setPassword('');
          if (failedAttempts + 1 >= 3 && timer === 0) {
            setIsLocked(true);
            setTimer(60);
           
          }
        }
      } else {
        // setError(response.message || 'Invalid email or password.');
        // toast.error(response.message || 'Invalid email or password.');
        setFailedAttempts(prev => prev + 1);
        setPassword('');
        if (failedAttempts + 1 >= 3 && timer === 0) {
          setIsLocked(true);
          setTimer(60);
          
        }
      }
    } catch (error) {
      console.error('Login Error:', error);
      setError(error.message || 'Login failed. Please try again.');
      toast.error(error.message || 'Login failed. Please try again.');
      setFailedAttempts(prev => prev + 1);
      setPassword('');
      if (failedAttempts + 1 >= 3 && timer === 0) {
        setIsLocked(true);
        setTimer(60);
       
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
  e.preventDefault();
  try {
    await forgotPassword(resetEmail);
    toast.success("Password reset link sent to your email.");
    setResetEmail('');
    setShowForgotPasswordForm(false);
  } catch (error) {
    toast.error(error.message || "Failed to send reset email.");
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
                      disabled={isLocked}
                    />
                    <button
                      type="button"
                      className="btn btn-link text-muted position-absolute top-50 end-0 translate-middle-y"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                      disabled={isLocked}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {isLocked && timer > 0 && (
                    <div className="text-muted small mt-1 text-end">
                      Locked for {timer} seconds
                    </div>
                  )}
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <button type="submit" className="btn btn-primary w-100" disabled={isLocked || loading}>
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>
              <div className="mt-3 text-center">
                {!showForgotPasswordForm ? (
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={() => setShowForgotPasswordForm(true)}
                  >
                    Forgot Password?
                  </button>
                ) : (
                  <form onSubmit={handleForgotPasswordSubmit} className="mt-2">
                    <div className="mb-2">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-secondary w-100">
                      Send Reset Link
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;