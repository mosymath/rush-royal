import { describe, expect, it } from "vitest";
import { UNIT7_MULTIPLES_OF_TEN_LESSON_5 } from "../client/src/game/unit7MultiplesOfTenLesson5";

describe("Unit 7 Lesson 5 source bank", () => {
  it("validates patterns and the supplied error analysis", () => {
    expect(UNIT7_MULTIPLES_OF_TEN_LESSON_5.find((x) => x.id === "u7-l5-48x90")?.expectedAnswer).toBe("4,320");
    expect(UNIT7_MULTIPLES_OF_TEN_LESSON_5.find((x) => x.id === "u7-l5-error")?.expectedAnswer).toBe("No; 1,100");
  });
  it("keeps every source-choice key selectable or visibly represented in its supplied equation option", () => {
    UNIT7_MULTIPLES_OF_TEN_LESSON_5.filter((x) => x.choices).forEach((x) => {
      expect(x.choices?.some((choice) => choice === x.expectedAnswer || choice.includes(x.expectedAnswer))).toBe(true);
    });
  });
  it("preserves visible labels", () => {
    const labels = UNIT7_MULTIPLES_OF_TEN_LESSON_5.flatMap((x) => x.sourceLabels);
    expect(labels).toContain("Cairo 23");
    expect(labels).toContain("Giza – Abo El-Nomros 23");
  });
});
