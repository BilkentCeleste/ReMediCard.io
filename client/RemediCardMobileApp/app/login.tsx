import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
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

export default function Login() {
  const { t } = useTranslation("login");

  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { isLoggedIn, loginAuth } = useAuth();

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = () => {
    const body = {
      username: username,
      password: password,
    };

    loginAuth(body);
  };

  const handleLoginWithGoogle = () => {};

  const uploadRegisterPage = () => {};

  return isLoggedIn ? (
    <Redirect href="/(app)/home" />
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>{t('title')}</Text>

      <View style={styles.component}>
        <AtIcon />
        <TextInput
          style={[styles.usernametext]}
          placeholder={t('username')}
          placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
          maxLength={16}
          value={username}
          onChangeText={setUsername}
        ></TextInput>
      </View>

      <View style={styles.component}>
        <LockIcon></LockIcon>
        <TextInput
          style={styles.passwordtext}
          placeholder={t('password')}
          placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
          maxLength={16}
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        ></TextInput>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={togglePasswordVisibility}
        >
          <Text style={styles.toggleText}>
            {passwordVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logincomponent} onPress={handleLogin}>
        <Text style={styles.logintext}>{t("log_in")}</Text>
      </TouchableOpacity>

      <View style={styles.forgotPasswordContainer}>
          <Link href="/forgot_password" style={styles.link}>
              <Text>{t('forgot_password')}</Text>
          </Link>
      </View>

      <View style={styles.rememberMeContainer}>
        <Pressable style={styles.checkbox} onPress={toggleRememberMe}>
          {rememberMe && <Text style={styles.checkmark}>✓</Text>}
        </Pressable>
        <TouchableOpacity onPress={toggleRememberMe}>
          <Text style={styles.rememberMeText}>{t('remember_me')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.seperatortext}>{t('or')}</Text>
        <View style={styles.separatorLine} />
      </View>

      <TouchableOpacity
        style={styles.component}
        onPress={handleLoginWithGoogle}
      >
        <GoogleIcon></GoogleIcon>
        <Text style={styles.googleButtonText}>{t('continue_with_google')}</Text>
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.seperatortext}>
            {t('dont_have_an_account')}
            <Link href="/register" style={styles.link}>
              <Text> {t('sign_up')}</Text>
            </Link>
          </Text>
          <View style={styles.separatorLine} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    left: 0,
  },
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
  input: {
    width: "80%",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  usernametext: {
    top: 5,
    left: 45,
    fontSize: 18,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#111",
    textAlign: "left",
    zIndex: 1,
    position: "absolute",
  },
  passwordtext: {
    top: 5,
    left: 45,
    fontSize: 18,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#111",
    textAlign: "left",
    zIndex: 1,
    position: "absolute",
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
    marginTop: 10,
  },
  forgotPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 3,
    marginRight: 10,
    backgroundColor: "#53789D",
  },
  checkedBox: {
    backgroundColor: "#fff",
  },
  rememberMeText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Inter-Regular",
  },
  checkmark: {
    fontSize: 16,
    color: "#fff",
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
  },
});
