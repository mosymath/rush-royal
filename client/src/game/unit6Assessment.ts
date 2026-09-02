export type Unit6AssessmentQuestion = {
  id: string;
  skill: "factors" | "prime-composite" | "greatest-common-factor" | "multiples" | "common-multiples" | "relationships";
  prompt: string;
  expectedAnswer: string;
  explanation: string;
  sourceLabels: readonly string[];
  choices?: readonly string[];
};

export const UNIT6_ASSESSMENT_QUESTIONS: readonly Unit6AssessmentQuestion[] = [
  { id: "u6-assessment-prime-30-35", skill: "prime-composite", prompt: "The prime number between 30 and 35 is ___.", expectedAnswer: "31", explanation: "31 has exactly two factors, 1 and 31.", sourceLabels: ["Cairo 23"], choices: ["31", "32", "33", "34"] },
  { id: "u6-assessment-factors-8", skill: "factors", prompt: "The number 8 has ___ factors.", expectedAnswer: "4", explanation: "The factors of 8 are 1, 2, 4, and 8.", sourceLabels: ["Cairo 23"], choices: ["2", "3", "4", "5"] },
  { id: "u6-assessment-factors-16", skill: "factors", prompt: "All the factors of 16 are ___.", expectedAnswer: "1, 2, 4, 8, 16", explanation: "These are all factor pairs of 16.", sourceLabels: ["Cairo 23"], choices: ["1, 16", "2, 4, 8", "1, 2, 4, 8, 16", "4, 8, 16"] },
  { id: "u6-assessment-18-self-multiple", skill: "multiples", prompt: "The number ___ is a multiple of the number 18.", expectedAnswer: "18", explanation: "Every nonzero number is a multiple of itself.", sourceLabels: ["El-Kalyoubia 23"], choices: ["3", "5", "18", "16"] },
  { id: "u6-assessment-common-factor-all", skill: "greatest-common-factor", prompt: "The number ___ is the common factor of all numbers.", expectedAnswer: "1", explanation: "1 is a factor of every whole number.", sourceLabels: ["Giza 23"], choices: ["1", "0", "2", "3"] },
  { id: "u6-assessment-not-multiple-6", skill: "multiples", prompt: "___ is not a multiple of 6.", expectedAnswer: "16", explanation: "30, 36, and 24 are divisible by 6; 16 is not.", sourceLabels: ["Alex. – El-Montaza 23"], choices: ["30", "36", "16", "24"] },
  { id: "u6-assessment-factor-72", skill: "factors", prompt: "___ is a factor of 72.", expectedAnswer: "9", explanation: "72 = 9 × 8.", sourceLabels: ["Aswan 23"], choices: ["5", "9", "7", "11"] },
  { id: "u6-assessment-prime-factors", skill: "prime-composite", prompt: "The number of factors of a prime number is ___.", expectedAnswer: "2", explanation: "A prime has the two different factors 1 and itself.", sourceLabels: ["El-Menia – Samallout 22"], choices: ["1", "2", "3", "4"] },
  { id: "u6-assessment-even-prime", skill: "prime-composite", prompt: "The only even prime number is ___.", expectedAnswer: "2", explanation: "Every other even number has at least three factors.", sourceLabels: ["El-Sharkia 22"], choices: ["0", "1", "2", "4"] },
  { id: "u6-assessment-gcf-4-8", skill: "greatest-common-factor", prompt: "The G.C.F. of 4 and 8 is ___.", expectedAnswer: "4", explanation: "4 is the greatest number that divides both 4 and 8.", sourceLabels: [], choices: ["1", "2", "4", "8"] },
  { id: "u6-assessment-smallest-odd-prime", skill: "prime-composite", prompt: "The smallest odd prime number is ___.", expectedAnswer: "3", explanation: "2 is even, so 3 is the smallest odd prime.", sourceLabels: ["El-Beheira – Kafr El-Dawwar 22"], choices: ["1", "2", "3", "5"] },
  { id: "u6-assessment-prime-sum-8", skill: "prime-composite", prompt: "A number has only two factors and their sum is 8. What is the number?", expectedAnswer: "7", explanation: "The factors 1 and 7 add to 8.", sourceLabels: ["Aswan – Kom Ombo 22"], choices: ["5", "6", "7", "8"] },
  { id: "u6-assessment-rainbow-12", skill: "factors", prompt: "In the factor rainbow 1, 2, 3, 4, ___, 12, the missing factor is ___.", expectedAnswer: "6", explanation: "The factors of 12 are 1, 2, 3, 4, 6, and 12.", sourceLabels: ["Luxor 22"], choices: ["5", "6", "8", "9"] },
  { id: "u6-assessment-multiple-9", skill: "multiples", prompt: "Which number is a multiple of 9?", expectedAnswer: "27", explanation: "27 = 9 × 3.", sourceLabels: [], choices: ["1", "3", "27", "30"] },
  { id: "u6-assessment-factors-20", skill: "factors", prompt: "The number ___ has the factors 1, 2, 4, 5, 10, and 20.", expectedAnswer: "20", explanation: "Those are all factors of 20.", sourceLabels: [], choices: ["8", "16", "20", "30"] },
  { id: "u6-assessment-not-common-3-5", skill: "common-multiples", prompt: "Which is NOT a common multiple of 3 and 5?", expectedAnswer: "40", explanation: "15, 30, and 45 are divisible by 3 and 5; 40 is not divisible by 3.", sourceLabels: [], choices: ["15", "30", "40", "45"] },
  { id: "u6-assessment-not-prime", skill: "prime-composite", prompt: "___ is NOT a prime number.", expectedAnswer: "1", explanation: "1 is neither prime nor composite.", sourceLabels: [], choices: ["1", "2", "7", "11"] },
  { id: "u6-assessment-multiple-4", skill: "multiples", prompt: "The multiple of 4 is ___.", expectedAnswer: "4", explanation: "Every nonzero number is a multiple of itself.", sourceLabels: ["Giza 23"], choices: ["1", "2", "3", "4"] },
  { id: "u6-assessment-factor-count-7", skill: "prime-composite", prompt: "The number 7 has ___ factors.", expectedAnswer: "2", explanation: "7 is prime, so its factors are 1 and 7.", sourceLabels: ["Cairo 23"], choices: ["1", "2", "3", "4"] },
  { id: "u6-assessment-prime", skill: "prime-composite", prompt: "Which of the following is a prime number?", expectedAnswer: "17", explanation: "17 has exactly two factors.", sourceLabels: ["Cairo 23"], choices: ["10", "15", "17", "12"] },
  { id: "u6-assessment-riddle-28", skill: "factors", prompt: "I am an even number between 20 and 30. Some of my factors include 1, 2, 4, 7, and 14. What is the number?", expectedAnswer: "28", explanation: "28 has each listed factor.", sourceLabels: ["Giza – Awseem 23"] },
  { id: "u6-assessment-factors-30", skill: "factors", prompt: "Find all factors of 30.", expectedAnswer: "1, 2, 3, 5, 6, 10, 15, 30", explanation: "Pair the factors: 1×30, 2×15, 3×10, and 5×6.", sourceLabels: [] },
  { id: "u6-assessment-common-multiples-8-12", skill: "common-multiples", prompt: "List multiples of 8 and 12 up to 40, then name their common multiples.", expectedAnswer: "0, 24", explanation: "The multiples shared up to 40 are 0 and 24.", sourceLabels: [] },
  { id: "u6-assessment-gcf-24-40", skill: "greatest-common-factor", prompt: "Find the common factors and G.C.F. of 24 and 40.", expectedAnswer: "1, 2, 4, 8; G.C.F. 8", explanation: "The shared factors are 1, 2, 4, and 8; 8 is greatest.", sourceLabels: [] },
] as const;
