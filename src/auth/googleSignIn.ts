import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../firebase/firebaseConfig";

// This line ensures Expo can handle OAuth redirects correctly
WebBrowser.maybeCompleteAuthSession();

// Custom hook to use Google Sign-In
export function useGoogleSignIn() {
  // Setup Google OAuth request
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID, // Expo Go
    iosClientId: "", // Optional: if you build standalone iOS app
    androidClientId: "", // Optional: if you build standalone Android app
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID, // Required for Firebase
    scopes: ["openid", "profile", "email"],
  });

  // Listen for Google auth response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      // Create Firebase credential from Google ID token
      const credential = GoogleAuthProvider.credential(id_token);

      // Sign in to Firebase with the credential
      signInWithCredential(auth, credential);
    }
  }, [response]);

  // Return promptAsync so UI can trigger login
  return { promptAsync, request };
}
