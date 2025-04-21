import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { GoBackIcon, CorrectIcon, FalseIcon, CheckmarkIcon, CrossIcon, QuestionMarkIcon, UncertainIcon} from "@/constants/icons";
import Flashcard from '@/components/FlashCard';
import { useLocalSearchParams, useSearchParams } from 'expo-router/build/hooks';
import { getFlashcardsInBatch, updateFlashcardReviews, createDeckStats } from '@/apiHelper/backendHelper';
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

    const handleMaybeAnswer = () => {

    };

    const handleEndSession = () => {
        sendFlashcardReviews();
        
        const deckStat = {
            successRate: trueAnswers == 0 ? 0 : (trueAnswers / (trueAnswers + falseAnswers)) * 100,
            deckId: parsedDeck.id,
        }
        createDeckStats(deckStat).then(() => {
            console.log("Deck stats created successfully.");
        }).catch((error) => {
            console.error("Error creating deck stats:", error);
        });

        router.push(`/(app)/deckResults?deck=${deck}&trueAnwserCount=${trueAnswers}&falseAnswerCount=${falseAnswers}`);
    }


    return (
        <View style={styles.container}>

        <View style={styles.menuComponent}>
            <View style={[styles.menuIcon, styles.iconLayout]}>
                <Link href="/(app)/decks"><GoBackIcon/></Link>
            </View>

            <View style = {styles.textComponent}>
            <Text style={styles.menuText} numberOfLines={2} ellipsizeMode="tail">{parsedDeck?.topic}</Text>
            </View>

            <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
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

                    {/* Uncertain */}
                    <View style={styles.scoreItem}>
                        <Text style={styles.uncertainIcon}>?</Text>
                        <Text style={styles.scoreText}>5</Text>
                    </View>

                    {/* False */}
                    <View style={styles.scoreItem}>
                        <FalseIcon />
                        <Text style={styles.scoreText}>{falseAnswers}</Text>
                    </View>

                    {/* Solved / Total */}
                    <Text style={styles.scoreText}>{currentCard + 1}/{flashCardList.length}</Text>
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
                    
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={styles.crossIconPosition} onPress={handleFalseAnswer}>
                            <CrossIcon />
                        </TouchableOpacity>
                        <Text style={styles.labelText}>False</Text>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={styles.questionMarkIconPosition} onPress={handleMaybeAnswer}>
                            <QuestionMarkIcon />
                        </TouchableOpacity>
                        <Text style={styles.labelText}>Uncertain</Text>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={styles.checkMarkIconPosition} onPress={handleTrueAnswer}>
                            <CheckmarkIcon />
                        </TouchableOpacity>
                        <Text style={styles.labelText}>Correct</Text>
                    </View>
                    </View>

                    <TouchableOpacity style={styles.endSeesionPosition} onPress={handleEndSession}>
                        <Text style = {styles.registertext}>End Session</Text></TouchableOpacity>
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
    questionMarkIconPosition: {
        backgroundColor: "orange",
        borderRadius: 50,
        left: 0
    },
    endSeesionPosition: {
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
    }
});