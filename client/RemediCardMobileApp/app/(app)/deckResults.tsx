import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GoBackIcon, CorrectIcon, FalseIcon } from "@/constants/icons";
import { useTranslation } from "react-i18next";

export default function DeckResults( ) {
    const { t } = useTranslation("deck_results");
    const router = useRouter();
    const {deck, trueAnswerCount, falseAnswerCount} = useLocalSearchParams();

    const successRate = (Number(trueAnswerCount) / (Number(trueAnswerCount) + Number(falseAnswerCount))) * 100;

    const handleRetry = () => {
        router.push(`/(app)/card?deck=${deck}`);
    };

    const handleHomePage = () => {
        router.push(`/(app)/home`);
    };

    return (
        <View style={styles.container}>

            <View style={styles.menuComponent}>
                <View style={[styles.menuIcon, styles.iconLayout]}>
                    <Link href="/(app)/decks"><GoBackIcon/></Link>
                </View>
            
                <Text style={styles.menuText}>{t("title")}</Text>
                    
                <View style={styles.separatorContainer}>
                    <View style={styles.separatorLine} />
                </View>
            </View>
            <View style={styles.scoreTable}>
                <View style={[styles.checkIcon, styles.scoreTableIconLayout]}><CorrectIcon width={20} height={20}></CorrectIcon></View>
                <Text style={[styles.text2, styles.scoreText]}>{t("correct")} {trueAnswerCount}</Text>
                <View style={[styles.crossIcon, styles.scoreTableIconLayout]}><FalseIcon width={20} height={20}></FalseIcon></View>
                <Text style={[styles.text3, styles.scoreText]}>{t("incorrect")} {falseAnswerCount}</Text>
            </View>

            <Text style={styles.successRateText}>{t("success_rate")} {successRate.toFixed(2)}%</Text>

            <View style={styles.retryButton}>
                <TouchableOpacity onPress={handleRetry}>
                    <Text style={styles.retryButtonText}> {t("retry")} </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.retryButton}>
                <TouchableOpacity onPress={handleHomePage}>
                    <Text style={styles.retryButtonText}> {t("home")} </Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height:"100%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#53789D',
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
        position: "absolute"
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
    successRateText: {
        fontSize: 20,
        color: "#fff",
        fontFamily: "Inter-Regular",
        lineHeight: 20,
        marginBottom: 20,
        marginTop: 10
    },
    checkIcon: {
        top: "25%",
    },
    crossIcon: {
        top: "75%",
    },
    retryButton: {
        borderRadius: 20,
        backgroundColor: "#2916ff",
        width: "75%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        height: 50,
        marginTop: 10
    },
    retryButtonText: {
        fontSize: 17,
        lineHeight: 22,
        fontFamily: "Inter-Regular",
        color: "#fff",
        textAlign: "center",
    },
}); 