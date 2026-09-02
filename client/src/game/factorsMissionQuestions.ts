import {
  UNIT6_FACTORS_LESSON_1_QUESTIONS,
  UNIT6_PRIME_COMPOSITE_LESSON_2_QUESTIONS,
} from "./unit6FactorsLessons1and2";
import { UNIT6_GREATEST_COMMON_FACTOR_QUESTIONS } from "./unit6GreatestCommonFactorLessons3and4";
import {
  UNIT6_COMMON_MULTIPLES_LESSON_5_QUESTIONS,
  UNIT6_MULTIPLES_LESSON_4_QUESTIONS,
} from "./unit6MultiplesLessons4and5";
import { UNIT6_FACTOR_MULTIPLE_RELATIONSHIP_QUESTIONS } from "./unit6FactorMultipleRelationshipsLesson6";
import { UNIT6_ASSESSMENT_QUESTIONS } from "./unit6Assessment";
import type {
  FactorsLevelId,
  FactorsQuestion,
  FactorsRouteId,
} from "./factorsMissionTypes";

type Raw = {
  id: string;
  prompt: string;
  expectedAnswer: string;
  explanation: string;
  sourceLabels: readonly string[];
  choices?: readonly string[];
  skill: string;
};

const meaningfulDistractors = (raw: Raw) => {
  const numeric = Number(raw.expectedAnswer.replace(/[^0-9.-]/g, ""));
  if (Number.isFinite(numeric) && /^[-\d,.]+$/.test(raw.expectedAnswer.trim())) {
    return [
      String(Math.max(0, numeric - 1)),
      String(numeric + 1),
      String(numeric * 2 || 2),
      String(Math.max(0, numeric + 10)),
    ];
  }
  if (/prime|composite/i.test(raw.prompt)) {
    return ["A composite number", "A prime number", "Neither prime nor composite", "A multiple of 2"];
  }
  if (/greatest common factor|g\.c\.f|gcf/i.test(raw.prompt)) {
    return ["A common multiple", "The least common multiple", "A shared factor", "A product"];
  }
  if (/multiple/i.test(raw.prompt)) {
    return ["A factor", "A prime number", "A quotient", "A remainder"];
  }
  return ["A different factor relationship", "A common multiple", "A prime-number rule", "A product relationship"];
};

const fill = (raw: Raw): [string, string, string, string] => {
  const options = Array.from(
    new Set([raw.expectedAnswer, ...(raw.choices ?? []), ...meaningfulDistractors(raw)])
  );
  return [options[0]!, options[1]!, options[2]!, options[3]!];
};

const adapt = (raw: Raw, level: FactorsLevelId): FactorsQuestion => ({
  id: raw.id,
  prompt: raw.prompt,
  correctChoice: raw.expectedAnswer,
  choices: fill(raw),
  explanation: raw.explanation,
  skill: raw.skill,
  level,
  sourceLabels: raw.sourceLabels,
  teacherSourceId: raw.id,
});

const thirty = (questions: readonly Raw[]) =>
  [...questions, ...questions, ...questions]
    .slice(0, 30)
    .map((question, index) =>
      adapt(question, index < 10 ? "easy" : index < 20 ? "normal" : "hard")
    );

const BANK = {
  "factor-trail": thirty(UNIT6_FACTORS_LESSON_1_QUESTIONS),
  "prime-pulse": thirty(UNIT6_PRIME_COMPOSITE_LESSON_2_QUESTIONS),
  "gcf-guild": thirty(UNIT6_GREATEST_COMMON_FACTOR_QUESTIONS),
  "multiple-momentum": thirty(UNIT6_MULTIPLES_LESSON_4_QUESTIONS),
  "common-crossing": thirty(UNIT6_COMMON_MULTIPLES_LESSON_5_QUESTIONS),
  "relationship-relay": thirty(UNIT6_FACTOR_MULTIPLE_RELATIONSHIP_QUESTIONS),
  "factors-master-exam": UNIT6_ASSESSMENT_QUESTIONS.slice(0, 15).map(question =>
    adapt(question, "hard")
  ),
} as const;

export const FACTORS_MISSION_QUESTION_BANK = BANK;

export const getFactorsMissionQuestions = (
  id: FactorsRouteId,
  level?: FactorsLevelId
) =>
  id === "factors-master-exam" || !level
    ? [...BANK[id]]
    : [...BANK[id]].filter(question => question.level === level);
