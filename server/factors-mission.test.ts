import { describe, expect, it } from "vitest";
import { FACTORS_MISSION_ROUTES } from "../client/src/game/factorsMissionCurriculum";
import { FACTORS_MISSION_QUESTION_BANK, getFactorsMissionQuestions } from "../client/src/game/factorsMissionQuestions";
import { isFactorsMasterUnlocked, readFactorsMissionProgress } from "../client/src/game/factorsMissionProgress";

describe("Mission Factors and Multiples – Unit 6", () => {
  it("defines six lesson routes and a teacher-assessment Master Unit Exam that begins locked", () => {
    expect(FACTORS_MISSION_ROUTES.filter((route) => !route.isMaster)).toHaveLength(6);
    expect(FACTORS_MISSION_ROUTES.find((route) => route.isMaster)?.questionCount).toBe(15);
    expect(isFactorsMasterUnlocked(readFactorsMissionProgress())).toBe(false);
  });
  it("provides ten source-only questions at Easy, Normal, and Hard for every lesson", () => {
    FACTORS_MISSION_ROUTES.filter((route) => !route.isMaster).forEach((route) => {
      expect(getFactorsMissionQuestions(route.id, "easy")).toHaveLength(10);
      expect(getFactorsMissionQuestions(route.id, "normal")).toHaveLength(10);
      expect(getFactorsMissionQuestions(route.id, "hard")).toHaveLength(10);
    });
  });
  it("keeps every answer selectable and carries assessment city labels into the Master Unit Exam", () => {
    Object.values(FACTORS_MISSION_QUESTION_BANK).flat().forEach((question) => expect(question.choices).toContain(question.correctChoice));
    expect(getFactorsMissionQuestions("factors-master-exam").some((question) => question.sourceLabels.length > 0)).toBe(true);
  });
});
