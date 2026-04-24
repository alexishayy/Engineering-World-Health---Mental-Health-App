import React from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  avatarImages,
  useProfileAvatar,
} from "../context/ProfileAvatarContext";

const avatarKeys = [
  "pfp1",
  "pfp2",
  "pfp3",
  "pfp4",
  "pfp5",
  "pfp6",
  "pfp7",
  "pfp8",
  "pfp9",
] as const;

export default function ProfileAvatarPickerModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { selectedAvatar, setSelectedAvatar } = useProfileAvatar();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>Choose a profile picture</Text>

          <FlatList
            data={avatarKeys}
            numColumns={3}
            keyExtractor={(item) => item}
            scrollEnabled={false}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => {
              const isSelected = item === selectedAvatar;

              return (
                <Pressable
                  onPress={() => {
                    setSelectedAvatar(item);
                    onClose();
                  }}
                  style={[styles.item, isSelected && styles.selected]}
                >
                  <Image source={avatarImages[item]} style={styles.image} />
                </Pressable>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 18,
  },
  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#000",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
  },
  grid: {
    alignItems: "center",
  },
  item: {
    margin: 8,
    padding: 4,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selected: {
    borderColor: "#000",
  },
  image: {
    width: 78,
    height: 78,
    borderRadius: 39,
  },
});
