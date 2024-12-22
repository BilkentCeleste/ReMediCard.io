import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {createFlashcard, deleteFlashcard, updateFlashcard} from "../../../apiHelper/backendHelper";

export default function UpdateFlashcard() {
    const [cardFrontSide, setCardFrontSide] = useState('');
    const [cardBackSide, setCardBackSide] = useState('');
    const [flashcardId, setFlashcardId] = useState('');
    const [isCreating, setIsCreating] = useState(true);
    const router = useRouter();

    const { flashcard, deckId } = useLocalSearchParams();

    useEffect(() => {
        if (flashcard) {
            const flashCardData = JSON.parse(decodeURIComponent(flashcard));
            setCardFrontSide(flashCardData.frontSide.text);
            setCardBackSide(flashCardData.backSide.text);
            setFlashcardId(flashCardData.id);
            setIsCreating(false);
        } else {
            setIsCreating(true);
            setCardFrontSide('');
            setCardBackSide('');
            setFlashcardId('');
        }
    }, [flashcard]);

    const handleSave = () => {
        const data = {
            topic: "random",
            type: "random",
            frequency: 1.0,
            deckId: deckId,
            frontSide: {
                text: cardFrontSide,
                urlSet: [
                    "aaaaaaa",
                    "aaaaaaa2"
                ]
            },
            backSide: {
                text: cardBackSide,
                urlSet: [
                    "aaaaaaa",
                    "aaaaaaa2"
                ]
            }

        }

        console.log("creating: ");
        console.log(data);

        createFlashcard(data)
            .then(() => {
                console.log('Flashcard created');
                router.push("/(app)/updatedeck");
            })
            .catch((error) => {
                console.error('Error creating flashcard:', error);
            });
    }

    const handleUpdate = () => {
        console.log("update");
        const data = {
            id: flashcardId,
            frontSide: {
                text: cardFrontSide,
                urlSet: ["a", "b"],
            },
            backSide: {
                text: cardBackSide,
                urlSet: ["a", "b"],
            },
            deckId: deckId,
            type: "type",
            topic: "topic",
            frequency: 0.5,
        }

        updateFlashcard(flashcardId, data)
            .then(() => {
                console.log('Flashcard updated');
                router.push("/(app)/updatedeck");
            })
            .catch((error) => {
                console.error('Error updating flashcard:', error);
            });
    }

    const handleDelete = () => {
        deleteFlashcard(flashcardId)
            .then(() => {
                console.log('Flashcard deleted');
                router.push("/(app)/updatedeck");
            })
            .catch((error) => {
                console.error('Error deleting flashcard:', error);
            });
    }

    const handleBack = () => {
        router.push("/(app)/updatedeck");
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>{isCreating ? 'Create Flashcard' : 'Update Flashcard'}</Text>

            <TextInput
                style={styles.input}
                placeholder={isCreating ? 'Enter Front Side Text' : ''}
                value={cardFrontSide}
                onChangeText={setCardFrontSide}
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
            <TextInput
                style={styles.input}
                placeholder={isCreating ? 'Enter Back Side Text' : ''}
                value={cardBackSide}
                onChangeText={setCardBackSide}
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={isCreating ? handleBack : handleDelete}>
                    <Text style={styles.buttonText}>{isCreating ? 'Cancel' : 'Delete'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={isCreating ? handleSave : handleUpdate}>
                    <Text style={styles.buttonText}>{isCreating ? 'Save' : 'Update'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#53789D',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    backButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 60,
        marginBottom: 20,
    },
    input: {
        width: '90%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        position: 'absolute',
        bottom: 30,
    },
    button: {
        flex: 0.48,
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: '#FF6B6B',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
