import React, {useState} from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { GoBackIcon, CorrectIcon, FalseIcon, CheckmarkIcon, CrossIcon} from "@/constants/icons";
import Flashcard from '@/components/FlashCard';

export default function Profile() {

    const router = useRouter();


    return (
        <View style={styles.container}>

        <View style={styles.menuComponent}>
            <View style={[styles.menuIcon, styles.iconLayout]}>
                <Link href="/(app)/decks"><GoBackIcon/></Link>
            </View>

            <Text style={styles.menuText}>Deck 1</Text>
        
            <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
            </View>
        </View>

        <View style={styles.scoreTable}>
            <Text style={[styles.text1, styles.scoreText]}>15/35</Text>
            <View style={[styles.checkIcon, styles.scoreTableIconLayout]}><CorrectIcon></CorrectIcon></View>
            <Text style={[styles.text2, styles.scoreText]}>10</Text>
            <View style={[styles.crossIcon, styles.scoreTableIconLayout]}><FalseIcon></FalseIcon></View>
            <Text style={[styles.text3, styles.scoreText]}>5</Text>
        </View>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Flashcard 
                question="LOREM"
                answer="IPSUM"
                width={250}
                height={400}
            />
        </View>

        <View style={[styles.interactiveContainer, styles.interactiveContainerPosition]}>
            <TouchableOpacity style={styles.crossIconPosition}><CrossIcon></CrossIcon></TouchableOpacity>
            <TouchableOpacity style={styles.checkMarkIconPosition}><CheckmarkIcon></CheckmarkIcon></TouchableOpacity>
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
    menuComponent: {
        width: "75%",
        height: 20,
        padding: 10,
        gap: 10,
        alignItems: "center",
        marginVertical: 30,
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
    scoreTable: {
        width: "75%",
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginBottom: 20
    },
    scoreText: {
        textAlign: "center",
        color: "#fff",
        fontFamily: "Inter-Regular",
        lineHeight: 20,
        fontSize: 15,
        position: "absolute"
    },
    scoreTableIconLayout: {
        height: 14,
        width: 14,
        left: 10,
        position: "absolute"
    },
    text1: {
        top: "37.7%",
        right: 10,
        width: 55,
        zIndex: 0
    },
    text2: {
        top: "20%",
        left: "15%"
    },
    text3: {
        top: "70%",
        left: "15%"
    },
    checkIcon: {
        top: "25%",
    },
    crossIcon: {
        top: "75%",
    },
    interactiveContainer: {
        flexDirection: "row", // Layout the children horizontally
        justifyContent: "space-between", // Spread children across the container
        alignItems: "center", // Center the icons vertically
        width: "75%", // Keep the container width consistent with the rest of the layout
        marginTop: 30, // Add margin top to give space between elements
        height: 75, // Adjust height to fit the icons
    },
    interactiveContainerPosition: {
        zIndex: 0,
        bottom: 0,
        marginTop: 30,
        height: 75,
        width: "75%"
    },
    checkMarkIconPosition: {
        backgroundColor: "green",
        borderRadius: 50,
        right: 0
    },
    crossIconPosition: {
        backgroundColor: "red",
        borderRadius: 50,
        left: 0
    },
});