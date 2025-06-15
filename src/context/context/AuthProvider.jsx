// import React, { createContext, useContext, useState , useEffect } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//  useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     const email = sessionStorage.getItem('email');
//     const role = sessionStorage.getItem('role');
//     const userId = sessionStorage.getItem('userId');
//     const clientId = sessionStorage.getItem('clientId');
//     const name = sessionStorage.getItem('user_name');

//     if (token) {
//       setUser({ token, email, role, userId, clientId, name });
//     }
//   }, []);
  

//   // ✅ Add logout function
//   const logout = () => {
//       sessionStorage.clear();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, logout }}> {/* ✅ Added logout to value */}
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Load user from sessionStorage on initial app load (per tab)
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const email = sessionStorage.getItem('email');
    const role = sessionStorage.getItem('role');
    const userId = sessionStorage.getItem('userId');
    const clientId = sessionStorage.getItem('clientId');
    const name = sessionStorage.getItem('user_name');

    if (token) {
      setUser({ token, email, role, userId, clientId, name });
    }
  }, []);

  // ✅ Clear sessionStorage on logout
  const logout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

