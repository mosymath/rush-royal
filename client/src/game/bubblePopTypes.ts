export const BUBBLE_ROUTE_IDS = [
  "length",
  "mass",
  "capacity",
  "time",
  "elapsed-time",
  "add-subtract",
  "multiply-divide",
  "master-challenge",
] as const;

export type BubbleRouteId = (typeof BUBBLE_ROUTE_IDS)[number];
export type BubbleLessonRouteId = Exclude<BubbleRouteId, "master-challenge">;
export type BubbleLevelId = "easy" | "normal" | "hard";

export type BubbleQuestion = {
  id: string;
  prompt: string;
  choices: readonly [string, string, string, string];
  correctChoice: string;
  explanation: string;
  skill: string;
  level: BubbleLevelId;
};

export type BubbleReward = {
  name: string;
  emoji: string;
  color: string;
};

export type BubbleRoute = {
  id: BubbleRouteId;
  lesson: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  theme: string;
  accent: string;
  accentSoft: string;
  icon: string;
  reward: BubbleReward;
  questionCount: number;
  isMaster?: boolean;
};

export type BubbleRouteProgress = {
  unlockedLevel: BubbleLevelId;
  completedLevels: BubbleLevelId[];
  bestScores: Partial<Record<BubbleLevelId, number>>;
};

export type BubbleProgressState = Record<BubbleLessonRouteId, BubbleRouteProgress>;

export const BUBBLE_LEVELS: readonly { id: BubbleLevelId; label: string; hint: string; multiplier: number }[] = [
  { id: "easy", label: "Easy", hint: "Learn the key skill", multiplier: 1 },
  { id: "normal", label: "Normal", hint: "Mix connected skills", multiplier: 1.25 },
  { id: "hard", label: "Hard", hint: "Take on mission problems", multiplier: 1.5 },
] as const;
