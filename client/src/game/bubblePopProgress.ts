import type { BubbleLessonRouteId, BubbleLevelId, BubbleProgressState, BubbleRouteProgress } from "@/game/bubblePopTypes";

export const BUBBLE_PROGRESS_STORAGE_KEY = "mosy-math-bubble-pop-measurement-progress";

export const BUBBLE_LESSON_ROUTES: readonly BubbleLessonRouteId[] = [
  "length",
  "mass",
  "capacity",
  "time",
  "elapsed-time",
  "add-subtract",
  "multiply-divide",
] as const;

const EMPTY_ROUTE_PROGRESS: BubbleRouteProgress = { unlockedLevel: "easy", completedLevels: [], bestScores: {} };

function emptyRouteProgress(): BubbleRouteProgress {
  return { ...EMPTY_ROUTE_PROGRESS, completedLevels: [], bestScores: {} };
}

export function createEmptyBubbleProgress(): BubbleProgressState {
  return {
    length: emptyRouteProgress(),
    mass: emptyRouteProgress(),
    capacity: emptyRouteProgress(),
    time: emptyRouteProgress(),
    "elapsed-time": emptyRouteProgress(),
    "add-subtract": emptyRouteProgress(),
    "multiply-divide": emptyRouteProgress(),
  };
}

function isLevel(value: unknown): value is BubbleLevelId {
  return value === "easy" || value === "normal" || value === "hard";
}

function sanitizeRouteProgress(value: unknown): BubbleRouteProgress {
  if (!value || typeof value !== "object") return { ...EMPTY_ROUTE_PROGRESS, completedLevels: [], bestScores: {} };
  const candidate = value as Partial<BubbleRouteProgress>;
  const completedLevels = Array.isArray(candidate.completedLevels) ? candidate.completedLevels.filter(isLevel) : [];
  const bestScores = Object.fromEntries(Object.entries(candidate.bestScores ?? {}).filter(([level, score]) => isLevel(level) && typeof score === "number" && Number.isFinite(score))) as BubbleRouteProgress["bestScores"];
  const unlockedLevel = isLevel(candidate.unlockedLevel) ? candidate.unlockedLevel : "easy";
  return { unlockedLevel, completedLevels: Array.from(new Set(completedLevels)), bestScores };
}

export function readBubbleProgress(storage: Storage | undefined = typeof window === "undefined" ? undefined : window.localStorage): BubbleProgressState {
  if (!storage) return createEmptyBubbleProgress();
  try {
    const parsed = JSON.parse(storage.getItem(BUBBLE_PROGRESS_STORAGE_KEY) ?? "{}") as Record<string, unknown>;
    const progress = createEmptyBubbleProgress();
    BUBBLE_LESSON_ROUTES.forEach((id) => { progress[id] = sanitizeRouteProgress(parsed[id]); });
    return progress;
  } catch {
    return createEmptyBubbleProgress();
  }
}

export function saveBubbleProgress(progress: BubbleProgressState, storage: Storage | undefined = typeof window === "undefined" ? undefined : window.localStorage) {
  storage?.setItem(BUBBLE_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

const NEXT_LEVEL: Record<BubbleLevelId, BubbleLevelId | null> = { easy: "normal", normal: "hard", hard: null };

export function recordBubbleRouteResult(progress: BubbleProgressState, routeId: BubbleLessonRouteId, level: BubbleLevelId, score: number, completed: boolean): BubbleProgressState {
  const routeProgress = progress[routeId];
  const completedLevels = completed && !routeProgress.completedLevels.includes(level) ? [...routeProgress.completedLevels, level] : routeProgress.completedLevels;
  const nextLevel = completed ? NEXT_LEVEL[level] : null;
  const unlockedLevel = nextLevel ?? routeProgress.unlockedLevel;
  const bestScore = Math.max(routeProgress.bestScores[level] ?? 0, score);
  return {
    ...progress,
    [routeId]: { unlockedLevel, completedLevels, bestScores: { ...routeProgress.bestScores, [level]: bestScore } },
  };
}

export function isBubbleLevelUnlocked(progress: BubbleRouteProgress, level: BubbleLevelId): boolean {
  const rank: Record<BubbleLevelId, number> = { easy: 1, normal: 2, hard: 3 };
  return rank[level] <= rank[progress.unlockedLevel];
}

export function isMasterChapterUnlocked(progress: BubbleProgressState): boolean {
  return BUBBLE_LESSON_ROUTES.every((id) => progress[id].completedLevels.includes("hard"));
}
