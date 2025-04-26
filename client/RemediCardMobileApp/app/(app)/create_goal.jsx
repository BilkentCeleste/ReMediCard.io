import React, { useState } from "react";
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
  GoBackIcon,
  EditProfileIcon,
  SaveIcon,
  DiscordIcon
} from "@/constants/icons";
import DropDown from "../../components/DropDown";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useTranslation } from "react-i18next";

export default function CreateGoal() {
  const { t } = useTranslation("create_goal");
  const router = useRouter();
  const { deck_id } = useLocalSearchParams();

  const [deck, setDeck] = useState("Deck 1");
  const [repOneValue, setRepOneValue] = useState("1");
  const [repOneUnit, setRepOneUnit] = useState("month(s)");
  const [repTwoValue, setRepTwoValue] = useState("2");
  const [repTwoUnit, setRepTwoUnit] = useState("day(s)");
  const [performance, setPerformance] = useState("80");

  const deckOptions = [
    { label: "Deck 1", value: "Deck 1" },
    { label: "Deck 2", value: "Deck 2" },
  ];
  const repValues = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
  ];
  const repUnitsMonth = [
    { label: t("months"), value: "month(s)" },
    { label: t("weeks"), value: "week(s)" },
  ];
  const repUnitsDay = [
    { label: t("days"), value: "day(s)" },
    { label: t("hours"), value: "hour(s)" },
  ];

  const summaryText = `You will be notified about ${deck} every ${repTwoValue} ${repTwoUnit} for ${repOneValue} ${repOneUnit} until you exceed ${performance}% success`;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <GoBackIcon color="#fff" />
        </TouchableOpacity>
        <Text style={styles.goalHeaderText}>Goal 1</Text>
        <TouchableOpacity>
          <EditProfileIcon color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.formRow}>
        <Text style={styles.labelText}>{t("deck")}</Text>
        <DropDown
          options={deckOptions}
          placeholder={t("select_deck")}
          onSelect={(value) => setDeck(value)}
          initialValue={deck}
        />
      </View>
      <View style={styles.lineSeparator} />

      <View style={styles.formRow}>
        <Text style={styles.labelText}>{t("repetition")}</Text>
        <View style={styles.repetitionRow}>
          <DropDown
            options={repValues}
            placeholder="1"
            onSelect={(value) => setRepOneValue(value)}
            initialValue={repOneValue}
            showChevron={false}
          />
          <DropDown
            options={repUnitsMonth}
            placeholder={t("months")}
            onSelect={(value) => setRepOneUnit(value)}
            initialValue={repOneUnit}
            showChevron={false}

          />
        </View>
      </View>
      <View style={styles.lineSeparator} />

      <View style={styles.formRow}>
        <Text style={styles.labelText}>{t("repetition")}</Text>
        <View style={styles.repetitionRow}>
          <DropDown
            options={repValues}
            placeholder="2"
            onSelect={(value) => setRepTwoValue(value)}
            initialValue={repTwoValue}
            showChevron={false}

          />
          <DropDown
            options={repUnitsDay}
            placeholder={t("days")}
            onSelect={(value) => setRepTwoUnit(value)}
            initialValue={repTwoUnit}
            showChevron={false}

          />
        </View>
      </View>
      <View style={styles.lineSeparator} />

      <View style={styles.formRow}>
        <Text style={styles.labelText}>{t("performance")}</Text>
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

      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>{summaryText}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.discardButton}
            onPress={() => {
              router.back();
            }}
          >
            <DiscordIcon/>
            <Text style={styles.discardButtonText}>{t("discard")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
            }}
          >
            <SaveIcon color="#000" />
            <Text style={styles.saveButtonText}>{t("save")}</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    width: "60%",
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
    right: "20%",
    top: 0,
    bottom: 0,
    textAlignVertical: "center",
  },
  summaryCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
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
