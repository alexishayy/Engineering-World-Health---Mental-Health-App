import { router } from "expo-router";
import React from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    avatarImages,
    useProfileAvatar,
} from "../../../context/ProfileAvatarContext";

export default function AccountScreen() {
  const { selectedAvatar, setSelectedAvatar } = useProfileAvatar();

  const avatarKeys = Object.keys(avatarImages) as Array<
    keyof typeof avatarImages
  >;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* Current Profile Picture */}
        <Image
          source={avatarImages[selectedAvatar]}
          style={styles.currentAvatar}
        />

        <Text style={styles.headerText}>Account</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ACCOUNT INFO CARD */}
        <View style={styles.card}>
          <Text style={styles.text}>Name: Ivan Guerrero</Text>
          <Text style={styles.text}>Username: @username</Text>
          <Text style={styles.text}>Email: example@email.com</Text>
        </View>

        {/* AVATAR SELECTOR */}
        <View style={styles.avatarSection}>
          <Text style={styles.sectionTitle}>
            Choose a Profile Picture
          </Text>

          <View style={styles.avatarGrid}>
            {avatarKeys.map((avatarKey) => {
              const isSelected = selectedAvatar === avatarKey;

              return (
                <Pressable
                  key={avatarKey}
                  onPress={() => setSelectedAvatar(avatarKey)}
                  style={[
                    styles.avatarButton,
                    isSelected && styles.selectedAvatarButton,
                  ]}
                >
                  <Image
                    source={avatarImages[avatarKey]}
                    style={styles.avatarImage}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* BACK BUTTON */}
        <Pressable
          onPress={() => router.back()}
          style={styles.buttonWrapper}
        >
          {({ pressed }) => (
            <>
              {/* SHADOW LAYER */}
              <View style={styles.buttonShadow} />

              {/* TOP BUTTON */}
              <View
                style={[
                  styles.button,
                  pressed && styles.buttonPressedDown,
                ]}
              >
                <Text style={styles.buttonText}>Back</Text>
              </View>
            </>
          )}
        </Pressable>

        {/* Bottom spacing */}
        <View style={{ height: 50 }} />
      </ScrollView>
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

    paddingVertical: 22,
    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    position: "relative",
  },

  currentAvatar: {
    width: 58,
    height: 58,

    borderRadius: 29,

    position: "absolute",
    left: 20,

    borderWidth: 2,
    borderColor: "white",
  },

  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },

  /* SCROLL AREA */
  scrollContent: {
    padding: 18,
  },

  /* ACCOUNT INFO CARD */
  card: {
    backgroundColor: "#E7EFF0",

    borderRadius: 22,

    padding: 22,

    borderWidth: 1,
    borderColor: "#B5E48C",
  },

  text: {
    fontSize: 16,
    color: "#588157",
    marginBottom: 14,
  },

  /* AVATAR SECTION */
  avatarSection: {
    marginTop: 28,

    backgroundColor: "#E7EFF0",

    borderRadius: 22,

    padding: 18,

    borderWidth: 1,
    borderColor: "#B5E48C",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#588157",

    marginBottom: 18,

    textAlign: "center",
  },

  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent: "space-between",

    gap: 12,
  },

  avatarButton: {
    width: "30%",

    aspectRatio: 1,

    backgroundColor: "#F8F5F1",

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 2,
    borderColor: "transparent",
  },

  selectedAvatarButton: {
    borderColor: "#588157",
    backgroundColor: "#dceef7",
  },

  avatarImage: {
    width: "82%",
    height: "82%",

    resizeMode: "contain",
  },

  /* BACK BUTTON */
  buttonWrapper: {
    marginTop: 36,

    alignItems: "center",

    height: 70,
  },

  /* SHADOW */
  buttonShadow: {
    backgroundColor: "#588157",

    width: 190,
    height: 58,

    borderRadius: 29,

    position: "absolute",

    top: 6,
  },

  /* TOP BUTTON */
  button: {
    backgroundColor: "#A3CEF1",

    width: 190,
    height: 58,

    borderRadius: 29,

    alignItems: "center",
    justifyContent: "center",
  },

  /* PRESS EFFECT */
  buttonPressedDown: {
    transform: [{ translateY: 6 }],
  },

  buttonText: {
    color: "white",

    fontSize: 18,
    fontWeight: "700",
  },
});