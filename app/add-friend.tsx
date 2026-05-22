import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/auth/useAuth";
import {
  findUserByIdentity,
  FriendSummary,
  sendFriendRequest,
} from "../src/db/users";

const isValidInput = (value: string) => value.trim().length > 0;

export default function AddFriendScreen() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const trimmed = email.trim();
  const valid = isValidInput(trimmed);

  const onSend = async () => {
    if (!valid || submitting || !user) return;
    setSubmitting(true);
    console.log("Searching for user with identity:", trimmed);
    try {
      const target = await findUserByIdentity(trimmed);
      console.log("Found user:", target?.data);
      if (!target) {
        Alert.alert(
          "No user found",
          "No account matches that email or username.",
        );
        return;
      }

      if (target.id === user.uid) {
        Alert.alert(
          "Can't add yourself",
          "Enter someone else's email or username.",
        );
        return;
      }

      const currentUser: FriendSummary = {
        id: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "Friend",
        email: user.email?.toLowerCase() || "",
      };

      await sendFriendRequest(currentUser, target.id);
      Alert.alert(
        "Request sent",
        `We'll let ${target.data.name || target.data.email} know you'd like to connect.`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert(
        "Unable to send request",
        error?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Add a friend</Text>
        <View style={styles.backBtn} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Invite by email or username</Text>
          <Text style={styles.subtitle}>
            Enter your friend&apos;s email or exact username and we&apos;ll send
            them an invite to connect.
          </Text>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="friend@example.com or username"
              placeholderTextColor="#a9b3b4"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="send"
              onSubmitEditing={onSend}
              style={styles.input}
            />
          </View>

          <Pressable
            onPress={onSend}
            disabled={!valid || submitting}
            style={[styles.sendBtn, !valid && styles.sendBtnDisabled]}
          >
            <Text style={styles.sendBtnText}>Send invite</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: "#e7eff0" },

  header: {
    height: 72,
    backgroundColor: "#a3cef1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#95bdde",
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "900",
    marginTop: -4,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.3,
  },

  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 22,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#678067",
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#8f8f8f",
    lineHeight: 20,
  },

  inputWrap: {
    marginTop: 22,
  },
  label: {
    fontSize: 11,
    fontWeight: "900",
    color: "#95bdde",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#b5e48c",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#1B1B1B",
  },

  sendBtn: {
    marginTop: 22,
    backgroundColor: "#a3cef1",
    borderWidth: 1,
    borderColor: "#95bdde",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  sendBtnDisabled: {
    opacity: 0.55,
  },
  sendBtnText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 0.2,
  },
});
