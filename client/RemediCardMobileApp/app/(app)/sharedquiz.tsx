import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GoBackIcon } from '@/constants/icons';
import { getQuizByShareToken, addUserQuiz } from '@/apiHelper/backendHelper';
import { useTranslation } from 'react-i18next';

interface Question {
    id: number;
    description: string;
    options: string[];
}

interface Quiz {
    id: number;
    name: string;
    questions: Question[];
}

export default function SharedQuiz() {
    const { t } = useTranslation('shared_quiz');
    const router = useRouter();
    const { shareToken } = useLocalSearchParams();
    const [quiz, setQuiz] = useState<Quiz | null>(null);

    useEffect(() => {
        if (shareToken) {
            getQuizByShareToken(shareToken)
                .then((res) => {
                    setQuiz(res?.data);
                })
                .catch((error: Error) => {
                    console.error(error);
                });
        }
    }, [shareToken]);

    const handleAddToMyQuizzes = () => {
        if (quiz?.id) {
            addUserQuiz(quiz.id)
                .then(() => {
                    router.push('/(app)/quizzes');
                })
                .catch((error: Error) => {
                    console.error(error);
                });
        }
    };

    const handleStartQuiz = () => {
        if (quiz?.id) {
            router.push(`/(app)/quiz_question?quizId=${quiz.id}`);
        }
    };

    if (!quiz) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>{t('loading_quiz')}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <GoBackIcon />
                </TouchableOpacity>
                <Text style={styles.title}>{quiz?.name}</Text>
            </View>

            <View style={styles.questionsContainer}>
                <FlatList
                    data={quiz?.questions}
                    keyExtractor={(item) => item?.id?.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.questionItem}>
                            <Text style={styles.questionText}>{item?.description}</Text>
                            <View style={styles.optionsContainer}>
                                {item?.options?.map((option: string, index: number) => (
                                    <Text key={index} style={styles.optionText}>
                                        {String.fromCharCode(65 + index)}. {option}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    )}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleAddToMyQuizzes}>
                    <Text style={styles.buttonText}>{t("add_to_my_quizzes")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleStartQuiz}>
                    <Text style={styles.buttonText}>{t("start_quiz")}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#53789D',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 20,
    },
    questionsContainer: {
        flex: 1,
    },
    questionItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
    },
    questionText: {
        fontSize: 16,
        marginBottom: 10,
    },
    optionsContainer: {
        marginLeft: 10,
    },
    optionText: {
        fontSize: 14,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        width: '45%',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
}); 