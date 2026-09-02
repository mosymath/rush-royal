import type { ChallengeLevel, ChallengeLevelConfig, GameMode, PlaceConfig, PlaceId, RoundQuestion, RoundingStrategy } from "./types";

export const PLACES: PlaceConfig[] = [
  { id: "10", value: 10, label: "Ten", compactLabel: "10", route: 1, accent: "#ff5a73" },
  { id: "100", value: 100, label: "Hundred", compactLabel: "100", route: 2, accent: "#a98cf4" },
  { id: "1000", value: 1_000, label: "Thousand", compactLabel: "1K", route: 3, accent: "#ffd75a" },
  { id: "10000", value: 10_000, label: "Ten Thousand", compactLabel: "10K", route: 4, accent: "#62cfc1" },
  { id: "100000", value: 100_000, label: "Hundred Thousand", compactLabel: "100K", route: 5, accent: "#ff9a5c" },
  { id: "1000000", value: 1_000_000, label: "Million", compactLabel: "1M", route: 6, accent: "#72a8f7" },
];

export const CHALLENGE_LEVELS: ChallengeLevelConfig[] = [
  { level: 1, difficulty: "easy", name: "Candy Cadet", places: ["10", "100"], questionCount: 10, scoreMultiplier: 1, rewardLabel: "EASY" },
  { level: 2, difficulty: "normal", name: "Pod Pathfinder", places: ["100", "1000", "10000"], questionCount: 12, scoreMultiplier: 1.25, rewardLabel: "NORMAL" },
  { level: 3, difficulty: "hard", name: "Million Mixer", places: ["10", "100", "1000", "10000", "100000", "1000000"], questionCount: 15, scoreMultiplier: 1.5, rewardLabel: "HARD" },
];

const maxMultiples: Record<PlaceId, number> = {
  "10": 99,
  "100": 99,
  "1000": 99,
  "10000": 99,
  "100000": 99,
  "1000000": 8,
};

type TeacherQuestionSpec = {
  id: string;
  place: PlaceId;
  number: number;
  sourceLabel: string;
  strategy?: RoundingStrategy;
  context?: string;
  prompt?: string;
  targetResult?: number;
  choices?: number[];
  correctChoice?: number;
};

