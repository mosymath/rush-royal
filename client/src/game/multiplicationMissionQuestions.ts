import { MULTIPLICATIVE_COMPARISON_QUESTION_BANK } from "./multiplicationLesson1";
import { COMPARISON_EQUATION_QUESTION_BANK } from "./multiplicationLessons2and3";
import { MULTIPLICATION_PATTERN_QUESTIONS, MULTIPLICATION_PROPERTIES_QUESTIONS } from "./multiplicationLessons4and5";
import { APPLIED_PATTERN_QUESTIONS, ASSOCIATIVE_PROPERTY_QUESTIONS } from "./multiplicationLessons6and7";
import { UNIT5_ASSESSMENT_QUESTIONS } from "./multiplicationUnit5Assessment";
import type { MultiplicationLevelId, MultiplicationMissionQuestion, MultiplicationRouteId } from "./multiplicationMissionTypes";

type Raw = { id: string; prompt: string; expectedAnswer: string; sourceLabels: readonly string[]; choices?: readonly string[]; skill?: string; kind?: string; lesson?: string };
const fallback = (answer: string) => {
  const number = Number(answer.replace(/[^0-9.-]/g, ""));
  if (Number.isFinite(number) && answer.trim().match(/^[-\d,.]+(?:\s*(?:m|cm|mm|km|m²|cm²|km²|tens|hundreds|thousands))?$/i)) return [String(number + 1), String(Math.max(0, number - 1)), String(number * 2)] as const;
  if (/[=×÷+\-]/.test(answer)) return ["A different equation", "The inverse equation", "An equation with addition"] as const;
  if (/property/i.test(answer)) return ["Commutative property", "Associative property", "Identity property"] as const;
  return ["Not enough information", "A different relationship", "A different calculation"] as const;
};
const choices = (raw: Raw): readonly [string, string, string, string] => {
  const unique = Array.from(new Set([raw.expectedAnswer, ...(raw.choices ?? []), ...fallback(raw.expectedAnswer)])).slice(0, 4);
  if (unique.length < 4) unique.push("None of these relationships");
  if (unique.length < 4) unique.push("A different multiplication pattern");
  const shift = raw.id.split("").reduce((n, c) => n + c.charCodeAt(0), 0) % 4;
  const rotated = unique.slice(shift, shift + 4).concat(unique.slice(0, Math.max(0, shift + 4 - unique.length)));
  return [rotated[0]!, rotated[1]!, rotated[2]!, rotated[3]!];
};
const adapted = (raw: Raw, level: MultiplicationLevelId): MultiplicationMissionQuestion => ({ id: raw.id, prompt: raw.prompt, correctChoice: raw.expectedAnswer, choices: choices(raw), explanation: `Teacher-source answer: ${raw.expectedAnswer}.`, skill: raw.skill ?? raw.kind ?? raw.lesson ?? "multiplication", level, sourceLabels: raw.sourceLabels, teacherSourceId: raw.id });
const tier = (raws: readonly Raw[]) => raws.slice(0, 30).map((raw, index) => adapted(raw, index < 10 ? "easy" : index < 20 ? "normal" : "hard"));
const equations = COMPARISON_EQUATION_QUESTION_BANK as readonly Raw[];
const equationForge = equations.filter((item) => item.skill === "write-equation" || item.skill === "comparison");
const equationRescue = equations.filter((item) => item.skill === "solve-factor" || item.skill === "solve-product" || item.skill === "word-problem");
const takeThirty = (items: readonly Raw[]) => items.length >= 30 ? items : [...items, ...items, ...items].slice(0, 30);
const BANK = {
  "comparison-quest": tier(takeThirty(MULTIPLICATIVE_COMPARISON_QUESTION_BANK as readonly Raw[])),
  "equation-forge": tier(takeThirty(equationForge)),
  "equation-rescue": tier(takeThirty(equationRescue)),
  "property-parade": tier(takeThirty(MULTIPLICATION_PROPERTIES_QUESTIONS as readonly Raw[])),
  "pattern-power": tier(takeThirty(MULTIPLICATION_PATTERN_QUESTIONS as readonly Raw[])),
  "grouping-galaxy": tier(takeThirty(ASSOCIATIVE_PROPERTY_QUESTIONS as readonly Raw[])),
  "pattern-launch": tier(takeThirty(APPLIED_PATTERN_QUESTIONS as readonly Raw[])),
  "multiplication-master-exam": (UNIT5_ASSESSMENT_QUESTIONS.slice(0, 15) as readonly Raw[]).map((raw) => adapted(raw, "hard")),
} as const;
export const MULTIPLICATION_MISSION_QUESTION_BANK = BANK;
export function getMultiplicationMissionQuestions(routeId: MultiplicationRouteId, level?: MultiplicationLevelId): MultiplicationMissionQuestion[] { const bank = BANK[routeId] as readonly MultiplicationMissionQuestion[]; return routeId === "multiplication-master-exam" || !level ? [...bank] : bank.filter((question) => question.level === level); }
