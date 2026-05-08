export type Difficulty = "easy" | "medium" | "hard";

export const CATEGORIES = [
  "Movement",
  "Nature",
  "Art",
  "Journaling",
  "Social",
  "Cooking/Baking",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type DailyTask = {
  id: string;
  title: string;
  description?: string;
  categories: Category[];
  difficulty: Difficulty;
  estimatedTime: string;
};

export const EASY_TASKS: DailyTask[] = [
  {
    id: "e1",
    title: "Compliment a stranger",
    description:
      "Complimenting a stranger acts as a small form of exposure therapy, easing anxiety while boosting your mood!",
    categories: ["Social"],
    difficulty: "easy",
    estimatedTime: "~2 min",
  },
  {
    id: "e2",
    title:
      "Take your shoes off and put your feet in grass for at least 3 minutes",
    description: "Walking barefoot might actually heal you!",
    categories: ["Nature"],
    difficulty: "easy",
    estimatedTime: "~5 min",
  },
  {
    id: "e3",
    title: "Do 5 star jumps",
    description:
      "Jumping triggers the release of endorphins, sparking a cascade of positive, feel-good emotions!",
    categories: ["Movement"],
    difficulty: "easy",
    estimatedTime: "~1 min",
  },
  {
    id: "e4",
    title:
      'Do a short meditation like "When Progress Feels Too Slow: 7 Minute Meditation for Self-Compassion"',
    categories: ["Journaling"],
    difficulty: "easy",
    estimatedTime: "~7 min",
  },
  {
    id: "e5",
    title: "Try to find an interestingly shaped cloud",
    description: "Cloudgazing can be so fun!",
    categories: ["Nature"],
    difficulty: "easy",
    estimatedTime: "~5 min",
  },
  {
    id: "e6",
    title:
      "Wear your socks inside out (or do something else small scale you've never done before)",
    categories: ["Social"],
    difficulty: "easy",
    estimatedTime: "~1 min",
  },
];

export const MEDIUM_TASKS: DailyTask[] = [
  {
    id: "m1",
    title: "Go on a walk",
    description:
      "Walking as little as 1k steps a day can decrease depression by 10%!",
    categories: ["Movement", "Nature"],
    difficulty: "medium",
    estimatedTime: "~15 min",
  },
  {
    id: "m2",
    title: "Go birding and try to find your state bird",
    description:
      "Brief exposure to natural outdoor environments is linked to better memory and attention compared to time spent in busy urban outdoor settings.",
    categories: ["Nature"],
    difficulty: "medium",
    estimatedTime: "~30 min",
  },
  {
    id: "m3",
    title: "Take a fun personality quiz",
    categories: ["Social"],
    difficulty: "medium",
    estimatedTime: "~15 min",
  },
  {
    id: "m4",
    title:
      "Reflect on a key part of your identity. What makes you proud to be x (for example your ethnicity, religion, gender, etc.)?",
    description:
      "Writing short essays about personal important identities/values every few months can improve self esteem throughout the year!",
    categories: ["Journaling"],
    difficulty: "medium",
    estimatedTime: "~20 min",
  },
  {
    id: "m5",
    title: "Do a crossword puzzle (try ucsdguardian.org/games)",
    categories: ["Journaling"],
    difficulty: "medium",
    estimatedTime: "~20 min",
  },
  {
    id: "m6",
    title: "Try to hold crow pose for 5 seconds",
    categories: ["Movement"],
    difficulty: "medium",
    estimatedTime: "~10 min",
  },
];

export const HARD_TASKS: DailyTask[] = [
  {
    id: "h1",
    title: "Try plogging: go on a jog (or any speed) and pick up trash",
    description:
      'Plogging is a word formed by blending the Swedish phrase plocka upp ("pick up") with the English word "jogging."',
    categories: ["Movement", "Nature"],
    difficulty: "hard",
    estimatedTime: "~30 min",
  },
  {
    id: "h2",
    title:
      "Think of your hottest take. Make a piece of art (drawing, painting, song, anything!) based on it that obscures its meaning.",
    categories: ["Art"],
    difficulty: "hard",
    estimatedTime: "~45 min",
  },
];

export const ALL_DAILY_TASKS: DailyTask[] = [
  ...EASY_TASKS,
  ...MEDIUM_TASKS,
  ...HARD_TASKS,
];

export function getRandomDailyTasks(count = 3): DailyTask[] {
  const pool = [...ALL_DAILY_TASKS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}
