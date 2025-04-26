import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, BackHandler} from 'react-native';
import {useRouter, useLocalSearchParams, Link, useFocusEffect} from 'expo-router';
import {GoBackIcon, HomeIcon, ProfileIcon, SettingsIcon} from '@/constants/icons';
import {getQuizByShareToken, addUserQuiz, getQuizByQuizId} from '@/apiHelper/backendHelper';
import { useTranslation } from 'react-i18next';
import NotFound from "@/components/NotFound";
import Loading from "@/components/Loading";

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
    const { shareToken, id } = useLocalSearchParams();

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (shareToken) {
            setLoading(true);
            getQuizByShareToken(shareToken)
                .then((res) => {
                    setQuiz(res?.data);
                    setNotFound(false);
                    setLoading(false);
                })
                .catch((error: Error) => {
                    setNotFound(true);
                    setLoading(false);
                });
        }
    }, [shareToken]);

    useEffect(() => {
        if (id) {
            setLoading(true);
            getQuizByQuizId(id)
                .then((res) => {
                    setQuiz(res?.data);
                    setNotFound(false);
                    setLoading(false);
                })
                .catch((error: Error) => {
                    setNotFound(true);
                    setLoading(false);
                });
        }
    }, [id]);

    useFocusEffect(() => {
            const onBackPress = () => {
              router.replace(id ? `/(app)/discover?type=quiz&id=${id}` : "/(app)/quizzes");
              return true;
            };
          
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
          
            return () => {
              BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
          });

    const handleAddToMyQuizzes = () => {
        if (quiz?.id) {
            addUserQuiz(quiz.id)
                .then(() => {
                    router.push('/(app)/quizzes');
                })
                .catch((error: Error) => {
                    Alert.alert(t('error'), t('add_quiz_failed'));
                    console.error(error);
                });
        }
    };

    if (notFound) {
        return (
            <NotFound
                title={t("not_found_title")}
                message={t("not_found")}
            />
        );
    }

    if (loading) {
        return (
            <Loading
                message={t('loading_quiz')}
            />
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.menuComponent}>
                <View style={[styles.menuIcon, styles.iconLayout]}>
                    <Link href={id ? `/(app)/discover?type=quiz&id=${id}` : "/(app)/quizzes"}><GoBackIcon  width={100} height={100} /></Link>
                </View>

                <View style = {styles.textComponent}>
                <Text style={styles.menuText} numberOfLines={2} ellipsizeMode="tail">{quiz.name}</Text>
                </View>

                <View style={styles.separatorContainer}>
                    <View style={styles.separatorLine} />
                </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    navbarRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        position: 'absolute',
        bottom: 50,
        backgroundColor: '#53789D',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 20,
    },
    questionsContainer: {
        flex: 1,
        width: "75%"
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
    },
    buttonText: {
        fontSize: 14,
        fontFamily: "Inter-Regular",
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 15
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
    loadingContainer: {
        width: "60%",
        height: "50%",
        justifyContent: "center"
    },
    indicator: {
        transform: [{ scale: 2.2 }],
        margin: 20,
        color: "#fff",    
      },
}); 