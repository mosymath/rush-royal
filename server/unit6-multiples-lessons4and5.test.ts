import { describe, expect, it } from "vitest";
import { UNIT6_COMMON_MULTIPLES_LESSON_5_QUESTIONS, UNIT6_MULTIPLES_LESSON_4_QUESTIONS, UNIT6_MULTIPLES_LESSONS_4_AND_5_QUESTIONS, UNIT6_MULTIPLES_LESSON_NOTES } from "../client/src/game/unit6MultiplesLessons4and5";

describe("Unit 6 Lessons 4–5 multiples teacher source bank", () => {
  it("captures supplied multiple and common-multiple concepts, exercises, applications, challenges, and multiple-choice questions", () => {
    expect(UNIT6_MULTIPLES_LESSON_4_QUESTIONS.length).toBeGreaterThanOrEqual(20);
    expect(UNIT6_COMMON_MULTIPLES_LESSON_5_QUESTIONS.length).toBeGreaterThanOrEqual(25);
    expect(UNIT6_MULTIPLES_LESSON_NOTES).toContain("Zero is a multiple of every number.");
    expect(UNIT6_MULTIPLES_LESSONS_4_AND_5_QUESTIONS.every((question) => question.prompt && question.expectedAnswer && question.explanation)).toBe(true);
  });

  it("preserves the supplied worked and applied answers", () => {
    expect(UNIT6_COMMON_MULTIPLES_LESSON_5_QUESTIONS.find((question) => question.id === "u6-l5-common-4-6")?.expectedAnswer).toBe("0, 12, 24, 36, 48");
    expect(UNIT6_COMMON_MULTIPLES_LESSON_5_QUESTIONS.find((question) => question.id === "u6-l5-application-nagwa")?.expectedAnswer).toBe("7 times");
    expect(UNIT6_COMMON_MULTIPLES_LESSON_5_QUESTIONS.find((question) => question.id === "u6-l5-challenge-6-4-10")?.expectedAnswer).toBe("60, 120");
  });

  it("retains every visible source label for future red gameplay display", () => {
    const labels = UNIT6_MULTIPLES_LESSONS_4_AND_5_QUESTIONS.flatMap((question) => question.sourceLabels);
    expect(labels).toContain("Cairo 23");
    expect(labels).toContain("Beheira 23");
    expect(labels).toContain("Monofia – Sers El-Layyan 23");
    expect(labels).toContain("Cairo – Khalifa and Mokattam 22");
    expect(labels).toContain("Luxor 22");
  });
});
