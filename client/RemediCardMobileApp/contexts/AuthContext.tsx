import React, { createContext, useContext, useState } from "react";
import { login, register } from "@/apiHelper/backendHelper";
import * as SecureStore from "expo-secure-store";

export interface User {
  username?: string;
  email?: string;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  loginAuth: (body: any) => Promise<void>;
  registerAuth: (body: any) => Promise<void>;
  logoutAuth: () => Promise<void>;
  addToken: (token: string) => Promise<void>;
  setIsLoggedIn: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  token: null,
  loginAuth: async () => {},
  registerAuth: async () => {},
  logoutAuth: async () => {},
  addToken: async () => {},
  setIsLoggedIn: () => {},
});

// Export the useAuth hook with proper typing
export const useAuth = (): AuthContextType => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const addToken = async (token: string) => {
    await SecureStore.setItemAsync("token", token);
  };

  const removeToken = async () => {
    await SecureStore.deleteItemAsync("token");
  };

  const loginAuth = async (body: any) => {
    removeToken()
    login(body)
      .then((res) => {
        setIsLoggedIn(true);
        addToken(res.data.access_token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const registerAuth = async (body: any) => {
    register(body)
      .then((res) => {
        setIsLoggedIn(true);
        addToken(res.data.access_token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const logoutAuth = async () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    await removeToken();
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        loginAuth,
        registerAuth,
        logoutAuth,
        user,
        token,
        addToken,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 