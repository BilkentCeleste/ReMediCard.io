import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {useRouter, useNavigation, useLocalSearchParams} from 'expo-router';
import { GoBackIcon } from '@/constants/icons';

export default function UpdateFlashcard() {
    const router = useRouter();
    const navigation = useNavigation();
    
    React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
    }, [navigation]);
    const {question} = useLocalSearchParams();
    console.log(question);

    const [newQuestion, setNewQuestion] = useState('');
    const [answers, setAnswers] = useState(['', '', '', '', '']);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);

    const handleBack = () => {
        console.log('Back pressed');
    };

    const handleSave = () => {
        console.log('Save pressed');
    };

    const handleAnswerChange = (text, index) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = text;
        setAnswers(updatedAnswers);
    };

    const selectCorrectAnswer = (index) => {
        setCorrectAnswerIndex(index);
    };

    return (
        <View style={styles.container}>
            <View style={styles.menuComponent}>
                <View style={[styles.menuIcon, styles.iconLayout]}>
                    <TouchableOpacity onPress={() => router.back()}><GoBackIcon/></TouchableOpacity>
                </View>

                <Text style={styles.menuText}>Create Question</Text>
            
                <View style={styles.separatorContainer}>
                    <View style={styles.separatorLine} />
                </View>
            </View>
            
            <TextInput
                style={styles.qInput}
                placeholder='Enter Question'
                value={question?.description}
                // onChangeText={setQuestion}
                placeholderTextColor='rgba(0, 0, 0, 0.5)'
                multiline={true}
                textAlignVertical='top'
            />
            
            {answers.map((answer, index) => (
                <View key={index} style={styles.answerRow}>
                    <TouchableOpacity
                        style={[styles.answerSelector, correctAnswerIndex === index && styles.selectedAnswer]}
                        onPress={() => selectCorrectAnswer(index)}
                    >
                        <Text style={styles.answerLabel}>{String.fromCharCode(65 + index)}</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.aInput}
                        multiline={true}
                        value={answer}
                        onChangeText={(text) => handleAnswerChange(text, index)}
                        placeholder={`Answer ${index + 1}`}
                        placeholderTextColor='rgba(0, 0, 0, 0.5)'
                    />
                </View>
            ))}

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#53789D',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    qInput: {
        width: '75%',
        height: 120,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
        fontSize: 16,
    },
    answerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '75%',
        marginVertical: 5,
    },
    answerSelector: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    selectedAnswer: {
        backgroundColor: 'lightgreen',
    },
    answerLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    aInput: {
        width: '85%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
        fontSize: 16,
        justifyContent: 'center',
    },
    correctAnswer: {
        backgroundColor: 'lightgreen',
    },
    menuComponent: {
        width: "75%",
        height: 20,
        padding: 10,
        gap: 10,
        alignItems: "center",
        marginVertical: 40,
        marginTop: 65,
    },
    menuText: {
        fontSize: 16,
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '75%',
        marginTop: 20,
    },
    button: {
        flex: 0.48,
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#C8102E',
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
