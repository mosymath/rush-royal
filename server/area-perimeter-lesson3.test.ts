import { describe, expect, it } from "vitest";
import { UNKNOWN_DIMENSIONS_PAST_EXAM_QUESTIONS, UNKNOWN_DIMENSIONS_QUESTION_BANK, UNKNOWN_DIMENSIONS_RULES } from "../client/src/game/areaPerimeterLesson3";

describe("Unit 4 Lesson 3 Unknown Dimensions curriculum", () => {
  it("retains the inverse formulas for area and perimeter", () => {
    expect(UNKNOWN_DIMENSIONS_RULES.rectangle).toEqual(expect.arrayContaining(["l = A ÷ w", "w = A ÷ l", "l = (P ÷ 2) − w", "w = (P ÷ 2) − l"]));
    expect(UNKNOWN_DIMENSIONS_RULES.square).toContain("s = P ÷ 4");
  });

  it("preserves visible past-exam city references for future red source labels", () => {
    const labels = UNKNOWN_DIMENSIONS_PAST_EXAM_QUESTIONS.flatMap((question) => question.sourceLabels);
    expect(labels).toEqual(expect.arrayContaining([
      "El-Behiera – Hosh Essa 23",
      "Alex. – El Montazah 23",
      "Giza – Awseem 23",
      "Cairo – El-Kobba 22",
      "Alexandria – Borg El-Arab 22",
    ]));
  });

  it("keeps all stored multiple-choice questions answerable with four unique choices", () => {
    UNKNOWN_DIMENSIONS_QUESTION_BANK.filter((question) => question.choices).forEach((question) => {
      expect(question.choices).toHaveLength(4);
      expect(new Set(question.choices).size).toBe(4);
      expect(question.choices).toContain(question.expectedAnswer);
    });
  });
});
