import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useRouter} from 'expo-router';
import {CheckmarkIcon, CorrectIcon, CrossIcon, FalseIcon, QuestionMarkIcon} from "@/constants/icons";
import Flashcard from '@/components/FlashCard';
import {useLocalSearchParams} from 'expo-router/build/hooks';
import {createDeckStats, getDecksByDeckIdWithoutFlashcards, getFlashcardsInBatch, updateFlashcardReviews} from '@/apiHelper/backendHelper';
import {useTranslation} from 'react-i18next';
import PieChart from 'react-native-pie-chart';
import TutorialInfoButton from '../../components/TutorialInfoButton';

export default function Card( props: any ) {
    const { t } = useTranslation("card");
    const router = useRouter();
    const {deckId} = useLocalSearchParams();

    const [currentCard, setCurrentCard] = useState(0);
    const [trueAnswers, setTrueAnswers] = useState(0);
    const [falseAnswers, setFalseAnswers] = useState(0);
    const [maybeAnswers, setMaybeAnswers] = useState(0);
    const [flashCardList, setFlashCardList] = useState([]);
    const [flashcardReviewList, setFlashcardReviewList] = useState<{ id: any; result: string; lastReviewed: any }[]>([]);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [sessionStats, setSessionStats] = useState({
        correct: 0,
        uncertain: 0,
        incorrect: 0,
        accuracy: 0
    });
    const [deckData, setDeckData] = useState<any>(null);

    
    useEffect(() => {
    if (deckId) {
        getDecksByDeckIdWithoutFlashcards(deckId)
        .then((res) => {
            setDeckData(res?.data);    
        })
        .catch((error) => {
            console.error("Error fetching deck data:", error);
        });
    }
    }, [deckId]);

    const widthAndHeight = 200;
    
    const series = [
        { value: sessionStats.correct, color: 'green' },
        { value: sessionStats.uncertain, color: 'orange' },
        { value: sessionStats.incorrect, color: 'red' },
    ].filter(stat => stat.value > 0);

    const hasValidData = series.length > 0;

    async function getFlashcards(deckId: any) {
        try {
            const response = await getFlashcardsInBatch(deckId);
            setFlashCardList(response.data.sort((a, b) => a.recallProbability - b.recallProbability));
    
            if (response.data.length === 0) {
                Alert.alert(
                    t("no_cards_available"),
                    t("no_cards_available_message"),
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
        } catch (error) {
            Alert.alert(t("error"), t("error_fetching_flashcards"));
        }
    }

    async function sendFlashcardReviews() {
        try {
            await updateFlashcardReviews(flashcardReviewList);
            setFlashcardReviewList([]);
        } catch (error) {
            Alert.alert(t("error"), t("error_updating_flashcard_reviews"));
        }
    }

    useEffect(() => {
        getFlashcards(deckId);
    }
    , []);

    useEffect(() => {
        if ((flashcardReviewList.length % 10 === 0 || currentCard === 0) && flashcardReviewList.length > 0) {
            const updateAndFetch = async () => {
                await sendFlashcardReviews();
                if (currentCard === 0) {
                    setFlashCardList([]);
                    await getFlashcards(deckId);
                }
            };
            updateAndFetch();
        }
    }, [flashcardReviewList]);

    const handleTrueAnswer = () => {
        setTrueAnswers(trueAnswers + 1);
        setFlashcardReviewList((prevList) => {
                return [
                ...prevList,
                {
                    id: flashCardList[currentCard].id,
                    result: "CORRECT",
                    lastReviewed: new Date().toISOString().slice(0, -1),
                },
            ];
        });

        if (currentCard < flashCardList.length - 1) {
            setCurrentCard(currentCard + 1);
        }
        else {
            setCurrentCard(0);
        }
    };

    const handleFalseAnswer = () => {
        setFalseAnswers(falseAnswers + 1);
        setFlashcardReviewList([
            ...flashcardReviewList,
            {
                id: flashCardList[currentCard].id,
                result: "INCORRECT",
                lastReviewed: new Date().toISOString().slice(0, -1),
            },
        ]);
        if (currentCard < flashCardList.length - 1) {
            setCurrentCard(currentCard + 1);
        }
        else {
            setCurrentCard(0);
        }
    };

    const handleMaybeAnswer = () => {
        setMaybeAnswers(maybeAnswers + 1);
        setFlashcardReviewList((prevList) => {
                return [
                ...prevList,
                {
                    id: flashCardList[currentCard].id,
                    result: "PARTIALLY_CORRECT",
                    lastReviewed: new Date().toISOString().slice(0, -1),
                },
            ];
        });

        if (currentCard < flashCardList.length - 1) {
            setCurrentCard(currentCard + 1);
        }
        else {
            setCurrentCard(0);
        }
    };

    const handleEndSession = () => {
        sendFlashcardReviews();
        
        const deckStat = {
            successRate: trueAnswers == 0 ? 0 : (trueAnswers / (trueAnswers + falseAnswers)) * 100,
            deckId: deckId,
        }
        createDeckStats(deckStat)
            .then(() => {
                console.log("Deck stats created successfully.");
            })
            .catch((error) => {
                Alert.alert(t("error"), t("error_creating_deck_stats"));
            });

        const totalAnswers = trueAnswers + falseAnswers + maybeAnswers;
        const accuracy = totalAnswers === 0 ? 0 : ((trueAnswers + 0.5 * maybeAnswers) / totalAnswers) * 100;

        setSessionStats({
            correct: trueAnswers,
            uncertain: maybeAnswers,
            incorrect: falseAnswers,
            accuracy: accuracy.toFixed(2),
        });
    
        setShowSummaryModal(true);
    }

    const handleRetry = () => {
        setCurrentCard(0);
        setTrueAnswers(0);
        setFalseAnswers(0);
        setMaybeAnswers(0);
        setFlashcardReviewList([])
        setShowSummaryModal(false)
        setSessionStats({
            correct: 0,
            uncertain: 0,
            incorrect: 0,
            accuracy: 0
        })
    };

    const handleHomePage = () => {
        router.push(`/(app)/home`);
    };

    return (
        <View style={styles.container}>

        <View style={styles.menuComponent}>
            <View style = {styles.textComponent}>
            <Text style={styles.menuText} numberOfLines={2} ellipsizeMode="tail">{deckData?.topic}</Text>
            </View>

            <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
            </View>

            <View style={styles.tutorialIconLayout}>
                <TutorialInfoButton tutorialTitle = {"card_title"} tutorialTexts={["card_1", "card_2", "card_3"]} tutorialImages={[
                    require('@/assets/images/tutorial/card/card_page_tutorial_image_1.jpg'), 
                    require('@/assets/images/tutorial/card/card_page_tutorial_image_3.jpg'),
                    require('@/assets/images/tutorial/card/card_page_tutorial_image_2.jpg')]}/>
            </View>
        </View>

        {flashCardList.length == 0? 
            <View style={styles.modalContainer}>
                <ActivityIndicator size={"large"} style={styles.indicator} />
    
            </View>
             
            : (
                <>
                    <View style={styles.scoreTable}>
                    <View style={styles.scoreItem}>
                        <CorrectIcon />
                        <Text style={styles.scoreText}>{trueAnswers}</Text>
                    </View>

                    <View style={styles.scoreItem}>
                        <Text style={styles.uncertainIcon}>?</Text>
                        <Text style={styles.scoreText}>{maybeAnswers}</Text>
                    </View>

                    <View style={styles.scoreItem}>
                        <FalseIcon />
                        <Text style={styles.scoreText}>{falseAnswers}</Text>
                    </View>

                    <Text style={styles.scoreText}>{trueAnswers + maybeAnswers + falseAnswers}</Text>
                    </View>

                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Flashcard
                            question={flashCardList[currentCard]?.frontSide?.text}
                            frontImageURL={flashCardList[currentCard]?.frontSide?.imageURL}
                            answer={flashCardList[currentCard]?.backSide?.text}
                            backImageURL={flashCardList[currentCard]?.backSide?.imageURL}
                            width={250}
                            height={400}
                            key={currentCard}
                        />
                    </View>

                    <View style={[styles.interactiveContainer, styles.interactiveContainerPosition]}>
                    
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={styles.crossIconPosition} onPress={handleFalseAnswer}>
                            <CrossIcon />
                        </TouchableOpacity>
                        <Text style={styles.labelText}>{t("false")}</Text>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={styles.questionMarkIconPosition} onPress={handleMaybeAnswer}>
                            <QuestionMarkIcon />
                        </TouchableOpacity>
                        <Text style={styles.labelText}>{t("uncertain")}</Text>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={styles.checkMarkIconPosition} onPress={handleTrueAnswer}>
                            <CheckmarkIcon />
                        </TouchableOpacity>
                        <Text style={styles.labelText}>{t("correct")}</Text>
                    </View>
                    </View>

                    <TouchableOpacity style={styles.endSessionPosition} onPress={handleEndSession}>
                        <Text style = {styles.registertext}>{t("end_session")}</Text></TouchableOpacity>
                </>
            )}

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
                            <PieChart
                                widthAndHeight={widthAndHeight}
                                series={hasValidData ? series : [{ value: 1, color: '#D3D3D3' }]}
                            />
                            <Text style={{ marginTop: 10, fontSize: 16 }}>
                                {t("accuracy")}: {sessionStats.accuracy}%
                            </Text>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ color: 'green', fontWeight: "bold", fontSize: 16 }}>{t("correct")}: {sessionStats.correct}</Text>
                                <Text style={{ color: 'orange', fontWeight: "bold", fontSize: 16 }}>{t("uncertain")}: {sessionStats.uncertain}</Text>
                                <Text style={{ color: 'red', fontWeight: "bold", fontSize: 16 }}>{t("false")}: {sessionStats.incorrect}</Text>
                            </View>
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
                        </View>
                    </View>
                </Modal>
)}

        </View>
    );
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
        minHeight: 20,
        padding: 10,
        gap: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
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
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        marginTop: 10,
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
        gap: 30,
    },
    scoreItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },
    uncertainIcon:{
        color: "orange",
        fontFamily: "Inter-Regular",
        fontSize: 15,
    },
    scoreText: {
        color: "#fff",
        fontFamily: "Inter-Regular",
        fontSize: 15,
    },
    interactiveContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "75%",
        marginTop: 30,
        height: 75,
    },
    interactiveContainerPosition: {
        zIndex: 0,
        bottom: 0,
        marginTop: 30,
        height: 75,
        width: "75%"
    },
    checkMarkIconPosition: {
        backgroundColor: "green",
        borderRadius: 50,
        right: 0
    },
    crossIconPosition: {
        backgroundColor: "red",
        borderRadius: 50,
        left: 0
    },
    questionMarkIconPosition: {
        backgroundColor: "orange",
        borderRadius: 50,
        left: 0
    },
    endSessionPosition: {
        marginTop: 40,
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
    modalContainer: {
        width: 250,
        height: 644,
        padding: 20,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        transparent: true,
      },
    indicator: {
        transform: [{ scale: 1.8 }],
        margin: 20,
        color: "#ffffff",
      },
    labelText: {
        marginTop: 5,
        fontSize: 12,
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
    tutorialIconLayout: {
        height: 24,
        width: 24,
        position: "absolute",
        left: "95%",
        zIndex: 3,
        top: 5
    },
});