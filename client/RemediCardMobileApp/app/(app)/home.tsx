import React, {useState} from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { SearchIcon, FlashcardIcon, QuizIcon, GoalsIcon, CreateIcon, HomeIcon, ProfileIcon, SettingsIcon } from "../../constants/icons";

export default function Home() {
    
    const uploadDecksPage = () => {
        
    };

    const uploadQuizzesPage = () => {
        
    };

    const uploadStudyDashboardPage = () => {
        
    };

    const uploadGeneralEditPage = () => {
        
    };

    return (
        <View style={styles.container}>
        <Text style={styles.remedicardio}>ReMediCard.io</Text>

        <View style={styles.searchComponent}>
            <SearchIcon></SearchIcon>
            <TextInput style={[styles.searchText, styles.searchPosition]} 
            placeholder='search anything' placeholderTextColor={"rgba(0, 0, 0, 0.25)"}></TextInput>
        </View>
        
        <View style={styles.reminderComponent}>
            <Text style={[styles.reminderHeaderPlacement, styles.reminderHeader]}>What about excercising lorem ipsum ?</Text>
            <Text style={[styles.reminderTextPlacement, styles.reminderText]}>Last time you excersied lorem ipsum was 5 days ago</Text>
        </View>
        
        <View style={styles.buttonContainer}>
            <View style={styles.row}>
                <TouchableOpacity style={styles.mainComponent} onPress={uploadDecksPage}>
                    <FlashcardIcon></FlashcardIcon>
                    <Text style={[styles.mainComponentText]}>Decks</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.mainComponent} onPress={uploadQuizzesPage}>
                    <QuizIcon></QuizIcon>
                    <Text style={[styles.mainComponentText]}>Quizzes</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
            <TouchableOpacity style={styles.mainComponent} onPress={uploadStudyDashboardPage}>
                    <GoalsIcon></GoalsIcon>
                    <Text style={[styles.mainComponentText]}>Study Goals</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.mainComponent} onPress={uploadGeneralEditPage}>
                    <CreateIcon></CreateIcon>
                    <Text style={[styles.mainComponentText]}>Edit / Create</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.navbarRow}>
            <TouchableOpacity onPress={uploadGeneralEditPage}>
                    <HomeIcon/>
            </TouchableOpacity>
            <TouchableOpacity onPress={uploadGeneralEditPage}>
                    <ProfileIcon/>
            </TouchableOpacity>
            <TouchableOpacity onPress={uploadGeneralEditPage}>
                    <SettingsIcon/>
            </TouchableOpacity>
        </View>
        
        <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
        </View>

        </View>
    );
}
    
const styles = StyleSheet.create({
    container: {
        width: "100%",
        height:"100%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#53789D',
    },
    remedicardio: {
        fontSize: 35,
        lineHeight: 22,
        fontFamily: "InriaSans-Regular",
        color: "#fff",
        textAlign: "left",
        width: 200,
        height: 27,
        marginBottom: 20,
    },
    searchComponent: {
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
        width: "75%",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        gap: 30,
        marginBottom: 20,
    },
    searchText: {
        left: "25%",
        fontSize: 15,
        lineHeight: 22,
        fontFamily: "Inter-Regular",
        color: "#111",
        textAlign: "center",
        zIndex: 0
    },
    searchPosition: {
        marginTop: 20,
        position: "absolute"
    },
    reminderComponent: {
        borderRadius: 20,
        backgroundColor: "#2916ff",
        width: "75%",
        height: 130,
        gap: 10
    },
    reminderHeader: {
        textAlign: "left",
        color: "#fff",
        fontFamily: "Inter-Regular",
        height: "50%",
        left: 12,
        position: "absolute",
        fontWeight: "bold"
    },
    reminderText: {
        textAlign: "left",
        color: "#fff",
        fontFamily: "Inter-Regular",
        height: "50%",
        left: 12,
        position: "absolute"
    },
    reminderHeaderPlacement: {
        top: 10,
        fontSize: 20,
        width: "90%",
        height: "50%",
        zIndex: 0
    },
    reminderTextPlacement: {
        top: 70,
        fontSize: 12,
        width: "90%",
        height: "50%",
        zIndex: 1
    },
    buttonContainer: {
        width: "75%",
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
        marginBottom: 10,
    },
    mainComponent: {
        borderRadius: 20,
        backgroundColor: "#fff",
        width: "45%",
        height: 130,
        justifyContent: "center", // Center vertically
        alignItems: "center",
        position: "relative",    // Allows positioning of the text at the bottom
    },
    mainComponentText: {
        position: "absolute",    // Positions the text at the bottom
        bottom: 5,              // Adjusts the spacing from the bottom edge
        fontSize: 16,            // Adjust font size to fit nicely
        fontFamily: "Inter-Regular",
        color: "#000",
        textAlign: "center",
        fontWeight: "bold",
        marginTop: 5,
    },
    navbarRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
        marginTop: 30
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "75%",
        marginVertical: 10,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#fff',
    },
});