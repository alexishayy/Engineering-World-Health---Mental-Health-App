import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>About</Text>
      </View>

      <View style={styles.container}>
        {/* CONTENT CARD */}
        <View style={styles.card}>
          <Text style={styles.text}>
            TinyWins helps you build positive habits—not by blocking bad content, 
            but by encouraging good ones. Each day, you'll receive three personalized 
            challenges (like taking a walk or complimenting a friend) designed to 
            boost self-esteem, emotional intelligence, and self-awareness.
          </Text>

          <Text style={styles.text}>
            Version 1.0.0
          </Text>

          <Text style={styles.text}>
            Joined April 2026
          </Text>
        </View>

        {/* 3D BACK BUTTON */}
        <Pressable onPress={() => router.back()} style={styles.buttonWrapper}>
          <View style={styles.buttonShadow} />
          <View style={styles.button}>
            <Text style={styles.buttonText}>Back</Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F5F1",
  },

  /* HEADER */
  header: {
    backgroundColor: "#A3CEF1",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
  },

  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 20,
  },

  /* CARD */
  card: {
    backgroundColor: "#E7EFF0",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#B5E48C",
  },

  text: {
    fontSize: 15,
    color: "#588157",
    lineHeight: 22,
    marginBottom: 12,
  },

  /* 3D BUTTON */
  buttonWrapper: {
    marginTop: 30,
    alignItems: "center",
  },

  button: {
    backgroundColor: "#A3CEF1",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 25,
    position: "absolute",
  },

  buttonShadow: {
    backgroundColor: "#588157",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 25,
    top: 5,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});