import { useAuth } from "@/src/auth/useAuth";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { PetsProvider } from "../context/PetsContext";
import { ProfileAvatarProvider } from "../context/ProfileAvatarContext";
import { SettingsProvider } from "../context/SettingsContext";
import { StreakProvider } from "../context/StreakContext";
 
function AuthGuard() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
 
  useEffect(() => {
    if (loading) return;
 
    const inTabsGroup = segments[0] === "(tabs)";
 
    if (!user && inTabsGroup) {
      router.replace("/login");
    } else if (user && segments[0] === "login") {
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);
 
  return null;
}
 
export default function RootLayout() {
  return (
    <ProfileAvatarProvider>
      <SettingsProvider>
        <PetsProvider>
          <StreakProvider>
            <AuthGuard />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="login" />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            </Stack>
            <StatusBar style="auto" />
          </StreakProvider>
        </PetsProvider>
      </SettingsProvider>
    </ProfileAvatarProvider>
  );
}
 
