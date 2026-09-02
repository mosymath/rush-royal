import type { AreaLessonRouteId, AreaLevelId, AreaMissionProgressState } from "./areaMissionTypes";

const KEY = "mosy-math-area-mission-progress-v1";
const LESSON_IDS: readonly AreaLessonRouteId[] = ["perimeter", "area", "unknown-dimensions", "complex-shapes"];
const LEVELS: readonly AreaLevelId[] = ["easy", "normal", "hard"];

const defaultRoute = () => ({ unlockedLevel: "easy" as const, completedLevels: [] as AreaLevelId[], bestScores: {} });
export const createEmptyAreaMissionProgress = (): AreaMissionProgressState => Object.fromEntries(LESSON_IDS.map((id) => [id, defaultRoute()])) as AreaMissionProgressState;

export function readAreaMissionProgress(): AreaMissionProgressState {
  if (typeof window === "undefined") return createEmptyAreaMissionProgress();
  try {
    const candidate = JSON.parse(window.localStorage.getItem(KEY) || "null") as Partial<AreaMissionProgressState> | null;
    const empty = createEmptyAreaMissionProgress();
    if (!candidate) return empty;
    LESSON_IDS.forEach((id) => {
      const stored = candidate[id];
      if (!stored) return;
      const completed = LEVELS.filter((level) => stored.completedLevels?.includes(level));
      empty[id] = { unlockedLevel: stored.unlockedLevel && LEVELS.includes(stored.unlockedLevel) ? stored.unlockedLevel : "easy", completedLevels: completed, bestScores: stored.bestScores || {} };
    });
    return empty;
  } catch { return createEmptyAreaMissionProgress(); }
}

export function saveAreaMissionProgress(progress: AreaMissionProgressState) { if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(progress)); }

export function isAreaLevelUnlocked(progress: AreaMissionProgressState, routeId: AreaLessonRouteId, level: AreaLevelId) {
  return LEVELS.indexOf(level) <= LEVELS.indexOf(progress[routeId].unlockedLevel);
}

export function recordAreaMissionResult(progress: AreaMissionProgressState, routeId: AreaLessonRouteId, level: AreaLevelId, score: number, completed: boolean): AreaMissionProgressState {
  const next = structuredClone(progress);
  const route = next[routeId];
  route.bestScores[level] = Math.max(route.bestScores[level] || 0, score);
  if (completed && !route.completedLevels.includes(level)) route.completedLevels.push(level);
  if (completed && level !== "hard") route.unlockedLevel = LEVELS[LEVELS.indexOf(level) + 1]!;
  saveAreaMissionProgress(next);
  return next;
}

export function isAreaExplorerMissionUnlocked(progress: AreaMissionProgressState) { return LESSON_IDS.every((id) => progress[id].completedLevels.includes("hard")); }
