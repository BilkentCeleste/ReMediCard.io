import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronRightIcon, GoBackIcon } from "../../constants/icons"; // Replace with your icon paths

interface QuizQuestionData {
  questionText: string;
  answers: string[]; // e.g. ["Answer 1", "Answer 2", ...]
}

// Example array of questions
const quizQuestions: QuizQuestionData[] = [
  {
    questionText:
      "Question 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    answers: ["Answer 1", "Answer 2", "Answer 3", "Answer 4", "Answer 5"],
  },
  {
    questionText:
      "Question 2: Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    answers: ["Answer A", "Answer B", "Answer C", "Answer D", "Answer E"],
  },
  {
    questionText:
      "Question 3: Class aptent taciti sociosqu ad litora torquent per conubia nostra.",
    answers: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
  },
];

export default function QuizQuestion() {
  const router = useRouter();

  // We store the current index of the question
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Track which answer is selected for each question
  // For simplicity, we’ll store them in an array of the same length as quizQuestions
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    () => Array(quizQuestions.length).fill(-1) // -1 indicates no selection
  );

  // For the example, we’ll store a static quiz title, time remaining, etc.
  const [quizTitle] = useState("Quiz 1");
  const [timeRemaining] = useState("09:27");
  // total number of questions
  const totalQuestions = quizQuestions.length;

  // Get the current question object
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const currentAnswerIndex = selectedAnswers[currentQuestionIndex];

  const handleAnswerSelect = (index: number) => {
    // Update the selectedAnswers array for the current question
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
      // If we’re on the last question, maybe submit the quiz or handle differently
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

        <Text style={styles.quizTitle}>{quizTitle}</Text>

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
            {currentQuestion.questionText}
          </Text>
        </ScrollView>
      </View>

      {/* Answers list */}
      <View style={styles.answersContainer}>
        {currentQuestion.answers.map((answer, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.answerButton,
              currentAnswerIndex === index && styles.selectedAnswer,
            ]}
            onPress={() => handleAnswerSelect(index)}
          >
            <Text style={styles.answerLabel}>
              {String.fromCharCode(65 + index)} {/* A, B, C, D, E */}
            </Text>
            <Text style={styles.answerText}>{answer}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom nav row for previous/next question */}
      <View style={styles.bottomNavRow}>
        <TouchableOpacity onPress={handlePrevQuestion}>
          <GoBackIcon />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextQuestion}>
          <ChevronRightIcon color="#fff" />
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
