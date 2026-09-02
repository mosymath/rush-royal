/**
 * Unit 5, Lesson 1 — Multiplicative Comparison.
 * Every question below is transcribed only from the teacher-supplied pages.
 * Red source labels must remain red when the future game presents these items.
 */

export type MultiplicativeComparisonQuestion = {
  id: string;
  kind: "comparison" | "equation" | "repeated-addition" | "tape-diagram" | "word-problem";
  prompt: string;
  expectedAnswer: string;
  sourceLabels: readonly string[];
  choices?: readonly string[];
  tape?: readonly number[];
};

export const MULTIPLICATIVE_COMPARISON_RULES = {
  definition: "Multiplicative comparison means comparing two things or sets that need multiplication.",
  balloons: "Bassem has twice as many balloons as Amgad: 6 = 2 × 3.",
  repeatedAddition: "Multiplication is repeated addition.",
  comparisonLanguage: ["times as many", "times the number"] as const,
} as const;

export const MULTIPLICATIVE_COMPARISON_WORKED_EXAMPLES: readonly MultiplicativeComparisonQuestion[] = [
  { id: "mult-comp-example-15-5", kind: "comparison", prompt: "Compare 15 and 5. Complete: 15 is ___ times the number 5.", expectedAnswer: "3", sourceLabels: [], tape: [5, 5, 5] },
  { id: "mult-comp-example-50-10", kind: "comparison", prompt: "Compare 50 and 10. Complete: 50 is ___ times the number 10.", expectedAnswer: "5", sourceLabels: [], tape: [10, 10, 10, 10, 10] },
  { id: "mult-comp-example-addition-5", kind: "repeated-addition", prompt: "Rewrite using multiplication: 5 + 5 + 5 = 15.", expectedAnswer: "3 × 5 = 15", sourceLabels: [] },
  { id: "mult-comp-example-addition-3", kind: "repeated-addition", prompt: "Rewrite using multiplication: 3 + 3 + 3 + 3 + 3 + 3 + 3 = 21.", expectedAnswer: "7 × 3 = 21", sourceLabels: [] },
  { id: "mult-comp-example-tape-48", kind: "tape-diagram", prompt: "A tape diagram has six equal parts of 8. Complete: ___ is ___ times the number 8.", expectedAnswer: "48 is 6 times the number 8", sourceLabels: [], tape: [8, 8, 8, 8, 8, 8] },
  { id: "mult-comp-example-tape-40", kind: "tape-diagram", prompt: "A tape diagram has eight equal parts of 5. Complete: ___ is ___ times the number 5.", expectedAnswer: "40 is 8 times the number 5", sourceLabels: [], tape: [5, 5, 5, 5, 5, 5, 5, 5] },
];

