import { describe, expect, it } from "vitest";
import { UNIT6_FACTOR_MULTIPLE_RELATIONSHIP_NOTES, UNIT6_FACTOR_MULTIPLE_RELATIONSHIP_QUESTIONS } from "../client/src/game/unit6FactorMultipleRelationshipsLesson6";

describe("Unit 6 Lesson 6 factor–multiple relationship source bank", () => {
  it("captures relationship models, checks, riddles, challenge, and source-only multiple-choice material", () => {
    expect(UNIT6_FACTOR_MULTIPLE_RELATIONSHIP_QUESTIONS.length).toBeGreaterThanOrEqual(35);
    expect(UNIT6_FACTOR_MULTIPLE_RELATIONSHIP_NOTES).toContain("Use multiplication to find the relationship between factors and multiples.");
    expect(UNIT6_FACTOR_MULTIPLE_RELATIONSHIP_QUESTIONS.every((question) => question.prompt && question.expectedAnswer && question.explanation)).toBe(true);
  });

  it("preserves supplied relationship, riddle, and challenge answers", () => {
    expect(UNIT6_FACTOR_MULTIPLE_RELATIONSHIP_QUESTIONS.find((question) => question.id === "u6-l6-rel-4-9-36")?.expectedAnswer).toBe("36 is a multiple of 4 and 9; 4 and 9 are factors of 36");
    expect(UNIT6_FACTOR_MULTIPLE_RELATIONSHIP_QUESTIONS.find((question) => question.id === "u6-l6-riddle-factors-28")?.expectedAnswer).toBe("28");
    expect(UNIT6_FACTOR_MULTIPLE_RELATIONSHIP_QUESTIONS.find((question) => question.id === "u6-l6-challenge-multiple4-factor24")?.expectedAnswer).toBe("12");
  });

  it("preserves every visible source label for mandatory future red display", () => {
    const labels = UNIT6_FACTOR_MULTIPLE_RELATIONSHIP_QUESTIONS.flatMap((question) => question.sourceLabels);
    expect(labels).toContain("El-Beheira – Kafr El-Dawwar 22");
    expect(labels).toContain("Suez 22");
    expect(labels).toContain("Aswan 23");
    expect(labels.filter((label) => label === "Cairo – El-Salam 23")).toHaveLength(2);
  });
});
