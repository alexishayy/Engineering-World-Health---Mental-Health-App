import React, { createContext, useContext, useState } from "react";

type AvatarKey =
  | "pfp1"
  | "pfp2"
  | "pfp3"
  | "pfp4"
  | "pfp5"
  | "pfp6"
  | "pfp7"
  | "pfp8"
  | "pfp9";

type ProfileAvatarContextType = {
  selectedAvatar: AvatarKey;
  setSelectedAvatar: (avatar: AvatarKey) => void;
};

const ProfileAvatarContext = createContext<ProfileAvatarContextType | undefined>(undefined);

export const avatarImages: Record<AvatarKey, any> = {
  pfp1: require("../assets/images/pfp1.png"),
  pfp2: require("../assets/images/pfp2.png"),
  pfp3: require("../assets/images/pfp3.png"),
  pfp4: require("../assets/images/pfp4.png"),
  pfp5: require("../assets/images/pfp5.png"),
  pfp6: require("../assets/images/pfp6.png"),
  pfp7: require("../assets/images/pfp7.png"),
  pfp8: require("../assets/images/pfp8.png"),
  pfp9: require("../assets/images/pfp9.png"),
};

export function ProfileAvatarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarKey>("pfp1");

  return (
    <ProfileAvatarContext.Provider value={{ selectedAvatar, setSelectedAvatar }}>
      {children}
    </ProfileAvatarContext.Provider>
  );
}

export function useProfileAvatar() {
  const context = useContext(ProfileAvatarContext);

  if (!context) {
    throw new Error("useProfileAvatar must be used inside ProfileAvatarProvider");
  }

  return context;
}