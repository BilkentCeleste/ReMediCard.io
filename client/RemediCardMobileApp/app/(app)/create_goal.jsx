import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter, Link } from "expo-router";
import {
  HomeIcon,
  ProfileIcon,
  SettingsIcon,
  GoBackIcon, // placeholder for "Back" icon
  EditProfileIcon, // placeholder for "Edit" icon
  ChevronDown, // placeholder for "Discard" icon
  SaveIcon, // placeholder for "Save" icon
} from "../../constants/icons";
import DropDown from "../../components/DropDown";
import { useSearchParams } from "expo-router/build/hooks";
import { useLocalSearchParams } from "expo-router/build/hooks";

export default function CreateGoal() {
  const router = useRouter();

  const { deck_id } = useLocalSearchParams();

  //console.log("Full Route:", router.asPath);
  //console.log("Deck_id", deck_id);

  useEffect(() => {
    console.log("deck_id?", deck_id);
  }, []);

  // Example states for each form field
  const [deck, setDeck] = useState("Deck 1");
  const [repOneValue, setRepOneValue] = useState("1");
  const [repOneUnit, setRepOneUnit] = useState("month(s)");
  const [repTwoValue, setRepTwoValue] = useState("2");
  const [repTwoUnit, setRepTwoUnit] = useState("day(s)");
  const [performance, setPerformance] = useState("80");

  // Example options for the drop downs
  const deckOptions = [
    { label: "Deck 1", value: "Deck 1" },
    { label: "Deck 2", value: "Deck 2" },
  ];
  const repValues = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    // Add more as needed
  ];
  const repUnitsMonth = [
    { label: "month(s)", value: "month(s)" },
    { label: "week(s)", value: "week(s)" },
  ];
  const repUnitsDay = [
    { label: "day(s)", value: "day(s)" },
    { label: "hour(s)", value: "hour(s)" },
  ];

  // Derived text for the summary box at the bottom
  const summaryText = `You will be notified about ${deck} every ${repTwoValue} ${repTwoUnit} for ${repOneValue} ${repOneUnit} until you exceed ${performance}% success`;

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <GoBackIcon color="#fff" />
        </TouchableOpacity>
        <Text style={styles.goalHeaderText}>Goal 1</Text>
        <TouchableOpacity>
          <EditProfileIcon color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Deck Row */}
      <View style={styles.formRow}>
        <Text style={styles.labelText}>Deck</Text>
        {/* Example using DropDown component (like in deck.tsx) */}
        <DropDown
          options={deckOptions}
          placeholder="Select Deck"
          onSelect={(value) => setDeck(value)}
          initialValue={deck}
        />
      </View>
      <View style={styles.lineSeparator} />

      {/* Repetition Row #1 */}
      <View style={styles.formRow}>
        <Text style={styles.labelText}>Repetition</Text>
        <View style={styles.repetitionRow}>
          <DropDown
            options={repValues}
            placeholder="1"
            onSelect={(value) => setRepOneValue(value)}
            initialValue={repOneValue}
          />
          <DropDown
            options={repUnitsMonth}
            placeholder="month(s)"
            onSelect={(value) => setRepOneUnit(value)}
            initialValue={repOneUnit}
          />
        </View>
      </View>
      <View style={styles.lineSeparator} />

      {/* Repetition Row #2 */}
      <View style={styles.formRow}>
        <Text style={styles.labelText}>Repetition</Text>
        <View style={styles.repetitionRow}>
          <DropDown
            options={repValues}
            placeholder="2"
            onSelect={(value) => setRepTwoValue(value)}
            initialValue={repTwoValue}
          />
          <DropDown
            options={repUnitsDay}
            placeholder="day(s)"
            onSelect={(value) => setRepTwoUnit(value)}
            initialValue={repTwoUnit}
          />
        </View>
      </View>
      <View style={styles.lineSeparator} />

      {/* Performance Row */}
      <View style={styles.formRow}>
        <Text style={styles.labelText}>Performance</Text>
        {/* Example: plain TextInput for performance */}
        <TextInput
          style={styles.performanceInput}
          value={performance}
          onChangeText={(text) => setPerformance(text)}
          keyboardType="numeric"
          placeholder="80"
          placeholderTextColor="rgba(0,0,0,0.4)"
        />
        <Text style={styles.percentSign}>%</Text>
      </View>
      <View style={styles.lineSeparator} />

      {/* White summary card at the bottom */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>{summaryText}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.discardButton}
            onPress={() => {
              // handle discard
              router.back();
            }}
          >
            <ChevronDown color="#000" />
            <Text style={styles.discardButtonText}>Discard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              // handle save
              // e.g., router.push("/(app)/goal_list");
            }}
          >
            <SaveIcon color="#000" />
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    flex: 1,
    backgroundColor: "#53789D",
    alignItems: "center",
  },
  headerRow: {
    width: "90%",
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalHeaderText: {
    fontSize: 24,
    color: "#fff",
    fontFamily: "InriaSans-Regular",
    fontWeight: "bold",
  },
  divider: {
    marginTop: 5,
    marginBottom: 15,
    width: "90%",
    height: 1,
    backgroundColor: "#fff",
  },
  formRow: {
    width: "90%",
    flexDirection: "column",
    marginBottom: 15,
  },
  labelText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
    fontFamily: "Inter-Regular",
  },
  lineSeparator: {
    width: "90%",
    height: 1,
    backgroundColor: "#fff",
    marginBottom: 15,
    alignSelf: "center",
  },
  repetitionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%", // Adjust as needed
  },
  performanceInput: {
    width: "20%",
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 5,
    color: "#000",
  },
  percentSign: {
    color: "#fff",
    fontSize: 16,
    position: "absolute",
    right: "20%", // Slightly tweak if needed
    top: 0,
    bottom: 0,
    textAlignVertical: "center",
    // or you can put a small margin to the left
  },
  summaryCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    // push it above the navbar
    marginBottom: 80,
  },
  summaryText: {
    fontSize: 14,
    color: "#000",
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  discardButton: {
    flexDirection: "column",
    alignItems: "center",
  },
  discardButtonText: {
    marginTop: 5,
    fontSize: 12,
    color: "#000",
  },
  saveButton: {
    flexDirection: "column",
    alignItems: "center",
  },
  saveButtonText: {
    marginTop: 5,
    fontSize: 12,
    color: "#000",
  },
  // Navbar
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
});
