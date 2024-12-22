import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { AtIcon, MailIcon, ChevronDown, EditProfileIcon, SubscriptionIcon, ContactIcon, ProfileIcon, SettingsIcon,
    LanguageIcon, SearchIcon, HomeIcon, PlusIcon,
    EditIcon} from "@/constants/icons";
import DropDown from "../../components/DropDown"; // Path to the custom DropDown component
import { getDecksByCurrentUser } from '@/apiHelper/backendHelper';

export default function Decks() {
    const router = useRouter();
    
    const [selectedSort, setSelectedSort] = useState<string>("");
    const [decks, setDecks] = useState<any[]>([]);

    const uploadGeneratePage = () => {
        router.push("/(app)/generatedecks");
    };

    useEffect(() => {
        getDecksByCurrentUser()
            .then((decks) => {
                const decks_info = decks.data;
                console.log(decks_info);
                decks_info.forEach((deck: any) => {
                    deck.lastAccessed = "31.12.2024";
                    deck.bestPerformance = 90;
                    deck.lastPerformance = 40;
                });
                setDecks(decks_info);
            })
            .catch((error) => {
                console.log(error);
            });
        }, []);

    const sortOptions = [
        { label: "Sort by Last Accessed", value: "last" },
        { label: "Sort by Newwly Accessed", value: "newest" },
        { label: "Sort by Best Performance", value: "best" },
        { label: "Sort by Worst Performance", value: "worst" },
    ];

    const uploadUpdateDeckPage = (id: any) => {
        router.push("/(app)/updatedeck?deckId=" + id);
    }

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
                    <Link href="/(app)/card" style={styles.link}>
                    <View>
                    <Text style={styles.deckTitle}>{item.topic}</Text>
                    <Text style={[styles.deckInfoText]}>
                        Last accessed: {item.lastAccessed}
                    </Text>
                    <Text style={[styles.deckInfoText]}>
                        {item.flashcardCount} cards
                    </Text>
                    <Text style={[styles.deckInfoText]}>
                        Best: {item.bestPerformance}% Last: {item.lastPerformance}%
                    </Text>
                    <TouchableOpacity style={[styles.chevronRightIcon, styles.iconLayout]} onPress={() => uploadUpdateDeckPage(item.id)}>
                        <EditIcon color="#111" />
                    </TouchableOpacity>
                    </View>
                    </Link>
                </TouchableOpacity>
            )}
        />

        <TouchableOpacity style={styles.createButton} onPress={uploadGeneratePage}>
            <PlusIcon></PlusIcon>
            <Text style={styles.createNewDeck}>Create New Deck</Text>
        </TouchableOpacity>
                
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
        position: "absolute",
        bottom: 50,
        backgroundColor: "#53789D",

    },
    navbarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "75%",
        position: "absolute",
        bottom: 50,
        backgroundColor: "#53789D",
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
        left: "140%",
        top: "50%"
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
        marginBottom: 8, // Spacing below title
    },
    deckTitle: {
        fontSize: 16,
        color: "#000",
        fontWeight: "bold",
        marginBottom: 8, // Spacing below title

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
    link: {
        flexDirection: "column", // Stack children vertically
        alignItems: "flex-start", // Align text to the left
        width: "100%", // Ensure it doesn't shrink
    },
    createButton: {
        borderRadius: 20,
        backgroundColor: "#2916ff",
        width: "75%",
        flexDirection: "row",
        alignItems: "center",
        gap: 30,
        height: 50,
        bottom:"15%"
    },
    createNewDeck: {
        fontSize: 17,
        lineHeight: 22,
        fontFamily: "Inter-Regular",
        color: "#fff",
        textAlign: "center",
    },
});