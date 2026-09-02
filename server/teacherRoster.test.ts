import { describe, expect, it } from "vitest";
import { buildTeacherRosterCsv, filterTeacherRoster, getTeacherDefaultRosterPreset, getTeacherRosterReport, getTeacherRosterSummary, getTeacherRosterCsvFilename, normalizeTeacherRosterFilters, shouldAutoRefreshTeacherRoster, sortTeacherRoster, TEACHER_ROSTER_AUTO_REFRESH_MS } from "../client/src/game/teacherRoster";

const rows = [
  { nickname: "Zara", avatarId: "nova", totalScore: 1_000, updatedAt: new Date("2026-08-22T12:00:00.000Z") },
  { nickname: "Ari", avatarId: "orbit", totalScore: 3_000, updatedAt: new Date("2026-08-22T14:00:00.000Z") },
  { nickname: "Mina", avatarId: "spark", totalScore: 2_000, updatedAt: new Date("2026-08-22T13:00:00.000Z") },
];

describe("teacher roster sorting", () => {
  it("sorts names alphabetically without mutating backend roster rows", () => {
    expect(sortTeacherRoster(rows, "nickname", "asc").map((row) => row.nickname)).toEqual(["Ari", "Mina", "Zara"]);
    expect(rows.map((row) => row.nickname)).toEqual(["Zara", "Ari", "Mina"]);
  });

  it("sorts saved score, derived level, and recent backend activity in descending order", () => {
    expect(sortTeacherRoster(rows, "score", "desc").map((row) => row.nickname)).toEqual(["Ari", "Mina", "Zara"]);
    expect(sortTeacherRoster(rows, "level", "desc").map((row) => row.nickname)).toEqual(["Ari", "Mina", "Zara"]);
    expect(sortTeacherRoster(rows, "activity", "desc").map((row) => row.nickname)).toEqual(["Ari", "Mina", "Zara"]);
  });

  it("calculates zero, one, and multiple-student class summaries from backend roster rows", () => {
    expect(getTeacherRosterSummary([])).toEqual({ totalStudents: 0, averageScore: 0 });
    expect(getTeacherRosterSummary([rows[0]!])).toEqual({ totalStudents: 1, averageScore: 1_000 });
    expect(getTeacherRosterSummary(rows)).toEqual({ totalStudents: 3, averageScore: 2_000 });
  });

  it("combines case-insensitive nickname, inclusive score, and derived-level filters", () => {
    expect(filterTeacherRoster(rows, { search: "ar", minScore: null, maxScore: null, level: null }).map((row) => row.nickname)).toEqual(["Zara", "Ari"]);
    expect(filterTeacherRoster(rows, { search: "", minScore: 1_500, maxScore: 2_500, level: null }).map((row) => row.nickname)).toEqual(["Mina"]);
    expect(filterTeacherRoster(rows, { search: "", minScore: null, maxScore: null, level: 3 }).map((row) => row.nickname)).toEqual(["Mina"]);
    expect(filterTeacherRoster(rows, { search: "mi", minScore: 1_500, maxScore: 2_500, level: 3 }).map((row) => row.nickname)).toEqual(["Mina"]);
  });

  it("normalizes a saved filter view before applying it to the same roster rules", () => {
    const restored = normalizeTeacherRosterFilters({ search: "  mi  ", minScore: -25, maxScore: 2_500.9, level: 3 });
    expect(restored).toEqual({ search: "mi", minScore: 0, maxScore: 2_500, level: 3 });
    expect(filterTeacherRoster(rows, restored).map((row) => row.nickname)).toEqual(["Mina"]);
    expect(normalizeTeacherRosterFilters({ search: "all", minScore: Number.NaN, maxScore: null, level: 12 })).toEqual({ search: "all", minScore: null, maxScore: null, level: null });
  });

  it("finds only the selected backend default view for automatic roster loading", () => {
    const presets = [
      { id: 7, name: "Level 2", isDefault: 0 },
      { id: 8, name: "Support check-in", isDefault: 1 },
    ];
    expect(getTeacherDefaultRosterPreset(presets)).toEqual(presets[1]);
    expect(getTeacherDefaultRosterPreset([{ id: 9, name: "No default", isDefault: 0 }])).toBeNull();
  });

  it("builds a meeting report from the same filtered rows, summary, and requested sort order", () => {
    const report = getTeacherRosterReport(rows, { search: "", minScore: 1_000, maxScore: null, level: null }, "nickname", "asc");
    expect(report.rows.map((row) => row.nickname)).toEqual(["Ari", "Mina", "Zara"]);
    expect(report.summary).toEqual({ totalStudents: 3, averageScore: 2_000 });
    expect(report.filteredRows).toHaveLength(3);
  });

  it("exports sorted roster rows as UTF-8 CSV with quote escaping and spreadsheet formula safety", () => {
    const csv = buildTeacherRosterCsv([{ nickname: '=Mina, "R"', avatarId: "spark", totalScore: 2_000, updatedAt: new Date("2026-08-22T13:00:00.000Z") }], "Class 5A");
    expect(csv.startsWith("\uFEFF\"Class Name\",\"Nickname\",\"Total Sparks\",\"Derived Level\",\"Level Title\",\"Last Activity UTC\"\r\n")).toBe(true);
    expect(csv).toContain("\"Class 5A\",\"'=Mina, \"\"R\"\"\",\"2000\",\"3\"");
    expect(csv).toContain("\"2026-08-22T13:00:00.000Z\"");
    expect(getTeacherRosterCsvFilename(new Date("2026-08-22T13:00:00.000Z"), "Class 5A")).toBe("MosyMath_Class_5A_Filtered_Roster_2026-08-22.csv");
  });

  it("only permits automatic refresh while the open teacher panel is visible and idle", () => {
    expect(TEACHER_ROSTER_AUTO_REFRESH_MS).toBe(30_000);
    expect(shouldAutoRefreshTeacherRoster({ rosterOpen: true, tabVisible: true, isFetching: false })).toBe(true);
    expect(shouldAutoRefreshTeacherRoster({ rosterOpen: false, tabVisible: true, isFetching: false })).toBe(false);
    expect(shouldAutoRefreshTeacherRoster({ rosterOpen: true, tabVisible: false, isFetching: false })).toBe(false);
    expect(shouldAutoRefreshTeacherRoster({ rosterOpen: true, tabVisible: true, isFetching: true })).toBe(false);
  });
});
