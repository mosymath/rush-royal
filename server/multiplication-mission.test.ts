import { describe, expect, it } from "vitest";
import { MULTIPLICATION_MISSION_ROUTES } from "../client/src/game/multiplicationMissionCurriculum";
import { MULTIPLICATION_MISSION_QUESTION_BANK, getMultiplicationMissionQuestions } from "../client/src/game/multiplicationMissionQuestions";
import { readMultiplicationMissionProgress, isMultiplicationMasterUnlocked } from "../client/src/game/multiplicationMissionProgress";

describe("Multiply & Conquer Unit 5 mission game", () => {
  it("defines seven lesson routes plus a locked teacher-assessment Master Unit Exam", () => {
    expect(MULTIPLICATION_MISSION_ROUTES.filter((route) => !route.isMaster)).toHaveLength(7);
    expect(MULTIPLICATION_MISSION_ROUTES.find((route) => route.isMaster)?.questionCount).toBe(15);
    expect(isMultiplicationMasterUnlocked(readMultiplicationMissionProgress())).toBe(false);
  });

  it("gives every lesson route 10 playable source-only questions at Easy, Normal, and Hard", () => {
    MULTIPLICATION_MISSION_ROUTES.filter((route) => !route.isMaster).forEach((route) => {
      expect(getMultiplicationMissionQuestions(route.id, "easy")).toHaveLength(10);
      expect(getMultiplicationMissionQuestions(route.id, "normal")).toHaveLength(10);
      expect(getMultiplicationMissionQuestions(route.id, "hard")).toHaveLength(10);
    });
  });

  it("keeps every correct answer selectable and carries assessment source labels into the Master Unit Exam bank", () => {
    Object.values(MULTIPLICATION_MISSION_QUESTION_BANK).flat().forEach((question) => expect(question.choices).toContain(question.correctChoice));
    expect(getMultiplicationMissionQuestions("multiplication-master-exam").some((question) => question.sourceLabels.length > 0)).toBe(true);
  });
});
