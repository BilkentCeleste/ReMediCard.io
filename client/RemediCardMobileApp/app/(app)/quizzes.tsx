import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList, Modal, Alert,
} from "react-native";
import { useRouter, Link } from "expo-router";
import {
  SearchIcon,
  HomeIcon,
  ProfileIcon,
  SettingsIcon,
  ChevronRightIcon,
  PlusIcon
} from "@/constants/icons";
import DropDown from "../../components/DropDown";
import {deleteQuiz, getQuizzesByCurrentUser, createQuiz} from "@/apiHelper/backendHelper";

export default function Quizzes() {
  const [selectedSort, setSelectedSort] = useState<string>("");
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [manualCreateModalVisible, setManualCreateModalVisible] =
    useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState("");  
  const router = useRouter();

  useEffect(() => {
    getQuizzesByCurrentUser()
        .then((quizzes: any) => {
          const updatedQuizzes = quizzes?.data?.map((quiz: any) => ({
            ...quiz,
            lastAccessed: "31.12.2024",
            bestPerformance: 90,
            lastPerformance: 40,
          }));

          console.log(quizzes.data);
          setQuizzes(updatedQuizzes);
        })
        .catch((error: any) => {
          console.log(error);
        });
  }, []);

  const handleQuizPress = (quiz: any) => {
    setSelectedQuiz(quiz);
    setModalVisible(true);
  };

  const handleDeleteQuiz = () => {
    console.log(selectedQuiz?.id);

    deleteQuiz(selectedQuiz?.id)
      .then((res) => {
        Alert.alert("Success", "Selected quiz is successfully deleted!");
        setQuizzes(quizzes.filter((q) => q.id !== selectedQuiz?.id));
        setSelectedQuiz(null);
        setPopUpVisible(false);
        setModalVisible(false);
      });
  }

  const handleStartQuiz = () => {
    if (selectedQuiz) {
      setModalVisible(false);
      router.push({
        pathname: "/(app)/quiz_question",
        params: { quiz: JSON.stringify(selectedQuiz) },
      });
    } else {
      Alert.alert("Error", "Quiz information is missing.");
    }
  }

  const handleEditQuiz = () => {
    setModalVisible(false);
    // router.push("/(app)/edit_deck");
  }

  const handleGenerateByAI = () => {
    Alert.alert("AI", "Generate With AI");
  };

  const handleManualCreate = () => {
    Alert.alert("Manual", "Generate Manual");

    if (!newQuizTitle.trim()) {
      Alert.alert("Error", "Please enter a deck name");
      return;
    }

    createQuiz({
      name: newQuizTitle,
    }).then((res) => {
      setManualCreateModalVisible(false);
      setNewQuizTitle("");
      //router.push("/(app)/updatedeck?deckId=" + res.data.id);
    });
  };

  const sortOptions = [
    { label: "Sort by Last Accessed", value: "last" },
    { label: "Sort by Newly Accessed", value: "newest" },
    { label: "Sort by Best Performance", value: "best" },
    { label: "Sort by Worst Performance", value: "worst" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.remedicardio}>ReMediCard.io</Text>

      <View style={styles.searchComponent}>
        <SearchIcon></SearchIcon>
        <TextInput
          style={[styles.searchText, styles.searchPosition]}
          placeholder="search anything"
          placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
        ></TextInput>
      </View>

      <DropDown
        options={sortOptions}
        placeholder="Select sort option"
        onSelect={(value) => setSelectedSort(value)}
      />

      <FlatList
        style={styles.flatListContainer}
        contentContainerStyle={styles.flatListContent} // Style for inner FlatList items
        data={quizzes}
        keyExtractor={(item, index) => index.toString()} // Add padding to avoid overlap with navbar
        renderItem={({ item }) => (
          <TouchableOpacity
              style={styles.deckComponent}
              onPress={() => handleQuizPress(item)}
          >
            <View>
              <Text style={styles.deckTitle}>{item.name}</Text>
              <Text style={[styles.deckInfoText]}>
                Last accessed: {item.lastAccessed}
              </Text>
              <Text style={[styles.deckInfoText]}>{item?.questions?.length || 0} cards</Text>
              <Text style={[styles.deckInfoText]}>
                Best: {item.bestPerformance}% Last: {item.lastPerformance}%
              </Text>
              <View style={[styles.chevronRightIcon, styles.iconLayout]}>
                <ChevronRightIcon color="#111" />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
              style={styles.createButton}
              onPress={() => setCreateModalVisible(true)}
            >
              <PlusIcon></PlusIcon>
              <Text style={styles.createNewDeck}>Create New Quiz</Text>
            </TouchableOpacity>
      
            <Modal
              transparent={true}
              visible={createModalVisible}
              animationType="slide"
              onRequestClose={() => setCreateModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Create Quiz</Text>
      
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      setCreateModalVisible(false);
                      //handleManualCreate();
                      setManualCreateModalVisible(true);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Create Manually</Text>
                  </TouchableOpacity>
      
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      setCreateModalVisible(false);
                      handleGenerateByAI();
                    }}
                  >
                    <Text style={styles.modalButtonText}>Create with AI</Text>
                  </TouchableOpacity>
      
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => setCreateModalVisible(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

      <Modal
          transparent={true}
          visible={popUpVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {" "}
              Are you sure about deleting the selected quiz?{" "}
            </Text>

            <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#C8102E" }]}
                onPress={handleDeleteQuiz}
            >
              <Text style={[styles.modalButtonText]}>Delete Quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setPopUpVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedQuiz?.name}</Text>
            <TouchableOpacity
                style={styles.modalButton}
                onPress={handleStartQuiz}
            >
              <Text style={styles.modalButtonText}>Start Quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.modalButton}
                onPress={handleEditQuiz}
            >
              <Text style={styles.modalButtonText}>Edit Quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#C8102E" }]}
                onPress={() => setPopUpVisible(true)}
            >
              <Text style={[styles.modalButtonText]}>Delete Quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <Modal
        transparent={true}
        visible={manualCreateModalVisible}
        animationType="slide"
        onRequestClose={() => setManualCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>New Quiz Name</Text>
            <TextInput
              style={[
                styles.searchComponent,
                { width: "100%", marginBottom: 10 },
              ]}
              placeholder="Enter deck title"
              value={newQuizTitle}
              onChangeText={setNewQuizTitle}
            />

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleManualCreate}
            >
              <Text style={styles.modalButtonText}>Save & Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setManualCreateModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
        
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
  navbarRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 30,
    position: "absolute", // Position the navbar absolutely
    bottom: 50,
    backgroundColor: "#53789D",
  },
  navbarContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "75%",
    position: "absolute",
    bottom: 50,
    backgroundColor: "#53789D", // Match the background color
    height: 1,
  },
  navbarLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#fff",
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
  menuComponent: {
    width: "75%",
    height: 20,
    padding: 10,
    gap: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  menuText: {
    left: "10%",
    fontSize: 12,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#fff",
    textAlign: "left",
    zIndex: 1,
    top: 5,
    position: "absolute",
  },
  iconLayout: {
    height: 24,
    width: 24,
    position: "absolute",
  },
  chevronRightIcon: {
    left: "100%",
    zIndex: 3,
    top: "90%",
  },
  menuIcon: {
    right: "95%",
    zIndex: 3,
    top: 5,
  },
  selectedOption: {
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  deckInfoText: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.7)",
    marginBottom: 8, // Spacing below title
  },
  deckTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 8, // Spacing below title
  },
  deckComponent: {
    borderRadius: 20,
    backgroundColor: "#fff",
    width: "100%", // Adjusted width to fit screen
    height: 120, // Increased height for sufficient spacing
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 15, // Add padding for content
    marginVertical: 5, // Space between items
  },
  accessInfoPosition: {
    top: 35,
    zIndex: 1,
    left: 15,
  },
  cardsLengthInfoPosition: {
    top: 55,
    left: 15,
    zIndex: 2,
  },
  performanceInfoPosition: {
    top: 75,
    zIndex: 3,
    left: 15,
  },
  flatListContainer: {
    width: "75%", // Adjust the width to be larger
    height: "35%", // Shorten the height
    marginTop: 5, // Lower its starting position
    backgroundColor: "transparent", // Optional, keeps it aligned with the background
    marginBottom: 120,
  },
  flatListContent: {
    alignItems: "stretch", // Ensure items stretch to the container width
    paddingBottom: 20, // Add padding if needed at the bottom
  },
  link: {
    flexDirection: "column", // Stack children vertically
    alignItems: "flex-start", // Align text to the left
    width: "100%", // Ensure it doesn't shrink
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
  createButton: {
    borderRadius: 20,
    backgroundColor: "#2916ff",
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
    height: 50,
    bottom: "15%",
  },
  createNewDeck: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#fff",
    textAlign: "center",
  },
});
