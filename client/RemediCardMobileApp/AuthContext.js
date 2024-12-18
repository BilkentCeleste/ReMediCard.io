import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({
  isLoggedIn: false,
  logIn: () => {},
  logOut: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logIn = () => setIsLoggedIn(true);
  const logOut = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
