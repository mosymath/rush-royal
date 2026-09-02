import { shuffleForPresentation, shuffledChoices } from "@/game/answerFairness";

export const TABLE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type TableNumber = (typeof TABLE_NUMBERS)[number];
export type MultiplicationPlayMode = "arcade" | "choice";
export type MultiplicationRouteTable = TableNumber | "master";

export type BalloonGroup = {
  id: string;
  label: string;
  balloonIds: string[];
};

export type MultiplicationFact = {
  id: string;
  table: TableNumber;
  multiplier: TableNumber;
  product: number;
  equation: string;
  balloonGroups: BalloonGroup[];
};

export type TableChallengeQuestion = MultiplicationFact & {
  prompt: string;
  correctChoice: string;
  choices: string[];
  explanation: string;
};

export type MultiplicationTablesProgress = {
  arcadeCompleted: TableNumber[];
  choiceCompleted: TableNumber[];
  arcadeBestScores: Partial<Record<TableNumber, number>>;
  choiceBestScores: Partial<Record<TableNumber, number>>;
};

const STORAGE_KEY = "mosy-math-multiplication-tables-progress-v1";
const FACTORS = TABLE_NUMBERS;

function isTableNumber(value: unknown): value is TableNumber {
  return typeof value === "number" && TABLE_NUMBERS.includes(value as TableNumber);
}

function safeStorage() {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function uniqueTableNumbers(values: unknown): TableNumber[] {
  if (!Array.isArray(values)) return [];
  return Array.from(new Set(values.filter(isTableNumber))).sort((a, b) => a - b) as TableNumber[];
}

function safeBestScores(values: unknown): Partial<Record<TableNumber, number>> {
  if (!values || typeof values !== "object") return {};
  return TABLE_NUMBERS.reduce<Partial<Record<TableNumber, number>>>((result, table) => {
    const score = (values as Record<string, unknown>)[String(table)];
    if (typeof score === "number" && Number.isFinite(score) && score > 0) result[table] = Math.round(score);
    return result;
  }, {});
}

export function createFreshMultiplicationTablesProgress(): MultiplicationTablesProgress {
  return { arcadeCompleted: [], choiceCompleted: [], arcadeBestScores: {}, choiceBestScores: {} };
}

export function readMultiplicationTablesProgress(): MultiplicationTablesProgress {
  const storage = safeStorage();
  if (!storage) return createFreshMultiplicationTablesProgress();
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY) ?? "null") as Partial<MultiplicationTablesProgress> | null;
    if (!saved) return createFreshMultiplicationTablesProgress();
    return {
      arcadeCompleted: uniqueTableNumbers(saved.arcadeCompleted),
      choiceCompleted: uniqueTableNumbers(saved.choiceCompleted),
      arcadeBestScores: safeBestScores(saved.arcadeBestScores),
      choiceBestScores: safeBestScores(saved.choiceBestScores),
    };
  } catch {
    return createFreshMultiplicationTablesProgress();
  }
}

export function saveMultiplicationTablesProgress(progress: MultiplicationTablesProgress) {
  safeStorage()?.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}

export function isMultiplicationTablesMasterUnlocked(progress: MultiplicationTablesProgress, mode: MultiplicationPlayMode) {
  const completed = mode === "arcade" ? progress.arcadeCompleted : progress.choiceCompleted;
  return TABLE_NUMBERS.every((table) => completed.includes(table));
}

export function recordMultiplicationTableResult(
  progress: MultiplicationTablesProgress,
  mode: MultiplicationPlayMode,
  table: MultiplicationRouteTable,
  score: number,
  completed: boolean
): MultiplicationTablesProgress {
  if (table === "master") return progress;
  const completedKey = mode === "arcade" ? "arcadeCompleted" : "choiceCompleted";
  const scoreKey = mode === "arcade" ? "arcadeBestScores" : "choiceBestScores";
  const currentCompleted = progress[completedKey];
  const currentBest = progress[scoreKey];
  return {
    ...progress,
    [completedKey]: completed ? uniqueTableNumbers([...currentCompleted, table]) : currentCompleted,
    [scoreKey]: { ...currentBest, [table]: Math.max(currentBest[table] ?? 0, Math.max(0, Math.round(score))) },
  };
}

export function createMultiplicationFact(table: TableNumber, multiplier: TableNumber): MultiplicationFact {
  const product = table * multiplier;
  return {
    id: `table-${table}-times-${multiplier}`,
    table,
    multiplier,
    product,
    equation: `${table} × ${multiplier} = ${product}`,
    balloonGroups: Array.from({ length: table }, (_, groupIndex) => ({
      id: `table-${table}-times-${multiplier}-group-${groupIndex + 1}`,
      label: `Group ${groupIndex + 1}: ${multiplier} balloons`,
      balloonIds: Array.from({ length: multiplier }, (_, balloonIndex) => `balloon-${groupIndex + 1}-${balloonIndex + 1}`),
    })),
  };
}

function createDistractors(product: number, table: TableNumber, multiplier: TableNumber) {
  const candidates = [
    product + table,
    product - table,
    product + multiplier,
    product - multiplier,
    product + 1,
    product - 1,
    product + 2,
    product - 2,
    product + table * 2,
    product - table * 2,
    product + multiplier * 2,
    product - multiplier * 2,
  ];
  const options = Array.from(new Set(candidates.filter((candidate) => Number.isInteger(candidate) && candidate > 0 && candidate !== product)));
  for (let offset = 3; options.length < 3; offset += 1) {
    const next = product + offset;
    if (!options.includes(next)) options.push(next);
  }
  return options.slice(0, 3);
}

export function createTableChallengeQuestion(table: TableNumber, multiplier: TableNumber, runSeed: string): TableChallengeQuestion {
  const fact = createMultiplicationFact(table, multiplier);
  const correctChoice = String(fact.product);
  const choices = shuffledChoices(fact.id, [correctChoice, ...createDistractors(fact.product, table, multiplier).map(String)], runSeed);
  return {
    ...fact,
    prompt: `What is ${table} × ${multiplier}?`,
    correctChoice,
    choices,
    explanation: `${table} groups of ${multiplier} make ${fact.product}.`,
  };
}

/** A table run has ten distinct facts and never repeats a multiplier in the same run. */
export function createTableChallenge(table: TableNumber, runSeed: string): TableChallengeQuestion[] {
  return shuffleForPresentation(FACTORS, `${runSeed}:table-${table}`).slice(0, 10).map((multiplier) => createTableChallengeQuestion(table, multiplier, runSeed));
}

/** A master run presents exactly one fact from every table from 1 through 12. */
export function createMasterChallenge(runSeed: string): TableChallengeQuestion[] {
  return shuffleForPresentation(TABLE_NUMBERS, `${runSeed}:master-tables`).map((table) => {
    const multiplier = shuffleForPresentation(FACTORS, `${runSeed}:master-factor-${table}`)[0]!;
    return createTableChallengeQuestion(table, multiplier, runSeed);
  });
}
