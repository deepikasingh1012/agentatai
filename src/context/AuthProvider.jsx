import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Add logout function
  const logout = () => {
    localStorage.removeItem('clientId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}> {/* ✅ Added logout to value */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
