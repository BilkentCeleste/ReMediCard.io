import React, {useState} from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, Link } from 'expo-router';
import axios from 'axios';
import { AtIcon, MailIcon, ChevronDown, EditProfileIcon, SubscriptionIcon, ContactIcon, ProfileIcon, SettingsIcon,
    LanguageIcon, SearchIcon, HomeIcon, 
    ChevronRightIcon} from "../../constants/icons";
import DropDown from "../../components/DropDown"; // Path to the custom DropDown component

export default function Decks() {
    const [selectedSort, setSelectedSort] = useState<string>("");

    const sortOptions = [
        { label: "Sort by Last Accessed", value: "last" },
        { label: "Sort by Newwly Accessed", value: "newest" },
        { label: "Sort by Best Performance", value: "best" },
        { label: "Sort by Worst Performance", value: "worst" },
    ];

    const decks = [
        { title: "Deck 1", lastAccessed: "31.12.2024", cards: 35, bestPerformance: 90, lastPerformance: 40 },
        { title: "Deck 2", lastAccessed: "30.12.2024", cards: 20, bestPerformance: 85, lastPerformance: 50 },
        { title: "Deck 2", lastAccessed: "30.12.2024", cards: 20, bestPerformance: 85, lastPerformance: 50 },
        { title: "Deck 2", lastAccessed: "30.12.2024", cards: 20, bestPerformance: 85, lastPerformance: 50 },
        { title: "Deck 2", lastAccessed: "30.12.2024", cards: 20, bestPerformance: 85, lastPerformance: 50 },
        { title: "Deck 2", lastAccessed: "30.12.2024", cards: 20, bestPerformance: 85, lastPerformance: 50 },
        { title: "Deck 2", lastAccessed: "30.12.2024", cards: 20, bestPerformance: 85, lastPerformance: 50 },
        { title: "Deck 2", lastAccessed: "30.12.2024", cards: 20, bestPerformance: 85, lastPerformance: 50 },
    ];

    return (
        <View style={styles.container}>
        <Text style={styles.remedicardio}>ReMediCard.io</Text>

        <View style={styles.searchComponent}>
            <SearchIcon></SearchIcon>
            <TextInput style={[styles.searchText, styles.searchPosition]} placeholder='search anything' placeholderTextColor={"rgba(0, 0, 0, 0.25)"}></TextInput>
        </View>
        
        <DropDown
            options={sortOptions}
            placeholder="Select sort option"
            onSelect={(value) => setSelectedSort(value)}
        />

        <FlatList
            style={styles.flatListContainer}
            contentContainerStyle={styles.flatListContent} // Style for inner FlatList items
            data={decks}
            keyExtractor={(item, index) => index.toString()} // Add padding to avoid overlap with navbar
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.deckComponent}>
                    <Text style={styles.deckTitle}>{item.title}</Text>
                    <Text style={[styles.deckInfoText]}>
                        Last accessed: {item.lastAccessed}
                    </Text>
                    <Text style={[styles.deckInfoText]}>
                        {item.cards} cards
                    </Text>
                    <Text style={[styles.deckInfoText]}>
                        Best: {item.bestPerformance}% Last: {item.lastPerformance}%
                    </Text>
                    <View style={[styles.chevronRightIcon, styles.iconLayout]}>
                        <ChevronRightIcon color="#111" />
                    </View>
                </TouchableOpacity>
            )}
        />
                
        <View style={styles.navbarRow}>
            <TouchableOpacity>
                <Link href="/(app)/home"><HomeIcon/></Link>
            </TouchableOpacity>
            <TouchableOpacity>
                <Link href="/(app)/profile"><ProfileIcon/></Link>
            </TouchableOpacity>
            <TouchableOpacity>
                <SettingsIcon/>
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
        width: "100%",
        height:"100%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#53789D',
    },
    remedicardio: {
        top: 60,
        fontSize: 30,
        lineHeight: 32,
        fontFamily: "InriaSans-Regular",
        color: "#fff",
        textAlign: "center",
        width: "100%",   
        height: 27,
        marginBottom: 75,
        fontWeight: "bold",
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        marginVertical: 20,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#fff',
    },
    navbarRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
        marginTop: 30,
        position: "absolute", // Position the navbar absolutely
        bottom: 50,
        backgroundColor: "#53789D",

    },
    navbarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "75%",
        position: "absolute",
        bottom: 50,
        backgroundColor: "#53789D", // Match the background color
        height: 1,
    },
    navbarLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#fff',
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
        marginBottom: 10,
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
    menuComponent: {
        width: "75%",
        height: 20,
        padding: 10,
        gap: 10,
        alignItems: "center",
        marginVertical: 10,
    },
    menuText: {
        left: "10%",
        fontSize: 12,
        lineHeight: 22,
        fontFamily: "Inter-Regular",
        color: "#fff",
        textAlign: "left",
        zIndex: 1,
        top: 5,
        position: "absolute"
    },
    iconLayout: {
        height: 24,
        width: 24,
        position: "absolute"
    },
    chevronRightIcon: {
        left: "100%",
        zIndex: 3,
        top: "90%"
    },
    menuIcon: {
        right: "95%",
        zIndex: 3,
        top: 5
    },
    selectedOption: {
        marginTop: 20,
        fontSize: 16,
        color: "gray",
    },
    deckInfoText: {
        fontSize: 12,
        color: "rgba(0, 0, 0, 0.7)",
    },
    deckTitle: {
        fontSize: 16,
        color: "#000",
        fontWeight: "bold",
    },
    deckComponent: {
        borderRadius: 20,
        backgroundColor: "#fff",
        width: "100%", // Adjusted width to fit screen
        height: 120, // Increased height for sufficient spacing
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 15, // Add padding for content
        marginVertical: 5, // Space between items
    },
    accessInfoPosition: {
        top: 35,
        zIndex: 1,
        left: 15,
    },
    cardsLengthInfoPosition: {
        top: 55,
        left: 15,
        zIndex: 2
    },
    performanceInfoPosition: {
        top: 75,
        zIndex: 3,
        left: 15,
    },
    flatListContainer: {
        width: "75%", // Adjust the width to be larger
        height: "35%", // Shorten the height
        marginTop: 5, // Lower its starting position
        backgroundColor: "transparent", // Optional, keeps it aligned with the background
        marginBottom: 120
    },
    flatListContent: {
        alignItems: "stretch", // Ensure items stretch to the container width
        paddingBottom: 20, // Add padding if needed at the bottom
    },
});