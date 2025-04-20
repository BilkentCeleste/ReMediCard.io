import React, { createContext, useContext, useEffect, useState } from "react";
import { login, loginGoogle, register } from "@/apiHelper/backendHelper";
import * as SecureStore from "expo-secure-store";
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { EXPO_PUSH_TOKEN_KEY, GOOGLE_WEB_CLIENT_ID } from "@/constants/config";
import { Alert } from "react-native";

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

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
    GoogleSignin.signOut();
  }, []);

  const loginGoogleAuth = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { idToken, user } = response.data;
        const pushNotificationToken = await SecureStore.getItemAsync(
          EXPO_PUSH_TOKEN_KEY
        );

        const body = {
          email: user.email,
          username: user.name,
          idToken: idToken,
          pushNotificationToken: pushNotificationToken,
        };

        removeToken();
        loginGoogle(body)
          .then((res) => {
            setIsLoggedIn(true);
            addToken(res.data.access_token);
            GoogleSignin.signOut();
          })
          .catch((err) => {
            console.log(err);
            GoogleSignin.signOut();
          });
      }
    } catch (error) {
      console.log(error);

      if (error.code === "PLAY_SERVICES_NOT_AVAILABLE") {
        Alert.alert(
          "Play Services Not Available",
          "Google Play Services must be available on your device to sign in. Please install or update Google Play Services.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      }
    }
  };

  const addToken = async (token) => {
    await SecureStore.setItemAsync("token", token);
  };

  const removeToken = async () => {
    await SecureStore.deleteItemAsync("token");
  };

  const loginAuth = async (body) => {
    removeToken();
    login(body)
      .then((res) => {
        setIsLoggedIn(true);
        addToken(res.data.access_token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const registerAuth = async (body) => {
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
        loginGoogleAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
