import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GoBackIcon, NextQuestionIcon, InfoIcon } from "@/constants/icons";
import { useTranslation } from 'react-i18next';

const TutorialInfoButton = ({ tutorialImages, tutorialTitle, tutorialTexts }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [index, setIndex] = useState(0)

  const {t} = useTranslation("tutorial")

  const incrementIndex = () => {
    if(index !== tutorialImages.length-1){
      setIndex(index + 1)
    }
  }

  const decrementIndex = () => {
    console.log(index)

    if(index !== 0){
      setIndex(index - 1)
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <InfoIcon/>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>

          <View style={styles.modalContent}>

          {index > 0 && <TouchableOpacity style={styles.backButton} onPress={decrementIndex}>
            <Text style={styles.buttonText}> {"<"} </Text>
          </TouchableOpacity>}

          <Text style={styles.tutorialTitle}>{t(tutorialTitle)}</Text> 
            {tutorialImages && tutorialImages.length > 0 && (
              <Image source={tutorialImages[index]} style={styles.image} resizeMode="contain" />
            )}
            <Text style={styles.tutorialText}>{t(tutorialTexts[index])}</Text> 
            <TouchableOpacity onPress={() => {
              setIndex(0)
              setModalVisible(false)
              }} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>{t("close")}</Text>
            </TouchableOpacity>

            {index + 1 < tutorialImages.length && <TouchableOpacity style={styles.forwardButton} onPress={incrementIndex}>
              <Text style={styles.buttonText}> {">"} </Text>
            </TouchableOpacity>}

          </View>

        </View>
      </Modal>
    </View>
  );
};

export default TutorialInfoButton;

const styles = StyleSheet.create({
  container: {
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
  },
  tutorialText: {
    fontSize: 17,
    margin: 10
  },
  tutorialTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  image: {
    height: 450,
    width: 200,
    marginBottom: 10
  },
  closeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
    position: "absolute",
    width: 70,
    height: 70,
    left: "6%",
    top: "40%"
  },
  forwardButton: {
    position: "absolute",
    width: 70,
    height: 70,
    right: "6%",
    top: "40%"
  },
  buttonText: {
    fontSize: 60,
    color: "#53789D",
  }
});
