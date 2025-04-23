import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { ProfileIcon, SettingsIcon, SearchIcon, HomeIcon, PlusIcon, EditIcon} from "@/constants/icons";
import DropDown from "../../components/DropDown";
import { getDecksByCurrentUser } from '@/apiHelper/backendHelper';
import { useTranslation } from 'react-i18next';

export default function Decks() {
    const { t } = useTranslation("edit_deck_list");
    const router = useRouter();
    
    const [selectedSort, setSelectedSort] = useState<string>("");
    const [decks, setDecks] = useState<any[]>([]);

    useEffect(() => {
        getDecksByCurrentUser()
            .then((decks) => {
                setDecks(decks?.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const uploadGeneratePage = () => {
        router.push("/(app)/generatedecks");
    };

    const sortOptions = [
        { label: t("sort_by_last_accessed"), value: "last" },
        { label: t("sort_by_newly_accessed"), value: "newest" },
        { label: t("sort_by_best_performance"), value: "best" },
        { label: t("sort_by_worst_performance"), value: "worst" },
    ];

    const uploadUpdateDeckPage = (id: any) => {
        router.push({
            pathname: "/(app)/updatedeck",
            params: { deckId: id },
        });
    }

    const formatDate = (dateStr: any) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

    return (
        <View style={styles.container}>
        <Text style={styles.remedicardio}>{t("title")}</Text>

        <View style={styles.searchComponent}>
            <SearchIcon></SearchIcon>
            <TextInput style={[styles.searchText, styles.searchPosition]} placeholder={t("search")} placeholderTextColor={"rgba(0, 0, 0, 0.25)"}></TextInput>
        </View>
        
        <DropDown
            options={sortOptions}
            placeholder={t("select_sort_option")}
            onSelect={(value) => setSelectedSort(value)}
        />

        <FlatList
            style={styles.flatListContainer}
            contentContainerStyle={styles.flatListContent}
            data={decks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.deckComponent}>
                    <View>
                    <Text style={styles.deckTitle}>{item.name}</Text>
                    {
                    item.lastDeckStat &&
                    <Text style={styles.deckInfoText}>
                        {t("last_accessed")} {formatDate(item.lastDeckStat.accessDate)}
                    </Text>
                    }

                    <Text style={styles.deckInfoText}>
                    {item.flashcardCount} {t("cards")}
                    </Text>
                    {
                    item.lastDeckStat &&
                    <Text style={styles.deckInfoText}>
                        {t("best")}{new Intl.NumberFormat('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 1,}).format(item.bestDeckStat.successRate)}% 
                        {" "}
                        {t("last")}{new Intl.NumberFormat('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 1,}).format(item.lastDeckStat.successRate)}%
                    </Text>
                    }
                    <TouchableOpacity style={[styles.chevronRightIcon, styles.iconLayout]} onPress={() => uploadUpdateDeckPage(item.id)}>
                        <EditIcon color="#111" />
                    </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            )}
        />

        <TouchableOpacity style={styles.createButton} onPress={uploadGeneratePage}>
            <PlusIcon></PlusIcon>
            <Text style={styles.createNewDeck}>{t("create_new_deck")}</Text>
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
        left: "90%",
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