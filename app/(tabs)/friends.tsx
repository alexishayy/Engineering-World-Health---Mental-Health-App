import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const dayBg = require( "../../assets/images/dayBg.png");
const nightBg = require( "../../assets/images/nightBg.png");
const sunsetBg = require("../../assets/images/sunset.jpg");


// dummy data
const friendData = [
  { id: "1", name: "Username1" },
  { id: "2", name: "Username2" },
  { id: "3", name: "Username3" },

];

type Friend = { id: string; name: string };

const backgroundImg = () => {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 17) {
    return dayBg;      
  } else if (hour >= 17 && hour < 21) {
    return sunsetBg;  
  } else {
    return nightBg;    
  }
}
export default function FriendsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<Friend[]>(friendData);

  // remove-friend modal state
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const filteredFriends = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter((f) => f.name.toLowerCase().includes(q));
  }, [friends, searchQuery]);

  const listRef = useRef<FlatList>(null);

  const handleSearch = (text: string) => setSearchQuery(text);

  const handleAddFriend = () => {
    const name = searchQuery.trim();
    if (!name) return;

    const exists = friends.some(
      (f) => f.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) return;

    setFriends((prev) => [{ id: String(Date.now()), name }, ...prev]);
    setSearchQuery("");
  };

  const openRemoveModal = (friend: Friend) => {
    setSelectedFriend(friend);
    setIsRemoveModalOpen(true);
  };

  const closeRemoveModal = () => {
    setIsRemoveModalOpen(false);
    setSelectedFriend(null);
  };

  const removeSelectedFriend = () => {
    if (!selectedFriend) return;
    setFriends((prev) => prev.filter((f) => f.id !== selectedFriend.id));
    closeRemoveModal();
  };

  const [currentBg, setCurrentBg] = useState(backgroundImg());
  const [nextBg, setNextBg] = useState(backgroundImg());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeToNewBackground = (newImage: any) => {
    if (newImage === currentBg) return;

    setNextBg(newImage);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setCurrentBg(newImage);
      fadeAnim.setValue(0);
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newImage = backgroundImg();
      fadeToNewBackground(newImage);
    }, 60000); // check every minute

    return () => clearInterval(interval);
  }, [currentBg]);

  return (
      <View style={{ flex: 1 }}>
        {/* Current background */}
        <Image source={currentBg} style={styles.backgroundImg} />

        {/* Next background (animated fade) */}
        <Animated.Image
          source={nextBg}
          style={[styles.backgroundImg, { opacity: fadeAnim }]}
  />

      <SafeAreaView style={styles.screen} edges={["top"]}>
        <View style={styles.topBar}>
          <View style={styles.avatarDot} />
          <View style={styles.streakPill}>
            <Text style={styles.streakText}>🔥 Streak : 12</Text>
          </View>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.header}>
            <View style={styles.headerBlock} />
            <Text style={styles.headerText}>Add A Friend!</Text>

            <View style={styles.searchRow}>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search or type a username..."
                  value={searchQuery}
                  onChangeText={handleSearch}
                  placeholderTextColor="#4c4b4b"
                  returnKeyType="done"
                  onSubmitEditing={handleAddFriend}
                />
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.addFriendButton,
                  pressed && { transform: [{ translateY: 2 }] },
                  !searchQuery.trim() && { opacity: 0.6 },
                ]}
                onPress={handleAddFriend}
                disabled={!searchQuery.trim()}
              >
                <Text style={styles.addFriendButtonText}>Add</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.body}>
            <FlatList
              ref={listRef}
              data={filteredFriends}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => openRemoveModal(item)}
                  style={({ pressed }) => [
                    styles.friendItem,
                    pressed && { transform: [{ translateY: 1 }], opacity: 0.95 },
                  ]}
                >
                  <View style={styles.avatarPlaceholder} />
                  <Text style={styles.friendName}>{item.name}</Text>
                </Pressable>
              )}
              contentContainerStyle={styles.listContainer}
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews={false}
              maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
            />
          </View>
        </KeyboardAvoidingView>

        {/* ✅ Remove Friend Modal */}
        <Modal
          visible={isRemoveModalOpen}
          transparent
          animationType="fade"
          onRequestClose={closeRemoveModal}
        >
          <Pressable style={styles.modalBackdrop} onPress={closeRemoveModal}>
            <Pressable style={styles.modalCard} onPress={() => {}}>
              <Text style={styles.modalTitle}>Friend Options</Text>

              <Text style={styles.modalBodyText}>
                {selectedFriend ? `Remove ${selectedFriend.name}?` : ""}
              </Text>

              <View style={styles.modalRow}>
                <Pressable style={styles.modalBtnGhost} onPress={closeRemoveModal}>
                  <Text style={styles.modalBtnGhostText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={styles.modalBtnDanger}
                  onPress={removeSelectedFriend}
                >
                  <Text style={styles.modalBtnDangerText}>Remove Friend</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
      </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "transparent" },
  backgroundImg: {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  resizeMode: "cover",
},
  topBar: {
    height: 64,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  avatarDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "white",
  },
  streakPill: {
    borderWidth: 1,
    borderColor: "#C9C2B6",
    backgroundColor: "#FBF7EF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  streakText: { fontSize: 14, fontWeight: "700", color: "#1B1B1B" },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1,
  },
  headerBlock: {
    position: "absolute",
    top: 32,
    left: 30,
    right: 35,
    height: 140,
    borderRadius: 30,
    backgroundColor: "#edf3fa",
    borderBlockColor: "#b9b9b9",
    borderLeftColor: "#b9b9b9",
    borderRightColor: "#b9b9b9",
    borderWidth: 1.5,
    zIndex: -1,
  },
  headerText: {
    color: "#0a0909",
    fontSize: 22,
    fontWeight: "800",
    top: 40,
    left: 35,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    top: 50,
    left: 30,
    right: 60,
    width: 300,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderBlockColor: "#b9b9b9",
    borderLeftColor: "#b9b9b9",
    borderRightColor: "#b9b9b9",
    borderRadius: 50,
    borderWidth: 1.5,
    top: 10,
    paddingHorizontal: 20,
    height: 45,
    justifyContent: "center",
    marginRight: 10,
  },
  searchInput: { fontSize: 16, color: "#000" },

  addFriendButton: {
    height: 45,
    top: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#3E5870",
    borderWidth: 1.2,
    borderColor: "#2E4256",
    alignItems: "center",
    justifyContent: "center",
  },
  addFriendButtonText: { color: "white", fontSize: 16, fontWeight: "900" },

  body: {
    flex: 1,
    marginTop: 90, // ✅ spacing below Add Friend box
  },

  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecf5ff",
    borderBlockColor: "#b9b9b9",
    borderLeftColor: "#b9b9b9",
    borderRightColor: "#b9b9b9",
    borderWidth: 1.2,
    left: 25,
    right: 25,
    padding: 13,
    borderRadius: 30,
    marginBottom: 10,
    width: 300,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    marginRight: 15,
  },
  friendName: { fontSize: 18, fontWeight: "600", color: "#333" },

  listContainer: {
    paddingTop: 5,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 18,
    justifyContent: "center",
  },
  modalCard: {
    backgroundColor: "#FBF7EF",
    borderWidth: 1,
    borderColor: "#C9C2B6",
    borderRadius: 18,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1B1B1B",
    marginBottom: 10,
  },
  modalBodyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1B1B1B",
    marginBottom: 14,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalBtnGhost: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#B7C1CC",
    backgroundColor: "white",
  },
  modalBtnGhostText: { fontWeight: "900", color: "#1B1B1B" },

  modalBtnDanger: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#B42318",
    borderWidth: 1,
    borderColor: "#7A271A",
  },
  modalBtnDangerText: { fontWeight: "900", color: "white" },
});