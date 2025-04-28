import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
      <Stack screenOptions={{animation: 'fade', animationDuration: 100}}>
          <Stack.Screen name="editprofile" options={{ headerShown: false }} />
          <Stack.Screen name="contactus" options={{ headerShown: false }} />
          <Stack.Screen name="delete_account" options={{ headerShown: false }} />
      </Stack>
  );
}
