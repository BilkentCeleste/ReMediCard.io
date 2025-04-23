import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, Link, useLocalSearchParams } from 'expo-router';
import { GoBackIcon, HomeIcon, ProfileIcon, SettingsIcon } from '@/constants/icons';
import {addUserDeck, getDeckByShareToken} from '@/apiHelper/backendHelper';
import Flashcard from "../../components/FlashCard";
import { useTranslation } from 'react-i18next';

export default function SharedDeck() {
    const { t } = useTranslation('shared_deck');

    const [deck, setDeck] = useState();
    const router = useRouter();
    const { shareToken } = useLocalSearchParams();

    useEffect(() => {
        if (shareToken) {
            getDeckByShareToken(shareToken)
                .then((res) => {
                    setDeck(res?.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [shareToken]);

    const handleAddToMyDecks = () => {
        if (deck?.id) {
            addUserDeck(deck.id)
                .then(() => {
                    router.push('/(app)/decks');
                })
                .catch((error: Error) => {
                    console.error(error);
                });
        }
    };

    const handleStartQuiz = () => {
        if (deck?.id) {
            router.push({
                pathname: "/(app)/card",
                params: { deck: JSON.stringify(deck) },
            });
        } else {
            console.error("Deck ID is not available.");
        }
    };

    if (!deck) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>{t('loading_deck')}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.menuComponent}>
                <View style={[styles.menuIcon, styles.iconLayout]}>
                    <Link href="/(app)/decks"><GoBackIcon  width={100} height={100} /></Link>
                </View>

                <View style = {styles.textComponent}>
                <Text style={styles.menuText} numberOfLines={2} ellipsizeMode="tail">{deck?.name}</Text>
                </View>

                <View style={styles.separatorContainer}>
                    <View style={styles.separatorLine} />
                </View>
            </View>

            <FlatList
                style={styles.flatListContainer}
                contentContainerStyle={styles.flatListContent}
                data={deck?.flashcardSet || []}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.flashcardComponent}>
                        <Flashcard
                            question={item?.frontSide?.text || ''}
                            answer={item?.backSide?.text || ''}
                            width={110}
                            height={80}
                            textSize={8}
                        />
                    </View>
                )}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleAddToMyDecks}>
                    <Text style={styles.buttonText}>{t("add_to_my_decks")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleStartQuiz}>
                    <Text style={styles.buttonText}>{t("start_quiz")}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.navbarRow}>
                <TouchableOpacity>
                    <Link href="/(app)/home"><HomeIcon /></Link>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Link href="/(app)/profile"><ProfileIcon /></Link>
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
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#53789D',
    },
    title: {
        top: 60,
        fontSize: 30,
        lineHeight: 32,
        fontFamily: 'InriaSans-Regular',
        color: '#fff',
        textAlign: 'center',
        width: '100%',
        height: 27,
        marginBottom: 25,
        fontWeight: 'bold',
    },
    flashcardComponent: {
        borderRadius: 20,
        backgroundColor: '#fff',
        width: '49%',
        minHeight: 80,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 15,
        marginVertical: 5,
    },
    flashcardQuestion: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    flashcardAnswer: {
        fontSize: 12,
        color: 'rgba(0, 0, 0, 0.7)',
    },
    navbarRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        position: 'absolute',
        bottom: 50,
        backgroundColor: '#53789D',
    },
    flatListContainer: {
        width: '75%',
        height: '50%',
        marginTop: 5,
        marginBottom: 120,
    },
    flatListContent: {
        alignItems: 'stretch',
        paddingBottom: 20,
        justifyContent: 'space-evenly',

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
    createParent: {
        borderRadius: 20,
        backgroundColor: "#2916ff",
        width: "75%",
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        bottom: "14%"
    },
    buttonText: {
        fontSize: 14,
        fontFamily: "Inter-Regular",
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
    menuComponent: {
        width: "75%",
        minHeight: 20,
        padding: 10,
        gap: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
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
        marginTop: 15,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#fff',
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 100,
        gap: 10,
        width: 200,
        alignSelf: 'center',
    },
    button: {
        borderRadius: 20,
        backgroundColor: "#2916ff",
        width: "75%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        height: 50,
        bottom: "15%",
    }
});
