import { describe, expect, it } from "vitest";
import { AREA_MISSION_ROUTES } from "../client/src/game/areaMissionCurriculum";
import { AREA_MISSION_QUESTION_BANK, getAreaMissionQuestions } from "../client/src/game/areaMissionQuestions";
import { createEmptyAreaMissionProgress, isAreaExplorerMissionUnlocked, recordAreaMissionResult } from "../client/src/game/areaMissionProgress";

describe("Mission Explore Area – Unit 4", () => {
  it("defines four lesson missions and a final Area Explorer mission", () => {
    expect(AREA_MISSION_ROUTES.map((route) => route.id)).toEqual(["perimeter", "area", "unknown-dimensions", "complex-shapes", "area-explorer-mission"]);
    expect(AREA_MISSION_ROUTES.at(-1)?.isMaster).toBe(true);
  });

  it("keeps every playable question answerable with four unique choices and retains red exam labels", () => {
    Object.values(AREA_MISSION_QUESTION_BANK).flat().forEach((question) => {
      expect(question.choices).toHaveLength(4);
      expect(new Set(question.choices).size).toBe(4);
      expect(question.choices).toContain(question.correctChoice);
    });
    expect(getAreaMissionQuestions("area").flatMap((question) => question.sourceLabels)).toContain("Cairo – El Shrouk 23");
    expect(getAreaMissionQuestions("complex-shapes").some((question) => question.skill === "complex perimeter")).toBe(true);
  });

  it("uses exactly ten teacher-supplied questions in Easy, Normal, and Hard for every lesson route", () => {
    (["perimeter", "area", "unknown-dimensions", "complex-shapes"] as const).forEach((routeId) => {
      expect(getAreaMissionQuestions(routeId, "easy")).toHaveLength(10);
      expect(getAreaMissionQuestions(routeId, "normal")).toHaveLength(10);
      expect(getAreaMissionQuestions(routeId, "hard")).toHaveLength(10);
      expect(getAreaMissionQuestions(routeId)).toHaveLength(30);
    });
    expect(AREA_MISSION_ROUTES.filter((route) => !route.isMaster).every((route) => route.questionCount === 30)).toBe(true);
  });

  it("keeps the final mission locked until all four lesson hard routes are complete", () => {
    let progress = createEmptyAreaMissionProgress();
    expect(isAreaExplorerMissionUnlocked(progress)).toBe(false);
    (["perimeter", "area", "unknown-dimensions", "complex-shapes"] as const).forEach((routeId) => { progress = recordAreaMissionResult(progress, routeId, "hard", 900, true); });
    expect(isAreaExplorerMissionUnlocked(progress)).toBe(true);
  });
});
