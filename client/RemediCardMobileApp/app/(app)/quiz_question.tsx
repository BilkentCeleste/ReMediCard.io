import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal
} from "react-native";
import { useRouter } from "expo-router";
import { GoBackIcon, NextQuestionIcon } from "@/constants/icons";
import {useLocalSearchParams} from "expo-router/build/hooks";
import { useTranslation } from "react-i18next";
import { getQuizByQuizId, createQuizStats } from "@/apiHelper/backendHelper";

export default function QuizQuestion(props: any) {
  const { t } = useTranslation("quiz_question");
  const router = useRouter();
  const { quizId } = useLocalSearchParams();

  const [quizData, setQuizData] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [timerActive, setTimerActive] = useState(true);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [sessionStats, setSessionStats] = useState({
          score: 0,
          correctAnswers: 0,
          totalQuestions: 0,
          timeSpent: 0,
          skippedQuestions: 0,
          incorrectQuestions: 0
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
                    style: "cancel"
                  }
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
    if (timerActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleQuizCompletion();
    }
    return () => clearInterval(timer);
  }, [timeRemaining, timerActive]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswers((prev) => {
      const updated = [...prev];
      if (updated[currentQuestionIndex] === index) {
        updated[currentQuestionIndex] = -1;
      } else {
        updated[currentQuestionIndex] = index;
      }
      return updated;
    });
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } 
  };

  const handleQuizCompletion = () => {
    setTimerActive(false);
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    quizData.questions.forEach((question: any, index: number) => {
      const selected = selectedAnswers[index];
      if (selected === -1) {
        skipped++;
      } else if (selected === question.correctAnswerIndex) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const score = Math.round(correct === 0 ? 0 : (correct / totalQuestions) * 100);

    const quizStatBody = {
      successRate: score,
      quizId: quizId,
    }

    createQuizStats(quizStatBody)
        .then(() => {
          console.log("Quiz stats created successfully.");
        })
        .catch((error) => {
          console.error("Error creating quiz stats:", error);
        });

    setSessionStats({
        score: score,
        correctAnswers: correct,
        totalQuestions: totalQuestions,
        timeSpent: 600 - timeRemaining,
        skippedQuestions: skipped,
        incorrectQuestions: incorrect
  });

    setShowSummaryModal(true);
  };

  const handleQuizReults = () => {
    setTimerActive(false);
    
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    quizData.questions.forEach((question: any, index: number) => {
      const selected = selectedAnswers[index];
      if (selected === -1) {
        skipped++;
      } else if (selected === question.correctAnswerIndex) {
        correct++;
      } else {
        incorrect++;
      }
    });

    let correctAnswers = 0;
    quizData.questions.forEach((question: any, index: number) => {
      if (selectedAnswers[index] === question.correctAnswerIndex) {
        correctAnswers++;
      }
    });

    const score = Math.round(correctAnswers == 0 ? 0 : (correctAnswers / totalQuestions) * 100);

    const quizStatBody = {
      successRate: score,
      quizId: quizId,
    }
    createQuizStats(quizStatBody).then(() => {
        console.log("Quiz stats created successfully.");
    }).catch((error) => {
        console.error("Error creating quiz stats:", error);
    });

    router.push({
      pathname: "/(app)/quizresults",
      params: {
        quizId: quizId,
        score: score,
        correctAnswers: correct,
        incorrectAnswers: incorrect,
        skippedQuestions: skipped,
        totalQuestions: totalQuestions,
        timeSpent: 600 - timeRemaining,
        selectedAnswers: selectedAnswers
      }
    });
  }

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([])
    setTimeRemaining(600)
    setTimerActive(true)
    setShowSummaryModal(false)
    setSessionStats({
      score: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      timeSpent: 0,
      skippedQuestions: 0,
      incorrectQuestions: 0
    })
  };

  const handleHomePage = () => {
    router.push("/(app)/home");
  };

  if (!quizData || !quizData.questions) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff", fontSize: 18 }}>{t("loading_quiz")}</Text>
      </View>
    );
  }

  const quizQuestions = quizData?.questions;
  const totalQuestions = quizQuestions?.length || 0;
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const currentAnswerIndex = selectedAnswers[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <GoBackIcon />
        </TouchableOpacity>

        <View style = {styles.textComponent}>
        <Text style={styles.quizTitle} numberOfLines={2} ellipsizeMode="tail">{quizData?.name || t("quiz")}</Text>
        </View>

        <View style={{ width: 24, height: 24 }} />
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{formatTime(timeRemaining)}</Text>
        <Text style={styles.infoText}>
          {currentQuestionIndex + 1}/{totalQuestions}
        </Text>
      </View>

      <View style={styles.questionBox}>
        <ScrollView>
          <Text style={styles.questionText}>
            {currentQuestion?.description || t("question_text")}
          </Text>
        </ScrollView>
      </View>

      <View style={styles.answersContainer}>
        {currentQuestion?.options?.map((answer: any, index: any) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.answerButton,
              currentAnswerIndex === index && styles.selectedAnswer,
            ]}
            onPress={() => handleAnswerSelect(index)}
          >
            <Text style={styles.answerLabel}>
              {String.fromCharCode(65 + index)}
            </Text>
            <ScrollView style={styles.answerTextScroll} nestedScrollEnabled={true}>
              <Text style={styles.answerText}>{answer || t("answer") + index}</Text>
            </ScrollView>
          </TouchableOpacity>
        ))}
      </View>
      
      {showSummaryModal && (
      <Modal
          animationType="slide"
          transparent={true}
          visible={showSummaryModal}
          onRequestClose={() => setShowSummaryModal(false)}
      >
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{t("session_summary")}</Text>
                  <View style={{ alignItems: 'center', marginTop: 20 }}>

                  <Text style={{ fontSize: 16 }}>
                  {t("accuracy")}: <Text style={styles.valueText}>{sessionStats.score}%</Text>
                  </Text>
                  <Text style={{ marginTop: 10, fontSize: 16 }}>
                  {t("correct")}: <Text style={styles.valueText}>{sessionStats.correctAnswers}/{sessionStats.totalQuestions}</Text>
                  </Text>
                  <Text style={{ marginTop: 10, fontSize: 16 }}>
                  {t("incorrect")}: <Text style={styles.valueText}>{sessionStats.incorrectQuestions}/{sessionStats.totalQuestions}</Text>
                  </Text>
                  <Text style={{ marginTop: 10, fontSize: 16 }}>
                  {t("pass")}: <Text style={styles.valueText}>
                    {sessionStats.skippedQuestions}/{sessionStats.totalQuestions}
                  </Text>
                  </Text>
                  <Text style={{ marginTop: 10, fontSize: 16 }}>
                  {t("total")}: <Text style={styles.valueText}>{sessionStats.totalQuestions}</Text>
                  </Text>
                  <Text style={{ marginVertical: 10, fontSize: 16 }}>
                  {t("time_spent")}: <Text style={styles.valueText}>{formatTime(Number(sessionStats.timeSpent))}</Text>
                  </Text>
                  </View>

                  <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => {
                          setShowSummaryModal(false);
                          handleRetry();
                      }}
                  >
                      <Text style={styles.modalButtonText}>{t("retry")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => {
                          setShowSummaryModal(false);
                          handleHomePage();
                      }}
                  >
                      <Text style={styles.modalButtonText}>{t("home")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => {
                          setShowSummaryModal(false);
                          handleQuizReults();
                      }}
                  >
                      <Text style={styles.modalButtonText}>{t("results")}</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>
)}

      <View style={styles.bottomNavRow}>
        <TouchableOpacity onPress={handlePrevQuestion}>
          <NextQuestionIcon rotation={180}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.endQuizButton} onPress={handleQuizCompletion}>
          <Text style = {styles.registertext}>{t("end_session")}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextQuestion}>
          <NextQuestionIcon/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#53789D",
    alignItems: "center",
    paddingTop: 60,
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
    marginBottom: 40,
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
  bottomNavRow: {
    width: "90%",
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textComponent: {
    width: "75%",
    alignItems: "center",
  },
  answerTextScroll: {
    maxHeight: 55,
    flex: 1,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    borderRadius: 20,
    backgroundColor: "#2916ff",
    width: "75%",
    alignItems: "center",
    justifyContent:"center",
    gap: 30,
    height: 45,
    marginTop: 10
  },
  modalButtonText: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#fff",
    textAlign: "center",
  },
  valueText: {
    fontWeight: 'bold',
    color: '#2916ff',
  },
});
