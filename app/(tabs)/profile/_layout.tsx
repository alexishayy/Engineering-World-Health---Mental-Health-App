import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="account"
        options={{ title: "Account" }}
      />
      <Stack.Screen
        name="preferences"
        options={{ title: "Preferences" }}
      />
      <Stack.Screen
        name="stats"
        options={{ title: "Stats" }}
      />
    </Stack>
  );
}