/** Curated from the teacher-provided worksheets. */
export const TEACHER_QUESTION_BANK: TeacherQuestionSpec[] = [
  { id: "ten-423", place: "10", number: 423, sourceLabel: "Nearest ten practice" },
  { id: "ten-549", place: "10", number: 549, sourceLabel: "Nearest ten practice" },
  { id: "ten-495", place: "10", number: 495, sourceLabel: "Nearest ten practice" },
  { id: "ten-1287", place: "10", number: 1_287, sourceLabel: "Nearest ten practice" },
  { id: "ten-2618", place: "10", number: 2_618, sourceLabel: "Place-value strategy" },
  { id: "ten-2357", place: "10", number: 2_357, sourceLabel: "Multiple-choice practice" },
  { id: "hundred-874", place: "100", number: 874, sourceLabel: "Nearest hundred practice" },
  { id: "hundred-416", place: "100", number: 416, sourceLabel: "Nearest hundred practice" },
  { id: "hundred-4398", place: "100", number: 4_398, sourceLabel: "Nearest hundred practice" },
  { id: "hundred-1952", place: "100", number: 1_952, sourceLabel: "Nearest hundred practice" },
  { id: "hundred-9360-midpoint", place: "100", number: 9_360, sourceLabel: "Midpoint number line", strategy: "midpoint" },
  { id: "hundred-1537-runner", place: "100", number: 1_537, sourceLabel: "Runner distance", context: "A runner travelled 1,537 metres. Round the distance." },
  { id: "hundred-2721-plane", place: "100", number: 2_721, sourceLabel: "Plane altitude", context: "A plane's altitude increased by 2,721 metres. Round the increase." },
  { id: "thousand-8900", place: "1000", number: 8_900, sourceLabel: "Nearest thousand practice" },
  { id: "thousand-234432", place: "1000", number: 234_432, sourceLabel: "Nearest thousand practice" },
  { id: "thousand-9900", place: "1000", number: 9_900, sourceLabel: "Nearest thousand practice", strategy: "regrouping" },
  { id: "thousand-7578", place: "1000", number: 7_578, sourceLabel: "Nearest thousand practice" },
  { id: "thousand-74231-midpoint", place: "1000", number: 74_231, sourceLabel: "Midpoint number line", strategy: "midpoint" },
  { id: "thousand-161401", place: "1000", number: 161_401, sourceLabel: "Midpoint number line", strategy: "midpoint" },
  { id: "ten-thousand-37205", place: "10000", number: 37_205, sourceLabel: "Nearest ten-thousand practice" },
  { id: "ten-thousand-58936", place: "10000", number: 58_936, sourceLabel: "Nearest ten-thousand practice" },
  { id: "ten-thousand-290290", place: "10000", number: 290_290, sourceLabel: "Nearest ten-thousand practice" },
  { id: "ten-thousand-735462", place: "10000", number: 735_462, sourceLabel: "Assessment rounding" },
  { id: "ten-thousand-23386-ants", place: "10000", number: 23_386, sourceLabel: "Ant colony", context: "A colony has 23,386 ants. Round the population." },
  { id: "ten-thousand-102635-bees", place: "10000", number: 102_635, sourceLabel: "Bee hive", context: "A bee hive contains 102,635 bees. Round the number of bees." },
  { id: "ten-thousand-34089", place: "10000", number: 34_089, sourceLabel: "Multiple-choice practice" },
  { id: "hundred-thousand-483267", place: "100000", number: 483_267, sourceLabel: "Nearest hundred-thousand practice" },
  { id: "hundred-thousand-678090", place: "100000", number: 678_090, sourceLabel: "Nearest hundred-thousand practice" },
  { id: "hundred-thousand-449300", place: "100000", number: 449_300, sourceLabel: "Nearest hundred-thousand practice" },
  { id: "hundred-thousand-12786500", place: "100000", number: 12_786_500, sourceLabel: "Nearest hundred-thousand practice" },
  { id: "million-5367544", place: "1000000", number: 5_367_544, sourceLabel: "Nearest million practice" },
  { id: "million-20843267", place: "1000000", number: 20_843_267, sourceLabel: "Nearest million practice" },
  { id: "million-135984600", place: "1000000", number: 135_984_600, sourceLabel: "Nearest million practice" },
  { id: "million-2453000601", place: "1000000", number: 2_453_000_601, sourceLabel: "Nearest million practice" },
  { id: "million-7556462", place: "1000000", number: 7_556_462, sourceLabel: "Regrouping practice", strategy: "regrouping" },
  { id: "million-32582346", place: "1000000", number: 32_582_346, sourceLabel: "Multiple-choice practice" },
  { id: "inverse-120000", place: "10000", number: 116_034, sourceLabel: "Reverse rounding", strategy: "inverse", prompt: "Which number could round to 120,000 to the nearest TEN THOUSAND?", targetResult: 120_000, choices: [125_678, 116_034, 112_625], correctChoice: 116_034 },
  { id: "inverse-largest-2500", place: "100", number: 2_549, sourceLabel: "Greatest possible number", strategy: "inverse", prompt: "What is the greatest number that rounds to 2,500 to the nearest HUNDRED?", targetResult: 2_500, choices: [2_450, 2_551, 2_549], correctChoice: 2_549 },
];

