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
  ChevronDown
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
import NavBar from "@/components/NavBar";

const { width } = Dimensions.get("window");

export default function Decks() {
  const { t } = useTranslation("decks");
  const { deck_selected } = useLocalSearchParams();
  const router = useRouter();
  const isFirstRender = useRef(true);

  const [searchParamUsed, setSearchParamUsed] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string>("access");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [decks, setDecks] = useState<any[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<any>(null);
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

  useEffect(() => {
    getDecksByCurrentUser()
      .then((decks) => {
        setDecks(decks?.data);
        setShowLoading(false);
        if (!searchParamUsed && deck_selected !== undefined) {
          setSearchParamUsed(true);
          const selected = decks?.data.find((deck: any) => deck.id == deck_selected);
          handleDeckPress(selected);
        }
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
    .catch(err => {
      Alert.alert(t("error"), t("change_visibility_failed"));
    });
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

  const handleDeckPress = (deck: any) => {
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
    deleteDeck(selectedDeck.id)
        .then((res) => {
          Alert.alert(t("success"), t("success_message"));
          setDecks(decks.filter((d) => d.id !== selectedDeck.id));
          setSelectedDeck(null);
          setPopUpVisible(false);
          setModalVisible(false);
        })
        .catch((err) => {
          console.error(err);
          Alert.alert(t("error"), t("deck_deletion_failed"));
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
        setUpdated((updated) => !updated);
        setDecks((prevDecks) => [...prevDecks, res.data]);
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
          const shareUrl = res?.data;
          Share.share({
            message: shareUrl,
            url: shareUrl,
            title: selectedDeck?.name,
          }, {
            dialogTitle: 'Share Deck',
            subject: selectedDeck?.name,
          })})
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
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <View style={styles.container}>
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
        visible={visibilityPopUpVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}> {t("change_public_visibility_message")}</Text>
            <Text style={styles.modalTitle}> {t("next_public_visibility")} {t(selectedDeck?.isPubliclyVisible ? "private" : "public")}</Text>
            <TouchableOpacity
              style={[styles.modalButton]}
              onPress={handleChangeVisibility}
            >
              <Text style={[styles.modalButtonText]}>{t("change_visibility")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setVisibilityPopUpVisible(false)}
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
              onPress={handleStartDeck}
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
              <Text style={styles.modalButtonText}>{t("share_deck")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton]}
              onPress={() => setVisibilityPopUpVisible(true)}
            >
              <Text style={[styles.modalButtonText]}>{t("change_public_visibility")}</Text>
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

      <NavBar/>
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
  deckInfoText: {
    fontSize: 12,
    lineHeight: 12,
    color: "rgba(0, 0, 0, 0.7)",
    marginBottom: 4,
  },
  deckTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 8,
  },
  deckComponent: {
    borderRadius: 20,
    backgroundColor: "#fff",
    width: "100%",
    height: 135,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 15,
    marginVertical: 5,
  },
  flatListContainer: {
    width: "75%",
    height: "35%",
    marginTop: 5,
    backgroundColor: "transparent",
    marginBottom: 120,
  },
  flatListContent: {
    alignItems: "stretch",
    paddingBottom: 20,
  },
  link: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
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
    bottom: "12%",
  },
  createNewDeck: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#fff",
    textAlign: "center",
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
