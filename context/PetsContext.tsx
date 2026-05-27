import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "../src/auth/useAuth";
import { getPetProgress, setPetProgress } from "../src/db/pets";

export type PetId = "p1" | "p2" | "p3" | "p4" | "p5";

export type PetState = {
  id: PetId;
  image: any;
  walkingFrames: [any, any];
  emoji: string;
  collected: number;
  required: number;
  unlocked: boolean;
};

const INITIAL_PETS: PetState[] = [
  {
    id: "p1",
    image: require("../assets/pets/pet1.png"),
    walkingFrames: [
      require("../assets/pets/pet1walking1.png"),
      require("../assets/pets/pet1walking2.png"),
    ],
    emoji: "🐾",
    collected: 5,
    required: 5,
    unlocked: true,
  },
  {
    id: "p2",
    image: require("../assets/pets/pet2.png"),
    walkingFrames: [
      require("../assets/pets/pet2walking1.png"),
      require("../assets/pets/pet2walking2.png"),
    ],
    emoji: "🐟",
    collected: 0,
    required: 5,
    unlocked: false,
  },
  {
    id: "p3",
    image: require("../assets/pets/pet3.png"),
    walkingFrames: [
      require("../assets/pets/pet3walking1.png"),
      require("../assets/pets/pet3walking2.png"),
    ],
    emoji: "🦴",
    collected: 0,
    required: 10,
    unlocked: false,
  },
  {
    id: "p4",
    image: require("../assets/pets/pet4.png"),
    walkingFrames: [
      require("../assets/pets/pet4walking1.png"),
      require("../assets/pets/pet4walking2.png"),
    ],
    emoji: "🐦",
    collected: 0,
    required: 20,
    unlocked: false,
  },
  {
    id: "p5",
    image: require("../assets/pets/pet5.png"),
    walkingFrames: [
      require("../assets/pets/pet5walking1.png"),
      require("../assets/pets/pet5walking2.png"),
    ],
    emoji: "🐰",
    collected: 0,
    required: 50,
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
  const { user } = useAuth();

  // Load pet progress from DB when user signs in
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user) return;
      try {
        const progress = await getPetProgress(user.uid);
        if (!mounted) return;
        if (progress && typeof progress === "object") {
          setPets((prev) =>
            prev.map((p) => {
              const prog = progress[p.id];
              if (!prog) return p;
              const collected = Math.min(
                p.required,
                prog.collected ?? p.collected,
              );
              const unlocked =
                prog.unlocked ?? p.unlocked ?? collected >= p.required;
              return { ...p, collected, unlocked };
            }),
          );
        }
      } catch (e) {
        // ignore
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  // Persist pet progress when pets change (debounced)
  const saveTimeout = useRef<any>(null);
  useEffect(() => {
    if (!user) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      const progress: Record<string, { collected: number; unlocked: boolean }> =
        {};
      pets.forEach((p) => {
        progress[p.id] = { collected: p.collected, unlocked: p.unlocked };
      });
      setPetProgress(user.uid, progress).catch(() => {});
    }, 600);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [pets, user]);
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
