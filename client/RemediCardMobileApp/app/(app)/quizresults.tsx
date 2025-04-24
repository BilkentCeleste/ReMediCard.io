import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import {useEffect, useState} from "react";
import { getQuizByQuizId } from "@/apiHelper/backendHelper";
import { CorrectIcon, FalseIcon, QuestionMarkIcon } from "@/constants/icons";

import {
  GoBackIcon,
  HomeIcon,
  ProfileIcon,
  SettingsIcon,
} from "@/constants/icons";
import { useTranslation } from "react-i18next";

export default function QuizResults() {
  const { t } = useTranslation("quiz_results");
  const router = useRouter();
  const searchParams = useLocalSearchParams();

  const quizId = Number(searchParams.quizId);
  const score = Number(searchParams.score);
  const correctAnswers = Number(searchParams.correctAnswers);
  const incorrectAnswers = Number(searchParams.incorrectAnswers);
  const skippedQuestions = Number(searchParams.skippedQuestions);
  const totalQuestions = Number(searchParams.totalQuestions);
  const timeSpent = Number(searchParams.timeSpent);
  const selectedAnswers = (searchParams.selectedAnswers as string)
  .split(",")
  .map((val) => parseInt(val, 10));

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleRetry = () => {
    router.push(`/(app)/quiz_question?quizId=${quizId}`);
  };

  const handleHomePage = () => {
    router.push("/(app)/home");
  };

  const [quizData, setQuizData] = useState<any>(null);
  
  useEffect(() => {
      if (quizId) {
        getQuizByQuizId(quizId)
          .then((res) => {
          setQuizData(res?.data);         
          })
          .catch((error) => {
            console.error("Error fetching quiz data:", error);
          });
      }
    }, [quizId]);

  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedQuestionId(prev => (prev === id ? null : id));
  };

  const getOptionColor = (
    index: number,
    selectedIndex: number,
    correctIndex: number
  ): string => {
    if (selectedIndex === -1) {
      return index === correctIndex ? "orange" : "#000"; 
    }
    if (selectedIndex === correctIndex) {
      return index === correctIndex ? "green" : "#000"; 
    }
    if (index === correctIndex) return "green"; 

    if (index === selectedIndex) return "red";
    return "#000"; 
  };

  const getOptionFontWeight = (
    index: number,
    selectedIndex: number,
    correctIndex: number
  ): "bold" | "normal" => {
    // Apply bold to colored (non-default) options
    if (selectedIndex === -1 && index === correctIndex) return "bold";
    if (selectedIndex === correctIndex && index === correctIndex) return "bold";
    if (selectedIndex !== correctIndex && (index === selectedIndex || index === correctIndex)) return "bold";
    return "normal";
  };
  
    
  return (
    <View style={styles.container}>
      <View style={styles.menuComponent}>
        <View style={[styles.menuIcon, styles.iconLayout]}>
          <Link href="/(app)/quizzes">
            <GoBackIcon />
          </Link>
        </View>

        <Text style={styles.menuText}>{t("title")}</Text>

        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
        </View>
      </View>

      <View style={styles.resultBox}>
      <View style={styles.columnContainer}>
        {/* Left Column */}
        <View style={styles.column}>
          <Text style={styles.labelText}>
            {t("correct")}: <Text style={styles.valueText}>{correctAnswers}/{totalQuestions}</Text>
          </Text>
          <Text style={styles.labelText}>
            {t("incorrect")}: <Text style={styles.valueText}>{incorrectAnswers}/{totalQuestions}</Text>
          </Text>
          <Text style={styles.labelText}>
            {t("pass")}: <Text style={styles.valueText}>
                {skippedQuestions}/{totalQuestions}
          </Text>
          </Text>
        </View>

        {/* Right Column */}
        <View style={styles.column}>
          <Text style={styles.labelText}>
            {t("accuracy")}: <Text style={styles.valueText}>{score}%</Text>
          </Text>
          <Text style={styles.labelText}>
            {t("total")}: <Text style={styles.valueText}>{totalQuestions}</Text>
          </Text>
          <Text style={styles.labelText}>
            {t("time_spent")}: <Text style={styles.valueText}>{formatTime(Number(timeSpent))}</Text>
          </Text>
        </View>
      </View>
    </View>

      <View style={styles.questionsContainer}>
      <FlatList
          data={quizData?.questions}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({ item, index }) => {
            const isExpanded = expandedQuestionId === item?.id;
            const selectedAnswerIndex = selectedAnswers[index];
            const correctAnswerIndex = item.correctAnswerIndex;
            const isPass = selectedAnswerIndex === -1;
            const isCorrect = selectedAnswerIndex === correctAnswerIndex;

            let StatusIcon = null;

            if (isPass) {
              StatusIcon = <Text style={styles.uncertainIcon}>?</Text>;
            } else if (isCorrect) {
              StatusIcon = <CorrectIcon />;
            } else {
              StatusIcon = <FalseIcon />;
            }

            return (
              <TouchableOpacity onPress={() => toggleExpand(item.id)} activeOpacity={0.7}>
                <View
                  style={[
                    styles.questionItem]}
                >
                
                <View style={styles.questionRow}>
                <Text style={styles.questionText} numberOfLines={isExpanded ? undefined : 3}
                >
                  {item?.description}
                </Text>
                {StatusIcon}
                </View>
                
                  {isExpanded && (
                    <View style={styles.optionsContainer}>
                      {item?.options?.map((option: string, i: number) => (
                      <Text
                          key={i}
                          style={[
                            styles.optionText,
                            {
                              color: getOptionColor(i, selectedAnswerIndex, correctAnswerIndex),
                              fontWeight: getOptionFontWeight(i, selectedAnswerIndex, correctAnswerIndex)
                            }
                          ]}
                        >                          
                        {String.fromCharCode(65 + i)}. {option}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.buttonText}>{t("retry")}</Text>
        </TouchableOpacity>
      </View>

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
    flex: 1,
    backgroundColor: "#53789D",
    alignItems: "center",
    paddingTop: 60,
  },
  menuComponent: {
    width: "75%",
    height: 20,
    padding: 10,
    gap: 10,
    alignItems: "center",
    marginVertical: 30,
  },
  menuText: {
    fontSize: 20,
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
  menuIcon: {
    right: "95%",
    zIndex: 3,
    top: 5,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 30,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#fff",
  },
  scoreTable: {
    width: "75%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  scoreText: {
    textAlign: "left",
    color: "#fff",
    fontFamily: "Inter-Regular",
    lineHeight: 20,
    fontSize: 20,
    marginVertical: 10,
  },
  timeText: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "Inter-Regular",
    lineHeight: 20,
    fontSize: 20,
    marginBottom: 30,
  },
  scoreTableIconLayout: {
    height: 14,
    width: 14,
    left: 10,
    position: "absolute",
  },
  checkIcon: {
    top: "25%",
  },
  crossIcon: {
    top: "75%",
  },
  buttonContainer: {
    width: "75%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  retryButton: {
    backgroundColor: "#2916ff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  homeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter-Regular",
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
  valueText: {
    fontWeight: 'bold',
    color: '#2916ff',
  },
  resultBox:{
    width: '80%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  questionsContainer: {
    marginTop: 10,
    width: "75%",
    height: "52%"
},
questionItem: {
    backgroundColor: '#fff',
    width: "100%",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
},
questionText: {
    maxWidth: "90%",
    fontSize: 16,
    marginBottom: 10,
},
optionsContainer: {
    marginLeft: 10,
},
optionText: {
    fontSize: 14,
    marginBottom: 5,
},
columnContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
column: {
  flex: 1,
  gap: 10,
  paddingHorizontal: 8,
},
labelText: {
  fontSize: 14,
},
questionRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},
uncertainIcon:{
  color: "orange",
  fontFamily: "Inter-Regular",
  fontSize: 15,
},
});
