import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { GoBackIcon } from "@/constants/icons";
import DropDown from "../../components/DropDown";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/NavBar"
import { createStudyGoal, getDecksByCurrentUser, getQuizzesByCurrentUser } from "@/apiHelper/backendHelper";

export default function CreateGoal() {
  const { t } = useTranslation("create_goal");
  const router = useRouter();
  const { deck_id } = useLocalSearchParams();

  const [deckOrQuiz, setDeckOrQuiz] = useState("Deck");
  const [repOneUnit, setRepOneUnit] = useState("month(s)");
  const [repTwoUnit, setRepTwoUnit] = useState("day(s)");
  const [performance, setPerformance] = useState("80");
  const [duration, setDuration] = useState("1");
  const [repetition, setRepetition] = useState("2");
  const [deckList, setDeckList] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

    useEffect(() => {
      getDecksByCurrentUser()
        .then((decks) => {
          setDeckList(decks?.data.map((deck) => (
            { label: deck.name, value: deck.id }
          )));
        })
        .catch((error) => {
          Alert.alert(t("error"), t("fetch_decks_failed"));
        });

      getQuizzesByCurrentUser()
        .then((quizzes) => {
          setQuizList(quizzes?.data.map((quiz) => (
            { label: quiz.name, value: quiz.id }
          )));
        })
        .catch((error) => {
          Alert.alert(t("error"), t("fetch_quizzes_failed"));
        });
    }, []);

  const handleSave = () => {
    if( selectedDeck === null && selectedQuiz === null) {
      Alert.alert(t("error"), t("select_deck_or_quiz"));
      return;
    }
    const data = {
      deckId: deckOrQuiz === "Deck" ? selectedDeck : null,
      quizId: deckOrQuiz === "Quiz" ? selectedQuiz : null,
      targetPerformance: parseInt(performance),
      repetitionIntervalInHours: repTwoUnit === "day(s)"? parseInt(repetition) * 24 : parseInt(repetition),
      durationInDays: repOneUnit === "month(s)"? parseInt(duration) * 30 : parseInt(duration) * 7,
    };

    createStudyGoal(data)
      .then((response) => {
        router.push("/(app)/goal_list");
      })
      .catch((error) => {
        Alert.alert(t("error"), t("create_goal_failed"));
      });
  }

  const handleBack = () => {
    router.push("/(app)/goal_list");
}

  const deckOrQuizOptions = [
    { label: t("deck"), value: "Deck" },
    { label: t("quiz"), value: "Quiz" },
  ];
  const repUnitsMonth = [
    { label: t("months"), value: "month(s)" },
    { label: t("weeks"), value: "week(s)" },
  ];
  const repUnitsDay = [
    { label: t("days"), value: "day(s)" },
    { label: t("hours"), value: "hour(s)" },
  ];

  const summaryText = t("informing_message", {repetition: repetition, performance: performance, duration: duration, repOneUnit: repOneUnit === "month(s)"? t("months"): t("weeks"), repTwoUnit: repTwoUnit === "day(s)"? t("days"): t("hours")});

  return (
    <View style={styles.container}>
       <View style={styles.menuComponent}>
        <View style={[styles.menuIcon, styles.iconLayout]}>
            <Link href="/(app)/goal_list"><GoBackIcon width={100} height={100} /></Link>
        </View>

        <View style = {styles.textComponent}>
        <Text style={styles.menuText} numberOfLines={2} ellipsizeMode="tail">{t("create_goal")}</Text>
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
            onSelect={(value) => setDeckOrQuiz(value)}
          />
        </View>
        <View style={styles.formRow1}>
        <DropDown
            key={deckOrQuiz}
            options={deckOrQuiz === "Deck" ? deckList : quizList}
            placeholder={deckOrQuiz === "Deck"? t("select_deck"): t("select_quiz")}
            onSelect={(value) => deckOrQuiz === "Deck"? setSelectedDeck(value): setSelectedQuiz(value)}
            initialValue={deckList[0]?.value || quizList[0]?.value}
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
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                <Text style={styles.buttonText}>{t("save")}</Text>
            </TouchableOpacity>
        </View>
      </View>

      <NavBar/>
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
