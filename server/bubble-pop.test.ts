import { describe, expect, it } from "vitest";
import { BUBBLE_ROUTES } from "../client/src/game/bubblePopCurriculum";
import { BUBBLE_QUESTION_BANK, getBubbleQuestions } from "../client/src/game/bubblePopQuestions";
import { createEmptyBubbleProgress, isMasterChapterUnlocked, recordBubbleRouteResult } from "../client/src/game/bubblePopProgress";

describe("Bubble Pop Measurement curriculum", () => {
  it("defines seven separate lesson routes and one final Master Chapter Challenge", () => {
    expect(BUBBLE_ROUTES).toHaveLength(8);
    expect(BUBBLE_ROUTES.filter((route) => !route.isMaster).map((route) => route.id)).toEqual([
      "length", "mass", "capacity", "time", "elapsed-time", "add-subtract", "multiply-divide",
    ]);
    expect(BUBBLE_ROUTES.find((route) => route.id === "master-challenge")?.isMaster).toBe(true);
  });

  it("keeps each question answerable with exactly four distinct choices", () => {
    Object.values(BUBBLE_QUESTION_BANK).flat().forEach((question) => {
      expect(question.choices).toHaveLength(4);
      expect(new Set(question.choices).size).toBe(4);
      expect(question.choices).toContain(question.correctChoice);
      expect(question.explanation.length).toBeGreaterThan(5);
    });
  });

  it("uses the supplied Measurement conversion and assessment answers", () => {
    expect(getBubbleQuestions("length", "normal").find((question) => question.id === "length-n1")?.correctChoice).toBe("5,045 m");
    expect(getBubbleQuestions("mass", "normal").find((question) => question.id === "mass-n1")?.correctChoice).toBe("35,035 g");
    expect(getBubbleQuestions("capacity", "normal").find((question) => question.id === "capacity-n1")?.correctChoice).toBe("1,013 mL");
    expect(getBubbleQuestions("time", "normal").find((question) => question.id === "time-n1")?.correctChoice).toBe("390 seconds");
    expect(getBubbleQuestions("elapsed-time", "easy").find((question) => question.id === "elapsed-e3")?.correctChoice).toBe("3 hr 10 min");
    expect(getBubbleQuestions("master-challenge").find((question) => question.id === "master-6")?.correctChoice).toBe(">");
  });

  it("keeps lesson progress separate and unlocks the Master Challenge only after seven hard routes", () => {
    const original = createEmptyBubbleProgress();
    const lengthComplete = recordBubbleRouteResult(original, "length", "easy", 900, true);
    expect(lengthComplete.length.completedLevels).toEqual(["easy"]);
    expect(lengthComplete.mass.completedLevels).toEqual([]);
    expect(isMasterChapterUnlocked(lengthComplete)).toBe(false);

    let mastered = createEmptyBubbleProgress();
    (["length", "mass", "capacity", "time", "elapsed-time", "add-subtract", "multiply-divide"] as const).forEach((routeId) => {
      mastered = recordBubbleRouteResult(mastered, routeId, "hard", 1500, true);
    });
    expect(isMasterChapterUnlocked(mastered)).toBe(true);
  });
});