function seededRandom(seed?: number) {
  let value = (seed ?? Math.floor(Math.random() * 2_147_483_647)) >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function randomInt(random: () => number, minimum: number, maximum: number) {
  return Math.floor(random() * (maximum - minimum + 1)) + minimum;
}

function shuffled<T>(items: T[], random: () => number) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function getPlace(placeId: PlaceId) {
  return PLACES.find((place) => place.id === placeId) ?? PLACES[0];
}

export function getChallengeLevel(level: ChallengeLevel) {
  return CHALLENGE_LEVELS.find((challenge) => challenge.level === level) ?? CHALLENGE_LEVELS[0];
}

export function getRunLength(mode: GameMode, level: ChallengeLevel) {
  if (mode === "challenge") return getChallengeLevel(level).questionCount;
  return 10;
}

export function pickModePlace(mode: GameMode, level: ChallengeLevel, routePlace: PlaceId): PlaceId {
  if (mode === "route") return routePlace;
  const pool = mode === "random" ? PLACES.map((place) => place.id) : getChallengeLevel(level).places;
  return pool[Math.floor(Math.random() * pool.length)];
}

function makeChoices(number: number, target: PlaceConfig, correctAnswer: number, random: () => number, suppliedChoices?: number[]) {
  if (suppliedChoices) return shuffled(suppliedChoices, random);
  const lower = Math.floor(number / target.value) * target.value;
  const upper = lower + target.value;
  const nearbyAlternative = correctAnswer === lower ? upper : lower;
  const farAlternative = correctAnswer === lower ? Math.max(0, lower - target.value) : upper + target.value;
  return shuffled([correctAnswer, nearbyAlternative, farAlternative], random);
}

function buildTeacherQuestion(spec: TeacherQuestionSpec, random: () => number): RoundQuestion {
  const target = getPlace(spec.place);
  const correctAnswer = spec.correctChoice ?? Math.round(spec.number / target.value) * target.value;
  const digits = String(spec.number);
  const highlightedDigitIndex = digits.length - 1 - Math.log10(target.value);
  const decidingDigitIndex = Math.min(digits.length - 1, highlightedDigitIndex + 1);
  const decidingDigit = Number(digits[decidingDigitIndex]);
  const roundsUp = decidingDigit >= 5;
  const lower = Math.floor(spec.number / target.value) * target.value;
  const upper = lower + target.value;
  const midpoint = lower + target.value / 2;
  const isInverse = spec.strategy === "inverse";
  const ruleHint = isInverse
    ? `Test each landing: it must round to ${(spec.targetResult ?? 0).toLocaleString()}.`
    : spec.strategy === "midpoint"
      ? `The midpoint is ${midpoint.toLocaleString()}. Values below it round to ${lower.toLocaleString()}; values at or above it round to ${upper.toLocaleString()}.`
      : `Look right at ${decidingDigit}. ${roundsUp ? "5 or more means round up." : "4 or less means round down."}`;
  const explanation = isInverse
    ? `${correctAnswer.toLocaleString()} rounds to ${(spec.targetResult ?? 0).toLocaleString()} at the nearest ${target.label.toLowerCase()}.`
    : spec.strategy === "midpoint"
      ? `${spec.number.toLocaleString()} is ${spec.number < midpoint ? "below" : "at or above"} the midpoint of ${midpoint.toLocaleString()}, so it rounds to ${correctAnswer.toLocaleString()}.`
      : `${decidingDigit} means ${spec.number.toLocaleString()} rounds ${roundsUp ? "up" : "down"} to ${correctAnswer.toLocaleString()}.`;

  return {
    id: `teacher-${spec.id}`,
    number: spec.number,
    target,
    correctAnswer,
    choices: makeChoices(spec.number, target, correctAnswer, random, spec.choices),
    highlightedDigitIndex,
    decidingDigitIndex,
    decidingDigit,
    ruleHint,
    explanation,
    strategy: spec.strategy ?? "standard",
    context: spec.context,
    prompt: spec.prompt,
    targetResult: spec.targetResult,
    sourceLabel: spec.sourceLabel,
  };
}

export function getTeacherQuestion(id: string) {
  const spec = TEACHER_QUESTION_BANK.find((question) => question.id === id);
  return spec ? buildTeacherQuestion(spec, seededRandom(spec.number)) : undefined;
}

export function createQuestion(placeId: PlaceId, seed?: number): RoundQuestion {
  const random = seededRandom(seed);
  const target = getPlace(placeId);
  const teacherQuestions = TEACHER_QUESTION_BANK.filter((question) => question.place === placeId);
  if (seed === undefined && teacherQuestions.length > 0 && random() < 0.72) {
    return buildTeacherQuestion(teacherQuestions[randomInt(random, 0, teacherQuestions.length - 1)], random);
  }
  const multiplier = randomInt(random, 1, maxMultiples[placeId]);
  const minimumRemainder = Math.max(1, Math.floor(target.value * 0.12));
  const remainder = randomInt(random, minimumRemainder, target.value - 1);
  const number = multiplier * target.value + remainder;
  const correctAnswer = Math.round(number / target.value) * target.value;
  const digits = String(number);
  const highlightedDigitIndex = digits.length - 1 - Math.log10(target.value);
  const decidingDigitIndex = Math.min(digits.length - 1, highlightedDigitIndex + 1);
  const decidingDigit = Number(digits[decidingDigitIndex]);
  const roundsUp = decidingDigit >= 5;

  return {
    id: `${placeId}-${seed ?? Date.now()}-${number}`,
    number,
    target,
    correctAnswer,
    choices: makeChoices(number, target, correctAnswer, random),
    highlightedDigitIndex,
    decidingDigitIndex,
    decidingDigit,
    ruleHint: `Look right at ${decidingDigit}. ${roundsUp ? "5 or more means round up." : "4 or less means round down."}`,
    explanation: `${decidingDigit} means the ${target.label.toLowerCase()} digit rounds ${roundsUp ? "up" : "down"} to ${correctAnswer.toLocaleString()}.`,
    strategy: "standard",
  };
}

export function formatPlaceInstruction(question: RoundQuestion) {
  return question.prompt ?? `Round ${question.number.toLocaleString()} to the nearest ${question.target.label.toUpperCase()}`;
}
