export const MULTIPLICATION_ROUTE_IDS = ["comparison-quest", "equation-forge", "equation-rescue", "property-parade", "pattern-power", "grouping-galaxy", "pattern-launch", "multiplication-master-exam"] as const;
export type MultiplicationRouteId = (typeof MULTIPLICATION_ROUTE_IDS)[number];
export type MultiplicationLessonRouteId = Exclude<MultiplicationRouteId, "multiplication-master-exam">;
export type MultiplicationLevelId = "easy" | "normal" | "hard";

export type MultiplicationMissionQuestion = {
  id: string;
  prompt: string;
  choices: readonly [string, string, string, string];
  correctChoice: string;
  explanation: string;
  skill: string;
  level: MultiplicationLevelId;
  sourceLabels: readonly string[];
  teacherSourceId: string;
};

export type MultiplicationMissionRoute = {
  id: MultiplicationRouteId;
  lesson: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  accent: string;
  accentSoft: string;
  icon: string;
  reward: { name: string; color: string };
  questionCount: number;
  isMaster?: boolean;
};

export type MultiplicationRouteProgress = { unlockedLevel: MultiplicationLevelId; completedLevels: MultiplicationLevelId[]; bestScores: Partial<Record<MultiplicationLevelId, number>> };
export type MultiplicationMissionProgressState = Record<MultiplicationLessonRouteId, MultiplicationRouteProgress>;

export const MULTIPLICATION_LEVELS: readonly { id: MultiplicationLevelId; label: string; hint: string; multiplier: number }[] = [
  { id: "easy", label: "Easy", hint: "Build the first combo", multiplier: 1 },
  { id: "normal", label: "Normal", hint: "Power the arena", multiplier: 1.25 },
  { id: "hard", label: "Hard", hint: "Master the multiplier", multiplier: 1.5 },
] as const;
