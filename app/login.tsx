import { logIn, logOut, signUp } from "@/src/auth/emailAuth";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      await logIn(email, password);
      router.replace("/"); // go back to home after login
    } catch (err: any) {
      Alert.alert("Login failed", err.message);
    }
  }

  async function handleSignup() {
    try {
      await signUp(email, password);
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Signup failed", err.message);
    }
  }

  async function handleLogout() {
    try {
      await logOut();
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Logout failed", err.message);
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <Button title="Log In" onPress={handleLogin} />
      <Button title="Sign Up" onPress={handleSignup} />
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
}
