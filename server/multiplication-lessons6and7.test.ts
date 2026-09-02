import { describe, expect, it } from "vitest";
import { APPLIED_PATTERN_QUESTIONS, ASSOCIATIVE_AND_APPLIED_PATTERN_BANK, ASSOCIATIVE_PATTERN_RULES, ASSOCIATIVE_PROPERTY_QUESTIONS } from "../client/src/game/multiplicationLessons6and7";

describe("Unit 5 Lessons 6–7 — associative property and applied patterns", () => {
  it("retains the supplied grouping and decomposition strategies", () => {
    expect(ASSOCIATIVE_PATTERN_RULES.associative).toContain("product is the same");
    expect(ASSOCIATIVE_PATTERN_RULES.decomposition).toContain("10, 100, and 1,000");
    expect(ASSOCIATIVE_PATTERN_RULES.sandwich).toContain("16");
  });

  it("records the supplied associative and multiplication-pattern calculations accurately", () => {
    expect(ASSOCIATIVE_AND_APPLIED_PATTERN_BANK.length).toBeGreaterThanOrEqual(65);
    expect(ASSOCIATIVE_PROPERTY_QUESTIONS.find((question) => question.id === "assoc-mom")?.expectedAnswer).toBe("L.E. 100");
    expect(APPLIED_PATTERN_QUESTIONS.find((question) => question.id === "applied-4000x6")?.expectedAnswer).toBe("24,000");
  });

  it("preserves all visible Lessons 6–7 past-exam city labels for future red presentation", () => {
    const labels = ASSOCIATIVE_AND_APPLIED_PATTERN_BANK.flatMap((question) => question.sourceLabels);
    expect(labels).toEqual(expect.arrayContaining(["Alex. – El-Montazah 23", "Cairo – El Nozha 23", "El-Monofia – Sadat City 23", "Cairo – El Shrouk 23", "Giza 23", "Souhag 23", "El-Beheira 23", "Alexandria 23", "Alexandria – El-Montazah 22"]));
  });
});
