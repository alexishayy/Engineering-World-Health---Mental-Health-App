import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const STORAGE_KEY_SOUND = "settings_sound_effects";
const STORAGE_KEY_HAPTICS = "settings_haptic_feedback";
const STORAGE_KEY_NOTIFICATIONS = "settings_notifications";

type SettingsContextType = {
  soundEffects: boolean;
  hapticFeedback: boolean;
  notifications: boolean;
  loaded: boolean;
  setSoundEffects: (v: boolean) => void;
  setHapticFeedback: (v: boolean) => void;
  setNotifications: (v: boolean) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

// Mirror of the live setting values, so non-React modules (e.g. feedback helpers)
// can read them without subscribing.
export const settingsState = {
  soundEffects: true,
  hapticFeedback: true,
  notifications: true,
};

function parseBool(v: string | null, fallback: boolean): boolean {
  if (v === null) return fallback;
  return v === "true";
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [soundEffects, setSoundEffectsState] = useState(true);
  const [hapticFeedback, setHapticFeedbackState] = useState(true);
  const [notifications, setNotificationsState] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const [s, h, n] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_SOUND),
          AsyncStorage.getItem(STORAGE_KEY_HAPTICS),
          AsyncStorage.getItem(STORAGE_KEY_NOTIFICATIONS),
        ]);
        const sv = parseBool(s, true);
        const hv = parseBool(h, true);
        const nv = parseBool(n, true);
        settingsState.soundEffects = sv;
        settingsState.hapticFeedback = hv;
        settingsState.notifications = nv;
        setSoundEffectsState(sv);
        setHapticFeedbackState(hv);
        setNotificationsState(nv);
      } finally {
        hydratedRef.current = true;
        setLoaded(true);
      }
    })();
  }, []);

  const setSoundEffects = useCallback((v: boolean) => {
    settingsState.soundEffects = v;
    setSoundEffectsState(v);
    AsyncStorage.setItem(STORAGE_KEY_SOUND, String(v));
  }, []);

  const setHapticFeedback = useCallback((v: boolean) => {
    settingsState.hapticFeedback = v;
    setHapticFeedbackState(v);
    AsyncStorage.setItem(STORAGE_KEY_HAPTICS, String(v));
  }, []);

  const setNotifications = useCallback((v: boolean) => {
    settingsState.notifications = v;
    setNotificationsState(v);
    AsyncStorage.setItem(STORAGE_KEY_NOTIFICATIONS, String(v));
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        soundEffects,
        hapticFeedback,
        notifications,
        loaded,
        setSoundEffects,
        setHapticFeedback,
        setNotifications,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
