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
  GoBackIcon
} from "../../../constants/icons";

export default function ContactUs() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {};

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <GoBackIcon color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Contact Us</Text>
      </View>

      <Text style={styles.infoText}>
        Send your complaints and recommendations to Team Celeste:
      </Text>

      <View style={styles.textAreaContainerSmall}>
        <TextInput
          style={styles.textInputSmall}
          placeholder="Issue"
          placeholderTextColor="rgba(0, 0, 0, 0.25)"
          multiline
          numberOfLines={1}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.textAreaContainerLarge}>
        <TextInput
          style={styles.textInputLarge}
          placeholder="Description"
          placeholderTextColor="rgba(0, 0, 0, 0.25)"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
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
    marginRight: "25%"
  },
  infoText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#ffff",
    width: "75%"
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
