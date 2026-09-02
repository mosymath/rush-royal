/**
 * Presentation-only randomization for Mosy Math Adventure questions.
 * It deliberately never edits prompts, correct answers, explanations, or source labels.
 */
export const createPresentationSeed = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

const hash = (value: string) => {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
};

const seededRandom = (seed: string) => {
  let state = hash(seed) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

/** Keeps the same order while a question is on screen, then produces a new order on the next run. */
export function shuffleForPresentation<T>(items: readonly T[], seed: string): T[] {
  const shuffled = [...items];
  const random = seededRandom(seed);
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex]!, shuffled[index]!];
  }
  return shuffled;
}

export function shuffledChoices<T>(
  questionId: string,
  choices: readonly T[],
  runSeed: string
): T[] {
  return shuffleForPresentation(choices, `${runSeed}:choices:${questionId}`);
}

export function shuffledQuestions<T extends { id: string }>(
  questions: readonly T[],
  runSeed: string
): T[] {
  return shuffleForPresentation(questions, `${runSeed}:questions`);
}
