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
import { GoBackIcon } from "../../../constants/icons";
import { createFeedback } from "../../../apiHelper/backendHelper";

export default function ContactUs() {
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (subject.length < 1 || content.length < 1) {
      Alert.alert(
        "Invalid form",
        "Please enter a subject and a non-empty content for your feedback."
      );
      return;
    }

    createFeedback({
      subject: subject,
      content: content
    }).then(res => {
      Alert.alert(
        "Success",
        "Your feedback form is successfully submitted. The team will contact you shortly."
      );
      setSubject("")
      setContent("")
    })
    .catch(e => console.log(e))

  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <GoBackIcon color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Contact Us</Text>
      </View>

      <Text style={styles.infoText}>
        Send your complaints or recommendations to Team Celeste:
      </Text>

      <View style={styles.textAreaContainerSmall}>
        <TextInput
          style={styles.textInputSmall}
          placeholder="Subject"
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
          placeholder="Content"
          placeholderTextColor="rgba(0, 0, 0, 0.25)"
          multiline
          numberOfLines={8}
          value={content}
          onChangeText={setContent}
        />
      </View>

      <TouchableOpacity style={styles.registercomponent} onPress={handleSubmit}>
        <Text style={styles.registertext}>Submit</Text>
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
    marginRight: "25%",
  },
  infoText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#ffff",
    width: "75%",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
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
    fontSize: 16,
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
  toggleButton: {
    marginLeft: 175,
  },
  toggleText: {
    fontSize: 14,
    color: "#2916FF",
  },
});
