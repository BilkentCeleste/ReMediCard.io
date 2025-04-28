import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { GoBackIcon } from "../../../constants/icons";
import { createFeedback } from "../../../apiHelper/backendHelper";
import { useTranslation } from "react-i18next";

export default function ContactUs() {
  const { t } = useTranslation("contact_us");
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (subject.length < 1 || content.length < 1) {
      Alert.alert(
        t("invalid_form"), t("invalid_form_message")
      );
      return;
    }

    const data = {
        subject: subject,
        content: content
    }

    createFeedback(data)
        .then(res => {
          Alert.alert(
            t("success"), t("success_message")
          );
          setSubject("")
          setContent("")
        })
        .catch(e => {
            Alert.alert(
                t("error"), t("error_message")
            );
        })
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <GoBackIcon color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{t("title")}</Text>
      </View>

      <Text style={styles.infoText}>
        {t("send_message")}
      </Text>

      <View style={styles.textAreaContainerSmall}>
        <TextInput
          style={styles.textInputSmall}
          placeholder={t("subject")}
          placeholderTextColor="rgba(0, 0, 0, 0.25)"
          multiline
          numberOfLines={1}
          value={subject}
          onChangeText={setSubject}
        />
      </View>

      <View style={styles.textAreaContainerLarge}>
        <TextInput
          style={styles.textInputLarge}
          placeholder={t("content")}
          placeholderTextColor="rgba(0, 0, 0, 0.25)"
          multiline
          numberOfLines={8}
          value={content}
          onChangeText={setContent}
        />
      </View>

      <TouchableOpacity style={styles.registercomponent} onPress={handleSubmit}>
        <Text style={styles.registertext}>{t("submit")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    width: "75%",
    marginBottom: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#53789D",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#ffff",
    marginRight: "25%",
  },
  infoText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#ffff",
    width: "75%",
  },
  textAreaContainerSmall: {
    width: "75%",
    marginBottom: 10,
  },
  textInputSmall: {
    height: 40,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 10,
    textAlignVertical: "top",
    fontSize: 14,
    color: "#111",
  },
  textAreaContainerLarge: {
    width: "75%",
    marginBottom: 20,
  },
  textInputLarge: {
    height: 100,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 10,
    textAlignVertical: "top",
    fontSize: 14,
    color: "#111",
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
});
