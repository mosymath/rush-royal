import { describe, expect, it } from "vitest";
import {
  TABLE_NUMBERS,
  createFreshMultiplicationTablesProgress,
  createMasterChallenge,
  createMultiplicationFact,
  createTableChallenge,
  createTableChallengeQuestion,
  isMultiplicationTablesMasterUnlocked,
  recordMultiplicationTableResult,
} from "./multiplicationTables";

describe("Balloon Times Town multiplication foundations", () => {
  it("models each table fact as exact groups of exact balloon counts", () => {
    for (const table of TABLE_NUMBERS) {
      for (const multiplier of TABLE_NUMBERS) {
        const fact = createMultiplicationFact(table, multiplier);
        expect(fact.product).toBe(table * multiplier);
        expect(fact.balloonGroups).toHaveLength(table);
        expect(fact.balloonGroups.reduce((sum, group) => sum + group.balloonIds.length, 0)).toBe(table * multiplier);
        expect(fact.balloonGroups.every((group) => group.balloonIds.length === multiplier)).toBe(true);
      }
    }
  });

  it("creates table practice runs with ten unique facts from the selected table", () => {
    for (const table of TABLE_NUMBERS) {
      const questions = createTableChallenge(table, `table-${table}`);
      expect(questions).toHaveLength(10);
      expect(new Set(questions.map((question) => question.id)).size).toBe(10);
      expect(questions.every((question) => question.table === table)).toBe(true);
    }
  });

  it("creates master challenges that cover all twelve tables once", () => {
    const questions = createMasterChallenge("master-coverage");
    expect(questions).toHaveLength(12);
    expect(new Set(questions.map((question) => question.table))).toEqual(new Set(TABLE_NUMBERS));
  });

  it("keeps a correct unique answer in every shuffled choice list", () => {
    for (const table of TABLE_NUMBERS) {
      for (const multiplier of TABLE_NUMBERS) {
        const question = createTableChallengeQuestion(table, multiplier, `question-${table}-${multiplier}`);
        expect(question.choices).toHaveLength(4);
        expect(new Set(question.choices).size).toBe(4);
        expect(question.choices).toContain(question.correctChoice);
      }
    }
  });

  it("varies the visible correct-choice position across presentation seeds", () => {
    const positions = new Set<number>();
    for (let index = 0; index < 24; index += 1) {
      const question = createTableChallengeQuestion(7, 8, `fairness-${index}`);
      positions.add(question.choices.indexOf(question.correctChoice));
    }
    expect(positions.size).toBeGreaterThan(2);
  });

  it("unlocks each master only after all twelve matching table runs are completed", () => {
    let progress = createFreshMultiplicationTablesProgress();
    TABLE_NUMBERS.slice(0, 11).forEach((table) => { progress = recordMultiplicationTableResult(progress, "arcade", table, 800, true); });
    expect(isMultiplicationTablesMasterUnlocked(progress, "arcade")).toBe(false);
    progress = recordMultiplicationTableResult(progress, "arcade", 12, 900, true);
    expect(isMultiplicationTablesMasterUnlocked(progress, "arcade")).toBe(true);
    expect(isMultiplicationTablesMasterUnlocked(progress, "choice")).toBe(false);
  });
});
