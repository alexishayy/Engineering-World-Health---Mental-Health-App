import React, { createContext, useContext, useState } from "react";

export type PetId = "p1" | "p2" | "p3";

export type PetState = {
  id: PetId;
  image: any;
  walkingFrames: [any, any];
  emoji: string;
  collected: number;
  unlocked: boolean;
};

export const REQUIRED_EMOJIS = 5;

const INITIAL_PETS: PetState[] = [
  {
    id: "p1",
    image: require("../assets/pets/fpet1.png"),
    walkingFrames: [
      require("../assets/pets/fpet1walking1.png"),
      require("../assets/pets/fpet1walking2.png"),
    ],
    emoji: "🐾",
    collected: REQUIRED_EMOJIS,
    unlocked: true,
  },
  {
    id: "p2",
    image: require("../assets/pets/fpet2.png"),
    walkingFrames: [
      require("../assets/pets/fpet2walking1.png"),
      require("../assets/pets/fpet2walking2.png"),
    ],
    emoji: "🐟",
    collected: 0,
    unlocked: false,
  },
  {
    id: "p3",
    image: require("../assets/pets/fpet3.png"),
    walkingFrames: [
      require("../assets/pets/fpet3walking1.png"),
      require("../assets/pets/fpet3walking2.png"),
    ],
    emoji: "🦴",
    collected: 0,
    unlocked: false,
  },
];

type PetsContextType = {
  pets: PetState[];
  setPets: React.Dispatch<React.SetStateAction<PetState[]>>;
};

const PetsContext = createContext<PetsContextType | undefined>(undefined);

export function PetsProvider({ children }: { children: React.ReactNode }) {
  const [pets, setPets] = useState<PetState[]>(INITIAL_PETS);
  return (
    <PetsContext.Provider value={{ pets, setPets }}>
      {children}
    </PetsContext.Provider>
  );
}

export function usePets() {
  const ctx = useContext(PetsContext);
  if (!ctx) throw new Error("usePets must be used inside PetsProvider");
  return ctx;
}
