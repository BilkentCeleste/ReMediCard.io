import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Animated,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import DropDown from "../../components/DropDown";
import * as SecureStore from "expo-secure-store";

export default function GenerateDecks() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const showPopup = () => {
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
      setPopupMessage("");
    }, 3000);
  };

  const fileOptions = [
    { label: "Lecture Notes", value: "PDF, JPG, PNG" },
    { label: "Video", value: "MP4" },
    { label: "Voice Record", value: "MP3" },
  ];

  const pickFile = async () => {
    if (!fileType) {
      setPopupMessage("File type must be selected!");
      showPopup();
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // filter file types, e.g., 'image/*', 'application/pdf'
      });

      if (!result.assets || result.assets.length == 0) {
        return;
      }

      setFile({
        name: result.assets[0].name,
        uri: result.assets[0].uri,
      });
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FadingPopup
        message={popupMessage}
        visible={popupVisible}
        onClose={() => {}}
      />

      <DropDown
        options={fileOptions}
        placeholder="Select document type"
        onSelect={(value) => {
          setFileType(value);
          setFile(null);
        }}
      />

      <Button title="Select a file" onPress={pickFile} />
      {file && (
        <View style={{ marginTop: 20 }}>
          <Text>File Name: {file.name}</Text>
          <Text>File URI: {file.uri}</Text>
          <Text>File Type: {file.mimeType || "Unknown"}</Text>
        </View>
      )}

      {file && (
        <Button
          title="Confirm Auto Generation"
          onPress={() => {
            console.log("Will Auto Generate");
            console.log(file, fileType);
            setPopupMessage(
              "Deck generation is queued you can find your deck on deck menu once it is created"
            );
            showPopup();
            setFile(null);
            setFileType(null);
          }}
        />
      )}

      {/*<Button*/}
      {/*  title="A"*/}
      {/*  onPress={async () => {*/}
      {/*    const value = await SecureStore.getItemAsync("key");*/}
      {/*    console.log(value);*/}
      {/*    console.log("aaaaaaaa")*/}
      {/*  }}*/}
      {/*/>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#53789D",
  },
  remedicardio: {
    top: 60,
    fontSize: 30,
    lineHeight: 32,
    fontFamily: "InriaSans-Regular",
    color: "#fff",
    textAlign: "center",
    width: "100%",
    height: 27,
    marginBottom: 75,
    fontWeight: "bold",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#fff",
  },
  navbarRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 30,
    position: "absolute",
    bottom: 50,
    backgroundColor: "#53789D",
  },
  navbarContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "75%",
    position: "absolute",
    bottom: 50,
    backgroundColor: "#53789D",
    height: 1,
  },
  navbarLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#fff",
  },
  searchComponent: {
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 30,
    marginBottom: 10,
  },
  searchText: {
    left: "25%",
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#111",
    textAlign: "center",
    zIndex: 0,
  },
  searchPosition: {
    marginTop: 20,
    position: "absolute",
  },
  menuComponent: {
    width: "75%",
    height: 20,
    padding: 10,
    gap: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  menuText: {
    left: "10%",
    fontSize: 12,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#fff",
    textAlign: "left",
    zIndex: 1,
    top: 5,
    position: "absolute",
  },
  iconLayout: {
    height: 24,
    width: 24,
    position: "absolute",
  },
  chevronRightIcon: {
    left: "100%",
    zIndex: 3,
    top: "90%",
  },
  menuIcon: {
    right: "95%",
    zIndex: 3,
    top: 5,
  },
  selectedOption: {
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  deckInfoText: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.7)",
    marginBottom: 8,
  },
  deckTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 8,
  },
  deckComponent: {
    borderRadius: 20,
    backgroundColor: "#fff",
    width: "100%",
    height: 120,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 15,
    marginVertical: 5,
  },
  accessInfoPosition: {
    top: 35,
    zIndex: 1,
    left: 15,
  },
  cardsLengthInfoPosition: {
    top: 55,
    left: 15,
    zIndex: 2,
  },
  performanceInfoPosition: {
    top: 75,
    zIndex: 3,
    left: 15,
  },
  flatListContainer: {
    width: "75%",
    height: "35%",
    marginTop: 5,
    backgroundColor: "transparent",
    marginBottom: 120,
  },
  flatListContent: {
    alignItems: "stretch",
    paddingBottom: 20,
  },
  link: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
  },
});

const FadingPopup = ({ message, visible, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Trigger fade-in or fade-out based on `visible`
  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1, // Fully visible
        duration: 300, // Animation duration (in ms)
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0, // Fully hidden
        duration: 300,
        useNativeDriver: true,
      }).start(() => onClose && onClose()); // Call `onClose` after hiding
    }
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.popupContainer,
        { opacity: fadeAnim }, // Bind opacity to `fadeAnim`
      ]}
    >
      <View style={styles.popup}>
        <Text style={styles.popupText}>{message}</Text>
      </View>
    </Animated.View>
  );
};
