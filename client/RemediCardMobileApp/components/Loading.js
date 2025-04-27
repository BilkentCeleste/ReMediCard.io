import React from "react";
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Link} from "expo-router";
import {HomeIcon, ProfileIcon, SettingsIcon} from "@/constants/icons";
import NavBar from "./NavBar";

const Loading = ({ message }) => {
    return (
        <View style={styles.container}>
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={"large"} style={styles.indicator}/>
                <Text style={styles.loadingText}>{message}</Text>
            </View>

            <NavBar/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#53789D',
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
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

export default Loading;