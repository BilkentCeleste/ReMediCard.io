import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import {
  AtIcon,
  MailIcon,
  ChevronRightIcon,
  EditProfileIcon,
  SubscriptionIcon,
  ContactIcon,
  EditIcon,
} from "@/constants/icons";
import { useTranslation } from "react-i18next";
import { getUserProfile } from "@/apiHelper/backendHelper";
import { useFocusEffect } from "expo-router";
import NavBar from "@/components/NavBar"

export default function Profile() {
  const { t } = useTranslation("profile");
  const router = useRouter();

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

  const loadEditProfile = () => {
    router.push("/(app)/(profile)/editprofile");
  };

  const loadResetPassword = () => {
    router.push("/forgot_password?isResetPassword=true");
  }

  const loadContactUs = () => {
    router.push("/(app)/(profile)/contactus");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.remedicardio}>{t("title")}</Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <AtIcon color="white" style={[styles.infoIcon]} />
          <Text style={styles.infoText}>{userProfile.username}</Text>
        </View>

        <View style={styles.infoRow}>
          <MailIcon color="white" style={[styles.infoIcon]} />
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

      <TouchableOpacity style={styles.menuComponent} onPress={loadResetPassword}>
        <View style={[styles.menuIcon, styles.iconLayout]}>
          <EditIcon color={"#fff"}></EditIcon>
        </View>

        <Text style={styles.menuText}>{t("reset_password")}</Text>

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

      <NavBar/>

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
    height: 100,
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
});
