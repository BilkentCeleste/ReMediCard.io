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
  const [duration, setDuration] = useState("1");
  const [repetition, setRepetition] = useState("2");

  const handleBack = () => {
    router.push("/(app)/goal_list");
}

  const deckOptions = [
    { label: "Deck 1", value: "Deck 1" },
    { label: "Deck 2", value: "Deck 2" },
  ];
  const deckOrQuizOptions = [
    { label: "Deck", value: "Deck" },
    { label: "Quiz", value: "Quiz" },
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
       <View style={styles.menuComponent}>
        <View style={[styles.menuIcon, styles.iconLayout]}>
            <Link href="/(app)/goal_list"><GoBackIcon width={100} height={100} /></Link>
        </View>

        <View style = {styles.textComponent}>
        <Text style={styles.menuText} numberOfLines={2} ellipsizeMode="tail">Dummy</Text>
        </View>

        <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
        </View>
    </View>

      <View style={styles.formRow2}>
      <View style={styles.formRow1}>
        <DropDown
            options={deckOrQuizOptions}
            placeholder={t("deck")}
            onSelect={(value) => setDeck(value)}
            initialValue={deck}
          />
        </View>
        <View style={styles.formRow1}>
        <DropDown
            options={deckOptions}
            placeholder={t("select_deck")}
            onSelect={(value) => setDeck(value)}
            initialValue={deck}
          />
        </View>
      </View>
      <View style={styles.lineSeparator} />

      <View style={styles.formRow}>
        <Text style={styles.labelText}>{t("duration")}</Text>
        <View style={styles.formRow2}>
        <View style={styles.formRow1}>
          <TextInput
            style={styles.timeInput}
            value={duration}
            onChangeText={(text) => {
              const cleaned = text.replace(/[^0-9]/g, ''); // Keep only digits
              if (cleaned === '' || parseInt(cleaned) > 0) {
                setDuration(cleaned);
              }
            }}
            keyboardType="numeric"
            placeholder="1"
            placeholderTextColor="rgba(0,0,0,0.4)"
          />
        </View>
        <View style={styles.formRow1}>
          <DropDown
            options={repUnitsMonth}
            placeholder={t("months")}
            onSelect={(value) => setRepOneUnit(value)}
            initialValue={repOneUnit}
          />
        </View>
        </View>
      </View>
      <View style={styles.lineSeparator} />

      <View style={styles.formRow}>
        <Text style={styles.labelText}>{t("repetition")}</Text>
        <View style={styles.formRow2}>
        <View style={styles.formRow1}>
          <TextInput
            style={styles.timeInput}
            value={repetition}
            onChangeText={(text) => {
              const cleaned = text.replace(/[^0-9]/g, ''); // Keep only digits
              if (cleaned === '' || parseInt(cleaned) > 0) {
                setRepetition(cleaned);
              }
            }}
            keyboardType="numeric"
            placeholder="2"
            placeholderTextColor="rgba(0,0,0,0.4)"
          />
          </View>
          <View style={styles.formRow1}>
          <DropDown
            options={repUnitsDay}
            placeholder={t("days")}
            onSelect={(value) => setRepTwoUnit(value)}
            initialValue={repTwoUnit}
          />
        </View>
        </View>
      </View>
      <View style={styles.lineSeparator} />

      <View style={styles.formRow}>
        <Text style={styles.labelText}>{t("performance")}</Text>
        <TextInput
          style={styles.performanceInput}
          value={performance}
          onChangeText={(text) => {
            const cleaned = text.replace(/[^0-9]/g, '');
            if (cleaned === '') {
              setPerformance('');
            } else {
              const num = parseInt(cleaned);
              if (num >= 0 && num <= 100) {
                setPerformance(cleaned);
              } else if (num > 100) {
                setPerformance('100');
              }
            }
          }}          keyboardType="numeric"
          placeholder="80"
          placeholderTextColor="rgba(0,0,0,0.4)"
        />
        <Text style={styles.percentSign}>%</Text>
      </View>
      <View style={styles.lineSeparator} />

      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>{summaryText}</Text>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleBack}>
                <Text style={styles.buttonText}>{t("discard")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]}>
                <Text style={styles.buttonText}>{t("save")}</Text>
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
  menuComponent: {
    width: "75%",
    minHeight: 20,
    padding: 10,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  textComponent: {
    width: "75%",
    alignItems: "center",
  },
  menuText: {
    fontSize: 20,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#fff",
    textAlign: "left",
    zIndex: 1,
    top: 5,
    position: "relative",
  },
  iconLayout: {
    height: 24,
    width: 24,
    position: "absolute",
  },
  menuIcon: {
    right: "95%",
    zIndex: 3,
    top: 15,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 15,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#fff",
  },
  formRow: {
    width: "75%",
    flexDirection: "column",
    justifyContent: 'space-between', // optional, to space them nicely
    alignItems: 'center', // optional, to vertically center them
    marginBottom: 15,
  },
  formRow1: {
    width: "50%",
    flexDirection: "column",
    justifyContent: 'space-between', // optional, to space them nicely
    alignItems: 'center', // optional, to vertically center them
    marginBottom: 15,
  },
  formRow2: {
    width: "90%",
    flexDirection: "row",
    justifyContent: 'center', // optional, to space them nicely
    alignItems: 'center', // optional, to vertically center them
  },
  labelText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
    fontFamily: "Inter-Regular",
  },
  lineSeparator: {
    width: "75%",
    height: 1,
    backgroundColor: "#fff",
    marginBottom: 15,
    alignSelf: "center",
  },
  repetitionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
  },
  performanceInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 35,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 14,
    color: "#333",
  },
  timeInput:{
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 35,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 14,
    color: "#333",
  },
  percentSign: {
    color: "#fff",
    fontSize: 16,
    position: "absolute",
    right: "30%",
    top: "40%",
    bottom: 0,
    textAlignVertical: "center",
  },
  summaryCard: {
    width: "80%",
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
  button: {
    flex: 0.48,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  deleteButton: {
      backgroundColor: '#C8102E',
  },
  saveButton: {
      backgroundColor: '#4CAF50',
  },
  buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
