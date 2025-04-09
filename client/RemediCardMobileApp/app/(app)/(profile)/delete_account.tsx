import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { AtIcon, LockIcon } from "@/constants/icons";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
  const { t } = useTranslation("delete_account");

  const [authId, setAuthId] = useState(["", "", "", "", "", ""]);
  const navigation = useNavigation();
  const router = useRouter();

  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const inputRefs = useRef(authId.map(() => React.createRef()));

  const handleDelete = () => {

  };

  const handleAuthInputChange = (text, index) => {
    if (text.length > 1) return;
    const newAuthId = [...authId];
    newAuthId[index] = text;
    setAuthId(newAuthId);
    
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("title")}</Text>
          <Text style={styles.infoText}>{t("description")}</Text>
          <View style={styles.authCodeContainer}>
            {authId.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                style={styles.authInput}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleAuthInputChange(text, index)}
              />
            ))}
          </View>
          <TouchableOpacity onPress={() => Alert.alert(t("resent"), t("resent_message"))}> 
            <Text style={styles.link}>{t("try_again")}</Text>
          </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete()}
      >
        <Text style={styles.buttonText}>{t("delete_account")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>{t("cancel")}</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  infoText: {
    width:"75%",
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 50,
  },
  component: {
    height: 60,
    borderRadius: 20,
    backgroundColor: "#fff",
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    fontSize: 18,
    color: "#111",
    flex: 1,
    marginLeft: 10,
  },
  authCodeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  authInput: {
    width: 40,
    height: 50,
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    borderRadius: 10,
  },
  deleteButton: {
    height: 50,
    borderRadius: 20,
    backgroundColor: "#C8102E",
    width: "75%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  cancelButton: {
    height: 50,
    borderRadius: 20,
    backgroundColor: "#2916ff",
    width: "75%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    fontSize: 14,
    color: "#2518c7",
    marginTop: 10,
    fontWeight: "bold",
  },
});
