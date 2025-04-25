import React, { useState, useEffect, useRef } from "react";
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
  Animated,
  Easing,
  Share,
} from "react-native";
import { useRouter, Link, useLocalSearchParams } from "expo-router";
import {
  ChevronRightIcon,
  HomeIcon,
  ProfileIcon,
  SettingsIcon,
  SearchIcon,
  PlusIcon,
  ChevronDown,
  LikeIcon,
  DislikeIcon
} from "@/constants/icons";
import DropDown from "../../components/DropDown";
import {
  getDecksByCurrentUser,
  deleteDeck,
  createDeck,
  generateDeckShareToken,
  decksSearch,
  changeDeckVisibility,
} from "@/apiHelper/backendHelper";
import { useTranslation } from "react-i18next";
import ListLoader from "../../components/ListLoader";

const { width } = Dimensions.get("window");

export default function Discover() {
  const { t } = useTranslation("discover");
  
  const router = useRouter();

  const [selectedSort, setSelectedSort] = useState("access");
  const [sortOrder, setSortOrder] = useState("desc");
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [visibilityPopUpVisible, setVisibilityPopUpVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [manualCreateModalVisible, setManualCreateModalVisible] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [showLoading, setShowLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [isRotated, setIsRotated] = useState(false);
  const rotation = useState(new Animated.Value(0))[0];

  const [listType, setListType] = useState("deck")

  const isFirstRender = useRef(true);

  useEffect(() => {
    getDecksByCurrentUser()
      .then((decks) => {
        setDecks(decks?.data);
        setShowLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setShowLoading(false);
      });
  }, [updated]);

  useEffect(() => {
        if (debouncedSearchText.trim() !== "") {
          setShowLoading(true);
          decksSearch(debouncedSearchText)
            .then((res) => {
              setShowLoading(false);
              setDecks(res.data);
            })
            .catch((e) => {
              console.log(e)
              setShowLoading(false);
            });
        } else {
          if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
          }
          setUpdated(!updated);
        }
      }, [debouncedSearchText]);
    
  useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedSearchText(searchText);
      }, 700);
  
      return () => {
        clearTimeout(handler);
      };
    }, [searchText]);

  const cleanSearch = () => {
    setSearchText("");
    setDebouncedSearchText("");
  };

  const handleChangeVisibility = () => {
    
    changeDeckVisibility(selectedDeck.id)
    .then(res => {
      selectedDeck.isPubliclyVisible = !selectedDeck.isPubliclyVisible
      setVisibilityPopUpVisible(false)
    })
    .catch
  }

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    Animated.timing(rotation, {
      toValue: isRotated ? 0 : 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    setIsRotated(!isRotated);
  }

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const iconStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const sortOptions = [
    { label: t("sort_by_access_date"), value: "access" },
    { label: t("sort_by_recent_performance"), value: "recent" },
    { label: t("sort_by_best_performance"), value: "best" },
    { label: t("sort_by_alphabetical"), value: "alphabetical" },
  ];

  const sortedDecks = sortDecks(decks, selectedSort, sortOrder);

  function sortDecks(decks, sortBy = 'access', order = 'desc') {
    return decks.slice().sort((a, b) => {
      const getDate = stat => stat ? new Date(stat.accessDate) : new Date(0);
      const getRate = stat => stat ? stat.successRate : -1;

      let compare = 0;

      if (sortBy === 'access') {
        const aDate = getDate(a.lastDeckStat || a.bestDeckStat);
        const bDate = getDate(b.lastDeckStat || b.bestDeckStat);
        compare = aDate - bDate;
      } else if (sortBy === 'recent') {
        const aRate = getRate(a.lastDeckStat);
        const bRate = getRate(b.lastDeckStat);
        compare = aRate - bRate;
      } else if (sortBy === 'best') {
        const aRate = getRate(a.bestDeckStat);
        const bRate = getRate(b.bestDeckStat);
        compare = aRate - bRate;
      } else if (sortBy === 'alphabetical') {
        compare = a.name.localeCompare(b.name);
      }

      return order === 'asc' ? compare : -compare;
    });
  }

  const handleDeckPress = (deck) => {
    setSelectedDeck(deck);
    setModalVisible(true);
  };

  const handleStartDeck = () => {
    if (selectedDeck) {
      if(selectedDeck.flashcardCount === 0){
         Alert.alert(t("no_cards_available"), 
         t("no_cards_available_message"), 
         [{text: t("ok"), style: "cancel"}], { cancelable: false }
        );
        return
      }
      
      setModalVisible(false);
      router.push({
        pathname: "/(app)/card",
        params: { deck: JSON.stringify(selectedDeck) },
      });
    } else {
      Alert.alert(t("error"), t("deck_info_missing"));
    }
  };


  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
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
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={cleanSearch}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <DropDown
        options={sortOptions}
        placeholder={t("select_sort_option")}
        onSelect={(value) => setSelectedSort(value)}
        showChevron = {false}
      />

      <TouchableOpacity
          onPress={toggleSortOrder}
      >
        <Animated.View style={iconStyle}>
          <ChevronDown />
        </Animated.View>
      </TouchableOpacity>

      {/* Decks List */}
      {showLoading ? (
        <ListLoader count={6} width={width} />
      ) : (
        <FlatList
          style={styles.flatListContainer}
          contentContainerStyle={styles.flatListContent}
          data={sortedDecks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.deckComponent}
              onPress={() => handleDeckPress(item)}
            >
              <View>
                <Text style={styles.deckTitle} numberOfLines={3} ellipsizeMode="tail">{item.name}</Text>
                {item.lastDeckStat && (
                  <Text style={styles.deckInfoText}>
                    {t("create_time")}{" "}
                    22.07.2002
                  </Text>
                )}

                <Text style={styles.deckInfoText}>
                  {item.flashcardCount} {t("cards")}
                </Text>
                {item.lastDeckStat && (
                  <Text style={styles.deckInfoText}>
                    {t("like")}: 50 {" "}
                    {t("dislike")}: 15
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
        <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.createButton,
            listType === "quizzes" && styles.activeButton,
          ]}
          onPress={() => setListType("quizzes")}
        >
          <Text
            style={[
              styles.createNewDeck,
              listType === "quizzes" && styles.activeText,
            ]}
          >
            {t("quizzes")}
          </Text>
        </TouchableOpacity>
    
        <TouchableOpacity
          style={[
            styles.createButton,
            listType === "deck" && styles.activeButton,
          ]}
          onPress={() => setListType("deck")}
        >
          <Text
            style={[
              styles.createNewDeck,
              listType === "deck" && styles.activeText,
            ]}
          >
            {t("decks")}
          </Text>
        </TouchableOpacity>
      </View>
      )}

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
              onPress={handleStartDeck}
            >
              <Text style={styles.modalButtonText}>{t("review_deck")}</Text>
            </TouchableOpacity>
            <View style={styles.likeContainer}>
              <TouchableOpacity style={styles.modalButton2}>
                <LikeIcon />
                <Text style={styles.modalButtonText}>{t("like")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton2}>
                <DislikeIcon />
                <Text style={styles.modalButtonText}>{t("dislike")}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setModalVisible(false)}
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
    bottom: "4%",
    backgroundColor: "#53789D",
  },
  navbarContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "75%",
    position: "absolute",
    bottom: "4%",
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
  textComponent: {
    width: "75%",
    alignItems: "center",
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
    lineHeight: 12,
    color: "rgba(0, 0, 0, 0.7)",
    marginBottom: 4, // Spacing below title
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
    height: 135, // Increased height for sufficient spacing
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
  modalButton2: {
    backgroundColor: "#2916ff",
    padding: 10,
    borderRadius: 10,
    width: "48%",
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
  likeContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',  
    alignItems: 'center',  
    width: "100%"
  },
  createButton: {
    width: "40%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 50,
  },
  
  createNewDeck: {
    color: "white",
    fontWeight: "normal",
    fontSize: 18,
    alignSelf: "center", // Ensure the text stays centered within the button

  },
  activeText: {
    fontWeight: "bold",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "75%",
    bottom: "12%",
  },
  activeButton: {
    borderBottomWidth: 2,  // Underline effect on active state
    borderColor: "#fff", // Matching color for underline
  },
  clearButton: {
    paddingHorizontal: 6,
    position: "absolute",
    right: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: "#888",
  },
});
