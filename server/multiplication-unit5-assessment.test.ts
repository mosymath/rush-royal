import { describe, expect, it } from "vitest";
import { UNIT5_ASSESSMENT_QUESTIONS } from "../client/src/game/multiplicationUnit5Assessment";

describe("Unit Five Assessment", () => {
  it("records every supplied assessment section with sufficient mixed-skill coverage", () => {
    expect(UNIT5_ASSESSMENT_QUESTIONS.length).toBeGreaterThanOrEqual(30);
    expect(new Set(UNIT5_ASSESSMENT_QUESTIONS.map((question) => question.skill))).toEqual(new Set(["comparison", "equation", "commutative", "associative", "identity", "zero", "pattern", "word-problem"]));
  });

  it("keeps each supplied multiple-choice answer selectable", () => {
    UNIT5_ASSESSMENT_QUESTIONS.filter((question) => question.choices).forEach((question) => expect(question.choices).toContain(question.expectedAnswer));
  });

  it("preserves all visible assessment city labels for required future red display", () => {
    const labels = UNIT5_ASSESSMENT_QUESTIONS.flatMap((question) => question.sourceLabels);
    expect(labels).toEqual(expect.arrayContaining(["Giza – Abo El-Nomros 23", "Cairo – El-Kobba 22", "Alexandria – Montaza 22", "Port Said 22", "Cairo – El-Nozha 23", "Cairo – El-Shrouk 23", "Cairo – Rod El-Farag 23", "Souhag 23", "Alex. 23", "El-Menia 23", "Giza 23"]));
  });
});
