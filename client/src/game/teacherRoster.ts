import { getPlayerLevelProgress } from "./playerProfile";

export type TeacherRosterRow = {
  nickname: string;
  avatarId: string;
  totalScore: number;
  updatedAt: Date;
};

export type TeacherRosterSortKey = "nickname" | "score" | "level" | "activity";
export type TeacherRosterSortDirection = "asc" | "desc";
export type TeacherRosterFilters = {
  search: string;
  minScore: number | null;
  maxScore: number | null;
  level: number | null;
};

export const TEACHER_ROSTER_AUTO_REFRESH_MS = 30_000;

/** Keeps teacher-only background refreshes visible, bounded, and free of overlapping requests. */
export function shouldAutoRefreshTeacherRoster({ rosterOpen, tabVisible, isFetching }: { rosterOpen: boolean; tabVisible: boolean; isFetching: boolean }) {
  return rosterOpen && tabVisible && !isFetching;
}

/** Converts a saved roster view into the same safe filter shape used by the visible roster. */
export function normalizeTeacherRosterFilters(filters: TeacherRosterFilters): TeacherRosterFilters {
  const normalizeScore = (value: number | null) => value === null || !Number.isFinite(value) ? null : Math.min(10_000_000, Math.max(0, Math.floor(value)));
  const level = filters.level === null || !Number.isInteger(filters.level) || filters.level < 1 || filters.level > 10 ? null : filters.level;
  return {
    search: filters.search.trim().slice(0, 64),
    minScore: normalizeScore(filters.minScore),
    maxScore: normalizeScore(filters.maxScore),
    level,
  };
}

/** Returns the teacher's one backend-marked startup view, if a saved view has been selected. */
export function getTeacherDefaultRosterPreset<T extends { isDefault: number }>(presets: T[]) {
  return presets.find((preset) => preset.isDefault === 1) ?? null;
}

export function filterTeacherRoster(rows: TeacherRosterRow[], filters: TeacherRosterFilters) {
  const search = filters.search.trim().toLocaleLowerCase();
  return rows.filter((row) => {
    const score = Math.max(0, row.totalScore);
    const matchesSearch = !search || row.nickname.toLocaleLowerCase().includes(search);
    const matchesMin = filters.minScore === null || score >= filters.minScore;
    const matchesMax = filters.maxScore === null || score <= filters.maxScore;
    const matchesLevel = filters.level === null || getPlayerLevelProgress(score).level.level === filters.level;
    return matchesSearch && matchesMin && matchesMax && matchesLevel;
  });
}

export function sortTeacherRoster(rows: TeacherRosterRow[], key: TeacherRosterSortKey, direction: TeacherRosterSortDirection) {
  const factor = direction === "asc" ? 1 : -1;
  return [...rows].sort((left, right) => {
    const leftValue = key === "nickname" ? left.nickname.localeCompare(right.nickname) : key === "score" ? left.totalScore - right.totalScore : key === "level" ? getPlayerLevelProgress(left.totalScore).level.level - getPlayerLevelProgress(right.totalScore).level.level : left.updatedAt.getTime() - right.updatedAt.getTime();
    if (leftValue !== 0) return leftValue * factor;
    return left.nickname.localeCompare(right.nickname);
  });
}

/** Creates the exact filtered and sorted roster dataset used in a teacher meeting report. */
export function getTeacherRosterReport(rows: TeacherRosterRow[], filters: TeacherRosterFilters, key: TeacherRosterSortKey, direction: TeacherRosterSortDirection) {
  const filteredRows = filterTeacherRoster(rows, filters);
  return {
    filteredRows,
    rows: sortTeacherRoster(filteredRows, key, direction),
    summary: getTeacherRosterSummary(filteredRows),
  };
}

/** Produces a spreadsheet-safe UTF-8 CSV from the roster rows currently visible to the teacher. */
export function buildTeacherRosterCsv(rows: TeacherRosterRow[], className = "") {
  const csvCell = (value: string | number) => {
    let text = String(value);
    if (/^\s*[=+\-@]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  const header = ["Class Name", "Nickname", "Total Sparks", "Derived Level", "Level Title", "Last Activity UTC"];
  const data = rows.map((row) => {
    const level = getPlayerLevelProgress(Math.max(0, row.totalScore)).level;
    return [className.trim(), row.nickname, Math.max(0, row.totalScore), level.level, level.title, row.updatedAt.toISOString()];
  });
  return `\uFEFF${[header, ...data].map((row) => row.map(csvCell).join(",")).join("\r\n")}\r\n`;
}

export function getTeacherRosterCsvFilename(date = new Date(), className = "") {
  const stamp = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
  const classPart = className.trim().replace(/[\\/:*?"<>|]+/g, "_").replace(/[\u0000-\u001f]+/g, "").replace(/\s+/g, "_").replace(/^_+|_+$/g, "").slice(0, 50);
  return `MosyMath${classPart ? `_${classPart}` : ""}_Filtered_Roster_${stamp}.csv`;
}

export function formatRosterActivity(updatedAt: Date) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(updatedAt);
}

export function getTeacherRosterSummary(rows: TeacherRosterRow[]) {
  const totalStudents = rows.length;
  const totalScore = rows.reduce((sum, row) => sum + Math.max(0, row.totalScore), 0);
  return { totalStudents, averageScore: totalStudents ? Math.round(totalScore / totalStudents) : 0 };
}
