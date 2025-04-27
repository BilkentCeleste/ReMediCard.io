import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { useRouter, Link } from "expo-router";
import {
  SearchIcon,
  FlashcardIcon,
  QuizIcon,
  GoalsIcon,
  HomeIcon,
  ProfileIcon,
  SettingsIcon,
  DiscoverIcon
} from "@/constants/icons";
import { useTranslation } from "react-i18next";
import { generalSearch } from "@/apiHelper/backendHelper";
import ListLoader from "@/components/ListLoader";
import NavBar from "@/components/NavBar";

const { width } = Dimensions.get("window");

export default function Home() {
  const { t } = useTranslation("home");

  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (debouncedSearchText.trim() !== "") {
      setShowLoading(true)
      generalSearch(debouncedSearchText)
        .then((res) => {
          setShowLoading(false)
          setSearchResult(res.data);
        })
        .catch((e) => {
            setShowLoading(false)
          });
    } else {
      setSearchResult(null);
    }
  }, [debouncedSearchText]);

  const cleanSearch = () => {
    setSearchText("");
    setDebouncedSearchText("");
    setSearchResult(null);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 700);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const router = useRouter();

  const uploadDecksPage = () => {
    router.push("/(app)/decks");
  };

  const uploadQuizzesPage = () => {
    router.push("/(app)/quizzes");
  };

  const uploadStudyDashboardPage = () => {
    router.push("/(app)/study_dashboard");
  };

  const uploadDiscoverPage = () => {
    router.push("/(app)/discover");
  };

  const handleQuizResultSelection = (id) => {
    cleanSearch();
    router.push(`/(app)/quizzes?quiz_selected=${id}`);
  };

  const handleDeckResultSelection = (id) => {
    cleanSearch();
    router.push(`/(app)/decks?deck_selected=${id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.remedicardio}>ReMediCard.io</Text>
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
            onPress={() => setSearchText("")}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {searchText.trim() !== "" ? (
        <>

        {showLoading && <ListLoader count={4} width={width} height={"40%"}/> }

          {searchResult && searchResult.quizzes.length > 0 && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>{t("quizzes")}</Text>
              <FlatList
                data={searchResult.quizzes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => handleQuizResultSelection(item.id)}
                    >
                      <View style={styles.resultItem}>
                        <Text style={styles.resultItemText}>{item.name}</Text>
                        <Text style={styles.resultItemClickText}>
                          {t("click_to_view_quiz")}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                scrollEnabled={true}
              />
            </View>
          )}

          {searchResult && searchResult.decks.length > 0 && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>{t("decks")}</Text>
              <FlatList
                data={searchResult.decks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => handleDeckResultSelection(item.id)}
                    >
                      <View style={styles.resultItem}>
                        <Text style={styles.resultItemText}>{item.name}</Text>
                        <Text style={styles.resultItemClickText}>
                          {t("click_to_view_deck")}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                scrollEnabled={true}
              />
            </View>
          )}

          {!showLoading && (!searchResult ||
            (searchResult.decks.length == 0 &&
              searchResult.quizzes.length === 0) && (
                <Text style={styles.resultTitle}>{t("no_results_found")}</Text>
              ))}
        </>
      ) : (
        <>
          <View style={styles.reminderComponent}>
            <Text
              style={[styles.reminderHeaderPlacement, styles.reminderHeader]}
            >
              What about exercising about cardiovascular system ? (dummy)
            </Text>
            <Text style={[styles.reminderTextPlacement, styles.reminderText]}>
              Last time you exercised about cardiovascular system was 5 days ago
              (dummy)
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.mainComponent}
                onPress={uploadDecksPage}
              >
                <FlashcardIcon></FlashcardIcon>
                <Text style={[styles.mainComponentText]}>{t("decks")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mainComponent}
                onPress={uploadQuizzesPage}
              >
                <QuizIcon></QuizIcon>
                <Text style={[styles.mainComponentText]}>{t("quizzes")}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.mainComponent}
                onPress={uploadStudyDashboardPage}
              >
                <GoalsIcon></GoalsIcon>
                <Text style={styles.mainComponentText}>{t("study_goals")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mainComponent}
                onPress={uploadDiscoverPage}
              >
                <DiscoverIcon></DiscoverIcon>
                <Text style={[styles.mainComponentText]}>{t("discover")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

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
    fontSize: 30,
    lineHeight: 32,
    fontFamily: "InriaSans-Regular",
    color: "#fff",
    textAlign: "center",
    width: "100%",
    height: 27,
    marginTop: 0,
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
    marginTop: 40,
    marginBottom: 20,
    position: "relative"
  },
  searchText: {
    left: "25%",
    width: "100%",
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#111",
    textAlign: "left",
    zIndex: 0,
  },
  searchPosition: {
    marginTop: 20,
    position: "absolute",
  },
  reminderComponent: {
    borderRadius: 20,
    backgroundColor: "#2916ff",
    height: "18%",
    width: "75%",
    gap: 10,
  },
  reminderHeader: {
    textAlign: "left",
    color: "#fff",
    fontFamily: "Inter-Regular",
    height: "50%",
    left: 12,
    marginBottom: 30,
    fontWeight: "bold",
  },
  reminderText: {
    textAlign: "left",
    color: "#fff",
    fontFamily: "Inter-Regular",
    height: "50%",
    left: 12,
  },
  reminderHeaderPlacement: {
    top: 10,
    fontSize: 18,
    position: "absolute",
    width: "90%",
    height: "50%",
  },
  reminderTextPlacement: {
    top: 70,
    fontSize: 12,
    width: "90%",
    height: "50%",
  },
  buttonContainer: {
    width: "75%",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom: 10,
  },
  mainComponent: {
    borderRadius: 20,
    backgroundColor: "#fff",
    width: "45%",
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  mainComponentText: {
    position: "absolute",
    bottom: 5,
    fontSize: 15,
    fontFamily: "Inter-Regular",
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 5,
  },
  resultContainer: {
    backgroundColor: "#2916ff",
    width: "75%",
    display: "flex",
    borderRadius: 10,
    marginBottom: 10,
    gap: 10,
  },
  resultTitle: {
    textAlign: "center",
    width: "100%",
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  resultItem: {
    borderWidth: 4,
    height: 40,
    borderRadius: 10,
    marginBottom: 5,
    borderColor: "white",
  },
  resultItemText: {
    textAlign: "center",
    color: "white",
  },
  resultItemClickText: {
    textAlign: "center",
    color: "gray",
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
