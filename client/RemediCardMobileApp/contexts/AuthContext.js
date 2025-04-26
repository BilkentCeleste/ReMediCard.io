import React, { createContext, useContext, useEffect, useState } from "react";
import { login, loginGoogle, register } from "@/apiHelper/backendHelper";
import * as SecureStore from "expo-secure-store";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { EXPO_PUSH_TOKEN_KEY, GOOGLE_WEB_CLIENT_ID, LANGUAGE_KEY } from "@/constants/config";
import { Alert } from "react-native";
import {useTranslation} from "react-i18next";

const AuthContext = createContext({
  isLoggedIn: false,
  loginAuth: (body) => {},
  registerAuth: (body) => {},
  logoutAuth: () => {},
  loginGoogleAuth: (body) => {}
});

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation("auth_context");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const existingToken = await SecureStore.getItemAsync("token");
        const tokenTime = parseInt(await SecureStore.getItemAsync("tokenTime"));

        if (existingToken && tokenTime + 86400000 > Date.now()) { // 24 hours in milliseconds
          setIsLoggedIn(true);
          setToken(existingToken);
        }
      } catch (error) {
        console.error("Error checking token:", error);
      }
    };

    checkToken();
    
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

        const language = await SecureStore.getItemAsync(
          LANGUAGE_KEY
        );

        const body = {
          email: user.email,
          username: user.name,
          idToken: idToken,
          pushNotificationToken: pushNotificationToken,
          language: language === "en" ? "ENGLISH" : "TURKISH"
        };

        removeToken();

        loginGoogle(body)
          .then((res) => {
            setIsLoggedIn(true);
            addToken(res.data.access_token);
            GoogleSignin.signOut();
          })
          .catch((err) => {
            GoogleSignin.signOut();
          });
      }
    } catch (error) {
      if (error.code === "PLAY_SERVICES_NOT_AVAILABLE") {
        Alert.alert(
          t("google_play_services_error_title"),
          t("google_play_services_error_message"),
          [{ text: t("ok") }],
          { cancelable: false }
        );
      }
    }
  };

  const addToken = async (token) => {
    await SecureStore.setItemAsync("token", token);
    const time = Date.now();
    await SecureStore.setItemAsync("tokenTime", time.toString());
  };

  const removeToken = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("tokenTime");
  };

  const loginAuth = async (body) => {
    removeToken();
    login(body)
      .then((res) => {
        setIsLoggedIn(true);
        addToken(res.data.access_token);
      })
      .catch((err) => {
        Alert.alert(
            t("login_error_title"),
            t("login_error_message"),
            [{ text: t("ok") }],
            { cancelable: false }
            );
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