export const MULTIPLICATIVE_COMPARISON_PRACTICE: readonly MultiplicativeComparisonQuestion[] = [
  { id: "mult-comp-practice-add-4", kind: "repeated-addition", prompt: "Complete: 4 + 4 + 4 = ___ × ___ = ___.", expectedAnswer: "3 × 4 = 12", sourceLabels: [] },
  { id: "mult-comp-practice-add-7", kind: "repeated-addition", prompt: "Complete: 7 + 7 + 7 + 7 + 7 = ___ × ___ = ___.", expectedAnswer: "5 × 7 = 35", sourceLabels: ["Alex. 23"] },
  { id: "mult-comp-practice-add-5", kind: "repeated-addition", prompt: "Complete: 5 + 5 + 5 + 5 = ___ × ___ = ___.", expectedAnswer: "4 × 5 = 20", sourceLabels: ["Souhag 23"] },
  { id: "mult-comp-practice-add-2", kind: "repeated-addition", prompt: "Complete: 2 + 2 + 2 + 2 + 2 + 2 = ___ × ___ = ___.", expectedAnswer: "6 × 2 = 12", sourceLabels: [] },
  { id: "mult-comp-practice-add-8", kind: "repeated-addition", prompt: "Complete: 8 + 8 = ___ × ___ = ___.", expectedAnswer: "2 × 8 = 16", sourceLabels: [] },
  { id: "mult-comp-practice-equation-6", kind: "repeated-addition", prompt: "Rewrite using multiplication: 6 + 6 + 6 = 18.", expectedAnswer: "3 × 6 = 18", sourceLabels: [] },
  { id: "mult-comp-practice-equation-2", kind: "repeated-addition", prompt: "Rewrite using multiplication: 2 + 2 + 2 + 2 + 2 + 2 + 2 = 14.", expectedAnswer: "7 × 2 = 14", sourceLabels: [] },
  { id: "mult-comp-practice-equation-5", kind: "repeated-addition", prompt: "Rewrite using multiplication: 5 + 5 + 5 + 5 + 5 = 25.", expectedAnswer: "5 × 5 = 25", sourceLabels: [] },
  { id: "mult-comp-practice-equation-8", kind: "repeated-addition", prompt: "Rewrite using multiplication: 2 + 2 + 2 + 2 = 8.", expectedAnswer: "4 × 2 = 8", sourceLabels: [] },
  { id: "mult-comp-practice-equation-36", kind: "repeated-addition", prompt: "Rewrite using multiplication: 9 + 9 + 9 + 9 = 36.", expectedAnswer: "4 × 9 = 36", sourceLabels: [] },
  { id: "mult-comp-practice-equation-50", kind: "repeated-addition", prompt: "Rewrite using multiplication: 10 + 10 + 10 + 10 + 10 = 50.", expectedAnswer: "5 × 10 = 50", sourceLabels: [] },
  ...[15, 28, 27, 10, 12, 18, 18, 21, 24, 35].map((total, index) => {
    const bases = [3, 7, 9, 2, 3, 6, 9, 7, 6, 7] as const;
    const factor = total / bases[index]!;
    return { id: `mult-comp-practice-compare-${total}-${bases[index]}`, kind: "comparison" as const, prompt: `Compare ${total} and ${bases[index]}. Complete: ${total} is ___ times the number ${bases[index]}.`, expectedAnswer: String(factor), sourceLabels: [] };
  }),
  { id: "mult-comp-practice-tape-20", kind: "tape-diagram", prompt: "A tape diagram has four equal parts of 5. Complete: ___ is ___ times the number 5.", expectedAnswer: "20 is 4 times the number 5", sourceLabels: [], tape: [5, 5, 5, 5] },
  { id: "mult-comp-practice-tape-24", kind: "tape-diagram", prompt: "A tape diagram has three equal parts of 8. Complete: ___ is ___ times the number 8.", expectedAnswer: "24 is 3 times the number 8", sourceLabels: [], tape: [8, 8, 8] },
  { id: "mult-comp-practice-tape-16", kind: "tape-diagram", prompt: "A tape diagram has four equal parts of 4. Complete: ___ is ___ times the number 4.", expectedAnswer: "16 is 4 times the number 4", sourceLabels: [], tape: [4, 4, 4, 4] },
  { id: "mult-comp-practice-tape-40", kind: "tape-diagram", prompt: "A tape diagram has four equal parts of 10. Complete: ___ is ___ times the number 10.", expectedAnswer: "40 is 4 times the number 10", sourceLabels: [], tape: [10, 10, 10, 10] },
  { id: "mult-comp-practice-complete-28", kind: "comparison", prompt: "Complete: 28 is ___ times the number 7.", expectedAnswer: "4", sourceLabels: ["El-Monofia – Sadat City 23"] },
  { id: "mult-comp-practice-complete-35", kind: "comparison", prompt: "Complete: 35 is ___ times the number 5.", expectedAnswer: "7", sourceLabels: [] },
  { id: "mult-comp-practice-complete-12", kind: "comparison", prompt: "Complete: 12 is 6 times the number ___.", expectedAnswer: "2", sourceLabels: [] },
  { id: "mult-comp-practice-complete-40", kind: "comparison", prompt: "Complete: 8 + 8 + 8 + 8 + 8 = 40 is ___ times the number 8.", expectedAnswer: "5", sourceLabels: ["Ismailia 23"] },
  { id: "mult-comp-challenge-photos", kind: "word-problem", prompt: "Hanan has 40 photos. She has 5 times as many photos as Hany. How many photos does Hany have?", expectedAnswer: "8", sourceLabels: [] },
];

