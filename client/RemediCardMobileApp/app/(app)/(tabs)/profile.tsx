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
import { useRouter, Link } from "expo-router";
import {
  AtIcon,
  MailIcon,
  ChevronRightIcon,
  EditProfileIcon,
  SubscriptionIcon,
  ContactIcon,
  LanguageIcon,
  LogoutIcon,
} from "@/constants/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Redirect } from "expo-router";

export default function ProfileScreen() {
  const { t } = useTranslation("profile");

  const router = useRouter();
  const { isLoggedIn, logoutAuth, user } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

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

  return (
    <View style={styles.container}>
      <Text style={styles.remedicardio}>{t("title")}</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          <AtIcon color="white" />
          {user?.username || "Username (dummy)"}
        </Text>
        <Text style={styles.infoText}>
          <MailIcon color="white" />
          {user?.email || "Email (dummy)"}
        </Text>
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

      <View style={styles.menuComponent}>
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
      </View>

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
  infoText: {
    flex: 1,
    top: 5,
    fontSize: 25,
    lineHeight: 25,
    fontFamily: "InriaSans-Regular",
    color: "#fff",
    textAlign: "left",
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
  }
}); 