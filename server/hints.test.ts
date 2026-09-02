import { describe, expect, it } from "vitest";
import { shouldShowRoundingHints } from "../client/src/game/hints";

describe("Round Rush difficulty-aware hint visibility", () => {
  it("keeps marked digits available for every Easy challenge question", () => {
    expect(shouldShowRoundingHints({ gameMode: "challenge", activeLevel: 1, isFirstInSection: true })).toBe(true);
    expect(shouldShowRoundingHints({ gameMode: "challenge", activeLevel: 1, isFirstInSection: false })).toBe(true);
  });

  it("shows marked digits only for each new place section in Normal, Hard, Route, and Random", () => {
    for (const [gameMode, activeLevel] of [["challenge", 2], ["challenge", 3], ["route", 1], ["random", 1]] as const) {
      expect(shouldShowRoundingHints({ gameMode, activeLevel, isFirstInSection: true })).toBe(true);
      expect(shouldShowRoundingHints({ gameMode, activeLevel, isFirstInSection: false })).toBe(false);
    }
  });
});
