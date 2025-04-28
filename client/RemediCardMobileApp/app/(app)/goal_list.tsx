import React, {useEffect, useState} from "react";
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View,  Modal, Alert} from "react-native";
import { useRouter, Link, useLocalSearchParams } from "expo-router";
import {ChevronRightIcon, HomeIcon, PlusIcon, ProfileIcon, SearchIcon, SettingsIcon} from "@/constants/icons";
import DropDown from "../../components/DropDown";
import {useTranslation} from "react-i18next";
import NavBar from "@/components/NavBar";
import { getStudyGoals, deleteStudyGoal, getDeckByDeckId, getQuizByQuizId } from "@/apiHelper/backendHelper";

export default function GoalList() {
  const { t } = useTranslation("goal_list");
  const router = useRouter();
  
  const [selectedSort, setSelectedSort] = useState<string>("longest");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [listType, setListType] = useState("deck")
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [deckGoals, setDeckGoals] = useState<any[]>([]);
  const [quizGoals, setQuizGoals] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    getStudyGoals()
      .then((goals) => {
        setDeckGoals(goals.data.filter((goal: any) => goal.deckId !== null).map((goal: any) => ({
            id: goal.id,
            title: t("goal_name", {deckOrQuizName: goal.deckOrQuizName}),
            duration: daysBetween(goal.startDate, goal.endDate) >= 30 ? `${Math.floor(daysBetween(goal.startDate, goal.endDate) / 30)} ` + t("months") : `${Math.floor(daysBetween(goal.startDate, goal.endDate) / 7)} ` + t("weeks"),
            repetition: goal.repetitionInterval % 24 === 0 ? `${goal.repetitionInterval / 24} ` + t("days") : `${goal.repetitionInterval} ` + t("hours"),
            startDate: formatDate(goal.startDate),
            endDate: formatDate(goal.endDate),
            goalPercent: goal.targetPerformance,
            deckId: goal.deckId,
            completed: goal.completed,
          }))
        );
        setQuizGoals(goals.data.filter((goal: any) => goal.quizId !== null).map((goal: any) => ({
          id: goal.id,
          title: t("goal_name", {deckOrQuizName: goal.deckOrQuizName}),
          duration: daysBetween(goal.startDate, goal.endDate) >= 30 ? `${Math.floor(daysBetween(goal.startDate, goal.endDate) / 30)} ` + t("months") : `${Math.floor(daysBetween(goal.startDate, goal.endDate) / 7)} ` + t("weeks"),
          repetition: goal.repetitionInterval % 24 === 0 ? `${goal.repetitionInterval / 24} ` + t("days") : `${goal.repetitionInterval} ` + t("hours"),
          startDate: formatDate(goal.startDate),
          endDate: formatDate(goal.endDate),
          goalPercent: goal.targetPerformance,
          quizId: goal.quizId,
          completed: goal.completed,
          }))
        );
      })
      .catch((error) => {
        Alert.alert(t("error"), t("fetch_decks_failed"));
      });
  }, []);

  useEffect(() => {
    if (listType === "deck") {
      setGoals(deckGoals);
    } else {
      setGoals(quizGoals);
    }
  }, [listType, deckGoals, quizGoals]);

  const handleSelectGoal = (goal: any) => {
    setSelectedGoal(goal);
    setModalVisible(true);
  };

  const handleEditGoal = () => {
    let path = '/create_goal?goal=' + encodeURIComponent(JSON.stringify(selectedGoal));
-   router.push({ pathname: path });
  }

  const handleStart = () => {
    if (selectedGoal) {
      if ( listType === "deck") {
        getDeckByDeckId(selectedGoal.deckId)
          .then((deck) => {
            if(deck.data.flashcardCount === 0){
              Alert.alert(t("no_cards_available"), 
              t("no_cards_available_message"), 
              [{text: t("ok"), style: "cancel"}], { cancelable: false }
              );
              return
            }
            setModalVisible(false);
            router.push({
              pathname: "/(app)/card",
              params: { deck: JSON.stringify(deck.data) },
            });
          })
          .catch((error) => {
            Alert.alert(t("error"), t("fetch_deck_failed"));
          });
      }
      else if (listType === "quiz") {
        getQuizByQuizId(selectedGoal.quizId)
          .then((quiz) => {
            if(quiz.data.questionCount === 0){
              Alert.alert(t("no_quizzes_available"), t("no_quizzes_available_message"), 
              [{text: t("ok"), 
                style: "cancel" }],
              { cancelable: false })
                return
              }
            const quizId = quiz.data.id;
            setModalVisible(false);
            router.push(`/(app)/quiz_question?quizId=${quizId}`);
          })
          .catch((error) => {
            Alert.alert(t("error"), t("fetch_quiz_failed"));
          });
      }
    }
  };

  const handleDeleteGoal = () => {
    deleteStudyGoal(selectedGoal.id)
      .then(() => {
        setModalVisible(false);
        setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== selectedGoal.id));
        Alert.alert(t("success"), t("goal_deleted"));
      })
      .catch((error) => {
        Alert.alert(t("error"), t("delete_goal_failed"));
      }
    );
  }

  const sortOptions = [
    { label: t("sort_by_longest"), value: "longest" },
    { label: t("sort_by_shortest"), value: "shortest" },
    { label: t("sort_by_highest"), value: "highestGoal" },
    { label: t("sort_by_lowest"), value: "lowestGoal" },
  ];


  const searchedGoals = goals.filter((goal) =>
      goal.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr: any) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  function daysBetween(dateTimeString1, dateTimeString2) {
    const date1 = new Date(dateTimeString1);
    const date2 = new Date(dateTimeString2);

    // Get difference in milliseconds
    const diffMillis = Math.abs(date2 - date1);

    // Convert milliseconds to days
    const diffDays = Math.floor(diffMillis / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.remedicardio}>{t("title")}</Text>

      <View style={styles.searchComponent}>
        <SearchIcon />
        <TextInput
          style={[styles.searchText, styles.searchPosition]}
          placeholder={t("search")}
          placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>

      <DropDown
        options={sortOptions}
        placeholder={t("select_sort_option")}
        onSelect={(value) => setSelectedSort(value)}
      />

      <FlatList
        style={styles.flatListContainer}
        contentContainerStyle={styles.flatListContent}
        data={searchedGoals}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={[
            styles.goalComponent,
            item.completed && { borderColor: '#28a745', borderWidth: 5 }
          ]} onPress={() => handleSelectGoal(item)}>
              {item.completed && (
                <Text style={styles.completedBadge}>{t("completed")}</Text>
              )}
            <View style={styles.link}>
              <View>
                <Text style={styles.goalTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                <Text style={styles.goalInfoText}>
                  {t("duration")}: {item.duration}
                </Text>
                <Text style={styles.goalInfoText}>
                  {t("repetition")}: {item.repetition}
                </Text>
                <Text style={styles.goalInfoText}>
                  {t("from")}: {item.startDate} - {item.endDate}
                </Text>
                <Text style={styles.goalInfoText}>
                  {t("goal_performance")}: {item.goalPercent}%
                </Text>
                <View style={[styles.chevronRightIcon, styles.iconLayout]}>
                  <ChevronRightIcon color="#111" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            listType === "deck" && styles.activeButton,
          ]}
          onPress={() => {
            {
              setListType("deck")
            }
          }}
        >
          <Text
            style={[
              styles.toggleButtonText,
              listType === "deck" && styles.activeText,
            ]}
          >
            {t("decks")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            listType === "quiz" && styles.activeButton,
          ]}
          onPress={() => {
            setListType("quiz")
          }}
        >
          <Text
            style={[
              styles.toggleButtonText,
              listType === "quiz" && styles.activeText,
            ]}
          >
            {t("quizzes")}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.createButton} onPress={() => {
          router.push("/(app)/create_goal");
        }}>
          <PlusIcon></PlusIcon>
          <Text style={styles.createNewDeck}>{t("create_goal")}</Text>
      </TouchableOpacity>

      <Modal
              transparent={true}
              visible={modalVisible}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedGoal?.title}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleStart}
            >
              <Text style={styles.modalButtonText}>{listType === "deck"? t("review_deck"): t("review_quiz")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleEditGoal}
            >
              <Text style={styles.modalButtonText}>{t("edit_goal")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#C8102E" }]}
              onPress={handleDeleteGoal}
            >
              <Text style={[styles.modalButtonText]}>{t("delete_goal")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>{t("cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  goalComponent: {
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
  goalTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 8,
  },
  goalInfoText: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.7)",
    marginBottom: 2,
  },
  iconLayout: {
    height: 24,
    width: 24,
    position: "absolute",
  },
  chevronRightIcon: {
    left: "90%",
    zIndex: 3,
    top: "75%",
  },
  link: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
  },
  createButton: {
    borderRadius: 20,
    backgroundColor: "#2916ff",
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
    height: 50,
    bottom: "13%"
  },
  createNewDeck: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#fff",
    textAlign: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "75%",
    bottom: "14%",
  },  
  toggleButton: {
    width: "40%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 50,
  },
  toggleButtonText:{
    color: "white",
    fontWeight: "normal",
    fontSize: 18,
    alignSelf: "center",
  },
  activeText: {
    fontWeight: "bold",
  },
   activeButton: {
    borderBottomWidth: 2,
    borderColor: "#fff",
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
  modalButton: {
    backgroundColor: "#2916ff",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    marginVertical: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalCancel: {
    marginTop: 10,
  },
  modalCancelText: {
    color: "#2916ff",
    fontWeight: "bold",
    fontSize: 16,
  },
  completedBadge: {
    position: "absolute",
    top: 25,
    right: 10,
    backgroundColor: "#28a745",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: "bold",
    overflow: "hidden",
  },
  
});