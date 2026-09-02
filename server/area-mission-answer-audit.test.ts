import { describe, expect, it } from "vitest";
import { AREA_MISSION_QUESTION_BANK, getAreaMissionQuestions } from "../client/src/game/areaMissionQuestions";
import { FINDING_AREA_PAST_EXAM_QUESTIONS } from "../client/src/game/areaPerimeterLesson2";

describe("Mission Explore Area answer audit", () => {
  it("keeps every live answer explicit, selectable, and free from diagram-only placeholders", () => {
    Object.values(AREA_MISSION_QUESTION_BANK).flat().forEach((question) => {
      expect(question.teacherSourceId.trim()).not.toBe("");
      expect(question.correctChoice.trim()).not.toMatch(/^student calculation/i);
      expect(question.choices).toContain(question.correctChoice);
      expect(new Set(question.choices.map((choice) => choice.normalize("NFC").replace(/\s+/g, " ").trim())).size).toBe(4);
    });
  });

  it("retains the verified 7 cm by 5 cm perimeter answer shown in the teacher review", () => {
    const question = getAreaMissionQuestions("perimeter", "easy").find((item) => item.prompt.includes("7 cm long and 5 cm wide"));
    expect(question?.correctChoice).toBe("24 cm");
    expect(question?.choices).toContain("24 cm");
  });

  it("stores the supplied six-kilometre square area with square-kilometre units", () => {
    const question = FINDING_AREA_PAST_EXAM_QUESTIONS.find((item) => item.id === "area-exam-mcq-square-6-km");
    expect(question).toMatchObject({ expectedAnswer: "36 km²", unit: "km²" });
  });
});
