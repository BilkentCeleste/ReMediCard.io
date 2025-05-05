import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  BackHandler,
} from "react-native";
import {
  useRouter,
  Link,
  useLocalSearchParams,
} from "expo-router";
import {
  PlusIcon,
  GoBackIcon,
  EditIcon
} from "@/constants/icons";
import { getQuizByQuizId, removeQuestion, updateQuizName } from "@/apiHelper/backendHelper";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import NavBar from "@/components/NavBar"

export default function editQuiz() {
  const { t } = useTranslation("edit_quiz");
  const router = useRouter();
  const { quizId } = useLocalSearchParams();

  const [quiz, setQuiz] = useState();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [DeleteQuestionModalVisible, setDeleteQuestionModalVisible] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    if (quizId) {
      getQuizByQuizId(quizId)
        .then((res) => {
          setQuiz(res?.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [quizId]);

  useFocusEffect(() => {
    const onBackPress = () => {
      router.replace("/(app)/quizzes");
      return true;
    };
  
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  });

  const uploadUpdateQuestion = (questionId) => {
    const question = quiz?.questions?.find((q) => q.id === questionId);
    router.push(
      `/(app)/updatequizquestion?question=${encodeURIComponent(
        JSON.stringify(question)
      )}&quizId=${quizId}`
    );
  };

  const handleToggleDeleteQuestionModal = (id) => {
    setDeleteQuestionModalVisible(!DeleteQuestionModalVisible);
    setSelectedQuestion(id);
  };

  const handleDeleteQuestion = () => {
    removeQuestion(selectedQuestion)
      .then((res) => {
        setDeleteQuestionModalVisible(false);
        setQuiz((prevQuiz) => ({
          ...prevQuiz,
          questions: prevQuiz?.questions?.filter(
            (question) => question?.id !== selectedQuestion
          ),
        }));
        setSelectedQuestion(null);
      })
      .catch((error) => {
        Alert.alert(t("error"), t("delete_failed"));
      });
  };

  const handleNameEdit = () => {
    setIsEditingName(true);
    setEditedName(quiz?.name || "");
  };

  const handleNameSave = async () => {
    if (!editedName) {
        Alert.alert(t("error"), t("name_required"));
        return;
    }

    const data = {
        name: editedName,
    }

    updateQuizName(quizId, data)
        .then((res) => {
            setQuiz(prev => ({
              ...prev,
              name: editedName
            }));
            setIsEditingName(false);
        })
        .catch((error) => {
            Alert.alert(t("error"), t("update_failed"));
        });
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      activeOpacity={1}
      onPress={() => {
        if (isEditingName) {
          setIsEditingName(false);
        }
      }}
    >
      <View style={styles.menuComponent}>
        <View style={[styles.menuIcon, styles.iconLayout]}>
          <Link href="/(app)/quizzes">
            <GoBackIcon width={100} height={100} />
          </Link>
        </View>

        <View style={styles.textComponent}>
          {isEditingName ? (
            <TouchableOpacity 
              style={styles.nameEditContainer}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <TextInput
                style={styles.nameInput}
                value={editedName}
                onChangeText={setEditedName}
                autoFocus
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleNameSave();
                }}
              >
                <Text style={styles.saveButtonText}>{t("save")}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation();
                handleNameEdit();
              }}
            >
              <Text style={styles.menuText} numberOfLines={2} ellipsizeMode="tail">
                {quiz?.name}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {!isEditingName && (
            <TouchableOpacity
                style={[styles.menuIconEdit, styles.iconLayoutEdit]}
                onPress={handleNameEdit}
            >
              <EditIcon color={"#fff"} />
            </TouchableOpacity>
        )}

        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
        </View>
      </View>

      <FlatList
        style={styles.flatListContainer}
        contentContainerStyle={styles.flatListContent}
        data={quiz?.questions}
        renderItem={({ item }) => (
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{item?.description}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => uploadUpdateQuestion(item?.id)}
            >
              <Text style={styles.editButtonText}>{t("edit")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleToggleDeleteQuestionModal(item?.id)}
            >
              <Text style={styles.deleteButtonText}>{t("delete")}</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={DeleteQuestionModalVisible}
        onRequestClose={() => {
          setDeleteQuestionModalVisible(!DeleteQuestionModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t("delete_question_consent")}
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setDeleteQuestionModalVisible(false)}
              >
                <Text style={styles.editButtonText}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteQuestion()}
              >
                <Text style={styles.deleteButtonText}>{t("delete")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
          style={styles.createButton}
          onPress={() => uploadUpdateQuestion()}
        >
          <PlusIcon></PlusIcon>
          <Text style={styles.createButtonText}>{t("create_question")}</Text>
        </TouchableOpacity>

      <NavBar/>
    </TouchableOpacity>
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
  flatListContainer: {
    width: "75%",
    height: "50%",
    marginTop: 5,
    marginBottom: 120,
  },
  flatListContent: {
    width: "130%",
    alignItems: "stretch",
    paddingBottom: 20,
    justifyContent: "space-evenly",
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
  createButtonText: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#fff",
    textAlign: "center",
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
  iconLayoutEdit: {
    height: 24,
    width: 24,
    position: "absolute",
  },
  menuIconEdit: {
    right: "25%",
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
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    width: "75%",
    alignItems: "center",
    justifyContent: "center",
  },
  questionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 1,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 2,
    width: "50%"
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#C8102E",
    paddingVertical: 1,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "50%"
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  nameInput: {
    flex: 1,
    fontSize: 20,
    lineHeight: 24,
    fontFamily: "Inter-Regular",
    color: "#fff",
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    height: 40,
    minWidth: '90%',
  },

  saveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
