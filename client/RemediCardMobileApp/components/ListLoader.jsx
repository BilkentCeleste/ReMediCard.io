import React from "react";
import { View, StyleSheet } from "react-native";
import ListItemLoader from "./ListItemLoader";

const ListLoader = ({ count = 5, width }) => (
  <View style={styles.flatListContainer}>
    {Array.from({ length: count }).map((_, index) => (
      <ListItemLoader key={index} width={width} />
    ))}
  </View>
);

export default ListLoader;

styles = StyleSheet.create({
  flatListContainer: {
    width: "100%", // Adjust the width to be larger
    height: "63%", // Shorten the height
    marginTop: 5, // Lower its starting position
    backgroundColor: "transparent", // Optional, keeps it aligned with the background
    marginBottom: 120,
  },
});
