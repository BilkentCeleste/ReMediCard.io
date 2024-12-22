import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "../../contexts/AuthContext";
import { Redirect } from "expo-router";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    console.log("Logged", isLoggedIn);
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    console.log(isLoggedIn);
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(profile)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="decks" options={{ headerShown: false }} />
      <Stack.Screen name="card" options={{ headerShown: false }} />
      <Stack.Screen name="generatedecks" options={{ headerShown: false }} />
      <Stack.Screen name="editdecklist" options={{ headerShown: false }} />
      <Stack.Screen name="deckResults" options={{ headerShown: false }} />
    </Stack>
  );
}
