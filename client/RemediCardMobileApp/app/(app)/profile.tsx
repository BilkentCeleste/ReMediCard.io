import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { useRouter, Link } from "expo-router";
import {
  AtIcon,
  MailIcon,
  ChevronRightIcon,
  EditProfileIcon,
  SubscriptionIcon,
  ContactIcon,
  ProfileIcon,
  SettingsIcon,
  LanguageIcon,
  LogoutIcon,
  HomeIcon,
} from "@/constants/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { getUserProfile } from "@/apiHelper/backendHelper";
import { useFocusEffect } from "expo-router";

export default function Profile() {
  const { t, i18n } = useTranslation("profile");
  const router = useRouter();
  const { logoutAuth } = useAuth();

  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [showLanguage, setShowLanguage] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: "-----",
    email: "-------",
  });

  useFocusEffect(
    useCallback(() => {
      getUserProfile()
        .then((res) => setUserProfile(res.data))
        .catch((e) => console.log(e));
    }, [])
  );

  const handleLanguageSelection = (language: any) => {
    if (selectedLanguage === language) {
      return;
    }

    setSelectedLanguage(language);
    i18n.changeLanguage(language);
  };

  const logoutHandler = () => {
    logoutAuth();
    router.push("/login");
  };

  const loadEditProfile = () => {
    router.push("/(app)/(profile)/editprofile");
  };

  const loadContactUs = () => {
    router.push("/(app)/(profile)/contactus");
  };

  const loadLanguage = () => {
    setShowLanguage(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.remedicardio}>{t("title")}</Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <AtIcon color="white" style={styles.infoIcon} />
          <Text style={styles.infoText}>{userProfile.username}</Text>
        </View>

        <View style={styles.infoRow}>
          <MailIcon color="white" style={styles.infoIcon} />
          <Text style={styles.infoText}>{userProfile.email}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.menuComponent} onPress={loadEditProfile}>
        <View style={[styles.menuIcon, styles.iconLayout]}>
          <EditProfileIcon></EditProfileIcon>
        </View>

        <Text style={styles.menuText}>{t("edit_profile")}</Text>

        <View style={[styles.chevronRightIcon, styles.iconLayout]}>
          <ChevronRightIcon></ChevronRightIcon>
        </View>

        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
        </View>
      </TouchableOpacity>

      <View style={styles.menuComponent}>
        <View style={[styles.menuIcon, styles.iconLayout]}>
          <SubscriptionIcon />
        </View>

        <Text style={styles.menuText}>{t("subscription")}</Text>

        <View style={[styles.chevronRightIcon, styles.iconLayout]}>
          <ChevronRightIcon></ChevronRightIcon>
        </View>

        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
        </View>
      </View>

      <TouchableOpacity style={styles.menuComponent} onPress={loadContactUs}>
        <View style={[styles.menuIcon, styles.iconLayout]}>
          <ContactIcon />
        </View>

        <Text style={styles.menuText}>{t("contact_us")}</Text>

        <View style={[styles.chevronRightIcon, styles.iconLayout]}>
          <ChevronRightIcon></ChevronRightIcon>
        </View>

        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuComponent} onPress={loadLanguage}>
        <View style={[styles.menuIcon, styles.iconLayout]}>
          <LanguageIcon />
        </View>

        <Text style={styles.menuText}>{t("language")}</Text>

        <View style={[styles.chevronRightIcon, styles.iconLayout]}>
          <ChevronRightIcon></ChevronRightIcon>
        </View>

        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuComponent} onPress={logoutHandler}>
        <View style={[styles.menuIcon, styles.iconLayout]}>
          <LogoutIcon />
        </View>

        <Text style={styles.menuText}>{t("log_out")}</Text>

        <View style={[styles.chevronRightIcon, styles.iconLayout]}>
          <ChevronRightIcon></ChevronRightIcon>
        </View>

        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
        </View>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={showLanguage}
        animationType="slide"
        onRequestClose={() => setShowLanguage(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t("language")}</Text>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  selectedLanguage === "en" && styles.selectedOption,
                ]}
                onPress={() => {
                  handleLanguageSelection("en");
                }}
              >
                <Image
                  source={require("../../assets/images/uk_flag.png")}
                  style={styles.flag_image}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  selectedLanguage === "tr" && styles.selectedOption,
                ]}
                onPress={() => {
                  handleLanguageSelection("tr");
                }}
              >
                <Image
                  source={require("../../assets/images/tr_flag.png")}
                  style={styles.flag_image}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalBack}
              onPress={() => setShowLanguage(false)}
            >
              <Text style={styles.modalBackText}>{t("back")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.navbarRow}>
        <TouchableOpacity>
          <Link href="/(app)/home">
            <HomeIcon />
          </Link>
        </TouchableOpacity>
        <TouchableOpacity>
          <Link href="/(app)/profile">
            <ProfileIcon />
          </Link>
        </TouchableOpacity>
        <TouchableOpacity>
          <SettingsIcon />
        </TouchableOpacity>
      </View>

      <View style={styles.navbarContainer}>
        <View style={styles.navbarLine} />
      </View>
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
    fontSize: 30,
    lineHeight: 32,
    fontFamily: "InriaSans-Regular",
    color: "#fff",
    textAlign: "center",
    width: "100%",
    height: 27,
    marginBottom: 50,
    fontWeight: "bold",
  },
  infoCard: {
    width: "75%",
    flexDirection: "column",
    height: 75,
    justifyContent: "space-evenly",
    marginBottom: 50,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 20,
    fontFamily: "InriaSans-Regular",
    color: "#fff",
    marginLeft: 5,
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
    left: 50,
    fontSize: 20,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#fff",
    textAlign: "left",
    zIndex: 1,
    top: 5,
    position: "absolute",
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
  iconLayout: {
    height: 24,
    width: 24,
    position: "absolute",
  },
  chevronRightIcon: {
    left: "95%",
    zIndex: 3,
    top: 5,
  },
  menuIcon: {
    right: "95%",
    zIndex: 3,
    top: 5,
  },
  navbarRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 30,
    position: "absolute",
    bottom: 50,
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
  modalBack: {
    marginTop: 10,
  },
  modalBackText: {
    color: "#2916ff",
    fontWeight: "bold",
    fontSize: 16,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    fontSize: 32,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: "#e6f0ff",
    borderWidth: 2,
    borderColor: "#000000",
  },
  flag_image: {
    width: 44,
    height: 28,
  },
});
