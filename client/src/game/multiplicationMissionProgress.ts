import type { MultiplicationLessonRouteId, MultiplicationLevelId, MultiplicationMissionProgressState } from "./multiplicationMissionTypes";

const KEY = "mosy-math-multiplication-mission-progress-v1";
const lessonIds: MultiplicationLessonRouteId[] = ["comparison-quest", "equation-forge", "equation-rescue", "property-parade", "pattern-power", "grouping-galaxy", "pattern-launch"];
const levels: MultiplicationLevelId[] = ["easy", "normal", "hard"];
const fresh = (): MultiplicationMissionProgressState => Object.fromEntries(lessonIds.map((id) => [id, { unlockedLevel: "easy", completedLevels: [], bestScores: {} }])) as unknown as MultiplicationMissionProgressState;
export const readMultiplicationMissionProgress = (): MultiplicationMissionProgressState => { try { const raw = localStorage.getItem(KEY); return raw ? { ...fresh(), ...JSON.parse(raw) } : fresh(); } catch { return fresh(); } };
export const isMultiplicationLevelUnlocked = (progress: MultiplicationMissionProgressState, route: MultiplicationLessonRouteId, level: MultiplicationLevelId) => levels.indexOf(level) <= levels.indexOf(progress[route].unlockedLevel);
export const recordMultiplicationMissionResult = (progress: MultiplicationMissionProgressState, route: MultiplicationLessonRouteId, level: MultiplicationLevelId, score: number, completed: boolean) => { const next = structuredClone(progress); const item = next[route]; item.bestScores[level] = Math.max(item.bestScores[level] ?? 0, score); if (completed && !item.completedLevels.includes(level)) item.completedLevels.push(level); const index = levels.indexOf(level); if (completed && index < levels.length - 1) item.unlockedLevel = levels[index + 1]!; try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {} return next; };
export const isMultiplicationMasterUnlocked = (progress: MultiplicationMissionProgressState) => lessonIds.every((id) => progress[id].completedLevels.includes("hard"));
