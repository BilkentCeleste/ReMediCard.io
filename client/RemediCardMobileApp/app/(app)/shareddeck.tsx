import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  BackHandler,
  Modal,
  Pressable,
} from "react-native";
import {
  useRouter,
  Link,
  useLocalSearchParams,
  useFocusEffect,
} from "expo-router";
import {
  GoBackIcon,
  HomeIcon,
  ProfileIcon,
  SettingsIcon,
} from "@/constants/icons";
import {
  addUserDeck,
  getDeckByDeckId,
  getDeckByShareToken,
} from "@/apiHelper/backendHelper";
import Flashcard from "../../components/FlashCard";
import { useTranslation } from "react-i18next";
import NotFound from "@/components/NotFound";
import Loading from "@/components/Loading";
import NavBar from "@/components/NavBar";

export default function SharedDeck() {
  const { t } = useTranslation("shared_deck");
  const router = useRouter();
  const { shareToken, id } = useLocalSearchParams();

  const [deck, setDeck] = useState();
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [shownItem, setShownItem] = useState(null);

  useEffect(() => {
    if (shareToken) {
      setLoading(true);
      getDeckByShareToken(shareToken)
        .then((res) => {
          setDeck(res?.data);
          setNotFound(false);
          setLoading(false);
        })
        .catch((error) => {
          setNotFound(true);
          setLoading(false);
        });
    }
  }, [shareToken]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getDeckByDeckId(id)
        .then((res) => {
          setDeck(res?.data);
          setNotFound(false);
          setLoading(false);
        })
        .catch((error) => {
          setNotFound(true);
          setLoading(false);
        });
    }
  }, [id]);

  useFocusEffect(() => {
    const onBackPress = () => {
      router.replace(
        id ? `/(app)/discover?type=deck&id=${id}` : "/(app)/decks"
      );
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  });

    const handleAddToMyDecks = () => {
        if (deck?.id) {
            addUserDeck(deck.id)
                .then(() => {
                    router.push('/(app)/decks');
                })
                .catch((error: Error) => {
                    Alert.alert(t('error'), t('add_deck_failed'));
                });
        }
    };

  if (notFound) {
    return <NotFound title={t("not_found_title")} message={t("not_found")} />;
  }

  if (loading) {
    return <Loading message={t("loading_deck")} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.menuComponent}>
        <View style={[styles.menuIcon, styles.iconLayout]}>
          <Link
            href={id ? `/(app)/discover?type=deck&id=${id}` : "/(app)/decks"}
          >
            <GoBackIcon width={100} height={100} />
          </Link>
        </View>

        <View style={styles.textComponent}>
          <Text style={styles.menuText} numberOfLines={2} ellipsizeMode="tail">
            {deck?.name}
          </Text>
        </View>

        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
        </View>
      </View>

      <FlatList
        style={styles.flatListContainer}
        contentContainerStyle={styles.flatListContent}
        data={deck?.flashcardSet || []}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 10,
        }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.flashcardComponent}>
            <Flashcard
              question={item?.frontSide?.text || ""}
              answer={item?.backSide?.text || ""}
              width={110}
              height={80}
              textSize={8}
              longPressHandler={() => {
                setModalVisible(true);
                setShownItem(item);
              }}
            />
          </View>
        )}
      />

      {shownItem && (
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable
            onPress={() => setModalVisible(false)}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContainer}>
              <Flashcard
                question={shownItem?.frontSide?.text || ""}
                answer={shownItem?.backSide?.text || ""}
                width={300}
                height={500}
                textSize={20}
              />
            </View>
          </Pressable>
        </Modal>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddToMyDecks}>
          <Text style={styles.buttonText}>{t("add_to_my_decks")}</Text>
        </TouchableOpacity>
      </View>

      <NavBar/>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#53789D',
    },
    title: {
        top: 60,
        fontSize: 30,
        lineHeight: 32,
        fontFamily: 'InriaSans-Regular',
        color: '#fff',
        textAlign: 'center',
        width: '100%',
        height: 27,
        marginBottom: 25,
        fontWeight: 'bold',
    },
    flashcardComponent: {
        borderRadius: 20,
        backgroundColor: '#fff',
        width: '49%',
        minHeight: 80,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 15,
        marginVertical: 5,
    },
    flatListContainer: {
        width: '75%',
        height: '80%',
        marginTop: 5,
        marginBottom: 5,
    },
    flatListContent: {
        alignItems: 'stretch',
        paddingBottom: 20,
        justifyContent: 'space-evenly',
    },
    buttonText: {
        fontSize: 14,
        fontFamily: "Inter-Regular",
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
    menuComponent: {
        width: "75%",
        minHeight: 20,
        padding: 10,
        gap: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
    },
    textComponent: {
        width: "75%",
        alignItems: "center",
    },
    menuText: {
        fontSize: 20,
        lineHeight: 22,
        fontFamily: "Inter-Regular",
        color: "#fff",
        textAlign: "left",
        zIndex: 1,
        top: 5,
        position: "relative",
    },
    iconLayout: {
        height: 24,
        width: 24,
        position: "absolute"
    },
    menuIcon: {
        right: "95%",
        zIndex: 3,
        top: 5
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        marginTop: 15,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 100,
        gap: 10,
        width: 200,
        alignSelf: 'center',
    },
    button: {
        borderRadius: 20,
        backgroundColor: "#2916ff",
        width: "75%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        height: 50,
        bottom: "15%",
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
});
