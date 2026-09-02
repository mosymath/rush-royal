import { describe, expect, it } from "vitest";
import { UNIT6_GCF_LESSON_NOTES, UNIT6_GREATEST_COMMON_FACTOR_QUESTIONS } from "../client/src/game/unit6GreatestCommonFactorLessons3and4";

describe("Unit 6 Lessons 3–4 G.C.F. teacher source bank", () => {
  it("captures the supplied G.C.F. process, practice, grouping applications, challenge, and multiple-choice questions", () => {
    expect(UNIT6_GREATEST_COMMON_FACTOR_QUESTIONS).toHaveLength(49);
    expect(UNIT6_GCF_LESSON_NOTES).toContain("Common factors of two numbers are factors that are the same.");
    expect(UNIT6_GREATEST_COMMON_FACTOR_QUESTIONS.every((question) => question.prompt && question.expectedAnswer && question.explanation)).toBe(true);
  });

  it("preserves key G.C.F. and grouping answers from the supplied pages", () => {
    expect(UNIT6_GREATEST_COMMON_FACTOR_QUESTIONS.find((question) => question.id === "u6-l3-gcf-18-24")?.expectedAnswer).toBe("1, 2, 3, 6; G.C.F. 6");
    expect(UNIT6_GREATEST_COMMON_FACTOR_QUESTIONS.find((question) => question.id === "u6-l3-grouping-snack-packs")?.expectedAnswer).toBe("12 snack packs; 2 apples and 3 candy bags each");
    expect(UNIT6_GREATEST_COMMON_FACTOR_QUESTIONS.find((question) => question.id === "u6-l3-mcq-same-gcf")?.expectedAnswer).toBe("18 and 30");
  });

  it("preserves all visible city labels for mandatory red future-game display", () => {
    const labels = UNIT6_GREATEST_COMMON_FACTOR_QUESTIONS.flatMap((question) => question.sourceLabels);
    expect(labels).toContain("Giza – Abo El-Nomros 23");
    expect(labels).toContain("Cairo – Heliopolis 23");
    expect(labels).toContain("El-Beheira – Kafr El-Dawwar 22");
    expect(labels).toContain("Monofia – Shebin El-Kom 22");
    expect(labels).toContain("Damietta 22");
  });
});
