import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, Link, useLocalSearchParams } from 'expo-router';
import { ChevronRightIcon, GoBackIcon, HomeIcon, ProfileIcon, SettingsIcon } from '@/constants/icons';
import { getDeckByDeckId } from '../../apiHelper/backendHelper';
import Flashcard from "../../components/FlashCard";

export default function Updatedeck() {
    const [deck, setDeck] = useState();
    const router = useRouter();
    const { deckId } = useLocalSearchParams();

    useEffect(() => {
        if (deckId) {
            getDeckByDeckId(deckId)
                .then((data) => {
                    setDeck(data.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [deckId]);

    const uploadUpdateFlashcard = (flashcard) => {
        let path = '/updateflashcard?deckId=' + deckId;
        if (flashcard) {
            path += '&flashcard=' + encodeURIComponent(JSON.stringify(flashcard));
        }
        router.push({ pathname: path });
    }

    return (
        <View style={styles.container}>
            <View style={styles.menuComponent}>
            <View style={[styles.menuIcon, styles.iconLayout]}>
                <Link href="/(app)/decks"><GoBackIcon  width={100} height={100} /></Link>
            </View>

            <Text style={styles.menuText}>{deck?.name}</Text>
        
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
                    <TouchableOpacity style={styles.flashcardComponent} onPress={() => uploadUpdateFlashcard(item)}>
                        <Flashcard
                            question={item?.frontSide?.text || ''}
                            answer={item?.backSide?.text || ''}
                            width={120}
                            height={80}
                            textSize={8}
                        />
                        <Text  
                                style={{ justifyContent: "center", alignItems: "center" }}
                            >
                                <Text style={{ fontSize: 10, color: "#111", textAlign: "center" }}>update flashcard</Text>
                            </Text>
                    </TouchableOpacity>
                )}
            />

            <TouchableOpacity style={styles.createParent} onPress={() => uploadUpdateFlashcard()}>
                <Text style={styles.buttonText}>Create flashcard</Text>
            </TouchableOpacity>

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
        color: "#fff", // White text color for visibility
        fontSize: 16,
        fontWeight: "bold",
      },
    menuComponent: {
        width: "75%",
        height: 20,
        padding: 10,
        gap: 10,
        alignItems: "center",
        marginVertical: 40,
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
});
