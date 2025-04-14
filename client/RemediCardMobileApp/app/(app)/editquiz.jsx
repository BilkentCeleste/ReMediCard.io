import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity, FlatList, Alert, Modal} from 'react-native';
import { useRouter, Link, useLocalSearchParams, useNavigation } from 'expo-router';
import { ChevronRightIcon, GoBackIcon, HomeIcon, ProfileIcon, SettingsIcon } from '@/constants/icons';
import { getQuizByQuizId, removeQuestion } from '../../apiHelper/backendHelper';
import { useTranslation } from 'react-i18next';

export default function editQuiz() {
    const { t } = useTranslation("edit_quiz");

    const [quiz, setQuiz] = useState();
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [DeleteQuestionModalVisible, setDeleteQuestionModalVisible] = useState(false);

    const router = useRouter();
    const navigation = useNavigation();
    const { quizId } = useLocalSearchParams();

    React.useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    useEffect(() => {
        if (quizId) {
            getQuizByQuizId(quizId)
                .then((res) => {
                    setQuiz(res?.data);
                    // console.log(res.data)
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [quizId]);

    /* const uploadUpdateFlashcard = (flashcard) => {
        let path = '/updateflashcard?deckId=' + deckId;
        if (flashcard) {
            path += '&flashcard=' + encodeURIComponent(JSON.stringify(flashcard));
        }
        router.push({ pathname: path });
    } */

    const uploadUpdateQuestion = (questionId) => {
        const question = quiz?.questions?.find(q => q.id === questionId);
        router.push(`/(app)/updatequizquestion?question=${encodeURIComponent(JSON.stringify(question))}&quizId=${quizId}`);
    }

    const handleToggleDeleteQuestionModal = (id) => {
        setDeleteQuestionModalVisible(!DeleteQuestionModalVisible);
        setSelectedQuestion(id);
    }

    const handleDeleteQuestion = () => {
        const data = {
            questionId: selectedQuestion,
        }
        removeQuestion(quizId, data)
            .then((res) => {
                setDeleteQuestionModalVisible(false);
                setQuiz(prevQuiz => ({
                    ...prevQuiz,
                    questions: prevQuiz?.questions?.filter(question => question?.id !== selectedQuestion)
                }));
                setSelectedQuestion(null);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <View style={styles.container}>
            <View style={styles.menuComponent}>
            <View style={[styles.menuIcon, styles.iconLayout]}>
                <Link href="/(app)/quizzes"><GoBackIcon  width={100} height={100} /></Link>
            </View>

            <Text style={styles.menuText}>{quiz?.name}</Text>
        
            <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
            </View>
            </View>

            {/* <FlatList
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
            /> */}

            <FlatList
                style={styles.flatListContainer}
                contentContainerStyle={styles.flatListContent}
                data={quiz?.questions}
                renderItem={({ item }) => (
                    <View style={styles.questionCard}>
                        <Text style={styles.questionText}>{item?.description}</Text>
                        <TouchableOpacity style={styles.editButton} onPress={() => uploadUpdateQuestion(item?.id)}>
                            <Text style={styles.editButtonText}>{t("edit")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleToggleDeleteQuestionModal(item?.id)}>
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={DeleteQuestionModalVisible}
                onRequestClose={() => {
                    setDeleteQuestionModalVisible(!DeleteQuestionModalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Are you sure you want to delete this question?</Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => setDeleteQuestionModalVisible(false)}
                            >
                                <Text style={styles.editButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteQuestion()}
                            >
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity style={styles.createParent} onPress={() => uploadUpdateQuestion()}>
                <Text style={styles.buttonText}>Create Question</Text>
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
        width: '130%',
        alignItems: "stretch",
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
        color: "#fff", 
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
    questionCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        marginBottom: 15,
        width: '75%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    questionText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    editButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 1,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: '#C8102E',
        paddingVertical: 1,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});
