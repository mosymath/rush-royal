import { describe, expect, it } from "vitest";
import { FINDING_PERIMETER_FORMULAS, FINDING_PERIMETER_PAST_EXAM_QUESTIONS, FINDING_PERIMETER_QUESTION_BANK } from "../client/src/game/areaPerimeterLesson1";

describe("Unit 4 Lesson 1 Finding Perimeter curriculum", () => {
  it("retains rectangle and square perimeter formulas from the supplied lesson", () => {
    expect(FINDING_PERIMETER_FORMULAS.rectangle).toContain("P = 2 × (length + width)");
    expect(FINDING_PERIMETER_FORMULAS.square).toContain("P = 4 × side");
  });

  it("preserves every supplied past-exam city reference for future red source labels", () => {
    const labels = FINDING_PERIMETER_PAST_EXAM_QUESTIONS.flatMap((question) => question.sourceLabels);
    expect(labels).toEqual(expect.arrayContaining([
      "Cairo – El-Salam 23",
      "Cairo – El Nozha 23",
      "Alexandria – Montaza 22",
      "Port Said 22",
      "Giza – Abo El Nomros 23",
    ]));
  });

  it("keeps all multiple-choice questions answerable with four unique choices", () => {
    FINDING_PERIMETER_QUESTION_BANK.filter((question) => question.choices).forEach((question) => {
      expect(question.choices).toHaveLength(4);
      expect(new Set(question.choices).size).toBe(4);
      expect(question.choices).toContain(question.expectedAnswer);
    });
  });
});
