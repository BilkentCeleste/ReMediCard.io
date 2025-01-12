import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useRouter, Link } from "expo-router";
import {
  SearchIcon,
  HomeIcon,
  ProfileIcon,
  SettingsIcon,
  ChevronRightIcon,
  PlusIcon
} from "../../constants/icons"; // Adjust to your icon imports
import DropDown from "../../components/DropDown"; // Same custom DropDown component used in deck.tsx

interface Goal {
  title: string;
  duration: string;
  repetition: string;
  startDate: string;
  endDate: string;
  goalPercent: number;
}

export default function GoalList() {
  const router = useRouter();

  // Sorting options (mirroring what you do in decks)
  const sortOptions = [
    { label: "Sort by Longest", value: "longest" },
    { label: "Sort by Shortest", value: "shortest" },
    { label: "Sort by Highest Goal %", value: "highestGoal" },
    { label: "Sort by Lowest Goal %", value: "lowestGoal" },
  ];

  const [selectedSort, setSelectedSort] = useState<string>("longest");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Sample goal data
  const goals: Goal[] = [
    {
      title: "Goal 1 for Deck 1",
      duration: "1 Month(s)",
      repetition: "2 Day(s)",
      startDate: "01.07.2025",
      endDate: "01.08.2025",
      goalPercent: 80,
    },
    {
      title: "Goal 2 for Deck 2",
      duration: "1 Week(s)",
      repetition: "1 Day(s)",
      startDate: "01.07.2025",
      endDate: "07.07.2025",
      goalPercent: 90,
    },
  ];

  // Filter and sort the goals based on user input
  const filteredGoals = goals.filter((goal) =>
    goal.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Example: you could apply sorting logic here if needed
  const sortedGoals = filteredGoals; // Currently just returning as-is

  return (
    <View style={styles.container}>
      <Text style={styles.remedicardio}>ReMediCard.io</Text>

      {/* Search Bar */}
      <View style={styles.searchComponent}>
        <SearchIcon />
        <TextInput
          style={[styles.searchText, styles.searchPosition]}
          placeholder="search anything"
          placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>

      {/* Sort Dropdown */}
      <DropDown
        options={sortOptions}
        placeholder="Select sort option"
        onSelect={(value) => setSelectedSort(value)}
        // optional: default selected could be set here
      />

      {/* FlatList of goals */}
      <FlatList
        style={styles.flatListContainer}
        contentContainerStyle={styles.flatListContent}
        data={sortedGoals}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.goalComponent}>
            {/* If you want to link to a goal details page, adjust the href below */}
            <View style={styles.link}>
              <View>
                <Text style={styles.goalTitle}>{item.title}</Text>
                <Text style={styles.goalInfoText}>
                  Duration: {item.duration}
                </Text>
                <Text style={styles.goalInfoText}>
                  Repetition: {item.repetition}
                </Text>
                <Text style={styles.goalInfoText}>
                  From: {item.startDate} - {item.endDate}
                </Text>
                <Text style={styles.goalInfoText}>
                  Goal: {item.goalPercent}%
                </Text>
                {/* Chevron icon on the right */}
                <View style={[styles.chevronRightIcon, styles.iconLayout]}>
                  <ChevronRightIcon color="#111" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* "Create New Study Goal" button */}
      <TouchableOpacity style={styles.createButton} onPress={() => {
          router.push("/(app)/create_goal");
        }}>
          <PlusIcon></PlusIcon>
          <Text style={styles.createNewDeck}>Create New Goal</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={styles.createGoalButton}
        onPress={() => {
          // Navigate to create goal page or handle logic
          router.push("(app)/create_goal");
        }}
      >
        <Text style={styles.createGoalButtonText}>+ Create New Study Goal</Text>
      </TouchableOpacity> */}

      {/* Bottom Nav Bar */}
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

      {/* White separator line behind the nav icons */}
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
    fontFamily: "InriaSans-Regular", // match your deck.tsx
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
  goalComponent: {
    borderRadius: 20,
    backgroundColor: "#fff",
    width: "100%",
    height: 120,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 15,
    marginVertical: 5,
  },
  goalTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 8,
  },
  goalInfoText: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.7)",
    marginBottom: 2, // Tweak spacing
  },
  iconLayout: {
    height: 24,
    width: 24,
    position: "absolute",
  },
  chevronRightIcon: {
    left: "90%",
    zIndex: 3,
    top: "85%",
  },
  link: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
  },
  createGoalButton: {
    position: "absolute",
    bottom: 100,
    backgroundColor: "#1E40AF", // e.g. a dark-blue color
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  createGoalButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
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
  createButton: {
    borderRadius: 20,
    backgroundColor: "#2916ff",
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
    height: 50,
    bottom: "12%"
  },
createNewDeck: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: "Inter-Regular",
    color: "#fff",
    textAlign: "center",
},
});