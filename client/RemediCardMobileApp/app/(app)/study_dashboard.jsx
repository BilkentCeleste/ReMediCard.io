import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, Link } from "expo-router";
import {
  ChevronRightIcon,
  PlusIcon
} from "@/constants/icons";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/NavBar";

export default function StudyDashboard() {
  const { t } = useTranslation("study_dashboard");

  const router = useRouter();

  //TODO fetch decks

  const loadCreateGoal = (deck_id) => {
    router.push(`/(app)/create_goal?deck_id=${deck_id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.remedicardio}>{t("title")}</Text>

      <TouchableOpacity
        onPress={() => {
          loadCreateGoal(1);
        }}
        style={[styles.suggestionBox, styles.blueBox]}
      >
        <View>
          <Text style={styles.suggestionTitle}>
            What about exercising Deck 1 ?
          </Text>
          <Text style={styles.suggestionSubtitle}>
            The deck you haven't studied for the longest time is Deck 1. (dummy)
          </Text>
          <View style={[styles.chevronRightIcon, styles.iconLayout]}>
            <ChevronRightIcon color="#fff" />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          loadCreateGoal(2);
        }}
        style={[styles.suggestionBox, styles.blueBox]}
      >
        <Link href="/(app)/create_goal?deck_id=2" style={styles.suggestionLink}>
          <View>
            <Text style={styles.suggestionTitle}>
              What about exercising Deck 2 ? 
            </Text>
            <Text style={styles.suggestionSubtitle}>
              The deck in which you perform the lowest is Deck 2 (dummy)
            </Text>
            <View style={[styles.chevronRightIcon, styles.iconLayout]}>
              <ChevronRightIcon color="#fff" />
            </View>
          </View>
        </Link>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.suggestionBox, styles.whiteBox]}>
        <Link href="/(app)/goal_list" style={styles.suggestionLink}>
          <View>
            <Text style={[styles.suggestionTitle, styles.blueText]}>
              You Have 2 active study goals
            </Text>
            <Text style={[styles.suggestionSubtitle, styles.blueText]}>
              See your goals (dummy)
            </Text>
            <View style={[styles.chevronRightIcon, styles.iconLayout]}>
              <ChevronRightIcon color="#1E40AF" />
            </View>
          </View>
        </Link>
      </TouchableOpacity>

      <TouchableOpacity style={styles.createButton} onPress={() => {
          router.push("/(app)/create_goal");
        }}>
          <PlusIcon></PlusIcon>
          <Text style={styles.createNewDeck}>{t("create_goal")}</Text>
      </TouchableOpacity>

      <NavBar/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#53789D",
    alignItems: "center",
  },
  remedicardio: {
    marginTop: 60,
    fontSize: 30,
    lineHeight: 32,
    fontFamily: "InriaSans-Regular",
    color: "#fff",
    textAlign: "center",
    width: "100%",
    height: 32,
    marginBottom: 40,
    fontWeight: "bold",
  },
  suggestionBox: {
    width: "75%",
    borderRadius: 20,
    padding: 15,
    marginVertical: 5,
    justifyContent: "center",
  },
  blueBox: {
    backgroundColor: "#2916ff",
  },
  whiteBox: {
    backgroundColor: "#fff",
  },
  suggestionLink: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#fff",
  },
  suggestionSubtitle: {
    fontSize: 14,
    color: "#fff",
  },
  blueText: {
    color: "#1E40AF",
  },
  iconLayout: {
    height: 24,
    width: 24,
    position: "absolute",
  },
  chevronRightIcon: {
    right: 0,
    top: "40%",
  },
  createButton: {
    borderRadius: 20,
    backgroundColor: "#2916ff",
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
    height: 50,
    top:"35%"
  },
  createNewDeck: {
      fontSize: 17,
      lineHeight: 22,
      fontFamily: "Inter-Regular",
      color: "#fff",
      textAlign: "center",
  },
});
