import type { AudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { settingsState } from "../../context/SettingsContext";

export type FeedbackKind =
  | "tap"
  | "toggle"
  | "warning"
  | "celebration"
  | "error";

function hapticOn(): boolean {
  return settingsState.hapticFeedback;
}

function soundOn(): boolean {
  return settingsState.soundEffects;
}

let celebrationPlayer: AudioPlayer | null = null;
let celebrationLoadTried = false;
function getCelebrationPlayer(): AudioPlayer | null {
  if (celebrationLoadTried) return celebrationPlayer;
  celebrationLoadTried = true;
  try {
    // Lazy require so the app still boots in environments where the native
    // expo-audio module isn't linked (e.g. Expo Go). Sound is skipped there.
    const { createAudioPlayer } = require("expo-audio");
    celebrationPlayer = createAudioPlayer(
      require("../../assets/sounds/celebration.mp3"),
    );
  } catch {
    celebrationPlayer = null;
  }
  return celebrationPlayer;
}

function playSound(name: string) {
  if (!soundOn()) return;
  if (name !== "celebration") return;
  const player = getCelebrationPlayer();
  if (!player) return;
  try {
    player.seekTo(0);
    player.play();
  } catch {}
}

export function feedback(kind: FeedbackKind) {
  switch (kind) {
    case "tap":
      if (hapticOn())
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      playSound("tap");
      return;
    case "toggle":
      if (hapticOn())
        Haptics.selectionAsync().catch(() => {});
      playSound("toggle");
      return;
    case "warning":
      if (hapticOn())
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
          .catch(() => {});
      playSound("warning");
      return;
    case "celebration":
      if (hapticOn()) {
        // A short rapid burst: success tap, two quick mediums.
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          .catch(() => {});
        setTimeout(
          () =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(
              () => {},
            ),
          90,
        );
        setTimeout(
          () =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(
              () => {},
            ),
          180,
        );
      }
      playSound("celebration");
      return;
    case "error":
      if (hapticOn())
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
          .catch(() => {});
      playSound("error");
      return;
  }
}
