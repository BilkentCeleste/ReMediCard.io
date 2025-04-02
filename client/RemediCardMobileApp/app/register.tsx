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
import {Redirect, useRouter} from "expo-router";
import {
  LockIcon,
  MailIcon,
  AtIcon,
  EyeOpenIcon,
  EyeClosedIcon,
} from "../constants/icons";
import { Link } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function Register() {
  const { t } = useTranslation("register");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const { isLoggedIn, registerAuth } = useAuth();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSignUp = () => {
    const body = {
      username: username,
      email: email,
      password: password
    }

    registerAuth(body);
  };

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
        <MailIcon />
        <TextInput
          style={[styles.usernametext]}
          placeholder={t('email')}
          placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
          value={email}
          onChangeText={setMail}
        ></TextInput>
      </View>

      <View style={styles.component}>
        <LockIcon />
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

      <View style={styles.component}>
        <LockIcon></LockIcon>
        <TextInput
          style={styles.passwordtext}
          placeholder={t('confirm_password')}
          placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
          maxLength={16}
          secureTextEntry={!passwordVisible}
          value={passwordCheck}
          onChangeText={setPasswordCheck}
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

      <TouchableOpacity style={styles.registercomponent} onPress={handleSignUp}>
        <Text style={styles.registertext}>{t('sign_up')}</Text>
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.seperatortext}>
            {t('already_have_an_account')}
            <Link href="/login" style={styles.link}>
              <Text style={styles.link}> {t('log_in')}</Text>
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
  registercomponent: {
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
  registertext: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: "InriaSans-Regular",
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
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
    cursor: "pointer"
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
