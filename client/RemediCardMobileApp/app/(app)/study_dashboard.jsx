import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, Link } from "expo-router";
import {
  HomeIcon,
  ProfileIcon,
  SettingsIcon,
  ChevronRightIcon,
  PlusIcon
} from "../../constants/icons";
import { useTranslation } from "react-i18next";

export default function StudyDashboard() {
  const { t } = useTranslation("study_dashboard");

  const router = useRouter();

  //TODO fetch decks

  const loadCreateGoal = (deck_id) => {
    //console.log();
    router.push(`/(app)/create_goal?deck_id=${deck_id}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.remedicardio}>{t("title")}</Text>

      {/* Suggestion Box 1 */}
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
          {/* Chevron icon on the right */}
          <View style={[styles.chevronRightIcon, styles.iconLayout]}>
            <ChevronRightIcon color="#fff" />
          </View>
        </View>
      </TouchableOpacity>

      {/* Suggestion Box 2 */}
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
            {/* Chevron icon on the right */}
            <View style={[styles.chevronRightIcon, styles.iconLayout]}>
              <ChevronRightIcon color="#fff" />
            </View>
          </View>
        </Link>
      </TouchableOpacity>

      {/* Active Study Goals Box */}
      <TouchableOpacity style={[styles.suggestionBox, styles.whiteBox]}>
        <Link href="/(app)/goal_list" style={styles.suggestionLink}>
          <View>
            <Text style={[styles.suggestionTitle, styles.blueText]}>
              You Have 2 active study goals
            </Text>
            <Text style={[styles.suggestionSubtitle, styles.blueText]}>
              See your goals (dummy)
            </Text>
            {/* Chevron icon on the right */}
            <View style={[styles.chevronRightIcon, styles.iconLayout]}>
              <ChevronRightIcon color="#1E40AF" />
            </View>
          </View>
        </Link>
      </TouchableOpacity>

      {/* Create New Study Goal Button */}
      {/* <TouchableOpacity
        style={styles.createGoalButton}
        onPress={() => {
          router.push("/(app)/create_goal");
        }}
      >
        <Text style={styles.createGoalButtonText}>+ Create New Study Goal</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.createButton} onPress={() => {
          router.push("/(app)/create_goal");
        }}>
          <PlusIcon></PlusIcon>
          <Text style={styles.createNewDeck}>{t("create_goal")}</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
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

// Styles
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
  // Suggestion Boxes
  suggestionBox: {
    width: "75%",
    borderRadius: 20,
    padding: 15,
    marginVertical: 5,
    justifyContent: "center",
  },
  blueBox: {
    backgroundColor: "#2916ff", // A bright blue/purple, adjust as needed
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
    color: "#1E40AF", // If text is on a white box
  },
  // Chevron Icon layout inside the suggestion boxes
  iconLayout: {
    height: 24,
    width: 24,
    position: "absolute",
  },
  chevronRightIcon: {
    right: 0,
    top: "40%",
  },

  // Create button
  createGoalButton: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: 100,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#1E40AF",
  },
  createGoalButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  // Bottom nav
  navbarRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
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
