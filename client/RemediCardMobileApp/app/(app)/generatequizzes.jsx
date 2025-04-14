import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Modal,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import DropDown from "../../components/DropDown";
import { useRouter, Link, useNavigation } from "expo-router";
import { GoBackIcon, EditIcon, UploadIcon } from "@/constants/icons";
import { autoGenerateQuiz } from "@/apiHelper/backendHelper";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";

export default function GenerateQuiz() {
  const { t, i18n } = useTranslation("generate_quizzes");
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [images, setImages] = useState(null);
  const [fileType, setFileType] = useState(null);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [showIndicator, setShowIndicator] = useState(false);
  const [contentLanguage, setContentLanguage] = useState(
    i18n.language === "en" ? "ENGLISH" : "TURKISH"
  );

  const showPopup = () => {
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
      setPopupMessage("");
    }, 5000);
  };

  const fileOptions = [
    { label: t("lecture_notes_pdf"), value: "PDF" },
    { label: t("lecture_notes_img"), value: "JPG, PNG" },
    { label: t("video_record"), value: "MP4" },
    { label: t("voice_record"), value: "MP3" },
  ];

  const languageOptions = [
    { label: t("english"), value: "ENGLISH" },
    { label: t("turkish"), value: "TURKISH" },
  ];

  const dataTypeMap = {
    PDF: "LECTURE_NOTES_PDF",
    MP4: "VIDEO_RECORD",
    MP3: "VOICE_RECORD",
    "JPG, PNG": "LECTURE_NOTE_IMAGES",
  };

  const fileFormatMap = {
    PDF: "application/pdf",
    MP4: "video/mp4",
    MP3: "audio/mpeg",
  };

  const pickMedia = async () => {
    const format = fileFormatMap[fileType];

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: format, //"*/*", // filter file types, e.g., 'image/*', 'application/pdf'
      });

      if (!result.assets || result.assets.length == 0) {
        return;
      }

      setFile(result.assets[0]);
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  const pickImages = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Denied",
        "Permission to access camera roll is required!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 10,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages(selectedImages);
    }
  };

  const pickFile = async () => {
    if (!fileType) {
      setPopupMessage(t("file_type_must_be_selected"));
      showPopup();
      return;
    }

    if (fileType === "JPG, PNG") {
      pickImages();
      return;
    }

    pickMedia();
  };

  const handleGenerate = async () => {
    setShowIndicator(true);

    const formData = new FormData();

    const dataType = dataTypeMap[fileType];
    const language = contentLanguage;

    if (fileType === "JPG, PNG") {
      let i = 1;

      for (const image of images) {
        formData.append("files", {
          uri: image,
          type: "application/multipart",
          name: "image_" + 1 + image.substring(image.lastIndexOf(".")),
        });
      }
    } else {
      formData.append("files", {
        uri: file.uri,
        type: "application/multipart",
        name: file.name,
      });
    }

    formData.append("dataType", dataType);
    formData.append("language", language);

    autoGenerateQuiz(formData)
      .then((res) => {
        setShowIndicator(false);
        setFile(null);
        setImages(null);
        setPopupMessage(t("queued_message"));
        showPopup();
      })
      .catch((e) => {
        setShowIndicator(false);
        console.log(e.request);
      });
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.menuComponent, { top: "20%" }, { position: "absolute" }]}
      >
        <View style={[styles.menuIcon, styles.iconLayout]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <GoBackIcon color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.menuText}>{t("generate_new_quiz")}</Text>
        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
        </View>
      </View>

      <View style={styles.uploadComponent}>
        <Text style={styles.fileComponentTitle}>{t("choose_file")}</Text>
        <Text style={styles.fileComponentText}>
          {t("supported_file_types")}
        </Text>
        <View style={[{ marginTop: "35%" }, { width: "100%" }]}>
          <View style={styles.selectComponent}>
            <View style={styles.selectedFile}>
              <DropDown
                options={fileOptions}
                placeholder={t("select_file_type")}
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
            <Text onPress={pickFile}>
              {file
                ? file.name
                : images
                ? images.length + t("images_selected")
                : t("select_file")}{" "}
            </Text>
            <View>
              <UploadIcon></UploadIcon>
            </View>
          </View>

          <View style={styles.selectComponent}>
            <View style={styles.selectedFile}>
              <DropDown
                options={languageOptions}
                placeholder={t("content_language")}
                onSelect={(value) => {
                  {
                    setContentLanguage(value);
                  }
                }}
                value={contentLanguage}
                textColor="black"
                showChevron={false}
              />
            </View>
          </View>
        </View>
      </View>

      <Modal
        transparent={true}
        visible={showIndicator}
        animationType="slide"
        onRequestClose={() => setShowIndicator(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size={"large"} style={styles.indicator} />

            <Text style={styles.indicatorText}> {t("file_transfer")}</Text>
          </View>
        </View>
      </Modal>

      <FadingPopup
        message={popupMessage}
        visible={popupVisible}
        onClose={() => {}}
      />

      {(file || images) && (
        <TouchableOpacity
          style={styles.generateParent}
          onPress={handleGenerate}
        >
          <Text style={styles.buttonText}>{t("confirm_auto_generation")}</Text>
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
    marginVertical: 30,
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
    fontSize: 18,
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
  quizInfoText: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.7)",
    marginBottom: 8,
  },
  quizTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 8,
  },
  quizComponent: {
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
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  indicator: {
    transform: [{ scale: 1.8 }],
    margin: 20,
  },
  indicatorText: {
    fontSize: 20,
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
