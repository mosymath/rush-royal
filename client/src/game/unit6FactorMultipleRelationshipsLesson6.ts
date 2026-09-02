export type Unit6RelationshipQuestion = {
  id: string;
  lesson: "factor-multiple-relationships";
  skill: "relationship" | "complete" | "factor-check" | "multiple-check" | "riddle" | "challenge" | "multiple-choice";
  prompt: string;
  expectedAnswer: string;
  explanation: string;
  sourceLabels: readonly string[];
  choices?: readonly string[];
};

export const UNIT6_FACTOR_MULTIPLE_RELATIONSHIP_NOTES = [
  "Use multiplication to find the relationship between factors and multiples.",
  "In 1 × 6 = 6, 1 and 6 are factors of 6, and 6 is a multiple of each of 1 and 6.",
  "In 2 × 3 = 6, 2 and 3 are factors of 6, and 6 is a multiple of each of 2 and 3.",
] as const;

export const UNIT6_FACTOR_MULTIPLE_RELATIONSHIP_QUESTIONS: readonly Unit6RelationshipQuestion[] = [
  { id: "u6-l6-rel-1-6", lesson: "factor-multiple-relationships", skill: "relationship", prompt: "In 1 × 6 = 6, identify the factors and the multiple.", expectedAnswer: "1 and 6 are factors of 6; 6 is a multiple of 1 and 6", explanation: "The factors multiply to make the product, and the product is a multiple of each factor.", sourceLabels: [] },
  { id: "u6-l6-rel-2-3-6", lesson: "factor-multiple-relationships", skill: "relationship", prompt: "In 2 × 3 = 6, identify the factors and the multiple.", expectedAnswer: "2 and 3 are factors of 6; 6 is a multiple of 2 and 3", explanation: "2 and 3 multiply to make 6.", sourceLabels: [] },
  { id: "u6-l6-factor-rainbow-6", lesson: "factor-multiple-relationships", skill: "relationship", prompt: "List the factors of 6 shown in the factor rainbow.", expectedAnswer: "1, 2, 3, 6", explanation: "The factor pairs are 1 × 6 and 2 × 3.", sourceLabels: [] },
  { id: "u6-l6-rel-2-4-16", lesson: "factor-multiple-relationships", skill: "relationship", prompt: "Describe the relationship among 2, 4, and 16.", expectedAnswer: "2, 4, and 16 are multiples of 2; 2, 4, and 16 are factors of 16; 16 is a multiple of 2, 4, and 16", explanation: "The lesson's connection model uses these statements.", sourceLabels: [] },
  { id: "u6-l6-complete-3x8", lesson: "factor-multiple-relationships", skill: "complete", prompt: "Complete: 3 × 8 = 24, then 3 and 8 are ___ of 24 and 24 is ___ of each of 3 and 8.", expectedAnswer: "factors; a multiple", explanation: "3 and 8 multiply to make 24.", sourceLabels: [] },
  { id: "u6-l6-complete-between", lesson: "factor-multiple-relationships", skill: "complete", prompt: "An even number is a multiple of 3 and 4. It lies between 30 and 40. What is the number?", expectedAnswer: "36", explanation: "36 is divisible by both 3 and 4 and is between 30 and 40.", sourceLabels: [] },
  { id: "u6-l6-multiples-5", lesson: "factor-multiple-relationships", skill: "complete", prompt: "Write three multiples of 5.", expectedAnswer: "5, 10, 15", explanation: "Continue skip counting by 5.", sourceLabels: [] },
  { id: "u6-l6-multiples-6", lesson: "factor-multiple-relationships", skill: "complete", prompt: "Write three multiples of 6.", expectedAnswer: "6, 12, 18", explanation: "Continue skip counting by 6.", sourceLabels: [] },
  { id: "u6-l6-factors-30", lesson: "factor-multiple-relationships", skill: "complete", prompt: "Write three factors of 30.", expectedAnswer: "1, 2, 3", explanation: "Each number divides 30 with no remainder.", sourceLabels: [] },
  { id: "u6-l6-factors-27", lesson: "factor-multiple-relationships", skill: "complete", prompt: "The numbers 1, 3, 9, and 27 are factors of ___.", expectedAnswer: "27", explanation: "All four listed numbers divide 27.", sourceLabels: ["El-Beheira – Kafr El-Dawwar 22"] },
  { id: "u6-l6-rel-4-9-36", lesson: "factor-multiple-relationships", skill: "relationship", prompt: "If 4 × 9 = 36, complete the relationship statement.", expectedAnswer: "36 is a multiple of 4 and 9; 4 and 9 are factors of 36", explanation: "The product is a multiple of both factors.", sourceLabels: [] },
  { id: "u6-l6-rel-7-3-21", lesson: "factor-multiple-relationships", skill: "relationship", prompt: "If 7 × 3 = 21, complete the relationship statement.", expectedAnswer: "21 is a multiple of 7 and 3", explanation: "21 is made by multiplying 7 and 3.", sourceLabels: [] },
  { id: "u6-l6-is-factor-4-12", lesson: "factor-multiple-relationships", skill: "factor-check", prompt: "Is 4 a factor of 12?", expectedAnswer: "Yes", explanation: "12 = 4 × 3.", sourceLabels: [] },
  { id: "u6-l6-is-factor-6-24", lesson: "factor-multiple-relationships", skill: "factor-check", prompt: "Is 6 a factor of 24?", expectedAnswer: "Yes", explanation: "24 = 6 × 4.", sourceLabels: [] },
  { id: "u6-l6-is-multiple-14-7", lesson: "factor-multiple-relationships", skill: "multiple-check", prompt: "Is 14 a multiple of 7?", expectedAnswer: "Yes", explanation: "14 = 7 × 2.", sourceLabels: [] },
  { id: "u6-l6-is-multiple-10-2", lesson: "factor-multiple-relationships", skill: "multiple-check", prompt: "Is 10 a multiple of 2?", expectedAnswer: "Yes", explanation: "10 = 2 × 5.", sourceLabels: [] },
  { id: "u6-l6-is-factor-24-8", lesson: "factor-multiple-relationships", skill: "factor-check", prompt: "Is 24 a factor of 8?", expectedAnswer: "No", explanation: "8 is a factor of 24, not the reverse.", sourceLabels: [] },
  { id: "u6-l6-is-multiple-2-4", lesson: "factor-multiple-relationships", skill: "multiple-check", prompt: "Is 2 a multiple of 4?", expectedAnswer: "No", explanation: "2 cannot be made by 4 times a whole number.", sourceLabels: [] },
  { id: "u6-l6-is-multiple-10-9", lesson: "factor-multiple-relationships", skill: "multiple-check", prompt: "Is 10 a multiple of 9?", expectedAnswer: "No", explanation: "10 is not reached by skip counting by 9.", sourceLabels: [] },
  { id: "u6-l6-is-multiple-16-3", lesson: "factor-multiple-relationships", skill: "multiple-check", prompt: "Is 16 a multiple of 3?", expectedAnswer: "No", explanation: "16 is not divisible by 3.", sourceLabels: [] },
  { id: "u6-l6-factor-or-multiple-5-25", lesson: "factor-multiple-relationships", skill: "relationship", prompt: "Is 5 a factor of 25 or a multiple of 25?", expectedAnswer: "A factor of 25", explanation: "25 = 5 × 5, so 5 is a factor of 25.", sourceLabels: [] },
  { id: "u6-l6-factor-or-multiple-32-8", lesson: "factor-multiple-relationships", skill: "relationship", prompt: "Is 32 a factor of 8 or a multiple of 8?", expectedAnswer: "A multiple of 8", explanation: "32 = 8 × 4.", sourceLabels: [] },
  { id: "u6-l6-factor-or-multiple-1-9", lesson: "factor-multiple-relationships", skill: "relationship", prompt: "Is 1 a factor of 9 or a multiple of 9?", expectedAnswer: "A factor of 9", explanation: "1 is a factor of every whole number.", sourceLabels: [] },
  { id: "u6-l6-multiple-of-7-factor-7", lesson: "factor-multiple-relationships", skill: "relationship", prompt: "What multiple of 7 is also a factor of 7?", expectedAnswer: "7", explanation: "7 is both a factor of 7 and a multiple of 7.", sourceLabels: [] },
  { id: "u6-l6-riddle-odd-3-5", lesson: "factor-multiple-relationships", skill: "riddle", prompt: "Find an odd number greater than 20 that is a multiple of 3 and 5.", expectedAnswer: "45", explanation: "45 is odd and divisible by both 3 and 5; the riddle allows more than one valid answer.", sourceLabels: [] },
  { id: "u6-l6-riddle-4-8", lesson: "factor-multiple-relationships", skill: "riddle", prompt: "Find an even number between 10 and 20 that is a multiple of 4 and 8.", expectedAnswer: "16", explanation: "16 is divisible by both 4 and 8.", sourceLabels: [] },
  { id: "u6-l6-riddle-3-4-6", lesson: "factor-multiple-relationships", skill: "riddle", prompt: "Find an even number that is a multiple of 3, 4, and 6.", expectedAnswer: "12", explanation: "12 is divisible by 3, 4, and 6; other valid multiples are also possible.", sourceLabels: [] },
  { id: "u6-l6-riddle-factors-28", lesson: "factor-multiple-relationships", skill: "riddle", prompt: "I am an even number between 20 and 30. Some of my factors include 1, 2, 4, 7, and 14. What number am I?", expectedAnswer: "28", explanation: "28 has all of the listed factors.", sourceLabels: ["Suez 22"] },
  { id: "u6-l6-challenge-multiple4-factor24", lesson: "factor-multiple-relationships", skill: "challenge", prompt: "There is a number between 10 and 20. It is a multiple of 4 and a factor of 24. What is it?", expectedAnswer: "12", explanation: "12 is a multiple of 4 and divides 24.", sourceLabels: [] },
  { id: "u6-l6-mcq-multiple8", lesson: "factor-multiple-relationships", skill: "multiple-choice", prompt: "___ is a multiple of 8.", expectedAnswer: "16", explanation: "16 = 8 × 2.", sourceLabels: [], choices: ["2", "4", "10", "16"] },
  { id: "u6-l6-mcq-multiples2", lesson: "factor-multiple-relationships", skill: "multiple-choice", prompt: "Multiples of 2 are ___ numbers.", expectedAnswer: "even", explanation: "Every multiple of 2 is even.", sourceLabels: [], choices: ["even", "odd", "prime", "composite"] },
  { id: "u6-l6-mcq-even-3-4-5", lesson: "factor-multiple-relationships", skill: "multiple-choice", prompt: "The even number which is a multiple of 3, 4, and 5 together is ___.", expectedAnswer: "60", explanation: "60 is divisible by 3, 4, and 5.", sourceLabels: ["Aswan 23"], choices: ["60", "18", "28", "12"] },
  { id: "u6-l6-mcq-odd-3-7", lesson: "factor-multiple-relationships", skill: "multiple-choice", prompt: "___ is an odd number that is a multiple of 3 and 7.", expectedAnswer: "21", explanation: "21 is odd and divisible by both 3 and 7.", sourceLabels: [], choices: ["7", "14", "21", "42"] },
  { id: "u6-l6-mcq-relation-6-18", lesson: "factor-multiple-relationships", skill: "multiple-choice", prompt: "The correct relation between 6 and 18 is ___.", expectedAnswer: "6 is a factor of 18", explanation: "18 = 6 × 3.", sourceLabels: ["Cairo – El-Salam 23"], choices: ["6 is a factor of 18", "6 is a multiple of 18", "18 is a factor of 6", "18 is the twice of 6"] },
  { id: "u6-l6-mcq-true", lesson: "factor-multiple-relationships", skill: "multiple-choice", prompt: "Which of the following is true?", expectedAnswer: "5 is a factor of 10", explanation: "10 = 5 × 2.", sourceLabels: [], choices: ["5 is a multiple of 10", "10 is a factor of 5", "5 is a factor of 10", "6 is a multiple of 4"] },
  { id: "u6-l6-mcq-false", lesson: "factor-multiple-relationships", skill: "multiple-choice", prompt: "Which of the following is false?", expectedAnswer: "8 is a factor of 14", explanation: "14 is not divisible by 8.", sourceLabels: [], choices: ["282 is a multiple of 2", "0 is a multiple of 7", "3 is a factor of 24", "8 is a factor of 14"] },
  { id: "u6-l6-mcq-7-49", lesson: "factor-multiple-relationships", skill: "multiple-choice", prompt: "Which statement correctly describes the relationship between 7 and 49?", expectedAnswer: "7 is a factor of 49", explanation: "49 = 7 × 7.", sourceLabels: ["Cairo – El-Salam 23"], choices: ["7 is a multiple of 49", "7 is a factor of 49", "49 is a factor of 7", "7 equals 9 times 49"] },
] as const;
