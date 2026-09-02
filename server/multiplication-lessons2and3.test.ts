import { describe, expect, it } from "vitest";
import { COMPARISON_EQUATION_PAST_EXAM_QUESTIONS, COMPARISON_EQUATION_QUESTION_BANK, COMPARISON_EQUATION_RULES } from "../client/src/game/multiplicationLessons2and3";

describe("Unit 5 Lessons 2–3 — comparison equations", () => {
  it("retains the supplied multiply-for-product and divide-for-factor strategies", () => {
    expect(COMPARISON_EQUATION_RULES.unknownProduct).toContain("multiplication");
    expect(COMPARISON_EQUATION_RULES.unknownFactor).toContain("division");
    expect(COMPARISON_EQUATION_RULES.giraffeModel).toBe("x = 3 × 2, so x = 6.");
  });

  it("keeps all recorded answers and past-exam option sets answerable", () => {
    expect(COMPARISON_EQUATION_QUESTION_BANK.length).toBeGreaterThanOrEqual(40);
    COMPARISON_EQUATION_PAST_EXAM_QUESTIONS.forEach((question) => expect(question.choices).toContain(question.expectedAnswer));
  });

  it("preserves visible Unit 5 past-exam source labels for future red display", () => {
    expect(COMPARISON_EQUATION_PAST_EXAM_QUESTIONS.flatMap((question) => question.sourceLabels)).toEqual(expect.arrayContaining(["Suez 22", "Cairo – El-Salam 23"]));
  });
});
