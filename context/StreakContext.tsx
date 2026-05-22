import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { DailyTask, getRandomDailyChallengeSet } from "../data/dailyTasks";

const STORAGE_KEY_STREAK = "streak_count";
const STORAGE_KEY_LAST_COMPLETED = "streak_last_completed_date";
const STORAGE_KEY_TODAY_DATE = "streak_today_date";
const STORAGE_KEY_TODAY_COMPLETED = "streak_today_completed_ids";
const STORAGE_KEY_TODAY_TASKS = "streak_today_tasks";

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(earlier: string, later: string): number {
  const a = new Date(earlier + "T00:00:00");
  const b = new Date(later + "T00:00:00");
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

type StreakContextType = {
  streak: number;
  dailyTasks: DailyTask[];
  completedIds: Set<string>;
  locked: boolean;
  loaded: boolean;
  celebrationToken: number;
  toggleComplete: (id: string) => void;
};

const StreakContext = createContext<StreakContextType | undefined>(undefined);

export function StreakProvider({ children }: { children: React.ReactNode }) {
  const [streak, setStreak] = useState(0);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(
    null,
  );
  const [currentDay, setCurrentDay] = useState<string>(todayKey());
  const [loaded, setLoaded] = useState(false);
  const [celebrationToken, setCelebrationToken] = useState(0);
  const reloadingRef = useRef(false);

  const loadForDay = useCallback(async (today: string) => {
    if (reloadingRef.current) return;
    reloadingRef.current = true;
    try {
      const [streakStr, lastDate, savedTodayDate, completedJson, tasksJson] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_STREAK),
          AsyncStorage.getItem(STORAGE_KEY_LAST_COMPLETED),
          AsyncStorage.getItem(STORAGE_KEY_TODAY_DATE),
          AsyncStorage.getItem(STORAGE_KEY_TODAY_COMPLETED),
          AsyncStorage.getItem(STORAGE_KEY_TODAY_TASKS),
        ]);

      let nextStreak = streakStr ? Number(streakStr) : 0;
      if (!Number.isFinite(nextStreak) || nextStreak < 0) nextStreak = 0;
      const nextLastCompleted = lastDate || null;

      if (nextLastCompleted) {
        const gap = daysBetween(nextLastCompleted, today);
        if (gap > 1) {
          nextStreak = 0;
          await AsyncStorage.setItem(STORAGE_KEY_STREAK, "0");
        }
      }

      let tasks: DailyTask[] = [];
      let completed: string[] = [];

      if (savedTodayDate === today && tasksJson) {
        try {
          const parsed = JSON.parse(tasksJson);
          if (Array.isArray(parsed)) tasks = parsed;
        } catch {
          tasks = [];
        }
        if (completedJson) {
          try {
            const parsed = JSON.parse(completedJson);
            if (Array.isArray(parsed))
              completed = parsed.filter((x) => typeof x === "string");
          } catch {
            completed = [];
          }
        }
      }

      if (tasks.length === 0) {
        tasks = getRandomDailyChallengeSet();
        completed = [];
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEY_TODAY_TASKS, JSON.stringify(tasks)),
          AsyncStorage.setItem(STORAGE_KEY_TODAY_DATE, today),
          AsyncStorage.setItem(
            STORAGE_KEY_TODAY_COMPLETED,
            JSON.stringify([]),
          ),
        ]);
      }

      setStreak(nextStreak);
      setLastCompletedDate(nextLastCompleted);
      setDailyTasks(tasks);
      setCompletedIds(new Set(completed));
      setCurrentDay(today);
      setLoaded(true);
    } finally {
      reloadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadForDay(todayKey());
  }, [loadForDay]);

  // Detect day rollover while the app stays open.
  useEffect(() => {
    const id = setInterval(() => {
      const today = todayKey();
      if (today !== currentDay) {
        loadForDay(today);
      }
    }, 30 * 1000);
    return () => clearInterval(id);
  }, [currentDay, loadForDay]);

  const allDone =
    dailyTasks.length > 0 && completedIds.size >= dailyTasks.length;
  const locked = allDone;

  const toggleComplete = useCallback(
    (id: string) => {
      if (!loaded || dailyTasks.length === 0) return;
      if (completedIds.size >= dailyTasks.length) return;

      const next = new Set(completedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);

      setCompletedIds(next);
      AsyncStorage.setItem(
        STORAGE_KEY_TODAY_COMPLETED,
        JSON.stringify([...next]),
      );

      if (next.size === dailyTasks.length) {
        const today = todayKey();
        if (lastCompletedDate !== today) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          setLastCompletedDate(today);
          AsyncStorage.setItem(STORAGE_KEY_STREAK, String(newStreak));
          AsyncStorage.setItem(STORAGE_KEY_LAST_COMPLETED, today);
          setCelebrationToken((t) => t + 1);
        }
      }
    },
    [loaded, dailyTasks, completedIds, streak, lastCompletedDate],
  );

  return (
    <StreakContext.Provider
      value={{
        streak,
        dailyTasks,
        completedIds,
        locked,
        loaded,
        celebrationToken,
        toggleComplete,
      }}
    >
      {children}
    </StreakContext.Provider>
  );
}

export function useStreak() {
  const ctx = useContext(StreakContext);
  if (!ctx) throw new Error("useStreak must be used inside StreakProvider");
  return ctx;
}
