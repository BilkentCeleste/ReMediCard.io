import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, Link, useLocalSearchParams } from 'expo-router';
import { ChevronRightIcon, SearchIcon, HomeIcon, ProfileIcon, SettingsIcon } from '@/constants/icons';
import { getDeckByDeckId } from '../../../apiHelper/backendHelper';
import Flashcard from "../../../components/FlashCard";

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
            <Text style={styles.title}>{deck?.title}</Text>

            <FlatList
                style={styles.flatListContainer}
                contentContainerStyle={styles.flatListContent}
                data={deck?.flashcardSet || []}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.flashcardComponent}>
                        <Flashcard
                            question={item?.frontSide?.text || ''}
                            answer={item?.backSide?.text || ''}
                            width={100}
                            height={200}
                        />
                        <TouchableOpacity onPress={() => uploadUpdateFlashcard(item)}>
                            <Text>go to update flashcard</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />

            <TouchableOpacity onPress={() => uploadUpdateFlashcard()}>
                <Text>Create flashcard</Text>
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
        width: '50%',
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
        width: '40%',
        height: '50%',
        marginTop: 5,
        marginBottom: 120,
    },
    flatListContent: {
        alignItems: 'stretch',
        paddingBottom: 20,
    },
});
