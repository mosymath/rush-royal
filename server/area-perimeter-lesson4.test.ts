import { describe, expect, it } from "vitest";
import { COMPLEX_SHAPES_MULTIPLE_CHOICE, COMPLEX_SHAPES_QUESTION_BANK, COMPLEX_SHAPES_STRATEGIES, MISSION_EXPLORE_AREA_TITLE } from "../client/src/game/areaPerimeterLesson4";

describe("Unit 4 Lesson 4 Complex Shapes curriculum", () => {
  it("keeps the official Mission Explore Area unit title and the supplied decomposition strategies", () => {
    expect(MISSION_EXPLORE_AREA_TITLE).toBe("Mission Explore Area – Unit 4");
    expect(COMPLEX_SHAPES_STRATEGIES).toContain("A complex figure's area does not change when it is divided in different ways.");
  });

  it("preserves the visible complex-shape past-exam labels for red display", () => {
    const labels = COMPLEX_SHAPES_QUESTION_BANK.flatMap((question) => question.sourceLabels);
    expect(labels).toEqual(expect.arrayContaining(["Alex. – Al-Agamy 23", "Ismailia 23"]));
  });

  it("keeps every complex-shape multiple-choice question answerable with four distinct choices", () => {
    COMPLEX_SHAPES_MULTIPLE_CHOICE.forEach((question) => {
      expect(question.choices).toHaveLength(4);
      expect(new Set(question.choices).size).toBe(4);
      expect(question.choices).toContain(question.expectedAnswer);
    });
  });
});
