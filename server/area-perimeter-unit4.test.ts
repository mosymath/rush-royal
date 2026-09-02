import { describe, expect, it } from "vitest";
import { FINDING_PERIMETER_FORMULAS, FINDING_PERIMETER_QUESTION_BANK, FINDING_PERIMETER_PAST_EXAM_QUESTIONS } from "../client/src/game/areaPerimeterLesson1";
import { FINDING_AREA_FORMULAS, FINDING_AREA_QUESTION_BANK, FINDING_AREA_PAST_EXAM_QUESTIONS } from "../client/src/game/areaPerimeterLesson2";
import { UNKNOWN_DIMENSIONS_QUESTION_BANK, UNKNOWN_DIMENSIONS_PAST_EXAM_QUESTIONS, UNKNOWN_DIMENSIONS_RULES } from "../client/src/game/areaPerimeterLesson3";

describe("Unit 4 combined curriculum capture", () => {
  it("keeps all currently supplied lesson questions usable and preserves city labels for red display", () => {
    const allQuestions = [...FINDING_PERIMETER_QUESTION_BANK, ...FINDING_AREA_QUESTION_BANK, ...UNKNOWN_DIMENSIONS_QUESTION_BANK];
    const allExamSources = [...FINDING_PERIMETER_PAST_EXAM_QUESTIONS, ...FINDING_AREA_PAST_EXAM_QUESTIONS, ...UNKNOWN_DIMENSIONS_PAST_EXAM_QUESTIONS].flatMap((question) => question.sourceLabels);
    expect(allQuestions.length).toBeGreaterThanOrEqual(90);
    expect(allQuestions.every((question) => question.prompt.length > 12 && question.expectedAnswer.length > 0)).toBe(true);
    expect(allExamSources).toEqual(expect.arrayContaining([
      "Cairo – El Nozha 23",
      "Giza – Abo El Nomros 23",
      "Giza – 6th October 22",
      "El-Menia 23",
      "Alexandria – Borg El-Arab 22",
    ]));
  });

  it("keeps the connected formula families intact before Unit 4 becomes a game world", () => {
    expect(FINDING_PERIMETER_FORMULAS.rectangle).toContain("P = 2 × (length + width)");
    expect(FINDING_AREA_FORMULAS.rectangle).toContain("A = length × width");
    expect(UNKNOWN_DIMENSIONS_RULES.rectangle).toContain("w = A ÷ l");
    expect(UNKNOWN_DIMENSIONS_RULES.square).toContain("s = P ÷ 4");
  });
});
