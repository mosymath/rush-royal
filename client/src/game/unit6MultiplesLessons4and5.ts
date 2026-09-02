export type Unit6MultiplesQuestion = {
  id: string;
  lesson: "multiples" | "common-multiples";
  skill: "definition" | "list-multiples" | "identify-multiple" | "missing-multiple" | "common-multiples" | "application" | "multiple-choice" | "challenge";
  prompt: string;
  expectedAnswer: string;
  explanation: string;
  sourceLabels: readonly string[];
  choices?: readonly string[];
};

export const UNIT6_MULTIPLES_LESSON_NOTES = [
  "A multiple is the product of a given number and another whole number.",
  "Multiples can be found by multiplying, skip-counting on a number line, or skip-counting on a hundred chart.",
  "Zero is a multiple of every number.",
  "A nonzero multiple of a number is divisible by that number.",
  "A common multiple is a multiple of two or more numbers; zero is a common multiple for any numbers.",
] as const;

export const UNIT6_MULTIPLES_LESSONS_4_AND_5_QUESTIONS: readonly Unit6MultiplesQuestion[] = [
  { id: "u6-l4-multiple-definition", lesson: "multiples", skill: "definition", prompt: "Complete: A multiple is the product of a given number and another ___.", expectedAnswer: "whole number", explanation: "This is the definition given in the lesson.", sourceLabels: [] },
  { id: "u6-l4-zero-multiple", lesson: "multiples", skill: "definition", prompt: "Is zero a multiple of any number?", expectedAnswer: "Yes", explanation: "The lesson remarks that zero is a multiple for any number.", sourceLabels: [] },
  { id: "u6-l4-divisibility-10", lesson: "multiples", skill: "definition", prompt: "10 is a multiple of both 2 and 5. Name the related divisibility facts.", expectedAnswer: "10 is divisible by 2 and 5", explanation: "Because 2 × 5 = 10, 10 is divisible by both numbers.", sourceLabels: [] },
  { id: "u6-l4-list-2", lesson: "multiples", skill: "list-multiples", prompt: "List the multiples of 2 shown through 12.", expectedAnswer: "0, 2, 4, 6, 8, 10, 12", explanation: "Multiply 2 by 0, 1, 2, 3, 4, 5, and 6.", sourceLabels: [] },
  { id: "u6-l4-list-4", lesson: "multiples", skill: "list-multiples", prompt: "List the multiples of 4 shown in the example.", expectedAnswer: "0, 4, 8, 12", explanation: "Multiply 4 by 0, 1, 2, and 3.", sourceLabels: [] },
  { id: "u6-l4-list-10", lesson: "multiples", skill: "list-multiples", prompt: "List the multiples of 10 shown in the example.", expectedAnswer: "0, 10, 20, 30", explanation: "Multiply 10 by 0, 1, 2, and 3.", sourceLabels: [] },
  { id: "u6-l4-list-four-8", lesson: "multiples", skill: "list-multiples", prompt: "List four multiples of 8.", expectedAnswer: "0, 8, 16, 24", explanation: "Start at 0 and skip count by 8.", sourceLabels: [] },
  { id: "u6-l4-identify-3", lesson: "multiples", skill: "identify-multiple", prompt: "From 12, 17, 6, 22, 18, and 27, circle all multiples of 3.", expectedAnswer: "12, 6, 18, 27", explanation: "Each selected number is reached by skip counting by 3.", sourceLabels: [] },
  { id: "u6-l4-list-2-30", lesson: "multiples", skill: "list-multiples", prompt: "List the multiples of 2 through 30.", expectedAnswer: "0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30", explanation: "Skip count by 2 starting at 0.", sourceLabels: [] },
  { id: "u6-l4-list-5-30", lesson: "multiples", skill: "list-multiples", prompt: "List the multiples of 5 through 30.", expectedAnswer: "0, 5, 10, 15, 20, 25, 30", explanation: "Skip count by 5 starting at 0.", sourceLabels: [] },
  { id: "u6-l4-identify-6", lesson: "multiples", skill: "identify-multiple", prompt: "From 7, 16, 12, 6, 21, 24, and 18, circle all multiples of 6.", expectedAnswer: "12, 6, 24, 18", explanation: "Each selected number is divisible by 6.", sourceLabels: [] },
  { id: "u6-l4-identify-3-b", lesson: "multiples", skill: "identify-multiple", prompt: "From 6, 17, 21, 15, 10, 36, and 29, circle all multiples of 3.", expectedAnswer: "6, 21, 15, 36", explanation: "Each selected number is divisible by 3.", sourceLabels: [] },
  { id: "u6-l4-identify-8", lesson: "multiples", skill: "identify-multiple", prompt: "From 6, 8, 10, 16, 18, 24, 30, 32, and 36, circle all multiples of 8.", expectedAnswer: "8, 16, 24, 32", explanation: "Each selected number is divisible by 8.", sourceLabels: [] },
  { id: "u6-l4-not-multiple-4", lesson: "multiples", skill: "identify-multiple", prompt: "Which number is NOT a multiple of 4: 4, 30, 20, 44, or 36?", expectedAnswer: "30", explanation: "30 is not reached when skip counting by 4.", sourceLabels: [] },
  { id: "u6-l4-missing-5", lesson: "multiples", skill: "missing-multiple", prompt: "Find the missing multiple: 5, 10, 15, ___.", expectedAnswer: "20", explanation: "Continue skip counting by 5.", sourceLabels: [] },
  { id: "u6-l4-missing-8", lesson: "multiples", skill: "missing-multiple", prompt: "Find the missing multiple: 8, 16, 24, ___.", expectedAnswer: "32", explanation: "Continue skip counting by 8.", sourceLabels: [] },
  { id: "u6-l4-missing-10", lesson: "multiples", skill: "missing-multiple", prompt: "Find the missing multiple: 10, 20, ___, 40.", expectedAnswer: "30", explanation: "Continue skip counting by 10.", sourceLabels: [] },
  { id: "u6-l4-missing-70", lesson: "multiples", skill: "missing-multiple", prompt: "Find the missing multiple: 70, 80, ___, 100.", expectedAnswer: "90", explanation: "Continue skip counting by 10.", sourceLabels: [] },
  { id: "u6-l4-missing-3", lesson: "multiples", skill: "missing-multiple", prompt: "Find the missing multiple: 12, 15, ___, 21.", expectedAnswer: "18", explanation: "Continue skip counting by 3.", sourceLabels: [] },
  { id: "u6-l4-missing-11", lesson: "multiples", skill: "missing-multiple", prompt: "Find the missing multiple: 22, ___, 44, 55.", expectedAnswer: "33", explanation: "Continue skip counting by 11.", sourceLabels: [] },
  { id: "u6-l4-missing-9", lesson: "multiples", skill: "missing-multiple", prompt: "Find the missing multiple: 36, ___, 54, 63.", expectedAnswer: "45", explanation: "Continue skip counting by 9.", sourceLabels: [] },
  { id: "u6-l4-missing-7", lesson: "multiples", skill: "missing-multiple", prompt: "Find the missing multiple: ___, 14, 21, 28.", expectedAnswer: "7", explanation: "Continue skip counting by 7.", sourceLabels: [] },
  { id: "u6-l4-missing-6", lesson: "multiples", skill: "missing-multiple", prompt: "Find the missing multiple: ___, 24, 30, 36.", expectedAnswer: "18", explanation: "Continue skip counting by 6.", sourceLabels: [] },
  { id: "u6-l5-common-definition", lesson: "common-multiples", skill: "definition", prompt: "Complete: A common multiple is a multiple of ___ or more numbers.", expectedAnswer: "two", explanation: "The lesson defines a common multiple as a multiple of two or more numbers.", sourceLabels: [] },
  { id: "u6-l5-common-2-3", lesson: "common-multiples", skill: "common-multiples", prompt: "List the common multiples of 2 and 3 shown through 18.", expectedAnswer: "0, 6, 12, 18", explanation: "These appear in both skip-counting lists.", sourceLabels: [] },
  { id: "u6-l5-common-4-6", lesson: "common-multiples", skill: "common-multiples", prompt: "List the common multiples of 4 and 6 up to 50.", expectedAnswer: "0, 12, 24, 36, 48", explanation: "These are the multiples that appear in both lists.", sourceLabels: [] },
  { id: "u6-l5-common-7-3", lesson: "common-multiples", skill: "common-multiples", prompt: "List the common multiples of 7 and 3 up to 50.", expectedAnswer: "0, 21, 42", explanation: "21 and 42 appear in both lists, along with 0.", sourceLabels: [] },
  { id: "u6-l5-common-5-4", lesson: "common-multiples", skill: "common-multiples", prompt: "List the common multiples of 5 and 4 through 30.", expectedAnswer: "0, 20", explanation: "0 and 20 are shared multiples in the required range.", sourceLabels: [] },
  { id: "u6-l5-common-one-4-8", lesson: "common-multiples", skill: "common-multiples", prompt: "Find one common multiple of 4 and 8.", expectedAnswer: "8", explanation: "8 is a multiple of both 4 and 8.", sourceLabels: [] },
  { id: "u6-l5-common-one-7-3", lesson: "common-multiples", skill: "common-multiples", prompt: "Find one common multiple of 7 and 3.", expectedAnswer: "21", explanation: "21 is a multiple of both 7 and 3.", sourceLabels: [] },
  { id: "u6-l5-common-two-6-9", lesson: "common-multiples", skill: "common-multiples", prompt: "Find two common multiples of 6 and 9.", expectedAnswer: "18, 36", explanation: "Both 18 and 36 are divisible by 6 and 9.", sourceLabels: [] },
  { id: "u6-l5-common-two-6-8", lesson: "common-multiples", skill: "common-multiples", prompt: "Find two common multiples of 6 and 8.", expectedAnswer: "24, 48", explanation: "Both 24 and 48 are divisible by 6 and 8.", sourceLabels: [] },
  { id: "u6-l5-common-two-5-7", lesson: "common-multiples", skill: "common-multiples", prompt: "Find two common multiples of 5 and 7.", expectedAnswer: "35, 70", explanation: "Both 35 and 70 are divisible by 5 and 7.", sourceLabels: [] },
  { id: "u6-l5-common-two-4-7", lesson: "common-multiples", skill: "common-multiples", prompt: "Find two common multiples of 4 and 7.", expectedAnswer: "28, 56", explanation: "Both 28 and 56 are divisible by 4 and 7.", sourceLabels: [] },
  { id: "u6-l5-application-nagwa", lesson: "common-multiples", skill: "application", prompt: "Nagwa visits her grandparents every fourth day in May. Her first visit is May 4. How many times will she visit during May?", expectedAnswer: "7 times", explanation: "Her visits are May 4, 8, 12, 16, 20, 24, and 28.", sourceLabels: [] },
  { id: "u6-l5-application-tahani", lesson: "common-multiples", skill: "application", prompt: "Tahani's bus stops every 4 kilometres. It leaves school at 0 km, and Tahani lives 18 km from school. How far does she walk home from the bus stop?", expectedAnswer: "2 km", explanation: "The final stop before 18 km is 16 km, so 18 − 16 = 2 km.", sourceLabels: [] },
  { id: "u6-l5-challenge-2-3-5", lesson: "common-multiples", skill: "challenge", prompt: "Find two common multiples of 2, 3, and 5.", expectedAnswer: "30, 60", explanation: "30 and 60 are divisible by 2, 3, and 5.", sourceLabels: [] },
  { id: "u6-l5-challenge-6-4-10", lesson: "common-multiples", skill: "challenge", prompt: "Find two common multiples of 6, 4, and 10.", expectedAnswer: "60, 120", explanation: "60 and 120 are divisible by 6, 4, and 10.", sourceLabels: [] },
  { id: "u6-l5-mcq-common-all", lesson: "common-multiples", skill: "multiple-choice", prompt: "The common multiple for all numbers is ___.", expectedAnswer: "0", explanation: "Zero is a common multiple for any numbers.", sourceLabels: ["Cairo 23"], choices: ["0", "1", "2", "3"] },
  { id: "u6-l5-mcq-multiples-8", lesson: "common-multiples", skill: "multiple-choice", prompt: "0, 8, 16, and 24 are all multiples of the number ___.", expectedAnswer: "8", explanation: "Each listed number is reached by skip counting by 8.", sourceLabels: ["Cairo 23"], choices: ["0", "8", "16", "24"] },
  { id: "u6-l5-mcq-30", lesson: "common-multiples", skill: "multiple-choice", prompt: "30 is a multiple of number ___.", expectedAnswer: "6", explanation: "30 = 6 × 5.", sourceLabels: ["Beheira 23"], choices: ["8", "7", "6", "4"] },
  { id: "u6-l5-mcq-25", lesson: "common-multiples", skill: "multiple-choice", prompt: "25 is a multiple of ___.", expectedAnswer: "5", explanation: "25 = 5 × 5.", sourceLabels: ["Cairo 23"], choices: ["5", "7", "9", "10"] },
  { id: "u6-l5-mcq-multiple-5", lesson: "common-multiples", skill: "multiple-choice", prompt: "___ is a multiple of 5.", expectedAnswer: "55", explanation: "55 ends in 5 and is divisible by 5.", sourceLabels: ["Giza 23"], choices: ["55", "503", "326", "124"] },
  { id: "u6-l5-mcq-multiple-8", lesson: "common-multiples", skill: "multiple-choice", prompt: "Which of the following is a multiple of 8?", expectedAnswer: "16", explanation: "16 = 8 × 2.", sourceLabels: ["Alex. 23"], choices: ["1", "2", "4", "16"] },
  { id: "u6-l5-mcq-common-5-8", lesson: "common-multiples", skill: "multiple-choice", prompt: "Which is a common multiple of 5 and 8?", expectedAnswer: "40", explanation: "40 is divisible by both 5 and 8.", sourceLabels: [], choices: ["20", "40", "35", "45"] },
  { id: "u6-l5-mcq-not-7", lesson: "common-multiples", skill: "multiple-choice", prompt: "Which of the following is NOT a multiple of 7?", expectedAnswer: "27", explanation: "42, 63, and 707 are multiples of 7, but 27 is not.", sourceLabels: ["Luxor 22"], choices: ["42", "63", "707", "27"] },
  { id: "u6-l5-mcq-not-common-9-6", lesson: "common-multiples", skill: "multiple-choice", prompt: "Which is NOT a common multiple of 9 and 6?", expectedAnswer: "42", explanation: "18, 36, and 54 are divisible by both 9 and 6; 42 is not.", sourceLabels: ["Monofia – Sers El-Layyan 23", "Cairo – Khalifa and Mokattam 22"], choices: ["18", "27", "36", "42"] },
  { id: "u6-l5-mcq-common-3-5", lesson: "common-multiples", skill: "multiple-choice", prompt: "Which list shows common multiples of 3 and 5?", expectedAnswer: "15, 30, 45", explanation: "Each number in that list is divisible by both 3 and 5.", sourceLabels: [], choices: ["6, 15, 24", "60, 80, 100", "15, 30, 45", "30, 40, 50"] },
  { id: "u6-l5-mcq-6-8", lesson: "common-multiples", skill: "multiple-choice", prompt: "The common multiples of 6 and 8 are the same as the multiples of which number?", expectedAnswer: "24", explanation: "24 is the first positive common multiple of 6 and 8.", sourceLabels: [], choices: ["8", "12", "20", "24"] },
] as const;

export const UNIT6_MULTIPLES_LESSON_4_QUESTIONS = UNIT6_MULTIPLES_LESSONS_4_AND_5_QUESTIONS.filter((question) => question.lesson === "multiples");
export const UNIT6_COMMON_MULTIPLES_LESSON_5_QUESTIONS = UNIT6_MULTIPLES_LESSONS_4_AND_5_QUESTIONS.filter((question) => question.lesson === "common-multiples");
