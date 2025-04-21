import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GoBackIcon, CorrectIcon, FalseIcon } from "@/constants/icons";
import { useTranslation } from "react-i18next";

export default function QuizResults() {
    const { t } = useTranslation("quiz_results");
    const router = useRouter();
    const { quizId, score, correctAnswers, totalQuestions, timeSpent } = useLocalSearchParams();

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleRetry = () => {
        router.push(`/(app)/quiz_question?quizId=${quizId}`);
    };

    const handleHomePage = () => {
        router.push("/(app)/home");
    };

    return (
        <View style={styles.container}>
            <View style={styles.menuComponent}>
                <View style={[styles.menuIcon, styles.iconLayout]}>
                    <Link href="/(app)/quizzes"><GoBackIcon/></Link>
                </View>
            
                <Text style={styles.menuText}>{t("title")}</Text>
                    
                <View style={styles.separatorContainer}>
                    <View style={styles.separatorLine} />
                </View>
            </View>

            <View style={styles.scoreTable}>
                <View style={[styles.checkIcon, styles.scoreTableIconLayout]}>
                    <CorrectIcon width={20} height={20} />
                </View>
                <Text style={[styles.text2, styles.scoreText]}>
                    {t("correct")} {correctAnswers}/{totalQuestions}
                </Text>
                <View style={[styles.crossIcon, styles.scoreTableIconLayout]}>
                    <FalseIcon width={20} height={20} />
                </View>
                <Text style={[styles.text3, styles.scoreText]}>
                    {t("incorrect")} {totalQuestions - correctAnswers}/{totalQuestions}
                </Text>
            </View>

            <Text style={styles.scoreText}>{t("score")} {score}%</Text>
            <Text style={styles.timeText}>{t("time_spent")} {formatTime(Number(timeSpent))}</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                    <Text style={styles.buttonText}>{t("retry")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.homeButton} onPress={handleHomePage}>
                    <Text style={styles.buttonText}>{t("home")}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#53789D',
        alignItems: 'center',
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
        position: "absolute"
    },
    menuIcon: {
        right: "95%",
        zIndex: 3,
        top: 5
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        marginVertical: 30,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#fff',
    },
    scoreTable: {
        width: "75%",
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginBottom: 20
    },
    scoreText: {
        textAlign: "center",
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
        position: "absolute"
    },
    text2: {
        top: "20%",
        left: "15%"
    },
    text3: {
        top: "70%",
        left: "15%"
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
        justifyContent: "space-between",
        marginTop: 20,
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
}); 