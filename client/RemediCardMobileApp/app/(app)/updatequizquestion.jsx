import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import {useRouter, useNavigation, useLocalSearchParams} from 'expo-router';
import { GoBackIcon } from '@/constants/icons';
import { useTranslation } from 'react-i18next';
import { createQuestion, editQuestion } from '@/apiHelper/backendHelper';


export default function UpdateFlashcard() {
    const { t } = useTranslation('update_quiz_question');

    const router = useRouter();
    const navigation = useNavigation();
    
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const {question, quizId} = useLocalSearchParams();
    const isNewQuestion = !question || question === 'undefined';
    const parsedQuestion = !isNewQuestion ? JSON.parse(question) : null;

    const [description, setDescription] = useState(isNewQuestion ? '' : parsedQuestion?.description);
    const [options, setOptions] = useState(() => {
        if (isNewQuestion) return ['', '', '', '', ''];
        const parsedOptions = parsedQuestion?.options || [];
        return [...parsedOptions, ...Array(5 - parsedOptions.length).fill('')].slice(0, 5);
    });

    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(isNewQuestion ? null : parsedQuestion?.correctAnswerIndex);

    const handleBack = () => {
        router.push("/(app)/editquiz?quizId=" + quizId);
    };

    const handleSaveEdit = () => {
        if (correctAnswerIndex === null) {
            Alert.alert(t("error"), t("select_correct_answer"));
            return;
        }

        const data = {
            description: description,
            options: options,
            correctAnswerIndex: correctAnswerIndex,
            quizId: quizId
        }

        editQuestion(parsedQuestion?.id, data)
            .then((response) => {
                router.push("/(app)/editquiz?quizId=" + quizId);
            })
            .catch((error) => {
                console.error('Error updating question:', error);
            });
    }

    const handleSaveCreate = () => {
        if (correctAnswerIndex === null) {
            Alert.alert(t("error"), t("select_correct_answer"));
            return;
        }

        const data = {
            description: description,
            options: options,
            correctAnswerIndex: correctAnswerIndex,
            quizId: quizId
        }

        createQuestion(data)
            .then((response) => {
                router.push("/(app)/editquiz?quizId=" + quizId);
            })
            .catch((error) => {
                console.error('Error creating question:', error);
            });
    };

    const handleAnswerChange = (text, index) => {
        const updatedOptions = [...options];
        updatedOptions[index] = text;
        setOptions(updatedOptions);
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

                <Text style={styles.menuText}>{isNewQuestion ? t("create_question") : t("edit_question")}</Text>
            
                <View style={styles.separatorContainer}>
                    <View style={styles.separatorLine} />
                </View>
            </View>
            
            <TextInput
                style={styles.qInput}
                placeholder={t("enter_question")}
                value={description}
                onChangeText={setDescription}
                placeholderTextColor='rgba(0, 0, 0, 0.5)'
                multiline={true}
                textAlignVertical='top'
            />
            
            <Text style={styles.correctAnswerLabel}>{t("select_correct_answer")}</Text>
            
            {options?.map((opt, index) => (
                <View key={index} style={styles.answerRow}>
                    <TouchableOpacity
                        style={[
                            styles.answerSelector,
                            correctAnswerIndex === index && styles.selectedAnswer,
                            correctAnswerIndex === index && styles.correctAnswer
                        ]}
                        onPress={() => selectCorrectAnswer(index)}
                    >
                        <Text style={[
                            styles.answerLabel,
                            correctAnswerIndex === index && styles.selectedAnswerLabel
                        ]}>
                            {String.fromCharCode(65 + index)}
                        </Text>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.aInput}
                        multiline={true}
                        value={opt}
                        onChangeText={(text) => handleAnswerChange(text, index)}
                        placeholder={t("answer") + (index + 1)}
                        placeholderTextColor='rgba(0, 0, 0, 0.5)'
                    />
                </View>
            ))}

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>{t("cancel")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={isNewQuestion ? handleSaveCreate : handleSaveEdit}>
                    <Text style={styles.buttonText}>{t("save")}</Text>
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
        borderWidth: 2,
        borderColor: '#ddd',
    },
    selectedAnswer: {
        borderColor: '#4CAF50',
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
        backgroundColor: '#4CAF50',
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
    correctAnswerLabel: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
        marginTop: 20,
        width: '75%',
        textAlign: 'left',
    },
    selectedAnswerLabel: {
        color: '#fff',
    },
});