export const MULTIPLICATIVE_COMPARISON_PAST_EXAM_QUESTIONS: readonly MultiplicativeComparisonQuestion[] = [
  { id: "mult-comp-exam-45-5", kind: "comparison", prompt: "45 is ___ times the number 5.", expectedAnswer: "9", sourceLabels: ["Giza 23", "Sharkia 22"], choices: ["9", "6", "5", "40"] },
  { id: "mult-comp-exam-6-times-4", kind: "comparison", prompt: "The number ___ equals 6 times 4.", expectedAnswer: "24", sourceLabels: ["Giza 23"], choices: ["10", "2", "24", "12"] },
  { id: "mult-comp-exam-40-5", kind: "comparison", prompt: "The number 40 equals 5 times the number ___.", expectedAnswer: "8", sourceLabels: ["Souhag 23"], choices: ["4", "8", "15", "25"] },
  { id: "mult-comp-exam-42-6", kind: "comparison", prompt: "The number 42 is 6 times the number ___.", expectedAnswer: "7", sourceLabels: ["Giza 23"], choices: ["7", "9", "8", "5"] },
  { id: "mult-comp-exam-10-times-430", kind: "equation", prompt: "10 times the number 430 is ___.", expectedAnswer: "4,300", sourceLabels: ["Cairo – Heliopolis 23", "El-Kalyoubia 22"], choices: ["430", "4,300", "43,000", "430,000"] },
  { id: "mult-comp-exam-15-3", kind: "comparison", prompt: "The number 15 equals 3 times the number ___.", expectedAnswer: "5", sourceLabels: ["El-Menia 23"], choices: ["4", "5", "6", "7"] },
  { id: "mult-comp-exam-18-6", kind: "comparison", prompt: "18 is equal to 6 times the number ___.", expectedAnswer: "3", sourceLabels: ["Aswan 23"], choices: ["2", "3", "6", "9"] },
  { id: "mult-comp-exam-equation-20", kind: "equation", prompt: "The multiplication equation of 5 + 5 + 5 + 5 = 20 is ___.", expectedAnswer: "4 × 5 = 20", sourceLabels: [], choices: ["2 × 10 = 20", "4 × 5 = 20", "20 × 1 = 20", "10 + 10 = 20"] },
  { id: "mult-comp-exam-equation-30", kind: "equation", prompt: "The multiplication equation of 10 + 10 + 10 = 30 is ___.", expectedAnswer: "3 × 10 = 30", sourceLabels: [], choices: ["5 × 6 = 30", "3 × 10 = 30", "10 + 20 = 30", "1 × 30 = 30"] },
  { id: "mult-comp-exam-equation-comparison-20", kind: "equation", prompt: "The multiplication equation of the comparison statement “20 is 10 times the number 2” is ___.", expectedAnswer: "20 = 10 × 2", sourceLabels: [], choices: ["20 = 10 × 2", "20 = 10 + 10", "20 = 4 × 5", "20 = 1 × 20"] },
];

export const MULTIPLICATIVE_COMPARISON_QUESTION_BANK = [
  ...MULTIPLICATIVE_COMPARISON_WORKED_EXAMPLES,
  ...MULTIPLICATIVE_COMPARISON_PRACTICE,
  ...MULTIPLICATIVE_COMPARISON_PAST_EXAM_QUESTIONS,
] as const;

