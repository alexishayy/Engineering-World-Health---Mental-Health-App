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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddFriendScreen() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const trimmed = email.trim();
  const valid = EMAIL_RE.test(trimmed);

  const onSend = () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    Alert.alert("Invite sent", `We'll let ${trimmed} know you'd like to connect.`, [
      {
        text: "OK",
        onPress: () => {
          setSubmitting(false);
          router.back();
        },
      },
    ]);
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
          <Text style={styles.title}>Invite by email</Text>
          <Text style={styles.subtitle}>
            Enter your friend&apos;s email and we&apos;ll send them an invite to
            connect.
          </Text>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="friend@example.com"
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
