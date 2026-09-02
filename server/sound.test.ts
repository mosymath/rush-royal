import { expect, it } from "vitest";
import { roundRushSound } from "../client/src/game/sound";
import { shapesSound } from "../client/src/game/shapesSound";

it("exposes the subtle hover cue used by interactive Mosy Math controls", () => {
  expect(typeof roundRushSound.hover).toBe("function");
  expect(typeof roundRushSound.enableHoverCues).toBe("function");
});

it("rotates Token Trail praise and supportive retry phrases without immediate repetition", () => {
  const praise = Array.from({ length: 4 }, () => shapesSound.tokenTrailCorrect());
  const retries = Array.from({ length: 4 }, () => shapesSound.tokenTrailWrong());
  expect(praise).toEqual(expect.arrayContaining(["Perfect!", "Well done!"]));
  expect(retries).toEqual(expect.arrayContaining(["Keep going!", "You were close!", "Try again!"]));
  expect(praise.every((phrase, index) => index === 0 || phrase !== praise[index - 1])).toBe(true);
  expect(retries.every((phrase, index) => index === 0 || phrase !== retries[index - 1])).toBe(true);
  expect(shapesSound.tokenTrailFeedbackAudio).toMatch(/^round-rush-recorded-wrong-(keepGoing|youWereClose|tryAgain|almostThere)-bright$/);
  shapesSound.tokenTrailCorrect();
  expect(shapesSound.tokenTrailFeedbackAudio).toMatch(/^round-rush-recorded-(perfect|wellDone|brilliant|onARoll)$/);
});
