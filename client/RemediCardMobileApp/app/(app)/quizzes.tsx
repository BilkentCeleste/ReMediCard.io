import React, { useState, useEffect, useRef } from "react";
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
  Animated,
  Easing,
  Share
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  SearchIcon,
  ChevronRightIcon,
  PlusIcon,
  ChevronDown
} from "@/constants/icons";
import DropDown from "../../components/DropDown";
import {
  deleteQuiz,
  getQuizzesByCurrentUser,
  createQuiz,
  generateQuizShareToken,
  changeQuizVisibility,
} from "@/apiHelper/backendHelper";
import { useTranslation } from "react-i18next";
import ListLoader from "../../components/ListLoader";
import { quizzesSearch } from "@/apiHelper/backendHelper";
import NavBar from "@/components/NavBar";

const { width } = Dimensions.get("window");

export default function Quizzes() {
  const { t } = useTranslation("quizzes");
  const { quiz_selected } = useLocalSearchParams();
  const router = useRouter();
  const isFirstRender = useRef(true);

  const [selectedSort, setSelectedSort] = useState<string>("access");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [visibilityPopUpVisible, setVisibilityPopUpVisible] = useState(false);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [manualCreateModalVisible, setManualCreateModalVisible] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [updated, setUpdated] = useState(false);
  const [searchParamUsed, setSearchParamUsed] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [isRotated, setIsRotated] = useState(false);
  const rotation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    getQuizzesByCurrentUser()
      .then((quizzes: any) => {
        setShowLoading(false);
        setQuizzes(quizzes?.data);
        if (!searchParamUsed && quiz_selected !== undefined) {
          setSearchParamUsed(true);
          const selected = quizzes?.data.find(
            (quiz: any) => quiz.id == quiz_selected
          );
          handleQuizPress(selected);
        }
      })
      .catch((error: any) => {
        setShowLoading(false);
        console.log(error);
      });
  }, [updated]);

  useEffect(() => {
      if (debouncedSearchText.trim() !== "") {
        setShowLoading(true);
        quizzesSearch(debouncedSearchText)
          .then((res) => {
            setShowLoading(false);
            setQuizzes(res.data);
          })
          .catch((e) => {
            console.log(e)
            setShowLoading(false);
          });
      } else {
        if (isFirstRender.current) {
          isFirstRender.current = false;
          return;
        }
        setUpdated(!updated);
      }
    }, [debouncedSearchText]);
  
  useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedSearchText(searchText);
      }, 700);
  
      return () => {
        clearTimeout(handler);
      };
    }, [searchText]);

  const cleanSearch = () => {
    setSearchText("");
    setDebouncedSearchText("");
  };

  const handleChangeVisibility = () => {
      changeQuizVisibility(selectedQuiz.id)
        .then(res => {
          selectedQuiz.isPubliclyVisible = !selectedQuiz.isPubliclyVisible
          setVisibilityPopUpVisible(false)
        })
      .catch(error => {
            Alert.alert(t("error"), t("change_visibility_failed"));
        });
    }

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
        })
        .catch((error) => {
          console.log(error);
          Alert.alert(t("error"), t("quiz_delete_failed"));
        });
  };

  const handleStartQuiz = () => {
    if (selectedQuiz) {
      if(selectedQuiz.questionCount === 0){
        Alert.alert(t("no_quizzes_available"), t("no_quizzes_available_message"), 
        [{text: t("ok"), 
          style: "cancel" }],
        { cancelable: false })
          return
        }

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
          const shareUrl = res?.data;
          Share.share({
            message: shareUrl,
            url: shareUrl,
            title: selectedQuiz.name
          }, {
            dialogTitle: 'Share Quiz',
            subject: selectedQuiz.name
          })})
        .catch((error) => {
            console.error('Error sharing:', error);
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
      Alert.alert(t("error"), t("enter_quiz_name"));
      return;
    }

    const data = {
      name: newQuizTitle,
    };

    createQuiz(data)
      .then((res) => {
        setManualCreateModalVisible(false);
        setNewQuizTitle("");
        setUpdated((updated) => !updated);
        setQuizzes((prevQuizzes) => [...prevQuizzes, res.data]);
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Error", t("quiz_create_failed"));
      });
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    Animated.timing(rotation, {
      toValue: isRotated ? 0 : 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    setIsRotated(!isRotated);
  }

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const iconStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const sortOptions = [
    { label: t("sort_by_access_date"), value: "access" },
    { label: t("sort_by_recent_performance"), value: "recent" },
    { label: t("sort_by_best_performance"), value: "best" },
    { label: t("sort_by_alphabetical"), value: "alphabetical" },
  ];

  const sortedQuizzes = sortQuizzes(quizzes, selectedSort, sortOrder);

  function sortQuizzes(quizzes, sortBy = 'access', order = 'desc') {
    return quizzes.slice().sort((a, b) => {
      const getDate = stat => stat ? new Date(stat.accessDate) : new Date(0);
      const getRate = stat => stat ? stat.successRate : -1;

      let compare = 0;

      if (sortBy === 'access') {
        const aDate = getDate(a.lastQuizStat || a.bestQuizStat);
        const bDate = getDate(b.lastQuizStat || b.bestQuizStat);
        compare = aDate - bDate;
      } else if (sortBy === 'recent') {
        const aRate = getRate(a.lastQuizStat);
        const bRate = getRate(b.lastQuizStat);
        compare = aRate - bRate;
      } else if (sortBy === 'best') {
        const aRate = getRate(a.bestQuizStat);
        const bRate = getRate(b.bestQuizStat);
        compare = aRate - bRate;
      } else if (sortBy === 'alphabetical') {
        compare = a.name.localeCompare(b.name);
      }

      return order === 'asc' ? compare : -compare;
    });
  }

  const formatDate = (dateStr: any) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
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
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
        ></TextInput>
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={cleanSearch}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <DropDown
        options={sortOptions}
        placeholder={t("select_sort_option")}
        onSelect={(value) => setSelectedSort(value)}
        showChevron = {false}
      />

      <TouchableOpacity
          onPress={toggleSortOrder}
      >
        <Animated.View style={iconStyle}>
          <ChevronDown />
        </Animated.View>
      </TouchableOpacity>

      {showLoading ? (
        <ListLoader count={6} width={width} />
      ) : (
        <FlatList
          style={styles.flatListContainer}
          contentContainerStyle={styles.flatListContent}
          data={sortedQuizzes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.deckComponent}
              onPress={() => handleQuizPress(item)}
            >
              <View>
                <Text style={styles.deckTitle} numberOfLines={3} ellipsizeMode="tail">{item.name}</Text>
                {item.lastQuizStat && (
                  <Text style={styles.deckInfoText}>
                    {t("last_accessed")}{" "}
                    {formatDate(item.lastQuizStat.accessDate)}
                  </Text>
                )}
                <Text style={[styles.deckInfoText]}>
                  {item?.questionCount || 0} {t("questions")}
                </Text>
                {item.lastQuizStat && (
                  <Text style={styles.deckInfoText}>
                    {t("best")}
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 1,
                    }).format(item.bestQuizStat.successRate)}
                    % {t("last")}
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 1,
                    }).format(item.lastQuizStat.successRate)}
                    %
                  </Text>
                )}
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
            {t("delete_quiz_message")}
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#C8102E" }]}
              onPress={handleDeleteQuiz}
            >
              <Text style={[styles.modalButtonText]}>{t("delete_quiz")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={handlePopUpClose}
            >
              <Text style={styles.modalCancelText}>{t("cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
              transparent={true}
              visible={visibilityPopUpVisible}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}> {t("change_public_visibility_message")}</Text>
                  <Text style={styles.modalTitle}> {t("next_public_visibility")} {t(selectedQuiz?.isPubliclyVisible ? "private": "public")}</Text>
                  <TouchableOpacity
                    style={[styles.modalButton]}
                    onPress={handleChangeVisibility}
                  >
                    <Text style={[styles.modalButtonText]}>{t("change_visibility")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => setVisibilityPopUpVisible(false)}
                  >
                    <Text style={styles.modalCancelText}>{t("cancel")}</Text>
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
              style={[styles.modalButton]}
              onPress={() => setVisibilityPopUpVisible(true)}
              >
                <Text style={[styles.modalButtonText]}>{t("change_public_visibility")}</Text>
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
    bottom: "12%",
  },
  createNewDeck: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#fff",
    textAlign: "center",
  },
  clearButton: {
    paddingHorizontal: 6,
    position: "absolute",
    right: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: "#888",
  },
});
