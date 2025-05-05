import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  SafeAreaView
} from "react-native";
import { useRouter } from "expo-router";
import { GoBackIcon, NextQuestionIcon } from "@/constants/icons";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useTranslation } from "react-i18next";
import { getQuizByQuizId, createQuizStats } from "@/apiHelper/backendHelper";
import Loading from "@/components/Loading";

export default function QuizQuestion(props: any) {
  const { t } = useTranslation("quiz_question");
  const router = useRouter();
  const { quizId } = useLocalSearchParams();

  const [quizData, setQuizData] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timePassed, setTimePassed] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    score: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    timeSpent: 0,
    skippedQuestions: 0,
    incorrectQuestions: 0,
  });

  useEffect(() => {
    if (quizId) {
      getQuizByQuizId(quizId)
          .then((res) => {
            setQuizData(res?.data);
            if (res?.data?.questions?.length === 0) {
              Alert.alert(
                  t("no_quizzes_available"),
                  t("no_quizzes_available_message"),
                  [
                    {
                      text: t("go_back"),
                      onPress: () => router.back(),
                      style: "cancel",
                    },
                  ],
                  { cancelable: false }
              );
            }

            setSelectedAnswers(new Array(res?.data?.questions?.length || 0).fill(-1));
          })
          .catch((error) => {
            console.error("Error fetching quiz data:", error);
          });
    }
  }, [quizId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive) {
      timer = setInterval(() => {
        setTimePassed((prev) => prev + 1);
      }, 1000);
    } else if (timePassed === 1500) {
      handleQuizCompletion();
    }
    return () => clearInterval(timer);
  }, [timePassed, timerActive]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = updated[currentQuestionIndex] === index ? -1 : index;
      return updated;
    });
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setShowHint(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setShowHint(false);
    }
  };

  const handleQuizCompletion = () => {
    setTimerActive(false);

    let correct = 0, incorrect = 0, skipped = 0;

    quizData.questions.forEach((q: any, i: number) => {
      const selected = selectedAnswers[i];
      if (selected === -1) skipped++;
      else if (selected === q.correctAnswerIndex) correct++;
      else incorrect++;
    });

    const score = Math.round(correct === 0 ? 0 : (correct / totalQuestions) * 100);

    const quizStatBody = {
      successRate: score,
      quizId: quizId,
    };

    createQuizStats(quizStatBody).catch(console.error);

    setSessionStats({
      score,
      correctAnswers: correct,
      totalQuestions,
      timeSpent: timePassed,
      skippedQuestions: skipped,
      incorrectQuestions: incorrect,
    });

    setShowSummaryModal(true);
  };

  const handleQuizResults = () => {
    setTimerActive(false);
    setShowSummaryModal(false);

    let correct = 0, incorrect = 0, skipped = 0;

    quizData.questions.forEach((q: any, i: number) => {
      const selected = selectedAnswers[i];
      if (selected === -1) skipped++;
      else if (selected === q.correctAnswerIndex) correct++;
      else incorrect++;
    });

    const score = Math.round(correct === 0 ? 0 : (correct / totalQuestions) * 100);

    createQuizStats({ successRate: score, quizId }).catch(console.error);

    router.push({
      pathname: "/(app)/quizresults",
      params: {
        quizId,
        score,
        correctAnswers: correct,
        incorrectAnswers: incorrect,
        skippedQuestions: skipped,
        totalQuestions,
        timeSpent: timePassed,
        selectedAnswers,
      },
    });
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setTimePassed(0);
    setTimerActive(true);
    setShowSummaryModal(false);
    setSessionStats({
      score: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      timeSpent: 0,
      skippedQuestions: 0,
      incorrectQuestions: 0,
    });
    setShowHint(false);
  };

  const handleHomePage = () => {
    setShowSummaryModal(false);
    router.push("/(app)/home");
  };

  if (!quizData || !quizData.questions) {
    return (
        <View style={styles.container}>
          <Loading message={t("loading_quiz")} />
        </View>
    );
  }

  const quizQuestions = quizData.questions;
  const totalQuestions = quizQuestions.length;
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const currentAnswerIndex = selectedAnswers[currentQuestionIndex];

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.scrollWrapper}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => router.back()}>
                <GoBackIcon />
              </TouchableOpacity>
              <View style={styles.textComponent}>
                <Text style={styles.quizTitle} numberOfLines={2} ellipsizeMode="tail">
                  {quizData.name || t("quiz")}
                </Text>
              </View>
              <View style={{ width: 24, height: 24 }} />
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{formatTime(timePassed)}</Text>
              <Text style={styles.infoText}>
                {currentQuestionIndex + 1}/{totalQuestions}
              </Text>
            </View>

            <View style={styles.questionBox}>
              <Text style={styles.questionText}>
                {currentQuestion?.description || t("question_text")}
              </Text>
            </View>

            <View style={styles.answersContainer}>
              {currentQuestion?.options?.map((answer: any, index: any) => (
                  <TouchableOpacity
                      key={index}
                      style={[styles.answerButton, currentAnswerIndex === index && styles.selectedAnswer]}
                      onPress={() => handleAnswerSelect(index)}
                  >
                    <Text style={styles.answerLabel}>{String.fromCharCode(65 + index)}</Text>
                    <ScrollView style={styles.answerTextScroll} nestedScrollEnabled>
                      <Text style={styles.answerText}>{answer || `${t("answer")} ${index}`}</Text>
                    </ScrollView>
                  </TouchableOpacity>
              ))}
            </View>

            <View style={styles.hintBox}>
              {!showHint ? (
                  <TouchableOpacity onPress={() => setShowHint(true)}>
                    <Text style={[styles.hintTextPosition, styles.showHint]}>{t("show_hint")}</Text>
                  </TouchableOpacity>
              ) : (
                  <ScrollView>
                    <Text style={styles.hintText}>
                      <Text style={styles.hintTitle}>{t("hint")}</Text>
                      {"\n"}
                      {currentQuestion?.hint || t("no_hint")}
                    </Text>
                  </ScrollView>
              )}
            </View>
          </ScrollView>
        </View>

        <View style={styles.bottomNavRow}>
          <TouchableOpacity onPress={handlePrevQuestion}>
            <NextQuestionIcon rotation={180} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.endQuizButton} onPress={handleQuizCompletion}>
            <Text style={styles.registertext}>{t("end_session")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextQuestion}>
            <NextQuestionIcon />
          </TouchableOpacity>
        </View>

        {showSummaryModal && (
            <Modal animationType="slide" transparent visible={showSummaryModal}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{t("session_summary")}</Text>
                  <View style={{ alignItems: "center", marginTop: 20 }}>
                    <Text>{t("accuracy")}: <Text style={styles.valueText}>{sessionStats.score}%</Text></Text>
                    <Text style={{ marginTop: 10 }}>{t("correct")}: <Text style={styles.valueText}>{sessionStats.correctAnswers}/{sessionStats.totalQuestions}</Text></Text>
                    <Text style={{ marginTop: 10 }}>{t("incorrect")}: <Text style={styles.valueText}>{sessionStats.incorrectQuestions}/{sessionStats.totalQuestions}</Text></Text>
                    <Text style={{ marginTop: 10 }}>{t("pass")}: <Text style={styles.valueText}>{sessionStats.skippedQuestions}/{sessionStats.totalQuestions}</Text></Text>
                    <Text style={{ marginTop: 10 }}>{t("total")}: <Text style={styles.valueText}>{sessionStats.totalQuestions}</Text></Text>
                    <Text style={{ marginVertical: 10 }}>{t("time_spent")}: <Text style={styles.valueText}>{formatTime(Number(sessionStats.timeSpent))}</Text></Text>
                  </View>

                  <TouchableOpacity style={styles.modalButton} onPress={handleRetry}>
                    <Text style={styles.modalButtonText}>{t("retry")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={handleHomePage}>
                    <Text style={styles.modalButtonText}>{t("home")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={handleQuizResults}>
                    <Text style={styles.modalButtonText}>{t("results")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
        )}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#53789D",
  },
  scrollWrapper: {
    flex: 1,
    paddingTop: 60,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 100,
  },
  headerRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "InriaSans-Regular",
    color: "#fff",
  },
  divider: {
    marginTop: 5,
    width: "90%",
    height: 1,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  infoRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#fff",
  },
  questionBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    maxHeight: 130,
  },
  questionText: {
    fontSize: 14,
    color: "#000",
  },
  answersContainer: {
    width: "90%",
  },
  answerButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  selectedAnswer: {
    backgroundColor: "#abd5ff",
  },
  answerLabel: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "#000",
    borderWidth: 1,
    textAlign: "center",
    lineHeight: 30,
    marginRight: 10,
    fontWeight: "600",
  },
  answerText: {
    fontSize: 14,
    color: "#000",
  },
  answerTextScroll: {
    maxHeight: 55,
    flex: 1,
  },
  textComponent: {
    width: "75%",
    alignItems: "center",
  },
  bottomNavRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#53789D",
  },
  endQuizButton: {
    backgroundColor: "blue",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  registertext: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: "InriaSans-Regular",
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButton: {
    borderRadius: 20,
    backgroundColor: "#2916ff",
    width: "75%",
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    marginTop: 10,
  },
  modalButtonText: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#fff",
    textAlign: "center",
  },
  valueText: {
    fontWeight: "bold",
    color: "#2916ff",
  },
  hintBox: {
    width: "90%",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    maxHeight: 130,
    marginTop: 30,
  },
  showHint: {
    textAlign: "center",
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 20,
    fontWeight: "bold",
    fontSize: 17,
    lineHeight: 22,
    fontFamily: "InriaSans-Regular",
    color: "#fff",
  },
  hintText: {
    backgroundColor: "#5402ab",
    padding: 12,
    borderRadius: 20,
    textAlign: "center",
    color: "#fff",
  },
  hintTextPosition: {
    textAlign: "center",
  },
  hintTitle: {
    textAlign: "left",
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
    display: "flex",
    width: "90%",
  },
});
