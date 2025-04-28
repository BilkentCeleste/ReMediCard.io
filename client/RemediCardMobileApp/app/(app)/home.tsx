import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import {
  SearchIcon,
  FlashcardIcon,
  QuizIcon,
  GoalsIcon,
  DiscoverIcon
} from "@/constants/icons";
import { useTranslation } from "react-i18next";
import { generalSearch, getRandomStudyGoal, getRandomDeckStats, getRandomQuizStats } from "@/apiHelper/backendHelper";
import ListLoader from "@/components/ListLoader";
import NavBar from "@/components/NavBar";
import AppTitle from "@/components/AppTitle";
import i18next from "i18next";

const { width } = Dimensions.get("window");

export default function Home() {
  const { t } = useTranslation("home");

  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [selectedRandomData, setSelectedRandomData] = useState(null);
  const [selectedType, setSelectedType] = useState(null); // "goal" | "deck" | "quiz" | "none"

  useEffect(() => {
    Promise.all([
      getRandomStudyGoal(),
      getRandomDeckStats(),
      getRandomQuizStats()
    ])
      .then(([goalRes, deckRes, quizRes]) => {
        const options = [];

        if (goalRes?.data) {
          options.push({ type: "goal", data: goalRes.data });
        }
        if (deckRes?.data) {
          options.push({ type: "deck", data: deckRes.data });
        }
        if (quizRes?.data) {
          options.push({ type: "quiz", data: quizRes.data });
        }

        if (options.length > 0) {
          const randomOption = options[Math.floor(Math.random() * options.length)];
          setSelectedRandomData(randomOption.data);
          setSelectedType(randomOption.type);
        } else {
          setSelectedType("none"); // All are empty
        }
      })
      .catch((e) => {
        console.error(e);
        setSelectedType("none");
      });
  }, []);

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
    router.push("/(app)/goal_list");
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

  function formatLocalDateTime(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (isNaN(date)) {
      console.error("Invalid date:", dateString);
      return "";
    }

    const localeLanguage = i18next.language;
    let language = "en-GB"; // Default to English (UK)
    if( localeLanguage === "tr"){
      language ="tr-TR";
    }

    return date.toLocaleDateString(language, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <View style={styles.container}>

      <AppTitle/>

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
          {selectedType === null? (
            <ActivityIndicator size={"large"} style={styles.indicator} />
          ) : selectedType === "none" ? (
            <View style={styles.reminderComponent}>
              <Text
                style={[styles.reminderHeaderPlacement, styles.reminderHeader]}
              >
                {t("welcome")}
              </Text>
              <Text style={[styles.reminderTextPlacement, styles.reminderText]}>
                {t("welcome_message")}
              </Text>
            </View>
          ) : selectedType === "goal" ? (
            <View style={styles.reminderComponent}>
              <Text
                style={[styles.reminderHeaderPlacement, styles.reminderHeader]}
              >
                {t("goal_heading", { deckOrQuizName: selectedRandomData.deckOrQuizName })}
              </Text>
              <Text style={[styles.reminderTextPlacement, styles.reminderText]}>
                {t("goal_message", { deckOrQuizName: selectedRandomData.deckOrQuizName, endDate: formatLocalDateTime(selectedRandomData.endDate) })}
              </Text>
            </View>
          ) : selectedType === "deck" ? (
            <View style={styles.reminderComponent}>
              <Text
                style={[styles.reminderHeaderPlacement, styles.reminderHeader]}
              >
                {t("deck_heading", { deckName: selectedRandomData.deckName })}
              </Text>
              <Text style={[styles.reminderTextPlacement, styles.reminderText]}>
                {t("deck_message", { deckName: selectedRandomData.deckName, accessDate: formatLocalDateTime(selectedRandomData.accessDate) })}
              </Text>
            </View>
          ) : selectedType === "quiz" ? (
            <View style={styles.reminderComponent}>
              <Text
                style={[styles.reminderHeaderPlacement, styles.reminderHeader]}
              >
                {t("quiz_heading", { quizName: selectedRandomData.quizName })}
              </Text>
              <Text style={[styles.reminderTextPlacement, styles.reminderText]}>
                {t("quiz_message", { quizName: selectedRandomData.quizName, accessDate: formatLocalDateTime(selectedRandomData.accessDate) })}
              </Text>
            </View>
          ) : null
          }

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
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderColor: "white",
    backgroundColor: "#3A5BA0",
    alignItems: "center",
  },
  resultItemText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 5,
  },
  resultItemClickText: {
    fontSize: 12,
    color: "white",
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
  indicator: {
    transform: [{ scale: 1.8 }],
    margin: 20,
    color: "#ffffff",
  },
});
