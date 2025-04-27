import React, {useState} from "react";
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View,  Modal} from "react-native";
import { useRouter, Link, useLocalSearchParams } from "expo-router";
import {ChevronRightIcon, HomeIcon, PlusIcon, ProfileIcon, SearchIcon, SettingsIcon} from "@/constants/icons";
import DropDown from "../../components/DropDown";
import {useTranslation} from "react-i18next";
import NavBar from "@/components/NavBar";

interface Goal {
  title: string;
  duration: string;
  repetition: string;
  startDate: string;
  endDate: string;
  goalPercent: number;
}

export default function GoalList() {
  const { t } = useTranslation("goal_list");
  const router = useRouter();
    const {id, type} = useLocalSearchParams()
  

  const [selectedSort, setSelectedSort] = useState<string>("longest");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [listType, setListType] = useState(type ? type : "deck")
  const [showLoading, setShowLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<any>(null);
  
  const handleDeckPress = (deck: any) => {
    setSelectedDeck(deck);
    setModalVisible(true);
  };

  const sortOptions = [
    { label: t("sort_by_longest"), value: "longest" },
    { label: t("sort_by_shortest"), value: "shortest" },
    { label: t("sort_by_highest"), value: "highestGoal" },
    { label: t("sort_by_lowest"), value: "lowestGoal" },
  ];

  const goals: Goal[] = [
    {
      title: "Goal 1 for Deck 1",
      duration: "1 Month(s)",
      repetition: "2 Day(s)",
      startDate: "01.07.2025",
      endDate: "01.08.2025",
      goalPercent: 80,
    },
    {
      title: "Goal 2 for Deck 2",
      duration: "1 Week(s)",
      repetition: "1 Day(s)",
      startDate: "01.07.2025",
      endDate: "07.07.2025",
      goalPercent: 90,
    },
  ];

  const sortedGoals = goals.filter((goal) =>
      goal.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        data={sortedGoals}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.goalComponent} onPress={() => handleDeckPress(item)}>
            <View style={styles.link}>
              <View>
                <Text style={styles.goalTitle}>{item.title}</Text>
                <Text style={styles.goalInfoText}>
                  Duration: {item.duration}
                </Text>
                <Text style={styles.goalInfoText}>
                  Repetition: {item.repetition}
                </Text>
                <Text style={styles.goalInfoText}>
                  From: {item.startDate} - {item.endDate}
                </Text>
                <Text style={styles.goalInfoText}>
                  Goal: {item.goalPercent}%
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
            <Text style={styles.modalTitle}>{selectedDeck?.title}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              //onPress={handleStartDeck}
            >
              <Text style={styles.modalButtonText}>{t("review_deck")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              //onPress={handleEditDeck}
            >
              <Text style={styles.modalButtonText}>{t("edit_goal")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#C8102E" }]}
              //onPress={() => setPopUpVisible(true)}
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
});