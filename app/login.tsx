import { logIn, signUp } from "@/src/auth/emailAuth";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");

  async function handleLogin() {
    try {
      await logIn(email, password);
      router.replace("/");
    } catch (err: any) {
      setError("Incorrect email or password. Please try again.");
    }
  }

  async function handleSignup() {
    try {
      await signUp(email, password);
      router.replace("/");
    } catch (err: any) {
      setError(cleanFirebaseError(err));
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Background mint */}
      <View style={styles.bg} />

      {/* Mascot */}
      <View style={styles.mascotWrapper}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.mascot}
          resizeMode="contain"
        />
        <Text style={styles.brandName}>tinywins</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        {/* Tab toggle */}
        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tab, mode === "login" && styles.tabActive]}
            onPress={() => {
              setMode("login");
              setError("");
            }}
          >
            <Text
              style={[styles.tabText, mode === "login" && styles.tabTextActive]}
            >
              Log In
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, mode === "signup" && styles.tabActive]}
            onPress={() => {
              setMode("signup");
              setError("");
            }}
          >
            <Text
              style={[
                styles.tabText,
                mode === "signup" && styles.tabTextActive,
              ]}
            >
              Sign Up
            </Text>
          </Pressable>
        </View>

        {/* Inputs */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="hello@example.com"
            placeholderTextColor="#b0ccc8"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#b0ccc8"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
            style={styles.input}
          />
        </View>

        {/* Primary button */}
        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && styles.primaryBtnPressed,
          ]}
          onPress={mode === "login" ? handleLogin : handleSignup}
        >
          <Text style={styles.primaryBtnText}>
            {mode === "login" ? "Log In →" : "Create Account →"}
          </Text>
        </Pressable>

        {/* Error message */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Switch mode */}
        <Pressable
          onPress={() => setMode(mode === "login" ? "signup" : "login")}
        >
          <Text style={styles.switchText}>
            {mode === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const cleanFirebaseError = (error: any) => {
  // Map specific Firebase error codes to friendly messages
  if (error.code === "auth/weak-password") {
    return "Password should be at least 6 characters";
  }
  if (error.code === "auth/email-already-in-use") {
    return "Email already in use";
  }

  // Generic cleanup: remove "Firebase: " prefix and error code in parentheses
  return (error.message || "")
    .replace(/^Firebase: /, "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();
};

const MINT = "#d6f0ed";
const DARK_MINT = "#4aab9e";
const BEAR_BROWN = "#3b2a28";
const GREEN_TEXT = "#5a9e8f";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: MINT,
  },
  mascotWrapper: {
    alignItems: "center",
    marginBottom: 28,
  },
  mascot: {
    width: 130,
    height: 130,
    marginBottom: 8,
  },
  brandName: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 28,
    fontWeight: "700",
    color: GREEN_TEXT,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 13,
    color: "#88bdb5",
    marginTop: 4,
    fontStyle: "italic",
  },
  card: {
    width: "88%",
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 28,
    shadowColor: BEAR_BROWN,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: MINT,
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 11,
  },
  tabActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#88bdb5",
  },
  tabTextActive: {
    color: GREEN_TEXT,
    fontWeight: "700",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#88bdb5",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#d6f0ed",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: BEAR_BROWN,
    backgroundColor: "#f7fdfc",
  },
  primaryBtn: {
    backgroundColor: DARK_MINT,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 8,
    shadowColor: DARK_MINT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  primaryBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  errorBox: {
    backgroundColor: "#fff0f0",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#ffcccc",
  },
  errorText: {
    color: "#cc4444",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e8f5f3",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#b0ccc8",
    fontSize: 12,
  },
  switchText: {
    textAlign: "center",
    color: GREEN_TEXT,
    fontSize: 13,
    fontWeight: "500",
  },
});
