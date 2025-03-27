import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, Link } from "expo-router";
import {
  ChevronRightIcon,
  HomeIcon,
  ProfileIcon,
  SettingsIcon,
  SearchIcon,
  PlusIcon,

} from "@/constants/icons";
import DropDown from "../../components/DropDown";
import { getDecksByCurrentUser, deleteDeck } from "@/apiHelper/backendHelper";

export default function Decks() {
  const [selectedSort, setSelectedSort] = useState<string>("");
  const [decks, setDecks] = useState<any[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [manualCreateModalVisible, setManualCreateModalVisible] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState("");

  const router = useRouter();

  useEffect(() => {
    getDecksByCurrentUser()
      .then((decks) => {
        const updatedDecks = decks.data.map((deck: any) => ({
          ...deck,
          lastAccessed: "31.12.2024",
          bestPerformance: 90,
          lastPerformance: 40,
        }));

        setDecks(updatedDecks);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const sortOptions = [
    { label: "Sort by Last Accessed", value: "last" },
    { label: "Sort by Newly Accessed", value: "newest" },
    { label: "Sort by Best Performance", value: "best" },
    { label: "Sort by Worst Performance", value: "worst" },
  ];

  const handleDeckPress = (deck) => {
    setSelectedDeck(deck);
    setModalVisible(true); // Open Modal
  };

  const handleStartQuiz = () => {
    if (selectedDeck) {
      setModalVisible(false);
      router.push({
        pathname: "/(app)/card",
        params: { deck: JSON.stringify(selectedDeck) },
      });
    } else {
      Alert.alert("Error", "Deck information is missing.");
    }
  };

  const handleEditDeck = () => {
    if (selectedDeck) {
      setModalVisible(false);
      router.push("/(app)/updatedeck?deckId=" + selectedDeck.id);
    } else {
      Alert.alert("Error", "Deck information is missing.");
    }
  };

  const handleDeleteDeck = () => {
    console.log(selectedDeck.id);

    deleteDeck(selectedDeck.id).then((res) => {
      Alert.alert("Success", "Selected deck is successfully deleted!");
      setDecks(decks.filter((d) => d.id !== selectedDeck.id));
      setSelectedDeck(null);
      setPopUpVisible(false);
      setModalVisible(false);
    });
  };

  const uploadGeneratePage = () => {
    router.push("/(app)/generatedecks");
  };

  const handleManualCreate = () => {
    if (!newDeckTitle.trim()) {
      Alert.alert("Error", "Please enter a deck name");
      return;
    }
  
    // Dummy creation, replace this with your real API call
    // Example: createDeck({ topic: newDeckTitle }) => returns { id }
    const fakeDeckId = Math.floor(Math.random() * 100000); // replace with API response later
  
    // Redirect
    setManualCreateModalVisible(false);
    setNewDeckTitle("");
    router.push("/(app)/updatedeck?deckId=" + fakeDeckId);
  };
  
  return (
    <View style={styles.container}>
      {/* Header, Search, Sort */}
      <Text style={styles.remedicardio}>ReMediCard.io</Text>

      <View style={styles.searchComponent}>
        <SearchIcon />
        <TextInput
          style={[styles.searchText, styles.searchPosition]}
          placeholder="search anything"
          placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
        />
      </View>

      <DropDown
        options={sortOptions}
        placeholder="Select sort option"
        onSelect={(value) => setSelectedSort(value)}
      />

      {/* Decks List */}
      <FlatList
        style={styles.flatListContainer}
        contentContainerStyle={styles.flatListContent}
        data={decks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.deckComponent}
            onPress={() => handleDeckPress(item)}
          >
            <View>
              <Text style={styles.deckTitle}>{item.topic}</Text>
              <Text style={styles.deckInfoText}>
                Last accessed: {item.lastAccessed}
              </Text>
              <Text style={styles.deckInfoText}>
                {item.flashcardSet.length} cards
              </Text>
              <Text style={styles.deckInfoText}>
                Best: {item.bestPerformance}% Last: {item.lastPerformance}%
              </Text>
              <View style={[styles.chevronRightIcon, styles.iconLayout]}>
                <ChevronRightIcon color="#111" />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.createButton} onPress={() => setCreateModalVisible(true)}>
        <PlusIcon></PlusIcon>
        <Text style={styles.createNewDeck}>Create New Deck</Text>
      </TouchableOpacity>
      
      <Modal
        transparent={true}
        visible={createModalVisible}
        animationType="slide"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create Deck</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setCreateModalVisible(false);
                setManualCreateModalVisible(true);
              }}
            >
              <Text style={styles.modalButtonText}>Create Manually</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setCreateModalVisible(false);
                uploadGeneratePage();
              }}
            >
              <Text style={styles.modalButtonText}>Create with AI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setCreateModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={popUpVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {" "}
              Are you sure about deleting the selected deck?{" "}
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#C8102E" }]}
              onPress={handleDeleteDeck}
            >
              <Text style={[styles.modalButtonText]}>Delete Deck</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setPopUpVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedDeck?.topic}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleStartQuiz}
            >
              <Text style={styles.modalButtonText}>Start Quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleEditDeck}
            >
              <Text style={styles.modalButtonText}>Edit Deck</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#C8102E" }]}
              onPress={() => setPopUpVisible(true)}
            >
              <Text style={[styles.modalButtonText]}>Delete Deck</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={manualCreateModalVisible}
        animationType="slide"
        onRequestClose={() => setManualCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>New Deck Name</Text>
            <TextInput
              style={[styles.searchComponent, { width: "100%", marginBottom: 10 }]}
              placeholder="Enter deck title"
              value={newDeckTitle}
              onChangeText={setNewDeckTitle}
            />

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleManualCreate}
            >
              <Text style={styles.modalButtonText}>Save & Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setManualCreateModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* Navbar */}
      <View style={styles.navbarRow}>
        <TouchableOpacity>
          <Link href="/(app)/home">
            <HomeIcon />
          </Link>
        </TouchableOpacity>
        <TouchableOpacity>
          <Link href="/(app)/profile">
            <ProfileIcon />
          </Link>
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
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#53789D",
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
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#fff",
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
    zIndex: 0,
  },
  searchPosition: {
    marginTop: 20,
    position: "absolute",
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
    position: "absolute",
  },
  iconLayout: {
    height: 24,
    width: 24,
    position: "absolute",
  },
  chevronRightIcon: {
    left: "90%",
    zIndex: 3,
    top: "70%",
  },
  menuIcon: {
    right: "95%",
    zIndex: 3,
    top: 5,
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
    zIndex: 2,
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
    marginBottom: 120,
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
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#2916ff",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    marginVertical: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalCancel: {
    marginTop: 10,
  },
  modalCancelText: {
    color: "#2916ff",
    fontWeight: "bold",
    fontSize: 16,
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
