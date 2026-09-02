export const AREA_ROUTE_IDS = ["perimeter", "area", "unknown-dimensions", "complex-shapes", "area-explorer-mission"] as const;

export type AreaRouteId = (typeof AREA_ROUTE_IDS)[number];
export type AreaLessonRouteId = Exclude<AreaRouteId, "area-explorer-mission">;
export type AreaLevelId = "easy" | "normal" | "hard";

export type AreaMissionQuestion = {
  id: string;
  prompt: string;
  choices: readonly [string, string, string, string];
  correctChoice: string;
  explanation: string;
  skill: string;
  level: AreaLevelId;
  sourceLabels: readonly string[];
  teacherSourceId: string;
};

export type AreaMissionRoute = {
  id: AreaRouteId;
  lesson: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  theme: "trail" | "tiles" | "compass" | "garden" | "final";
  accent: string;
  accentSoft: string;
  icon: "ruler" | "tiles" | "compass" | "garden" | "star";
  reward: { name: string; color: string };
  questionCount: number;
  isMaster?: boolean;
};

export type AreaRouteProgress = {
  unlockedLevel: AreaLevelId;
  completedLevels: AreaLevelId[];
  bestScores: Partial<Record<AreaLevelId, number>>;
};

export type AreaMissionProgressState = Record<AreaLessonRouteId, AreaRouteProgress>;

export const AREA_LEVELS: readonly { id: AreaLevelId; label: string; hint: string; multiplier: number }[] = [
  { id: "easy", label: "Easy", hint: "Trace the first trail", multiplier: 1 },
  { id: "normal", label: "Normal", hint: "Build the map", multiplier: 1.25 },
  { id: "hard", label: "Hard", hint: "Solve the mission", multiplier: 1.5 },
] as const;
