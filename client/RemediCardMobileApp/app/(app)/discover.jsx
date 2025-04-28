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
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ChevronRightIcon,
  SearchIcon,
  ChevronDown,
  LikeIcon,
  DislikeIcon
} from "@/constants/icons";
import DropDown from "../../components/DropDown";
import {
  decksOthersSearch,
  quizzesOthersSearch,
  discoverDecks,
  discoverQuizzes,
  likeDeck,
  dislikeDeck,
  likeQuiz,
  dislikeQuiz
} from "@/apiHelper/backendHelper";
import { useTranslation } from "react-i18next";
import ListLoader from "../../components/ListLoader";
import NavBar from "@/components/NavBar"

const { width } = Dimensions.get("window");

export default function Discover() {
  const { t } = useTranslation("discover");
  const router = useRouter();
  const {id, type} = useLocalSearchParams()

  const [sortOrder, setSortOrder] = useState("desc");
  const [list, setList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [isRotated, setIsRotated] = useState(false);
  const rotation = useState(new Animated.Value(0))[0];
  const [sortingOption, setSortingOption] = useState("NONE")
  const [listType, setListType] = useState(type ? type : "deck")
  const [updated, setUpdated] = useState(false)

  const isFirstRender = useRef(true);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    setShowLoading(true)

    if(listType === "deck"){
      discoverDecks(sortingOption)
      .then((res) => {
        setList(res.data);
        setShowLoading(false);
        if(isFirstLoad.current && id){
          isFirstLoad.current = false
          const item = res.data.find(item => item.id === id)
          setSelectedItem(item)
          setModalVisible(!!item)
        }
      })
      .catch((error) => {
        setShowLoading(false);
      });
    }
    else{
      discoverQuizzes(sortingOption)
      .then((res) => {
        setList(res.data);
        setShowLoading(false);
        if(isFirstLoad.current && id){
          isFirstLoad.current = false
          const item = res.data.find(item => item.id === id)
          setSelectedItem(item)
          setModalVisible(!!item)
        }
      })
      .catch((error) => {
        setShowLoading(false);
      });
    }
    
  }, [listType, updated, sortingOption]);

  useEffect(() => {
        if (debouncedSearchText.trim() !== "") {
          setShowLoading(true);
          if(listType === "deck"){
            handleSearchDecks()
          }
          else{
            handleSearchQuizzes()
          }
        }
        else{
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

  const handleSearchDecks = () => {
    decksOthersSearch(debouncedSearchText)
            .then((res) => {
              setShowLoading(false);
              setList(res.data);
            })
            .catch((e) => {
              setShowLoading(false);
            });
  }

  const handleSearchQuizzes = () => {
    quizzesOthersSearch(debouncedSearchText)
            .then((res) => {
              setShowLoading(false);
              setList(res.data);
            })
            .catch((e) => {
              console.log(e);
              setShowLoading(false);
            });
  }

  const handleLikeDeck = () => {
    likeDeck(selectedItem.id).then(res => {
      list[list.findIndex(item => item.id === selectedItem.id)] = res.data
      setSelectedItem(res.data)
    })
    .catch(e => console.log(e))
  }

  const handleDislikeDeck = () => {
    dislikeDeck(selectedItem.id).then(res => {
      list[list.findIndex(item => item.id === selectedItem.id)] = res.data
      setSelectedItem(res.data)
    })
    .catch(e => console.log(e))
  }

  const handleLikeQuiz = () => {
    likeQuiz(selectedItem.id).then(res => {
      list[list.findIndex(item => item.id === selectedItem.id)] = res.data
      setSelectedItem(res.data)
    })
    .catch(e => console.log(e))
  }

  const handleDislikeQuiz = () => {
    dislikeQuiz(selectedItem.id).then(res => {
      list[list.findIndex(item => item.id === selectedItem.id)] = res.data
      setSelectedItem(res.data)
    })
    .catch(e => console.log(e))
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
    { label: t("sort_by_like_count"), value: "LIKE_COUNT" },
    { label: t("sort_by_date"), value: "PUBLICATION_DATE" },
  ];

  const sortedList = sortList(list, sortingOption, sortOrder);

  function sortList(list, sortBy = 'access', order = 'desc') {
    return list.slice().sort((a, b) => {
      const getRate = stat => stat ? stat.successRate : -1;

      let compare = 0;

      if (sortBy === "LIKE_COUNT") {
        const aRate = getRate(a.likeCount);
        const bRate = getRate(b.likeCount);
        compare = aRate - bRate;
      } else if (sortBy === "PUBLICATION_DATE") {
        const aRate = getRate(a.createdDate);
        const bRate = getRate(b.createdDate);
        compare = aRate - bRate;
      }

      return order === 'asc' ? compare : -compare;
    });
  }

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleView = () => {
    if (listType === "deck") {
      if(selectedItem.flashcardCount === 0){
         Alert.alert(t("no_cards_available"), 
         t("no_cards_available_message"), 
         [{text: t("ok"), style: "cancel"}], { cancelable: false }
        );
        return
      }
      
      router.push({
        pathname: "/(app)/shareddeck",
        params: { id: selectedItem.id },
      });
    } else {
      if(selectedItem.questionCount === 0){
        Alert.alert(t("no_questions_available"), 
        t("no_questions_available_message"), 
        [{text: t("ok"), style: "cancel"}], { cancelable: false }
       );
       return
     }
     
     router.push({
      pathname: "/(app)/sharedquiz",
      params: { id: selectedItem.id },
     });
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
        onSelect={(value) => setSortingOption(value)}
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
          data={sortedList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.deckComponent}
              onPress={() => handleItemPress(item)}
            >
              <View>
                <Text style={styles.deckTitle} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
                {item.lastDeckStat && (
                  <Text style={styles.deckInfoText}>
                    {t("create_time")}{" "}
                    22.07.2002
                  </Text>
                )}

                <Text style={styles.deckInfoText}>
                {listType === "deck" ? `${item.flashcardCount} ${t("cards")}` : `${item.questionCount} ${t("questions")}`}
                </Text>

                <Text style={styles.deckInfoText}>
                {item.likeCount} {t("likes")}
                </Text>

                <Text style={styles.deckInfoText}>
                {item.dislikeCount} {t("dislikes")}
                </Text>

                <Text style={styles.deckInfoText}>
                {formatDate(item.createdDate)}
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
            listType === "deck" && styles.activeButton,
          ]}
          onPress={() => {
            {
              setShowLoading(true)
              setSearchText("")
              setListType("deck")
            }
          }}
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

        <TouchableOpacity
          style={[
            styles.createButton,
            listType === "quiz" && styles.activeButton,
          ]}
          onPress={() => {
            setShowLoading(true)
            setSearchText("")
            setListType("quiz")
          }}
        >
          <Text
            style={[
              styles.createNewDeck,
              listType === "quiz" && styles.activeText,
            ]}
          >
            {t("quizzes")}
          </Text>
        </TouchableOpacity>
      </View>
      )}

      {selectedItem && <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleView}
            >
              <Text style={styles.modalButtonText}>{listType==="deck" ? t("view_deck") : t("view_quiz")}</Text>
            </TouchableOpacity>
            <View style={styles.likeContainer}>
              <TouchableOpacity style={styles.modalButton2} onPress={listType === "deck" ? handleLikeDeck : handleLikeQuiz}>
                  <LikeIcon 
                    fill={selectedItem.isLiked ? "#fff" : "none"} 
                    strokeWidth={selectedItem.isLiked ? 0.5 : 2} 
                  />
                {/* {selectedItem.isLiked && <Text> Liked </Text>} */}
                <Text style={styles.modalButtonText}>{t("like")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton2} onPress={listType === "deck"? handleDislikeDeck : handleDislikeQuiz}>
                  <DislikeIcon 
                    fill={selectedItem.isDisliked ? "#fff" : "none"} 
                    strokeWidth={selectedItem.isDisliked ? 0.5 : 2} 
                  />
                {/* {selectedItem.isDisliked && <Text> Disliked </Text>} */}
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
      </Modal>}

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
    alignSelf: "center",
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
    borderBottomWidth: 2,
    borderColor: "#fff",
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
