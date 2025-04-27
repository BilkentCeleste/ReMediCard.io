import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import {
  LockIcon,
  AtIcon,
  GoogleIcon,
  EyeOpenIcon,
  EyeClosedIcon,
} from "@/constants/icons";
import { Link } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import { useTranslation } from "react-i18next";
import { EXPO_PUSH_TOKEN_KEY, LANGUAGE_KEY } from "@/constants/config";
import * as SecureStore from "expo-secure-store";

export default function Login() {
  const { t, i18n } = useTranslation("login");
  const { isLoggedIn, loginAuth, loginGoogleAuth } = useAuth();

  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLanguageSelection = (language: any) => {
    if (selectedLanguage === language) {
      return;
    }

    setSelectedLanguage(language);
    i18n.changeLanguage(language);
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    const pushNotificationToken = await SecureStore.getItemAsync(
      EXPO_PUSH_TOKEN_KEY
    );

    const language = await SecureStore.getItemAsync(
      LANGUAGE_KEY
    );

    const body = {
      username: username,
      password: password,
      pushNotificationToken: pushNotificationToken,
      language: language === "en" ? "ENGLISH" : "TURKISH"
    };

    loginAuth(body);
  };

  const handleLoginWithGoogle = () => {
    loginGoogleAuth();
  };

  return isLoggedIn ? (
    <Redirect href="/(app)/home" />
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>{t("title")}</Text>

      <View style={styles.component}>
        <AtIcon />
        <TextInput
          style={[styles.usernametext]}
          placeholder={t("username")}
          placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
          value={username}
          onChangeText={setUsername}
        ></TextInput>
      </View>

      <View style={styles.passwordContainer}>
        <LockIcon />
        <TextInput
            style={styles.passwordtext}
            placeholder={t("password")}
            placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          {passwordVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logincomponent} onPress={handleLogin}>
        <Text style={styles.logintext}>{t("log_in")}</Text>
      </TouchableOpacity>

      <View style={styles.forgotPasswordContainer}>
        <Link href="/forgot_password" style={styles.link}>
          <Text>{t("forgot_password")}</Text>
        </Link>
      </View>

      <View style={styles.rememberMeContainer}>
        <Pressable style={styles.checkbox} onPress={toggleRememberMe}>
          {rememberMe && <Text style={styles.checkmark}>✓</Text>}
        </Pressable>
        <TouchableOpacity onPress={toggleRememberMe}>
          <Text style={styles.rememberMeText}>{t("remember_me")}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.seperatortext}>{t("or")}</Text>
        <View style={styles.separatorLine} />
      </View>

      <TouchableOpacity
        style={styles.component}
        onPress={handleLoginWithGoogle}
      >
        <GoogleIcon></GoogleIcon>
        <Text style={styles.googleButtonText}>{t("continue_with_google")}</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={[
            styles.languageOption,
            selectedLanguage === "en" && styles.selectedOption,
          ]}
          onPress={() => {
            handleLanguageSelection("en");
          }}
        >
          <Image
            source={require("../assets/images/uk_flag.png")}
            style={styles.flag_image}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.languageOption,
            selectedLanguage === "tr" && styles.selectedOption,
          ]}
          onPress={() => {
            handleLanguageSelection("tr");
          }}
        >
          <Image
            source={require("../assets/images/tr_flag.png")}
            style={styles.flag_image}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.seperatortext}>
            {t("dont_have_an_account")}
            <Link href="/register" style={styles.link}>
              <Text> {t("sign_up")}</Text>
            </Link>
          </Text>
          <View style={styles.separatorLine} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#53789D",
  },
  component: {
    height: 50,
    borderRadius: 20,
    backgroundColor: "#fff",
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 75,
    color: "#ffff",
  },
  usernametext: {
    top: 15,
    left: 45,
    fontSize: 18,
    lineHeight: 22,
    width: "100%",
    fontFamily: "Inter-Regular",
    color: "#111",
    textAlign: "left",
    zIndex: 1,
    position: "absolute",
  },
  passwordContainer: {
    height: 50,
    borderRadius: 20,
    backgroundColor: "#fff",
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
    gap: 10,
  },
  passwordtext: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Inter-Regular",
    color: "#111",
  },
  logincomponent: {
    height: 50,
    borderRadius: 20,
    backgroundColor: "#2916ff",
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    gap: 30,
    marginBottom: 20,
  },
  logintext: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: "InriaSans-Regular",
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  forgotPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 3,
    marginRight: 10,
    backgroundColor: "#53789D",
    justifyContent: "center",
    textAlign: "center",
  },
  rememberMeText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Inter-Regular",
  },
  checkmark: {
    fontSize: 16,
    color: "#fff",
    justifyContent: "center",
    textAlign: "center",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "75%",
    marginVertical: 10,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#fff",
  },
  seperatortext: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#fff",
  },
  link: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#2518c7",
    cursor: "pointer",
    fontWeight: "bold",
  },
  googleButtonText: {
    alignSelf: "center",
    fontSize: 16,
    color: "#000",
    fontFamily: "Inter-Regular",
  },
  bottomContainer: {
    width: "100%",
    top: 75,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButton: {
    marginLeft: 175,
  },
  toggleText: {
    fontSize: 14,
    color: "#2916FF",
    right: -15
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    fontSize: 32,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: "#e6f0ff",
    borderWidth: 2,
    borderColor: "#000000",
  },
  flag_image: {
    width: 44,
    height: 28,
  },
});
