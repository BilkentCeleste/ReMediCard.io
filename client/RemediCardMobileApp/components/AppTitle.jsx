import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";

export default function AppTitle() {
  return (
    <View style={styles.titleContainer}>
      <Image
        style={styles.titleIcon}
        source={require("@/assets/icons/remedismallicon.png")}
      />
      <Text style={styles.remedicardio}>ReMediCard.io</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  titleIcon: {
    height: 27,
    width: 27,
  },
  remedicardio: {
    fontSize: 30,
    lineHeight: 32,
    fontFamily: "InriaSans-Regular",
    color: "#fff",
    textAlign: "center",
    height: 27,
    marginTop: 0,
    fontWeight: "bold",
  },
});
