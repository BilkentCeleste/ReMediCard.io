import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { GoBackIcon, NextQuestionIcon } from "@/constants/icons";
import {useLocalSearchParams} from "expo-router/build/hooks";


export default function QuizQuestion(props: any) {
  const router = useRouter();

  const {quiz} = useLocalSearchParams();
  const parsedQuiz = JSON.parse(Array.isArray(quiz) ? quiz[0] : quiz);
  const quizQuestions = parsedQuiz?.questions;
  console.log(parsedQuiz);

  const [timeRemaining] = useState("09:27");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    () => Array(quizQuestions.length).fill(-1) // -1 indicates no selection
  );
  const totalQuestions = quizQuestions?.length || 0;

  // Get the current question object
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const currentAnswerIndex = selectedAnswers[currentQuestionIndex];

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
      console.log(
        "Reached the end of the quiz. You could submit answers here."
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.headerRow}>
        {/* Back arrow */}
        <TouchableOpacity onPress={() => router.back()}>
          <GoBackIcon />
        </TouchableOpacity>

        <Text style={styles.quizTitle}>{parsedQuiz?.name || "Quiz"}</Text>

        {/* Space or an icon */}
        <View style={{ width: 24, height: 24 }} />
      </View>

      <View style={styles.divider} />

      {/* Timer and question count */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{timeRemaining}</Text>
        <Text style={styles.infoText}>
          {currentQuestionIndex + 1}/{totalQuestions}
        </Text>
      </View>

      {/* Question box */}
      <View style={styles.questionBox}>
        <ScrollView>
          <Text style={styles.questionText}>
            {currentQuestion?.description || "Question text"}
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
            <Text style={styles.answerText}>{answer || `answer ${index}`}</Text>
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
