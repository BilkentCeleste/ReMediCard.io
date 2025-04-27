import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
  }, [isLoggedIn]);

  if (!isLoggedIn) {
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
      <Stack.Screen name="generatequizzes" options={{ headerShown: false }} />
      <Stack.Screen name="deckResults" options={{ headerShown: false }} />
      <Stack.Screen name="quizzes" options={{ headerShown: false }} />
      <Stack.Screen name="quiz_question" options={{ headerShown: false }} />
      <Stack.Screen name="quizresults" options={{ headerShown: false }} />
      <Stack.Screen name="study_dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="goal_list" options={{ headerShown: false }} />
      <Stack.Screen name="create_goal" options={{ headerShown: false }} />
      <Stack.Screen name="updatedeck" options={{ headerShown: false }} />
      <Stack.Screen name="updateflashcard" options={{ headerShown: false }} />
      <Stack.Screen name="shareddeck" options={{ headerShown: false }} />
      <Stack.Screen name="sharedquiz" options={{ headerShown: false }} />
      <Stack.Screen name="discover" options={{ headerShown: false }} />
      <Stack.Screen name="editquiz" options={{ headerShown: false }} />
      <Stack.Screen name="updatequizquestion" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
    </Stack>
  );
}
