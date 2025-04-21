import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { GoBackIcon, NextQuestionIcon } from "@/constants/icons";
import {useLocalSearchParams} from "expo-router/build/hooks";
import { useTranslation } from "react-i18next";
import { getQuizByQuizId } from "@/apiHelper/backendHelper";

export default function QuizQuestion(props: any) {
  const { t } = useTranslation("quiz_question");
  const router = useRouter();
  const { quizId } = useLocalSearchParams();

  const [quizData, setQuizData] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    if (quizId) {
      getQuizByQuizId(quizId)
        .then((res) => {
          setQuizData(res?.data);
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
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[currentQuestionIndex] = index;
    setSelectedAnswers(updatedSelectedAnswers);
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      handleQuizCompletion();
    }
  };

  const handleQuizCompletion = () => {
    setTimerActive(false);
    let correctAnswers = 0;
    quizData.questions.forEach((question: any, index: number) => {
      if (selectedAnswers[index] === question.correctAnswerIndex) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    router.push({
      pathname: "/(app)/quizresults",
      params: {
        quizId: quizId,
        score: score,
        correctAnswers: correctAnswers,
        totalQuestions: totalQuestions,
        timeSpent: 600 - timeRemaining
      }
    });
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
      {/* Header row */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <GoBackIcon />
        </TouchableOpacity>

        <Text style={styles.quizTitle}>{quizData?.name || t("quiz")}</Text>

        <View style={{ width: 24, height: 24 }} />
      </View>

      <View style={styles.divider} />

      {/* Timer and question count */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{formatTime(timeRemaining)}</Text>
        <Text style={styles.infoText}>
          {currentQuestionIndex + 1}/{totalQuestions}
        </Text>
      </View>

      {/* Question box */}
      <View style={styles.questionBox}>
        <ScrollView>
          <Text style={styles.questionText}>
            {currentQuestion?.description || t("question_text")}
          </Text>
        </ScrollView>
      </View>

      {/* Answers list */}
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
            <Text style={styles.answerText}>{answer || t("answer") + index}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom nav row for previous/next question */}
      <View style={styles.bottomNavRow}>
        <TouchableOpacity onPress={handlePrevQuestion}>
          <NextQuestionIcon rotation={180}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextQuestion}>
          <NextQuestionIcon/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
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
    maxHeight: 150, // limit how tall the box can be
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
    backgroundColor: "#d1d5db", // Light gray for selected
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
});
