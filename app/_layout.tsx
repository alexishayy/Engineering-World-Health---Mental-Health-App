import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ProfileAvatarProvider } from '../context/ProfileAvatarContext';

export default function RootLayout() {
  return (
    <ProfileAvatarProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ProfileAvatarProvider>
  );
}
