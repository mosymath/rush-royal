import { describe, expect, it } from "vitest";
import { UNIT6_FACTORS_LESSON_1_QUESTIONS, UNIT6_FACTORS_LESSONS_1_AND_2_QUESTIONS, UNIT6_PRIME_COMPOSITE_LESSON_2_QUESTIONS } from "../client/src/game/unit6FactorsLessons1and2";

describe("Unit 6 Lessons 1–2 teacher source bank", () => {
  it("captures factors, prime/composite classification, factor riddles, and source-only multiple-choice material", () => {
    expect(UNIT6_FACTORS_LESSON_1_QUESTIONS.length).toBeGreaterThanOrEqual(30);
    expect(UNIT6_PRIME_COMPOSITE_LESSON_2_QUESTIONS.length).toBeGreaterThanOrEqual(25);
    expect(UNIT6_FACTORS_LESSONS_1_AND_2_QUESTIONS.every((question) => question.prompt && question.expectedAnswer && question.explanation)).toBe(true);
  });

  it("preserves the teacher supplied factor rules and key worked answers", () => {
    expect(UNIT6_FACTORS_LESSON_1_QUESTIONS.find((question) => question.id === "u6-l1-factors-48")?.expectedAnswer).toBe("1, 2, 3, 4, 6, 8, 12, 16, 24, 48");
    expect(UNIT6_FACTORS_LESSON_1_QUESTIONS.find((question) => question.id === "u6-l1-factor-riddle-28")?.expectedAnswer).toBe("28");
    expect(UNIT6_PRIME_COMPOSITE_LESSON_2_QUESTIONS.find((question) => question.id === "u6-l2-only-even-prime")?.expectedAnswer).toBe("2");
  });

  it("retains every visible past-exam city label for future red gameplay display", () => {
    const labels = UNIT6_FACTORS_LESSONS_1_AND_2_QUESTIONS.flatMap((question) => question.sourceLabels);
    expect(labels).toContain("Alex. 23");
    expect(labels).toContain("Giza – Abo El-Nomros 23");
    expect(labels).toContain("Cairo – El-Salam 23");
    expect(labels).toContain("El-Sharkia – Abo Kebeir 22");
  });
});
