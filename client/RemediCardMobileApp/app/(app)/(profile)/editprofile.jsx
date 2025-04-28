import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import {
  MailIcon,
  AtIcon,
  GoBackIcon
} from "@/constants/icons";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { getUserProfile } from "@/apiHelper/backendHelper";
import { useAuth } from "@/contexts/AuthContext";

export default function EditProfile() {
  const { t } = useTranslation("edit_profile");
  const router = useRouter();
  const { updateUserProfileAuth } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setMail] = useState("");

  useEffect(() => {
    getUserProfile()
        .then((response) => {
            setUsername(response.data.username);
            setMail(response.data.email);
        })
        .catch((error) => {
            Alert.alert(t("error"), t("fetch_error"));
        });
  }, []);

  const handleSaveChanges = async () => {
    if (!username || !email) {
      Alert.alert(t("error"), t("fill_all_fields"));
      return;
    }
  
    const body = {
      username: username,
      email: email
    };

    try {
      await updateUserProfileAuth(body);
      Alert.alert(t("success"), t("success_message"));
      router.push(`/(app)/home`);
    } catch (error) {
      Alert.alert(t("error"), t("update_error"));
    }
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
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
    marginRight: "25%"
  },
  usernametext: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Inter-Regular",
    color: "#111",
    marginLeft: 15,
  },
  saveButton: {
    height: 50,
    borderRadius: 20,
    backgroundColor: "#2916ff",
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: 20,
  },
  registertext: {
    fontSize: 17,
    fontFamily: "InriaSans-Regular",
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  link: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#960c03",
    fontWeight: "bold"
  },
  bottomContainer: {
    width: "100%",
    top: 75,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
