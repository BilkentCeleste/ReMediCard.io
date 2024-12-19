import React, { createContext, useContext, useState } from 'react';
import { login, register } from './apiHelper/backendHelper';

const AuthContext = createContext({
    isLoggedIn: false,
    loginAuth: (body) => {},
    registerAuth: (body) => {},
    logoutAuth: () => {},
});

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const loginAuth = async (body) => {
        login(body)
          .then((res) => {
              console.log(res);
              setIsLoggedIn( true);
          })
          .catch((err) => {
              console.log(err);
          }) };

    const registerAuth = async (body) => {
        register(body)
          .then((res) => {
              console.log(res);
              setIsLoggedIn( true);
          })
          .catch((err) => {
              console.log(err);
          })
    }
      
    const logoutAuth = async () => {
        setUser(null);
        setToken(null);
        setIsLoggedIn( false);
    };

    return (
      <AuthContext.Provider value={{ isLoggedIn, loginAuth, registerAuth, logoutAuth, user, token }}>
        {children}
      </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
