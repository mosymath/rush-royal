import { describe, expect, it } from "vitest";
import { CHALLENGE_LEVELS, createQuestion, getChallengeLevel, getRunLength, getTeacherQuestion, pickModePlace, PLACES, TEACHER_QUESTION_BANK } from "../client/src/game/rounding";

describe("Round Rush content model", () => {
  it("keeps each generated focused-rounding question playable with three unique choices", () => {
    for (const place of PLACES) {
      const question = createQuestion(place.id, place.value + 27);
      expect(question.target.id).toBe(place.id);
      expect(question.choices).toHaveLength(3);
      expect(new Set(question.choices).size).toBe(3);
      expect(question.choices).toContain(question.correctAnswer);
      expect(question.correctAnswer % place.value).toBe(0);
    }
  });

  it("defines Easy, Normal, and Hard challenge levels with ten or more questions", () => {
    expect(CHALLENGE_LEVELS.map((level) => level.level)).toEqual([1, 2, 3]);
    expect(CHALLENGE_LEVELS.map((level) => level.difficulty)).toEqual(["easy", "normal", "hard"]);
    expect(CHALLENGE_LEVELS.every((level) => level.questionCount >= 10)).toBe(true);
    expect(getChallengeLevel(1).questionCount).toBe(10);
    expect(getChallengeLevel(2).questionCount).toBe(12);
    expect(getChallengeLevel(3).questionCount).toBe(15);
    expect(getChallengeLevel(3).scoreMultiplier).toBeGreaterThan(getChallengeLevel(1).scoreMultiplier);
    expect(getChallengeLevel(3).places).toHaveLength(6);
  });

  it("sets appropriate run lengths and always selects a valid configured place", () => {
    expect(getRunLength("route", 1)).toBe(10);
    expect(getRunLength("random", 2)).toBe(10);
    expect(getRunLength("challenge", 1)).toBe(10);
    expect(getRunLength("challenge", 2)).toBe(12);
    expect(PLACES.map((place) => place.id)).toContain(pickModePlace("random", 3, "10"));
    expect(getChallengeLevel(2).places).toContain(pickModePlace("challenge", 2, "10"));
  });

  it("keeps the teacher-provided direct, midpoint, regrouping, and context examples mathematically correct", () => {
    expect(TEACHER_QUESTION_BANK.length).toBeGreaterThanOrEqual(30);
    expect(getTeacherQuestion("ten-423")?.correctAnswer).toBe(420);
    expect(getTeacherQuestion("hundred-9360-midpoint")?.correctAnswer).toBe(9_400);
    expect(getTeacherQuestion("thousand-9900")?.correctAnswer).toBe(10_000);
    expect(getTeacherQuestion("ten-thousand-102635-bees")?.correctAnswer).toBe(100_000);
    expect(getTeacherQuestion("million-32582346")?.correctAnswer).toBe(33_000_000);
    expect(getTeacherQuestion("hundred-1537-runner")?.context).toContain("runner");
  });

  it("supports inverse multiple-choice questions with exactly one supplied correct answer", () => {
    const couldRound = getTeacherQuestion("inverse-120000");
    const greatestPossible = getTeacherQuestion("inverse-largest-2500");
    expect(couldRound?.targetResult).toBe(120_000);
    expect(couldRound?.correctAnswer).toBe(116_034);
    expect(couldRound?.choices).toEqual(expect.arrayContaining([125_678, 116_034, 112_625]));
    expect(greatestPossible?.correctAnswer).toBe(2_549);
    expect(greatestPossible?.choices).toEqual(expect.arrayContaining([2_450, 2_551, 2_549]));
  });

  it("covers every supported place value with a teacher example and an accurate displayed explanation", () => {
    const examples = [
      ["ten-423", 420],
      ["hundred-874", 900],
      ["thousand-8900", 9_000],
      ["ten-thousand-37205", 40_000],
      ["hundred-thousand-483267", 500_000],
      ["million-5367544", 5_000_000],
    ] as const;

    for (const [id, answer] of examples) {
      const question = getTeacherQuestion(id);
      expect(question?.correctAnswer).toBe(answer);
      expect(question?.explanation).toContain(answer.toLocaleString());
      expect(question?.choices).toContain(answer);
    }
  });

  it("keeps teacher questions varied enough for each configured campaign tier", () => {
    for (const place of PLACES) {
      expect(TEACHER_QUESTION_BANK.filter((question) => question.place === place.id).length).toBeGreaterThanOrEqual(4);
    }
    expect(TEACHER_QUESTION_BANK.filter((question) => question.strategy === "midpoint").length).toBeGreaterThanOrEqual(3);
    expect(TEACHER_QUESTION_BANK.filter((question) => question.strategy === "regrouping").length).toBeGreaterThanOrEqual(2);
    expect(TEACHER_QUESTION_BANK.filter((question) => question.strategy === "inverse").length).toBeGreaterThanOrEqual(2);
    expect(TEACHER_QUESTION_BANK.filter((question) => Boolean(question.context)).length).toBeGreaterThanOrEqual(4);
  });
});
