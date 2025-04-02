import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { GoBackIcon, CorrectIcon, FalseIcon, CheckmarkIcon, CrossIcon} from "@/constants/icons";
import Flashcard from '@/components/FlashCard';
import { useLocalSearchParams, useSearchParams } from 'expo-router/build/hooks';
import { getFlashcardsInBatch, updateFlashcardReviews } from '@/apiHelper/backendHelper';
import { useTranslation } from 'react-i18next';

export default function Card( props: any ) {
    const { t } = useTranslation("card");
    const router = useRouter();

    const {deck} = useLocalSearchParams();
    const parsedDeck = JSON.parse(Array.isArray(deck) ? deck[0] : deck);


    const [currentCard, setCurrentCard] = useState(0);
    const [trueAnswers, setTrueAnswers] = useState(0);
    const [falseAnswers, setFalseAnswers] = useState(0);
    const [flashCardList, setFlashCardList] = useState([]);
    const [flashcardReviewList, setFlashcardReviewList] = useState<{ id: any; correct: boolean; lastReviewed: timestamp }[]>([]);

    async function getFlashcards(deckId) {
        try {
            const response = await getFlashcardsInBatch(deckId);
            setFlashCardList(response.data.sort((a, b) => a.recallProbability - b.recallProbability));
            response.data.forEach((card) => {
                console.log("Card:", card.id, card.frontSide.text, card.recallProbability);
            });
    
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
            console.error("Error fetching flashcards:", error);
        }
    }

async function sendFlashcardReviews() {
    console.log("Sending flashcard reviews:", flashcardReviewList);
    try {
        await updateFlashcardReviews(flashcardReviewList);
        setFlashcardReviewList([]); // Clear list after sending
    } catch (error) {
        console.error("Error updating flashcard reviews:", error);
    }
}

    useEffect(() => {
        getFlashcards(parsedDeck.id);
    }
    , []);

    useEffect(() => {
        if ((flashcardReviewList.length % 10 === 0 || currentCard === 0) && flashcardReviewList.length > 0) {
            const updateAndFetch = async () => {
                await sendFlashcardReviews(); // Ensure this completes first
                if (currentCard === 0) {
                    setFlashCardList([]); // Clear the list to force a re-fetch
                    console.log("Getting flashcards after sending reviews.");
                    await getFlashcards(parsedDeck.id); // Wait for database to update before fetching
                }
            };
            updateAndFetch();
        }
    }, [flashcardReviewList]);

    const handleTrueAnswer = () => {
        setTrueAnswers(trueAnswers + 1);
        setFlashcardReviewList((prevList) => {
            const updatedReviewList = [
                ...prevList,
                {
                    id: flashCardList[currentCard].id,
                    correct: true,
                    lastReviewed: new Date().toISOString().slice(0, -1),
                },
            ];
            return updatedReviewList;
        }
        );

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
                correct: false,
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

    const handleEndSession = () => {
        sendFlashcardReviews();
        router.push(`/(app)/deckResults?deck=${deck}&trueAnwserCount=${trueAnswers}&falseAnswerCount=${falseAnswers}`);
    }


    return (
        <View style={styles.container}>

        <View style={styles.menuComponent}>
            <View style={[styles.menuIcon, styles.iconLayout]}>
                <Link href="/(app)/decks"><GoBackIcon/></Link>
            </View>

            <Text style={styles.menuText}>{parsedDeck?.topic}</Text>
        
            <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
            </View>
        </View>

        {flashCardList.length > 0 && (
                <>
                    <View style={styles.scoreTable}>
                        <Text style={[styles.text1, styles.scoreText]}>{currentCard + 1}/{flashCardList.length}</Text>
                        <View style={[styles.checkIcon, styles.scoreTableIconLayout]}><CorrectIcon /></View>
                        <Text style={[styles.text2, styles.scoreText]}>{trueAnswers}</Text>
                        <View style={[styles.crossIcon, styles.scoreTableIconLayout]}><FalseIcon /></View>
                        <Text style={[styles.text3, styles.scoreText]}>{falseAnswers}</Text>
                    </View>

                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Flashcard
                            question={flashCardList[currentCard]?.frontSide?.text}
                            answer={flashCardList[currentCard]?.backSide?.text}
                            width={250}
                            height={400}
                            key={currentCard}
                        />
                    </View>

                    <View style={[styles.interactiveContainer, styles.interactiveContainerPosition]}>
                        <TouchableOpacity style={styles.crossIconPosition} onPress={handleFalseAnswer}><CrossIcon /></TouchableOpacity>
                        <TouchableOpacity style={styles.checkMarkIconPosition} onPress={handleTrueAnswer}><CheckmarkIcon /></TouchableOpacity>
                        <TouchableOpacity style={styles.crossIconPosition} onPress={handleEndSession}><CrossIcon /></TouchableOpacity>
                    </View>
                </>
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
        fontSize: 15,
        position: "absolute"
    },
    scoreTableIconLayout: {
        height: 14,
        width: 14,
        left: 10,
        position: "absolute"
    },
    text1: {
        top: "37.7%",
        right: 10,
        width: 55,
        zIndex: 0
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
    interactiveContainer: {
        flexDirection: "row", // Layout the children horizontally
        justifyContent: "space-between", // Spread children across the container
        alignItems: "center", // Center the icons vertically
        width: "75%", // Keep the container width consistent with the rest of the layout
        marginTop: 30, // Add margin top to give space between elements
        height: 75, // Adjust height to fit the icons
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
});