// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthProvider';
 
// const Login = () => {
//   const navigate = useNavigate();
//   const { setUser } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
 
//   const handleLogin = (e) => {
//     e.preventDefault();
 
//     // Mock authentication based on email (for demo purposes)
//     let role = '';
//     if (email.includes('superadmin')) role = 'superadmin';

//     else if (email.includes('agent')) role = 'agent';
//     else if(email.includes('admin')) role = 'admin';
  
//     const mockUser = { email, role, clientId: '123456' };
//     setUser(mockUser);
 
//     if (role === 'superadmin') navigate('/superadmin');
   
//     else if (role === 'agent') navigate('/agent');
//     else  if (role === 'admin') navigate('/admin');
//     else alert('Invalid role');
//   };
  

 
//   return (
//     <div className="container mt-5">
//       <h2>Login</h2>
//       <form onSubmit={handleLogin} className="w-50">
//         <div className="mb-3">
//           <label htmlFor="email" className="form-label">Email</label>
//           <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="password" className="form-label">Password</label>
//           <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         </div>
//         <button type="submit" className="btn btn-primary">Login</button>
//       </form>
//     </div>
//   );
// };
// export default Login;
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthProvider';
// import { verifyUserCredentials } from "../services/AgentServices";

// const Login = () => {
//   const navigate = useNavigate();
//   const { setUser } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState(null);
  


//   const validatePassword = (password) => {
//     const startsWithCapital = /^[A-Z]/.test(password);
//     const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
//     const minLength = password.length >= 6;

//     if (!startsWithCapital || !hasSpecialChar || !minLength) {
//       setError(
//         "Password must start with a capital letter, contain a special character, and be at least 6 characters long."
//       );
//       return false;
//     }
//     return true;
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (!email.trim() || !password.trim()) {
//       setError("Email and password are required!");
//       return;
//     }

//     let role = '';

//     if (email.includes('superadmin')) {
//       role = 'superadmin';
//     } else if (email.includes('admin')) {
//       role = 'admin';
//     } else {
//       role = 'agent';  // default role
//     }

//     if (role === 'superadmin' || role === 'admin') {
//       const mockUser = { email, role, userId: '123456' };
//       setUser(mockUser);
//       navigate(`/${role}`);
//       return;
//     }

//     if (role === 'agent' && !validatePassword(password)) return;

//     try {
//       const response = await verifyUserCredentials({ email, password });

//       if (response.status === 'success') {
//         const userInfo = {
//           email: response.data.username,
//           role: role,
//           userId: response.data.user_id
//         };
//         setUser(userInfo);
//         navigate('/agent');
//       } else {
//         setError(response.message || 'Invalid email or password.');
//       }
//     } catch (error) {
//       console.error('Login Error:', error);
//       setError(error.message || 'Login failed. Please try again.');
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="text-center mb-4">Welcome ! Please Login to Your Account</h2>
//       {/* <h2>Login</h2> */}
//       <form onSubmit={handleLogin} className="w-50">
//         <div className="mb-3">
//           <label htmlFor="email" className="form-label">Email</label>
//           <input
//             type="email"
//             className="form-control"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-3">
//   <label htmlFor="password" className="form-label">Password</label>
//   <div className="input-group">
//     <input
//       type={showPassword ? "text" : "password"}
//       className="form-control"
//       id="password"
//       value={password}
//       onChange={(e) => setPassword(e.target.value)}
//       required
//     />
//     <button
//       className="btn btn-outline-secondary"
//       type="button"
//       onClick={() => setShowPassword(!showPassword)}
//       tabIndex={-1}
//     >
//       <span className="material-icons">
//         {showPassword ? "visibility" : "visibility_off"}
//       </span>
//     </button>
//   </div>
// </div>

//         {error && <div className="alert alert-danger">{error}</div>}

//         <button type="submit" className="btn btn-primary">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { verifyUserCredentials } from "../services/AgentServices";
import bcrypt from 'bcryptjs';

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
        "Password must start with a capital letter, contain a special character, and be at least 6 characters long."
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
      return;
    }

    let role = '';
    if (email.includes('superadmin')) {
      role = 'superadmin';
    } else if (email.includes('admin')) {
      role = 'admin';
    } else {
      role = 'agent';
    }

    if (role === 'superadmin' || role === 'admin') {
      const mockUser = { email, role, userId: '123456' };
      setUser(mockUser);
      navigate(`/${role}`);
      return;
    }

    if (role === 'agent' && !validatePassword(password)) return;

    try {
      // const hashedPassword = await bcrypt.hash(password, 10);
      const response = await verifyUserCredentials({ email, password });
      setPassword('');
      // const response = await verifyUserCredentials({ email, password: hashedPassword });

      if (response.status === 'success') {
        const { client_id, username, user_id } = response.data;

        const userInfo = {
          email: username,
          role: role,
          userId: user_id,
          clientId: client_id
        };

        setUser(userInfo); // set to Context
        localStorage.setItem('clientId', client_id); // store in Local Storage

        navigate('/agent');  // will load Dashboard — which can now use this clientId
      } else {
        setError(response.message || 'Invalid email or password.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setError(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Welcome! Please Login to Your Account</h2>
      <form onSubmit={handleLogin} className="w-50">
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

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              required
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              <span className="material-icons">
                {showPassword ? "visibility" : "visibility_off"}
              </span>
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;


