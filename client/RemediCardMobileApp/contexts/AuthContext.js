import React, { createContext, useContext, useState } from 'react';
import { login, register } from '@/apiHelper/backendHelper';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({
    isLoggedIn: false,
    loginAuth: (body) => {},
    registerAuth: (body) => {},
    logoutAuth: () => {},
    dummyAuthenticator: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

    const dummyAuthenticator = async () => {
        setIsLoggedIn( true);
    }

    const addToken = async (token) => {
        await SecureStore.setItemAsync("token", token);
    }

    const removeToken = async () => {
        await SecureStore.deleteItemAsync("token");
    }

    const loginAuth = async (body) => {
        login(body)
          .then((res) => {
              console.log(res);
              setIsLoggedIn( true);
              addToken(res.data.access_token);
          })
          .catch((err) => {
              console.log(err);
          }) };

    const registerAuth = async (body) => {
        register(body)
          .then((res) => {
              setIsLoggedIn( true);
              addToken(res.data.access_token);
          })
          .catch((err) => {
              console.log(err);
          })
    }
      
    const logoutAuth = async () => {
        setUser(null);
        setToken(null);
        setIsLoggedIn( false);
        removeToken();
    };

    return (
      <AuthContext.Provider value={{ isLoggedIn, loginAuth, registerAuth, logoutAuth, dummyAuthenticator, user, token }}>
        {children}
      </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);