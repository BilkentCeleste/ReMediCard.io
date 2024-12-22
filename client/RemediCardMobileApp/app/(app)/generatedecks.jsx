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
import { useRouter, Link } from "expo-router";
import { GoBackIcon, EditIcon } from "@/constants/icons";
import { generateDeck } from "@/apiHelper/backendHelper";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { BASE_URL } from "@/constants/config";

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
    }, 5000);
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

      setFile(result.assets[0]);
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  const handleGenerate = async () => {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      type: "application/pdf",
      name: file.name,
    });

    const token = await SecureStore.getItemAsync("token");

    //TODO SOLVE THIS
    axios
      .post(`${BASE_URL}/deck/generate`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      })
      .then((res) => {
        console.log(res.data);
        console.log("SUCCESS");
        setFile(null);
        setFileType(null);

        setPopupMessage(
          "Deck generation is queued you can find your deck on deck menu once it is created"
        );
        showPopup();
      })
      .catch((e) => console.log(e.request));

    /* generateDeck(formData)
      .then((res) => {
        console.log(res.data);
        console.log("Will Auto Generate");
        console.log(file, fileType);
        
      })
      .catch((e) => console.log(e.request)); */
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.menuComponent, { top: "20%" }, { position: "absolute" }]}
      >
        <View style={[styles.menuIcon, styles.iconLayout]}>
          <Link href="/(app)/editdecklist">
            <GoBackIcon />
          </Link>
        </View>
        <Text style={styles.menuText}>Deck 1</Text>
        <View style={[styles.menuIcon, styles.iconLayout, { right: "10%" }]}>
          <EditIcon color="white" />
        </View>
        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
        </View>
      </View>

      <View style={styles.uploadComponent}>
        <Text style={styles.fileComponentTitle}>
          Choose a file to generate flashcards
        </Text>
        <Text
          style={styles.fileComponentText}
        >{`ReMediCard.io supports .pdf .png .jpeg .mp3 .mp4 `}</Text>
        <View style={[{ marginTop: "35%" }, { width: "100%" }]}>
          <View style={styles.selectComponent}>
            <View style={styles.selectedFile}>
              <DropDown
                options={fileOptions}
                placeholder="Select document type"
                onSelect={(value) => {
                  setFileType(value);
                  setFile(null);
                }}
                textColor="black"
                showChevron={false}
              />
            </View>
          </View>
          <View style={styles.selectComponent}>
            <Text style={styles.selectedFile} onPress={pickFile}>
              {file ? file.name : "Select a file"}
            </Text>
          </View>
        </View>
      </View>

      <FadingPopup
        message={popupMessage}
        visible={popupVisible}
        onClose={() => {}}
      />

      {/* <DropDown
        options={fileOptions}
        placeholder="Select document type"
        onSelect={(value) => {
          setFileType(value);
          setFile(null);
        }}
      />
 */}
      {/* <Button title="Select a file" onPress={pickFile} />
      {file && (
        <View style={{ marginTop: 20 }}>
          <Text>File Name: {file.name}</Text>
          <Text>File URI: {file.uri}</Text>
          <Text>File Type: {file.mimeType || "Unknown"}</Text>
        </View>
      )} */}

      {file && (
        <TouchableOpacity
          style={styles.generateParent}
          onPress={handleGenerate}
        >
          <Text style={styles.buttonText}>Confirm Auto Generation</Text>
        </TouchableOpacity>
      )}
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
    fontSize: 20,
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
  uploadComponent: {
    borderRadius: 20,
    backgroundColor: "#fff",
    width: "75%",
    height: "35%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  fileComponentTitle: {
    position: "absolute",
    top: 17,
    fontSize: 17,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#000",
    textAlign: "left",
    width: 265,
  },
  fileComponentText: {
    position: "absolute",
    top: 70,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "rgba(0, 0, 0, 0.5)",
    textAlign: "left",
    width: "95%",
  },
  selectedFile: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#000",
    textAlign: "left",
  },
  selectComponent: {
    borderRadius: 20,
    backgroundColor: "rgba(207, 207, 207, 0.3)",
    width: "100%",
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
  },
  generateParent: {
    borderRadius: 20,
    backgroundColor: "#2916ff",
    width: "75%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center the text inside the button
  },
  buttonText: {
    color: "#fff", // White text color for visibility
    fontSize: 16,
    fontWeight: "bold",
  },
});

const FadingPopup = ({ message, visible, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onClose && onClose());
    }
  }, [visible]);

  return (
    <Animated.View style={[styles.popupContainer, { opacity: fadeAnim }]}>
      <View style={styles.popup}>
        <Text style={[{ color: "#fff" }, { fontSize: 17 }]}>{message}</Text>
      </View>
    </Animated.View>
  );
};
