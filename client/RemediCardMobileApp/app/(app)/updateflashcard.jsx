import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, ActivityIndicator, Alert} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {createFlashcard, updateFlashcard} from "../../apiHelper/backendHelper";
import { GoBackIcon, UploadIcon} from '@/constants/icons';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from "expo-image-picker";

export default function UpdateFlashcard() {
    const { t } = useTranslation('update_flashcard');
    const router = useRouter();
    const { flashcard, deckId } = useLocalSearchParams();

    const [cardFrontSide, setCardFrontSide] = useState('');
    const [cardBackSide, setCardBackSide] = useState('');
    const [flashcardId, setFlashcardId] = useState('');
    const [isCreating, setIsCreating] = useState(true);
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [showIndicator, setShowIndicator] = useState(false);

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
        if( frontImage || backImage){
            setShowIndicator(true);
        }

        const formData = new FormData();

        formData.append("topic", "random");
        formData.append("type", "random");
        formData.append("frequency", "1.0");
        formData.append("deckId", deckId.toString());
        
        formData.append("frontSide.text", cardFrontSide);
        formData.append("frontSide.urlSet", "aaaaaaa");
        formData.append("frontSide.urlSet", "aaaaaaa2");
        
        if(frontImage != null) {
            formData.append("frontSide.image", {
                uri: frontImage,
                type: "image/jpeg",
                name: "image"  + frontImage.substring(frontImage.lastIndexOf(".")),
            });
        }
        
        formData.append("backSide.text", cardBackSide);
        formData.append("backSide.urlSet", "aaaaaaa");
        formData.append("backSide.urlSet", "aaaaaaa2");

        if(backImage != null) {
            formData.append("backSide.image", {
                uri: backImage,
                type: "image/jpeg",
                name: "image"  + backImage.substring(backImage.lastIndexOf(".")),
            });
        }

        createFlashcard(formData)
            .then(() => {
                setShowIndicator(false);
                router.push("/(app)/updatedeck?deckId=" + deckId);
            })
            .catch((error) => {
                Alert.alert(t("error"), t("flashcard_creation_error"));
                setShowIndicator(false);
            });
    }

    const handleUpdate = () => {
        if( frontImage || backImage){
            setShowIndicator(true);
        }        
        
        const formData = new FormData();

        formData.append("topic", "random");
        formData.append("type", "random");
        formData.append("frequency", "1.0");
        formData.append("deckId", deckId.toString());
        
        formData.append("frontSide.text", cardFrontSide);
        formData.append("frontSide.urlSet", "aaaaaaa");
        formData.append("frontSide.urlSet", "aaaaaaa2");
        
        if(frontImage != null) {
            formData.append("frontSide.image", {
                uri: frontImage,
                type: "image/jpeg",
                name: "image"  + frontImage.substring(frontImage.lastIndexOf(".")),
            });
        }
        
        formData.append("backSide.text", cardBackSide);
        formData.append("backSide.urlSet", "aaaaaaa");
        formData.append("backSide.urlSet", "aaaaaaa2");

        if(backImage != null) {
            formData.append("backSide.image", {
                uri: backImage,
                type: "image/jpeg",
                name: "image"  + backImage.substring(backImage.lastIndexOf(".")),
            });
        }

        updateFlashcard(flashcardId, formData)
            .then(() => {
                setShowIndicator(false);
                router.push("/(app)/updatedeck?deckId=" + deckId);
            })
            .catch((error) => {
                setShowIndicator(false);
                Alert.alert(t("error"), t("flashcard_update_error"));
            });
    }

    const handleBack = () => {
        router.push("/(app)/updatedeck?deckId=" + deckId);
    }

    const pickImage = async (setImage) => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false) {
            Alert.alert(t("error"), t("permission_denied"));
            return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.Images,
          allowsEditing: true,
          allowsMultipleSelection: false,
          quality: 1,
        });
    
        if (!result.canceled) {
          const imageUri = result.assets[0].uri;
          setImage(imageUri);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.menuComponent}>
                <View style={[styles.menuIcon, styles.iconLayout]}>
                    <TouchableOpacity onPress={handleBack}><GoBackIcon/></TouchableOpacity>
                </View>

                <Text style={styles.menuText}>{isCreating ? t("create_flashcard") : t("update_flashcard")}</Text>
            
                <View style={styles.separatorContainer}>
                    <View style={styles.separatorLine} />
                </View>
            </View>

            <TextInput
                style={styles.aInput}
                placeholder={isCreating ? t("front_message") : ''}
                value={cardFrontSide}
                onChangeText={setCardFrontSide}
                multiline={true}
                textAlignVertical="top"
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
            <View style={styles.selectComponent}>
                <Text onPress={() => pickImage(setFrontImage)}>
                    {frontImage? t("front_image_selected") : t("select_front_image")}{" "}
                </Text>
                <View>
                    {frontImage == null && <UploadIcon></UploadIcon>}
                </View>
            </View>

            <TextInput
                style={[styles.aInput, {marginTop: 50}]}
                placeholder={isCreating ? t("back_message") : ''}
                value={cardBackSide}
                onChangeText={setCardBackSide}
                multiline={true}
                textAlignVertical="top"
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
            <View style={styles.selectComponent}>
                <Text onPress={() => pickImage(setBackImage)}>
                    {backImage? t("back_image_selected") : t("select_back_image")}{" "}
                </Text>
                <View>
                    {backImage == null && <UploadIcon></UploadIcon>}
                </View>
            </View>
            
            <Modal
                transparent={true}
                visible={showIndicator}
                animationType="slide"
                onRequestClose={() => setShowIndicator(false)}
            >
                <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <ActivityIndicator size={"large"} style={styles.indicator} />

                    <Text style={styles.indicatorText}> {t("file_transfer")}</Text>
                </View>
                </View>
            </Modal>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleBack}>
                    <Text style={styles.buttonText}>{t("cancel")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={isCreating ? handleSave : handleUpdate}>
                    <Text style={styles.buttonText}>{isCreating ? t("save") : t("update")}</Text>
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
    aInput: {
        width: '75%',
        height: 150,
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
        top: 675
    },
    button: {
        flex: 0.48,
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 5,
    },
    deleteButton: {
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
    menuComponent: {
        width: "75%",
        height: 20,
        padding: 10,
        gap: 10,
        alignItems: "center",
        marginVertical: 40,
    },
    menuText: {
        fontSize: 15,
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
    selectComponent: {
        borderRadius: 20,
        backgroundColor: "rgba(207, 207, 207, 0.3)",
        width: "100%",
        height: 45,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "5%",
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
    indicator: {
        transform: [{ scale: 1.8 }],
        margin: 20,
        color: "#888888",
    },
});
