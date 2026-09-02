import { describe, expect, it } from "vitest";
import { FINDING_AREA_FORMULAS, FINDING_AREA_PAST_EXAM_QUESTIONS, FINDING_AREA_QUESTION_BANK } from "../client/src/game/areaPerimeterLesson2";

describe("Unit 4 Lesson 2 Finding Area curriculum", () => {
  it("retains the supplied rectangle and square area formulas", () => {
    expect(FINDING_AREA_FORMULAS.rectangle).toContain("A = length × width");
    expect(FINDING_AREA_FORMULAS.square).toContain("A = s × s");
  });

  it("preserves visible past-exam city references for future red source labels", () => {
    const labels = FINDING_AREA_PAST_EXAM_QUESTIONS.flatMap((question) => question.sourceLabels);
    expect(labels).toEqual(expect.arrayContaining([
      "Cairo – El Nozha 23",
      "Giza – 6th October 22",
      "Ismailia 23",
      "El-Monofia – Sadat City 23",
      "El-Menia – Dir Mawas 22",
      "Souhag 23",
    ]));
  });

  it("keeps the supplied multiple-choice questions answerable with four unique choices", () => {
    FINDING_AREA_QUESTION_BANK.filter((question) => question.choices).forEach((question) => {
      expect(question.choices).toHaveLength(4);
      expect(new Set(question.choices).size).toBe(4);
      expect(question.choices).toContain(question.expectedAnswer);
    });
  });
});
