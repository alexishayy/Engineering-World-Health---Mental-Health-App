import React, { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import {
  avatarImages,
  useProfileAvatar,
} from "../context/ProfileAvatarContext";
import ProfileAvatarPickerModal from "./ProfileAvatarPickerModal";

type Props = {
  size?: number;
  bordered?: boolean;
};

export default function ProfileAvatarButton({
  size = 32,
  bordered = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const { selectedAvatar } = useProfileAvatar();

  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={{ borderRadius: size / 2 }}>
        <View
          style={[
            styles.avatarWrap,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
            bordered && styles.bordered,
          ]}
        >
          <Image
            source={avatarImages[selectedAvatar]}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: size / 2,
            }}
            resizeMode="cover"
          />
        </View>
      </Pressable>

      <ProfileAvatarPickerModal visible={open} onClose={() => setOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  avatarWrap: {
    overflow: "hidden",
    backgroundColor: "white",
  },
  bordered: {
    borderWidth: 2,
    borderColor: "#000",
  },
});
