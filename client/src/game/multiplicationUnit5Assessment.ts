/** Unit Five Assessment — teacher-supplied Master Unit Exam source bank. */

export type Unit5AssessmentQuestion = {
  id: string;
  skill: "comparison" | "equation" | "commutative" | "associative" | "identity" | "zero" | "pattern" | "word-problem";
  prompt: string;
  expectedAnswer: string;
  sourceLabels: readonly string[];
  choices?: readonly string[];
};

export const UNIT5_ASSESSMENT_QUESTIONS: readonly Unit5AssessmentQuestion[] = [
  { id: "u5-assessment-5x9", skill: "commutative", prompt: "Complete: 5 × 9 = 9 × ___.", expectedAnswer: "5", sourceLabels: [], choices: ["5", "9", "14", "4"] },
  { id: "u5-assessment-375", skill: "pattern", prompt: "375 × ___ = 37,500.", expectedAnswer: "100", sourceLabels: [], choices: ["10", "100", "1,000", "10,000"] },
  { id: "u5-assessment-zero", skill: "zero", prompt: "0 × 25 = ___.", expectedAnswer: "0", sourceLabels: [], choices: ["25", "1", "0", "250"] },
  { id: "u5-assessment-commutative", skill: "commutative", prompt: "Which equation best explains the Commutative Property of Multiplication?", expectedAnswer: "3 × 5 = 5 × 3", sourceLabels: [], choices: ["3 × 5 = 5 × 3", "4 × 16 = [4 × 11] + [4 × 5]", "[6 × 4] × 6 = 6 × [4 × 2]", "5 × 1 = 5 × 1"] },
  { id: "u5-assessment-associative", skill: "associative", prompt: "Which equation best explains the Associative Property of Multiplication?", expectedAnswer: "[3 × 7] × 2 = 3 × [7 × 2]", sourceLabels: [], choices: ["[9 × 12] × 0 = 0", "[4 × 6] × 1 = 4 × 6", "[3 × 7] × 2 = 3 × [7 × 2]", "7 × 6 = 6 × 7"] },
  { id: "u5-assessment-balls", skill: "comparison", prompt: "A box has 15 green balls. Yellow balls are 5 times as many. How many yellow balls are there?", expectedAnswer: "75", sourceLabels: [], choices: ["12", "35", "2", "75"] },
  { id: "u5-assessment-bar-model", skill: "comparison", prompt: "A bar model has five equal parts of 3. The number ___ is 5 times the number 3.", expectedAnswer: "15", sourceLabels: ["Giza – Abo El-Nomros 23"], choices: ["8", "15", "20", "30"] },
  { id: "u5-assessment-4x3x7", skill: "associative", prompt: "Complete: 4 × 3 × 7 = 4 × ___.", expectedAnswer: "21", sourceLabels: ["Cairo – El-Kobba 22"] },
  { id: "u5-assessment-repeated-8", skill: "equation", prompt: "The multiplicative equation of 8 + 8 + 8 + 8 + 8 = 40 is ___.", expectedAnswer: "5 × 8 = 40", sourceLabels: [] },
  { id: "u5-assessment-identity", skill: "identity", prompt: "The multiplicative Identity Element is ___.", expectedAnswer: "1", sourceLabels: ["Alexandria – Montaza 22"] },
  { id: "u5-assessment-hundreds", skill: "pattern", prompt: "200 = ___ hundreds.", expectedAnswer: "2", sourceLabels: [] },
  { id: "u5-assessment-4x7", skill: "commutative", prompt: "4 × 7 = 7 × ___. Name the property.", expectedAnswer: "4; Commutative Property", sourceLabels: ["Port Said 22"] },
  { id: "u5-assessment-a7", skill: "equation", prompt: "If A × 7 = 21, then A = ___.", expectedAnswer: "3", sourceLabels: [] },
  { id: "u5-assessment-z", skill: "equation", prompt: "If 1,000 × Z = 3,000, then Z = ___.", expectedAnswer: "3", sourceLabels: ["Cairo – El-Nozha 23"] },
  { id: "u5-assessment-seven-times-five", skill: "comparison", prompt: "7 times the number 5 = ___.", expectedAnswer: "35", sourceLabels: ["Cairo – El-Shrouk 23"] },
  { id: "u5-assessment-15", skill: "comparison", prompt: "The number 15 equals 5 times the number ___.", expectedAnswer: "3", sourceLabels: ["Cairo – Rod El-Farag 23"], choices: ["4", "5", "3", "15"] },
  { id: "u5-assessment-x10", skill: "equation", prompt: "If X × 10 = 100, then X = ___.", expectedAnswer: "10", sourceLabels: ["Souhag 23"], choices: ["10", "5", "15", "20"] },
  { id: "u5-assessment-0x216", skill: "zero", prompt: "0 × 216 = ___.", expectedAnswer: "0", sourceLabels: ["Alex. 23"], choices: ["216", "2,160", "1", "0"] },
  { id: "u5-assessment-13x24", skill: "commutative", prompt: "13 × 24 = 24 × 13 represents the ___ Property.", expectedAnswer: "Commutative", sourceLabels: ["Giza 23"], choices: ["Associative", "Commutative", "Multiplicative Identity", "Distribution"] },
  { id: "u5-assessment-ten-times-18", skill: "pattern", prompt: "What is the number that is 10 times the number 18?", expectedAnswer: "180", sourceLabels: ["El-Menia 23"], choices: ["28", "1,800", "180", "18"] },
  { id: "u5-assessment-a4", skill: "commutative", prompt: "If a × 4 = 4 × 2, then a = ___.", expectedAnswer: "2", sourceLabels: ["Giza 23"], choices: ["8", "4", "2", "6"] },
  { id: "u5-assessment-grouping", skill: "associative", prompt: "Complete: 2 × [7 × 4] = [2 × ___] × 4.", expectedAnswer: "7", sourceLabels: [], choices: ["2", "7", "4", "28"] },
  { id: "u5-assessment-figs", skill: "word-problem", prompt: "Ayman ate 4 figs. His brother ate 3 times as many. How many figs did his brother eat?", expectedAnswer: "12 figs", sourceLabels: ["Cairo – El-Shrouk 23"] },
  { id: "u5-assessment-water", skill: "word-problem", prompt: "Hany bought 3 packs of water bottles. Each pack had 3 rows of 4 bottles. How many bottles did he buy?", expectedAnswer: "36 bottles", sourceLabels: ["Giza 23"] },
  { id: "u5-assessment-product-a", skill: "associative", prompt: "Apply the properties to solve: 3 × 2 × 4.", expectedAnswer: "24", sourceLabels: [] },
  { id: "u5-assessment-product-b", skill: "associative", prompt: "Apply the properties to solve: 5 × 7 × 2.", expectedAnswer: "70", sourceLabels: [] },
  { id: "u5-assessment-7x5", skill: "commutative", prompt: "Find m: 7 × 5 = 5 × m.", expectedAnswer: "7", sourceLabels: [] },
  { id: "u5-assessment-3x7x6", skill: "associative", prompt: "Find m: [3 × 7] × 6 = 3 × [m × 6].", expectedAnswer: "7", sourceLabels: [] },
  { id: "u5-assessment-9x4", skill: "commutative", prompt: "Find m: 9 × 4 = 4 × m.", expectedAnswer: "9", sourceLabels: [] },
  { id: "u5-assessment-248zero", skill: "zero", prompt: "Find m: 248 × m = zero.", expectedAnswer: "0", sourceLabels: [] },
];
