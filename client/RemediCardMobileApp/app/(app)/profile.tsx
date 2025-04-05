import React from "react";
import { Redirect } from "expo-router";

export default function Profile() {
  // Redirect to the tabs profile page
  return <Redirect href="/(app)/(tabs)/profile" />;
}
