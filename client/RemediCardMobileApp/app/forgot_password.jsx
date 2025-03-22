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

export default function ForgotPassword() {
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
      Alert.alert("Invalid Email", "Please enter a valid email address.");
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
      Alert.alert("Invalid Code", "The authentication code must be 6 digits.");
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
        Alert.alert("Failed", "Given code is invalid!");
      });
  };

  const handlePasswordReset = () => {
    if (newPassword.length < 6) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 6 characters long."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }

    resetPassword({
      email: email,
      code: code.join(""),
      password: newPassword,
    })
      .then((res) => {
        setIsLoggedIn(true);
        Alert.alert("Success", "Your password has been reset.", [
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
          "Failed",
          "New password can't be the same with last two set passwords!"
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
      <Text style={styles.title}>Forgot Password</Text>
      {stage === 1 && (
        <>
          <Text style={styles.infoText}>
            Enter your registered email to receive a verification code.
          </Text>
          <View style={styles.component}>
            <AtIcon />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
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
            Enter the 6-digit verification code sent to your email.
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
                  Alert.alert("Resent", "Verification email has been resent.");
                })
                .catch((e) => {
                  console.log(e.status);
                })
            }
          >
            <Text style={styles.link}>Didn't receive the email? Try again</Text>
          </TouchableOpacity>
        </>
      )}
      {stage === 3 && (
        <>
          <Text style={styles.infoText}>
            Set a new password for your account.
          </Text>
          <View style={styles.component}>
            <LockIcon />
            <TextInput
              style={styles.input}
              placeholder="New password"
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
              placeholder="Confirm new password"
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
          {stage === 3 ? "Reset Password" : "Next"}
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
          <Text style={styles.buttonText}>{"Continue Without Reset"}</Text>
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
