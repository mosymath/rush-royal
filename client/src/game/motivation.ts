import type { MotivationClip } from "./sound";

export type Motivation = {
  clip: MotivationClip;
  text: string;
  kind: "everyday" | "streak" | "milestone";
};

export type WrongMotivationClip = "keepGoing" | "youWereClose" | "tryAgain" | "almostThere";
export type WrongMotivation = { text: string; clip: WrongMotivationClip };

type MotivationInput = {
  questionNumber: number;
  combo: number;
  last: Motivation | null;
};

const everydayPraise: Motivation[] = [
  { clip: "perfect", text: "Perfect landing!", kind: "everyday" },
  { clip: "wellDone", text: "Well done!", kind: "everyday" },
  { clip: "brilliant", text: "Nice rounding!", kind: "everyday" },
  { clip: "perfect", text: "You nailed it!", kind: "everyday" },
  { clip: "wellDone", text: "Great job!", kind: "everyday" },
  { clip: "brilliant", text: "Sharp thinking!", kind: "everyday" },
];

const streakPraise: Motivation[] = [
  { clip: "onARoll", text: "You are on a roll!", kind: "streak" },
  { clip: "brilliant", text: "Brilliant streak!", kind: "streak" },
  { clip: "wellDone", text: "That combo is glowing!", kind: "streak" },
];

const milestonePraise: Motivation[] = [
  { clip: "perfect", text: "Five sparkling answers!", kind: "milestone" },
  { clip: "brilliant", text: "A brilliant milestone!", kind: "milestone" },
  { clip: "wellDone", text: "Your route is shining!", kind: "milestone" },
];

const supportiveRetryMessages: WrongMotivation[] = [
  { text: "You are close — keep going!", clip: "keepGoing" },
  { text: "Good try! Take another look.", clip: "youWereClose" },
  { text: "Keep going — you can do this!", clip: "keepGoing" },
  { text: "Try again — your next landing can sparkle!", clip: "tryAgain" },
  { text: "Almost there! Check the digit on the right.", clip: "almostThere" },
  { text: "Every try helps your math brain grow!", clip: "youWereClose" },
];

function pickDifferent(candidates: Motivation[], index: number, last: Motivation | null) {
  const fresh = candidates.filter((candidate) => candidate.clip !== last?.clip && candidate.text !== last?.text);
  const pool = fresh.length > 0 ? fresh : candidates;
  return pool[index % pool.length];
}

/** Picks audible praise without allowing the same spoken clip or phrase to play twice in a row. */
export function selectMotivation({ questionNumber, combo, last }: MotivationInput): Motivation {
  if (combo >= 3 && combo % 3 === 0) return pickDifferent(streakPraise, Math.floor(combo / 3) - 1, last);
  if (questionNumber > 0 && questionNumber % 5 === 0) return pickDifferent(milestonePraise, Math.floor(questionNumber / 5) - 1, last);
  return pickDifferent(everydayPraise, questionNumber - 1, last);
}

/** Picks caring retry language without repeating the same phrase after consecutive mistakes. */
export function selectWrongMotivation(questionNumber: number, last: WrongMotivation | null): WrongMotivation {
  const startIndex = (questionNumber - 1) % supportiveRetryMessages.length;
  for (let offset = 0; offset < supportiveRetryMessages.length; offset += 1) {
    const candidate = supportiveRetryMessages[(startIndex + offset) % supportiveRetryMessages.length];
    if (candidate.text !== last?.text) return candidate;
  }
  return supportiveRetryMessages[startIndex];
}
