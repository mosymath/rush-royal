import { describe, expect, it } from "vitest";
import { MULTIPLICATIVE_COMPARISON_PAST_EXAM_QUESTIONS, MULTIPLICATIVE_COMPARISON_QUESTION_BANK, MULTIPLICATIVE_COMPARISON_RULES } from "../client/src/game/multiplicationLesson1";

describe("Unit 5 Lesson 1 — Multiplicative Comparison", () => {
  it("retains the teacher-supplied comparison and repeated-addition rules", () => {
    expect(MULTIPLICATIVE_COMPARISON_RULES.balloons).toContain("6 = 2 × 3");
    expect(MULTIPLICATIVE_COMPARISON_RULES.repeatedAddition).toContain("repeated addition");
  });

  it("keeps every stored answer present and every past-exam option set answerable", () => {
    expect(MULTIPLICATIVE_COMPARISON_QUESTION_BANK.length).toBeGreaterThanOrEqual(35);
    MULTIPLICATIVE_COMPARISON_PAST_EXAM_QUESTIONS.forEach((question) => {
      expect(question.choices).toContain(question.expectedAnswer);
    });
  });

  it("preserves the visible past-exam city labels for future red presentation", () => {
    const labels = MULTIPLICATIVE_COMPARISON_PAST_EXAM_QUESTIONS.flatMap((question) => question.sourceLabels);
    expect(labels).toEqual(expect.arrayContaining(["Giza 23", "Sharkia 22", "Souhag 23", "Cairo – Heliopolis 23", "El-Menia 23", "Aswan 23"]));
  });
});
