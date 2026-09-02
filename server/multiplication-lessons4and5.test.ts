import { describe, expect, it } from "vitest";
import { MULTIPLICATION_PATTERN_QUESTIONS, MULTIPLICATION_PROPERTIES_AND_PATTERNS_BANK, MULTIPLICATION_PROPERTIES_QUESTIONS, MULTIPLICATION_PROPERTY_RULES } from "../client/src/game/multiplicationLessons4and5";

describe("Unit 5 Lessons 4–5 — properties and patterns", () => {
  it("retains the three supplied properties and the zero-addition pattern rule", () => {
    expect(MULTIPLICATION_PROPERTY_RULES.commutative).toContain("same");
    expect(MULTIPLICATION_PROPERTY_RULES.identity).toContain("equals that number");
    expect(MULTIPLICATION_PROPERTY_RULES.zero).toContain("equals 0");
    expect(MULTIPLICATION_PROPERTY_RULES.tensPattern).toContain("10, 100, and 1,000");
  });

  it("records the supplied property and pattern calculations accurately", () => {
    expect(MULTIPLICATION_PROPERTIES_AND_PATTERNS_BANK.length).toBeGreaterThanOrEqual(50);
    expect(MULTIPLICATION_PATTERN_QUESTIONS.find((question) => question.id === "pattern-7x1000")?.expectedAnswer).toBe("7,000");
    expect(MULTIPLICATION_PROPERTIES_QUESTIONS.find((question) => question.id === "prop-850")?.expectedAnswer).toBe("1");
  });

  it("preserves every visible Lessons 4–5 past-exam source label for future red display", () => {
    const labels = MULTIPLICATION_PROPERTIES_AND_PATTERNS_BANK.flatMap((question) => question.sourceLabels);
    expect(labels).toEqual(expect.arrayContaining(["Matrouh 22", "Souhag 22", "Cairo – El-Tebbeen 22", "Giza 23", "Cairo – El Shrouk 23", "Cairo – El Nozha 23", "Ismailia 23", "Alexandria 23", "Alexandria – Borg El-Arab 22"]));
  });
});
