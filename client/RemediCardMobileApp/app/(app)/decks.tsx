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
  Dimensions,
} from "react-native";
import { useRouter, Link, useLocalSearchParams } from "expo-router";
import {
  ChevronRightIcon,
  HomeIcon,
  ProfileIcon,
  SettingsIcon,
  SearchIcon,
  PlusIcon,
} from "@/constants/icons";
import DropDown from "../../components/DropDown";
import {
  getDecksByCurrentUser,
  deleteDeck,
  createDeck,
  generateDeckShareToken,
} from "@/apiHelper/backendHelper";
import { useTranslation } from "react-i18next";
import ListLoader from "../../components/ListLoader";

const { width } = Dimensions.get("window");

export default function Decks() {
  const { t } = useTranslation("decks");

  const { deck_selected } = useLocalSearchParams();
  const [searchParamUsed, setSearchParamUsed] = useState(false);

  const [selectedSort, setSelectedSort] = useState<string>("");
  const [decks, setDecks] = useState<any[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [manualCreateModalVisible, setManualCreateModalVisible] =
    useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState("");

  const [showLoading, setShowLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    getDecksByCurrentUser()
      .then((decks) => {
        setDecks(decks?.data);
        setShowLoading(false);
        if (!searchParamUsed && deck_selected !== undefined) {
          setSearchParamUsed(true);
          const selected = decks?.data.find((deck) => deck.id == deck_selected);
          handleDeckPress(selected);
        }
      })
      .catch((error) => {
        console.log(error);
        setShowLoading(false);
      });
  }, []);

  const sortOptions = [
    { label: t("sort_by_last_accessed"), value: "last" },
    { label: t("sort_by_newly_accessed"), value: "newest" },
    { label: t("sort_by_best_performance"), value: "best" },
    { label: t("sort_by_worst_performance"), value: "worst" },
  ];

  const handleDeckPress = (deck: any) => {
    setSelectedDeck(deck);
    setModalVisible(true);
  };

  const handleStartQuiz = () => {
    if (selectedDeck) {
      setModalVisible(false);
      router.push({
        pathname: "/(app)/card",
        params: { deck: JSON.stringify(selectedDeck) },
      });
    } else {
      Alert.alert(t("error"), t("deck_info_missing"));
    }
  };

  const handleEditDeck = () => {
    if (selectedDeck) {
      setModalVisible(false);
      router.push({
        pathname: "/(app)/updatedeck",
        params: { deckId: selectedDeck.id },
      });
    } else {
      Alert.alert(t("error"), t("deck_info_missing"));
    }
  };

  const handleDeleteDeck = () => {
    deleteDeck(selectedDeck.id).then((res) => {
      Alert.alert(t("success"), t("success_message"));
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
      Alert.alert(t("error"), t("enter_deck_name"));
      return;
    }

    const data = {
      name: newDeckTitle,
      topic: newDeckTitle,
    };

    createDeck(data)
      .then((res) => {
        setManualCreateModalVisible(false);
        setNewDeckTitle("");
        router.push({
          pathname: "/(app)/updatedeck",
          params: { deckId: res.data.id },
        });
      })
      .catch((err) => {
        console.error(err);
        Alert.alert(t("error"), t("deck_creation_failed"));
      });
  };

  const handleShareDeck = () => {
    if (selectedDeck) {
      generateDeckShareToken(selectedDeck?.id)
        .then((res) => {
          setModalVisible(false);
          router.push({
            pathname: "/(app)/shareddeck",
            params: { shareToken: res?.data?.shareToken },
          });
        })
        .catch((err) => {
          console.error(err);
          Alert.alert(t("error"), t("share_failed"));
        });
    } else {
      Alert.alert(t("error"), t("deck_info_missing"));
    }
  };

  const formatDate = (dateStr: any) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <View style={styles.container}>
      {/* Header, Search, Sort */}
      <Text style={styles.remedicardio}>{t("title")}</Text>

      <View style={styles.searchComponent}>
        <SearchIcon />
        <TextInput
          style={[styles.searchText, styles.searchPosition]}
          placeholder={t("search")}
          placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
        />
      </View>

      <DropDown
        options={sortOptions}
        placeholder={t("select_sort_option")}
        onSelect={(value) => setSelectedSort(value)}
      />

      {/* Decks List */}
      {showLoading ? (
        <ListLoader count={6} width={width} />
      ) : (
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
                <Text style={styles.deckTitle}>{item.name}</Text>
                {item.lastDeckStat && (
                  <Text style={styles.deckInfoText}>
                    {t("last_accessed")}{" "}
                    {formatDate(item.lastDeckStat.accessDate)}
                  </Text>
                )}

                <Text style={styles.deckInfoText}>
                  {item.flashcardCount} {t("cards")}
                </Text>
                {item.lastDeckStat && (
                  <Text style={styles.deckInfoText}>
                    {t("best")}
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 1,
                    }).format(item.bestDeckStat.successRate)}
                    % {t("last")}
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 1,
                    }).format(item.lastDeckStat.successRate)}
                    %
                  </Text>
                )}

                <View style={[styles.chevronRightIcon, styles.iconLayout]}>
                  <ChevronRightIcon color="#111" />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {showLoading ? null : (
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setCreateModalVisible(true)}
        >
          <PlusIcon></PlusIcon>
          <Text style={styles.createNewDeck}>{t("create_new_deck")}</Text>
        </TouchableOpacity>
      )}

      <Modal
        transparent={true}
        visible={createModalVisible}
        animationType="slide"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t("create_deck")}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setCreateModalVisible(false);
                setManualCreateModalVisible(true);
              }}
            >
              <Text style={styles.modalButtonText}>{t("create_manually")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setCreateModalVisible(false);
                uploadGeneratePage();
              }}
            >
              <Text style={styles.modalButtonText}>{t("create_with_ai")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setCreateModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>{t("cancel")}</Text>
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
            <Text style={styles.modalTitle}> {t("delete_deck_message")} </Text>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#C8102E" }]}
              onPress={handleDeleteDeck}
            >
              <Text style={[styles.modalButtonText]}>{t("delete_deck")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setPopUpVisible(false)}
            >
              <Text style={styles.modalCancelText}>{t("cancel")}</Text>
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
              <Text style={styles.modalButtonText}>{t("review_deck")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleEditDeck}
            >
              <Text style={styles.modalButtonText}>{t("edit_deck")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleShareDeck}
            >
              <Text style={styles.modalButtonText}>Share Deck</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#C8102E" }]}
              onPress={() => setPopUpVisible(true)}
            >
              <Text style={[styles.modalButtonText]}>{t("delete_deck")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>{t("cancel")}</Text>
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
            <Text style={styles.modalTitle}>{t("new_deck_name")}</Text>
            <TextInput
              style={[
                styles.searchComponent,
                { width: "100%", marginBottom: 10 },
              ]}
              placeholder={t("enter_deck_title")}
              value={newDeckTitle}
              onChangeText={setNewDeckTitle}
            />

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleManualCreate}
            >
              <Text style={styles.modalButtonText}>{t("save_and_edit")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setManualCreateModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>{t("cancel")}</Text>
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
    bottom: "15%",
  },
  createNewDeck: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#fff",
    textAlign: "center",
  },
});
