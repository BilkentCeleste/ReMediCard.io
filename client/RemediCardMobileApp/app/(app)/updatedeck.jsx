import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput, Alert, Pressable } from 'react-native';
import { useRouter, Link, useLocalSearchParams } from 'expo-router';
import { GoBackIcon, PlusIcon } from '@/constants/icons';
import { getDeckByDeckId, deleteFlashcard, updateDeckName } from '@/apiHelper/backendHelper';
import Flashcard from "../../components/FlashCard";
import { useTranslation } from 'react-i18next';
import NavBar from "@/components/NavBar"

export default function Updatedeck() {
    const { t } = useTranslation('update_deck');
    const router = useRouter();
    const { deckId } = useLocalSearchParams();

    const [deck, setDeck] = useState();
    const [DeleteCardModal, setDeleteCardModalVisible] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [shownItem, setShownItem] = useState(null);

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

    const handleDeleteCardModal = (id) => {
        setDeleteCardModalVisible(!DeleteCardModal);
        setSelectedCard(id);
      };

    const handleDeleteFlashcard = () => {
            deleteFlashcard(selectedCard)
                .then(() => {
                    setDeleteCardModalVisible(false);
                    setDeck((prevCards) => ({
                        ...prevCards,
                        flashcardSet: prevCards?.flashcardSet?.filter(
                          (card) => card?.id !== selectedCard
                        ),
                      }));
                      setSelectedCard(null);
                })
                .catch((error) => {
                    Alert.alert(t("error"), t("delete_failed"));
                });
        }

    const handleNameEdit = () => {
        setIsEditingName(true);
        setEditedName(deck?.name || "");
    };

    const handleNameSave = () => {
        if (!editedName) {
            Alert.alert(t("error"), t("name_required"));
            return;
        }

        const data = {
            name: editedName,
        };

        updateDeckName(deckId, data)
            .then((res) => {
                setDeck(prev => ({
                    ...prev,
                    name: editedName
                }));
                setIsEditingName(false);
            })
            .catch((error) => {
                Alert.alert(t("error"), t("update_failed"));
            });
    };

    return (
        <TouchableOpacity 
            style={styles.container}
            activeOpacity={1}
            onPress={() => {
                if (isEditingName) {
                    setIsEditingName(false);
                }
            }}
        >
            <View style={styles.menuComponent}>
                <View style={[styles.menuIcon, styles.iconLayout]}>
                    <Link href="/(app)/decks"><GoBackIcon width={100} height={100} /></Link>
                </View>

                <View style={styles.textComponent}>
                    {isEditingName ? (
                        <TouchableOpacity 
                            style={styles.nameEditContainer}
                            activeOpacity={1}
                            onPress={(e) => e.stopPropagation()}
                        >
                            <TextInput
                                style={styles.nameInput}
                                value={editedName}
                                onChangeText={setEditedName}
                                autoFocus
                            />
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    handleNameSave();
                                }}
                            >
                                <Text style={styles.saveButtonText}>{t("saveName")}</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            onPress={(e) => {
                                e.stopPropagation();
                                handleNameEdit();
                            }}
                        >
                            <Text style={styles.menuText} numberOfLines={2} ellipsizeMode="tail">
                                {deck?.name}
                            </Text>
                        </TouchableOpacity>
                    )}
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
                    <View style={styles.flashcardComponent} onPress={() => uploadUpdateFlashcard(item)}>
                        <Flashcard
                            question={item?.frontSide?.text || ''}
                            answer={item?.backSide?.text || ''}
                            width={110}
                            height={80}
                            textSize={8}
                            frontImageURL={item.frontSide.imageURL}
                            backImageURL={item.backSide.imageURL}
                            longPressHandler={() => {
                                setModalVisible(true);
                                setShownItem(item);
                              }}
                        />
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => uploadUpdateFlashcard(item)}
                        >
                            <Text style={styles.editButtonText}>{t("update_flashcard")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteCardModal(item.id)}
                        >
                        <Text style={styles.deleteButtonText}>{t("delete")}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {shownItem && (
                    <Modal
                      transparent={true}
                      visible={modalVisible}
                      animationType="slide"
                      onRequestClose={() => setModalVisible(false)}
                    >
                      <Pressable
                        onPress={() => setModalVisible(false)}
                        style={styles.modalOverlay}
                      >
                        <View style={styles.modalContainer}>
                          <Flashcard
                            question={shownItem?.frontSide?.text || ""}
                            answer={shownItem?.backSide?.text || ""}
                            width={300}
                            height={500}
                            textSize={20}
                            frontImageURL={shownItem?.frontSide?.imageURL}
                            backImageURL={shownItem?.backSide?.imageURL}
                          />
                        </View>
                      </Pressable>
                    </Modal>
                  )}

            <Modal
                    animationType="slide"
                    transparent={true}
                    visible={DeleteCardModal}
                    onRequestClose={() => {
                      setDeleteCardModalVisible(!DeleteCardModal);
                    }}
                  >
                    <View style={styles.modalContainer}>
                      <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                          {t("delete_card_consent")}
                        </Text>
                        <View style={styles.modalButtonContainer}>
                          <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => setDeleteCardModalVisible(false)}
                          >
                            <Text style={styles.editButtonText}>{t("cancel")}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteFlashcard()}
                          >
                            <Text style={styles.deleteButtonText}>{t("delete")}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>

            <TouchableOpacity style={styles.createParent} onPress={() => uploadUpdateFlashcard()}>
                <PlusIcon></PlusIcon>
                <Text style={styles.buttonText}>{t("create_flashcard")}</Text>
            </TouchableOpacity>

            <NavBar/>
        </TouchableOpacity>
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
    flashcardComponent: {
        borderRadius: 20,
        backgroundColor: '#fff',
        width: '48%',
        minHeight: 80,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 15,
        marginVertical: 5,
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
    createParent: {
        borderRadius: 20,
        backgroundColor: "#2916ff",
        width: "75%",
        flexDirection: "row",
        alignItems: "center",
        gap: 30,
        height: 50,
        bottom: "15%",
    },
    buttonText: {
        fontSize: 17,
        lineHeight: 22,
        fontFamily: "Inter-Regular",
        color: "#fff",
        textAlign: "center",
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
    editButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 1,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 4
    },
    editButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
        textAlign: "center",
    },
    deleteButton: {
        backgroundColor: "#C8102E",
        paddingVertical: 1,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
        textAlign: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    nameEditContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    nameInput: {
        flex: 1,
        fontSize: 20,
        lineHeight: 22,
        fontFamily: "Inter-Regular",
        color: "#fff",
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 5,
        borderRadius: 5,
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    },
});
