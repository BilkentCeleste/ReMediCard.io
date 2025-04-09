import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "expo-router";
import { AtIcon, LockIcon } from "@/constants/icons";
import {
  sendForgotPasswordCode,
  verifyResetPasswordcode,
  resetPassword,
} from "@/apiHelper/backendHelper";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
  const { t } = useTranslation("forgot_password");

  const [stage, setStage] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();
  const { addToken, setIsLoggedIn } = useAuth();

  const router = useRouter();

  const clearState = () => {
    setStage(1);
    setEmail("");
    setCode(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
  };

  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const inputRefs = useRef(code.map(() => React.createRef()));

  const handleEmailSubmit = () => {
    if (!email.includes("@")) {
      Alert.alert(t("invalid_email"), t("invalid_email_message"));
      return;
    }

    sendForgotPasswordCode({
      email: email,
    })
      .then((res) => {
        setStage(2);
      })
      .catch((e) => {
        console.log(e.status);
      });
  };

  const handleAuthSubmit = () => {
    if (code.join("").length !== 6) {
      Alert.alert(t("invalid_code"), t("invalid_code_message"));
      return;
    }

    verifyResetPasswordcode({
      email: email,
      code: code.join(""),
    })
      .then((res) => {
        addToken(res.data.access_token);
        setStage(3);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert(t("failed"), t("code_is_invalid"));
      });
  };

  const handlePasswordReset = () => {
    if (newPassword.length < 6) {
      Alert.alert(t("weak_password"), t("weak_password_message"));
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(t("missmatch_password"), t("missmatch_password_message"));
      return;
    }

    resetPassword({
      email: email,
      code: code.join(""),
      password: newPassword,
    })
      .then((res) => {
        setIsLoggedIn(true);
        Alert.alert(t("success"), t("password_reset_success_message"), [
          {
            text: "OK",
            onPress: () => {
              clearState();
              router.push("/(app)/home");
            },
          },
        ]);
      })
      .catch((e) => {
        console.log(e.status);
        Alert.alert(
          t("failed"), t("password_should_be_different_from_old_passwords_message")
        );
      });
  };

  const handleAuthInputChange = (text, index) => {

    if (text.length > 1) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("title")}</Text>
      {stage === 1 && (
        <>
          <Text style={styles.infoText}>
            {t("enter_registered_email")}
          </Text>
          <View style={styles.component}>
            <AtIcon />
            <TextInput
              style={styles.input}
              placeholder={t('email')}
              placeholderTextColor="rgba(0, 0, 0, 0.25)"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </>
      )}
      {stage === 2 && (
        <>
          <Text style={styles.infoText}>
            {t("enter_verification_code")}
          </Text>
          <View style={styles.authCodeContainer}>
            {code.map((digit, index) => (
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
          <TouchableOpacity
            onPress={() =>
              sendForgotPasswordCode({
                email: email,
              })
                .then((res) => {
                  Alert.alert(t("resent_email"), t("resent_email_message"));
                })
                .catch((e) => {
                  console.log(e.status);
                })
            }
          >
            <Text style={styles.link}>{t("didnt_receive_email")}</Text>
          </TouchableOpacity>
        </>
      )}
      {stage === 3 && (
        <>
          <Text style={styles.infoText}>
            {t("set_new_password")}
          </Text>
          <View style={styles.component}>
            <LockIcon />
            <TextInput
              style={styles.input}
              placeholder={t("new_password")}
              placeholderTextColor="rgba(0, 0, 0, 0.25)"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>
          <View style={styles.component}>
            <LockIcon />
            <TextInput
              style={styles.input}
              placeholder={t("confirm_new_password")}
              placeholderTextColor="rgba(0, 0, 0, 0.25)"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
        </>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={
          stage === 1
            ? handleEmailSubmit
            : stage === 2
            ? handleAuthSubmit
            : handlePasswordReset
        }
      >
        <Text style={styles.buttonText}>
          {stage === 3 ? t("reset_password") : t("next")}
        </Text>
      </TouchableOpacity>
      {stage === 3 && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setIsLoggedIn(true);
            clearState();
            router.push("/(app)/home");
          }}
        >
          <Text style={styles.buttonText}>{t("continue_without_reset")}</Text>
        </TouchableOpacity>
      )}
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
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
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
  button: {
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
