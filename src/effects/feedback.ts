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

// Sound playback is stubbed until expo-audio (or expo-av) is added. Each entry
// below is the intended sound — wire them up by replacing this no-op with a
// real player. Keep the soundOn() gate so the settings toggle still controls it.
function playSound(_name: string) {
  if (!soundOn()) return;
  // TODO: install expo-audio and load short clips, e.g.
  //   const player = useAudioPlayer(require('../../assets/sounds/<name>.mp3'));
  //   player.play();
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
