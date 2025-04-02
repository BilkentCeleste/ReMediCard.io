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
  MailIcon,
  AtIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  GoBackIcon
} from "../../../constants/icons";
import { Link } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function EditProfile() {
  const { t } = useTranslation("edit_profile");

  const router = useRouter();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const { isLoggedIn, registerAuth } = useAuth();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSaveChanges = () => {
    if (password !== passwordCheck) {
      Alert.alert(t("error"), t("passwords_do_not_match"));
      return;
    }
  
    if (!username || !email || !password) {
      Alert.alert(t("error"), t("fill_all_fields"));
      return;
    }
  
    const body = {
      username: username,
      email: email,
      password: password,
    };
  
    registerAuth(body);
    Alert.alert(t("success"), t("success_message"));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <GoBackIcon color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{t("title")}</Text>
      </View>

      <View style={styles.component}>
        <AtIcon />
        <TextInput
          style={[styles.usernametext]}
          placeholder={t("username")}
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
          placeholder={t("email")}
          placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
          value={email}
          onChangeText={setMail}
        ></TextInput>
      </View>

      <View style={styles.component}>
        <LockIcon />
        <TextInput
          style={styles.passwordtext}
          placeholder={t("password")}
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
          placeholder={t("confirm_password")}
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

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveChanges}
      >
        <Text style={styles.registertext}>{t("save")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}      
      >
        <Text style={styles.registertext}>{t("cancel")}</Text>
      </TouchableOpacity>
      
      <View style={styles.bottomContainer}>
        <Link href="/delete_account" style={styles.link}>
          <Text>{t("delete_account")}</Text>
        </Link>
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
  headerRow: {
    width: "75%",
    marginBottom: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    marginBottom: 10,
    color: "#ffff",
    marginRight: "25%"
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
  saveButton: {
    height: 50,
    borderRadius: 20,
    backgroundColor: "#2916ff",
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    gap: 30,
    marginTop: 20,
  },
  cancelButton: {
    height: 50,
    borderRadius: 20,
    backgroundColor: "#C8102E",
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    gap: 30,
    marginTop: 20,
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
    fontSize: 16,
    color: "#960c03",
    cursor: "pointer",
    fontWeight: "bold"
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
  deleteAccountContainer: {
    height: 50,
    borderRadius: 20,
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    gap: 30,
    top: 75,

  },
});
