import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter, Link } from "expo-router";
import {
  SearchIcon,
  HomeIcon,
  ProfileIcon,
  SettingsIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@/constants/icons";
import DropDown from "../../components/DropDown";
import {
  deleteQuiz,
  getQuizzesByCurrentUser,
  createQuiz,
  generateQuizShareToken
} from "@/apiHelper/backendHelper";
import { useTranslation } from "react-i18next";
import ListLoader from "../../components/ListLoader";

const { width } = Dimensions.get("window");

export default function Quizzes() {
  const { t } = useTranslation("quizzes");

  const [selectedSort, setSelectedSort] = useState<string>("");
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [manualCreateModalVisible, setManualCreateModalVisible] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const router = useRouter();
  const [updated, setUpdated] = useState(false);

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    getQuizzesByCurrentUser()
      .then((quizzes: any) => {
        setShowLoading(false);
        setQuizzes(quizzes?.data);
      })
      .catch((error: any) => {
        setShowLoading(false);
        console.log(error);
      });
  }, [updated]);

  const handleQuizPress = (quiz: any) => {
    setSelectedQuiz(quiz);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedQuiz(null);
  };

  const handlePopUpClose = () => {
    setPopUpVisible(false);
    setSelectedQuiz(null);
  };

  const handleDeleteQuiz = () => {
    deleteQuiz(selectedQuiz?.id)
        .then((res) => {
          Alert.alert(t("success"), t("quiz_deleted"));
          setQuizzes(quizzes.filter((q) => q.id !== selectedQuiz?.id));
          setSelectedQuiz(null);
          setPopUpVisible(false);
          setModalVisible(false);
        });
  };

  const handleStartQuiz = () => {
    if (selectedQuiz) {
      const quizId = selectedQuiz.id;
      setModalVisible(false);
      setSelectedQuiz(null);
      router.push(`/(app)/quiz_question?quizId=${quizId}`);
    } else {
      Alert.alert(t("error"), t("quiz_info_missing"));
    }
  };

  const handleEditQuiz = () => {
    if (selectedQuiz) {
      const quizId = selectedQuiz.id;
      setModalVisible(false);
      setSelectedQuiz(null);
      router.push(`/(app)/editquiz?quizId=${quizId}`);
    } else {
      Alert.alert(t("error"), t("quiz_info_missing"));
    }
  };

  const handleShareQuiz = () => {
    if (selectedQuiz) {
      generateQuizShareToken(selectedQuiz?.id)
        .then((res) => {
          setModalVisible(false);
          setSelectedQuiz(null);
          router.push(`/(app)/sharedquiz?shareToken=${res?.data?.shareToken}`);
        })
        .catch((error) => {
          console.error(error);
          Alert.alert(t("error"), t("share_failed"));
        });
    } else {
      Alert.alert(t("error"), t("quiz_info_missing"));
    }
  };

  const handleGenerateByAI = () => {
    router.push("/(app)/generatequizzes");
  };

  const handleManualCreate = () => {
    if (!newQuizTitle.trim()) {
      Alert.alert(t("error"), t("enter_deck_name"));
      return;
    }

    const data = {
      name: newQuizTitle
    }

    createQuiz(data)
        .then((res) => {
          setManualCreateModalVisible(false);
          setNewQuizTitle("");
          setUpdated((updated) => !updated);
          setQuizzes((prevQuizzes) => [...prevQuizzes, res.data]);
          //router.push("/(app)/updatedeck?deckId=" + res.data.id);
        })
        .catch((error) => {
            console.log(error);
            Alert.alert("Error", "Failed to create quiz");
        });
  };

  const sortOptions = [
    { label: t("sort_by_last_accessed"), value: "last" },
    { label: t("sort_by_newly_accessed"), value: "newest" },
    { label: t("sort_by_best_performance"), value: "best" },
    { label: t("sort_by_worst_performance"), value: "worst" },
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.remedicardio}>ReMediCard.io</Text>

      <View style={styles.searchComponent}>
        <SearchIcon></SearchIcon>
        <TextInput
          style={[styles.searchText, styles.searchPosition]}
          placeholder={t("search")}
          placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
        ></TextInput>
      </View>

      <DropDown
        options={sortOptions}
        placeholder={t("select_sort_option")}
        onSelect={(value) => setSelectedSort(value)}
      />

      {showLoading ? (
        <ListLoader count={6} width={width} />
      ) : (
        <FlatList
          style={styles.flatListContainer}
          contentContainerStyle={styles.flatListContent}
          data={quizzes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.deckComponent}
              onPress={() => handleQuizPress(item)}
            >
              <View>
                <Text style={styles.deckTitle}>{item?.name}</Text>
                {
                  item.lastQuizStat &&
                  <Text style={styles.deckInfoText}>
                    {t("last_accessed")} {formatDate(item?.lastQuizStat?.accessDate)}
                  </Text>
                }
                <Text style={[styles.deckInfoText]}>
                  {item?.questionCount || 0} {t("cards")}
                </Text>
                {
                  item.lastQuizStat &&
                  <Text style={styles.deckInfoText}>
                    {t("best")}{new Intl.NumberFormat('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 1,}).format(item?.bestQuizStat?.successRate)}%
                    {" "}
                    {t("last")}{new Intl.NumberFormat('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 1,}).format(item?.lastQuizStat?.successRate)}%
                  </Text>
                }
                <View style={[styles.chevronRightIcon, styles.iconLayout]}>
                  <ChevronRightIcon color="#111" />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {showLoading ? null : (
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setCreateModalVisible(true)}
        >
          <PlusIcon></PlusIcon>
          <Text style={styles.createNewDeck}>{t("create_new_quiz")}</Text>
        </TouchableOpacity>
      )}

      <Modal
        transparent={true}
        visible={createModalVisible}
        animationType="slide"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t("create_quiz")}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setCreateModalVisible(false);
                //handleManualCreate();
                setManualCreateModalVisible(true);
              }}
            >
              <Text style={styles.modalButtonText}>{t("create_manually")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setCreateModalVisible(false);
                handleGenerateByAI();
              }}
            >
              <Text style={styles.modalButtonText}>{t("create_with_ai")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setCreateModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>{t("cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={popUpVisible}
        animationType="slide"
        onRequestClose={handlePopUpClose}
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
              onPress={handlePopUpClose}
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
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedQuiz?.name}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleStartQuiz}
            >
              <Text style={styles.modalButtonText}>{t("start_quiz")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleEditQuiz}
            >
              <Text style={styles.modalButtonText}>{t("edit_quiz")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleShareQuiz}
            >
              <Text style={styles.modalButtonText}>{t("share_quiz")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#C8102E" }]}
              onPress={() => setPopUpVisible(true)}
            >
              <Text style={[styles.modalButtonText]}>{t("delete_quiz")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={handleModalClose}
            >
              <Text style={styles.modalCancelText}>{t("cancel")}</Text>
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
            <Text style={styles.modalTitle}>{t("new_quiz_name")}</Text>
            <TextInput
              style={[
                styles.searchComponent,
                { width: "100%", marginBottom: 10 },
              ]}
              placeholder={t("enter_quiz_title")}
              value={newQuizTitle}
              onChangeText={setNewQuizTitle}
            />

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleManualCreate}
            >
              <Text style={styles.modalButtonText}>{t("save_and_edit")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setManualCreateModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>{t("cancel")}</Text>
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
    left: "90%",
    zIndex: 3,
    top: "70%",
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
    marginBottom: 8,
  },
  deckTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 8,
  },
  deckComponent: {
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
  link: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
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
