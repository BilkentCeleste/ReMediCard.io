import React, { createContext, useContext, useState } from 'react';
import { login } from './apiHelper/backendHelper';

const AuthContext = createContext({
  isLoggedIn: false,
  logIn: (body) => {console.log("asd");},
  logOut: () => {},
});

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const logIn = async (body) => { login(body)
          .then((res) => { console.log(res); setIsLoggedIn( true); })
          .catch((err) => { console.log(err); }) };
      
    const logOut = async () => { setUser(null); setToken(null); setIsLoggedIn( false);};



    return (
      <AuthContext.Provider value={{ isLoggedIn, logIn, logOut, user, token }}>
        {children}
      </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
