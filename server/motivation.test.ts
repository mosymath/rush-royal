import { describe, expect, it } from "vitest";
import { selectMotivation, selectWrongMotivation, type Motivation, type WrongMotivation } from "../client/src/game/motivation";

describe("Round Rush encouragement rotation", () => {
  it("never repeats the same phrase or voice clip on consecutive correct answers", () => {
    const sequence: Motivation[] = [];
    let last: Motivation | null = null;
    for (let questionNumber = 1; questionNumber <= 12; questionNumber += 1) {
      const encouragement = selectMotivation({ questionNumber, combo: questionNumber, last });
      sequence.push(encouragement);
      last = encouragement;
    }

    for (let index = 1; index < sequence.length; index += 1) {
      expect(sequence[index].text).not.toBe(sequence[index - 1].text);
      expect(sequence[index].clip).not.toBe(sequence[index - 1].clip);
    }
  });

  it("keeps streak and milestone messages special instead of using them for every answer", () => {
    const everyday = selectMotivation({ questionNumber: 2, combo: 2, last: null });
    const streak = selectMotivation({ questionNumber: 3, combo: 3, last: everyday });
    const milestone = selectMotivation({ questionNumber: 5, combo: 1, last: streak });

    expect(everyday.kind).toBe("everyday");
    expect(streak.kind).toBe("streak");
    expect(streak.text).toBe("You are on a roll!");
    expect(milestone.kind).toBe("milestone");
  });

  it("rotates caring retry feedback after incorrect answers without hiding the learning opportunity", () => {
    const sequence: WrongMotivation[] = [];
    let last: WrongMotivation | null = null;
    for (let questionNumber = 1; questionNumber <= 6; questionNumber += 1) {
      const encouragement = selectWrongMotivation(questionNumber, last);
      sequence.push(encouragement);
      last = encouragement;
    }

    expect(sequence.map((message) => message.text)).toEqual([
      "You are close — keep going!",
      "Good try! Take another look.",
      "Keep going — you can do this!",
      "Try again — your next landing can sparkle!",
      "Almost there! Check the digit on the right.",
      "Every try helps your math brain grow!",
    ]);
    for (let index = 1; index < sequence.length; index += 1) expect(sequence[index].text).not.toBe(sequence[index - 1].text);
    expect(sequence.map((message) => message.clip)).toEqual(["keepGoing", "youWereClose", "keepGoing", "tryAgain", "almostThere", "youWereClose"]);
    for (let index = 1; index < sequence.length; index += 1) expect(sequence[index].clip).not.toBe(sequence[index - 1].clip);
  });
});
