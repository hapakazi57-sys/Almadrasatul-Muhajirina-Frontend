import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('amm_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (loginResponse) => {
    localStorage.setItem('amm_token', loginResponse.token);
    localStorage.setItem('amm_admin', JSON.stringify(loginResponse));
    setAdmin(loginResponse);
  };

  const logout = () => {
    localStorage.removeItem('amm_token');
    localStorage.removeItem('amm_admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
