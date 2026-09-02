import { describe, expect, it } from "vitest";
import { UNIT6_ASSESSMENT_QUESTIONS } from "../client/src/game/unit6Assessment";

describe("Unit Six Assessment source bank", () => {
  it("captures every supplied assessment format across all Unit 6 skills", () => {
    expect(UNIT6_ASSESSMENT_QUESTIONS).toHaveLength(24);
    expect(new Set(UNIT6_ASSESSMENT_QUESTIONS.map((question) => question.skill))).toEqual(new Set(["factors", "prime-composite", "greatest-common-factor", "multiples", "common-multiples"]));
    expect(UNIT6_ASSESSMENT_QUESTIONS.every((question) => question.prompt && question.expectedAnswer && question.explanation)).toBe(true);
  });

  it("validates representative multiple-choice, construction, and G.C.F. answers", () => {
    expect(UNIT6_ASSESSMENT_QUESTIONS.find((question) => question.id === "u6-assessment-prime-30-35")?.expectedAnswer).toBe("31");
    expect(UNIT6_ASSESSMENT_QUESTIONS.find((question) => question.id === "u6-assessment-common-multiples-8-12")?.expectedAnswer).toBe("0, 24");
    expect(UNIT6_ASSESSMENT_QUESTIONS.find((question) => question.id === "u6-assessment-gcf-24-40")?.expectedAnswer).toBe("1, 2, 4, 8; G.C.F. 8");
  });

  it("preserves every visible city label for mandatory red Master Unit Exam display", () => {
    const labels = UNIT6_ASSESSMENT_QUESTIONS.flatMap((question) => question.sourceLabels);
    expect(labels).toContain("Alex. – El-Montaza 23");
    expect(labels).toContain("El-Menia – Samallout 22");
    expect(labels).toContain("El-Beheira – Kafr El-Dawwar 22");
    expect(labels).toContain("Giza – Awseem 23");
  });
});
