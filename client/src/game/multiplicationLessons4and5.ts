/** Unit 5, Lessons 4 & 5 — Properties and Patterns of Multiplication. */

export type MultiplicationPropertiesQuestion = {
  id: string;
  lesson: "properties" | "patterns";
  property?: "commutative" | "identity" | "zero" | "pattern";
  prompt: string;
  expectedAnswer: string;
  sourceLabels: readonly string[];
  choices?: readonly string[];
};

export const MULTIPLICATION_PROPERTY_RULES = {
  commutative: "When you multiply two factors in any order, the product is the same.",
  identity: "The product of 1 and any number equals that number.",
  zero: "The product of zero and any number equals 0.",
  tensPattern: "Use a basic fact and add zeros when multiplying by 10, 100, and 1,000.",
} as const;

export const MULTIPLICATION_PROPERTIES_QUESTIONS: readonly MultiplicationPropertiesQuestion[] = [
  { id: "prop-scarves", lesson: "properties", property: "commutative", prompt: "Natalie knit 3 scarves and used 2 balls of yarn for each scarf. How many balls of yarn did she use?", expectedAnswer: "6 balls", sourceLabels: [] },
  { id: "prop-3x8", lesson: "properties", property: "commutative", prompt: "Complete: 3 × 8 = ___ × 3.", expectedAnswer: "8", sourceLabels: [] },
  { id: "prop-10x7", lesson: "properties", property: "commutative", prompt: "Complete: 10 × ___ = 7 × 10.", expectedAnswer: "7", sourceLabels: [] },
  { id: "prop-5x9", lesson: "properties", property: "commutative", prompt: "Complete: ___ × 5 = 5 × 9.", expectedAnswer: "9", sourceLabels: [] },
  { id: "prop-2x11", lesson: "properties", property: "commutative", prompt: "Complete: 2 × 11 = 11 × ___.", expectedAnswer: "2", sourceLabels: [] },
  { id: "prop-15x1", lesson: "properties", property: "identity", prompt: "Complete: 15 × 1 = ___.", expectedAnswer: "15", sourceLabels: [] },
  { id: "prop-5x0", lesson: "properties", property: "zero", prompt: "Complete: 5 × 0 = ___.", expectedAnswer: "0", sourceLabels: [] },
  { id: "prop-170x0", lesson: "properties", property: "zero", prompt: "Complete: 170 × ___ = 0.", expectedAnswer: "0", sourceLabels: [] },
  { id: "prop-1x350", lesson: "properties", property: "identity", prompt: "Complete: ___ × 350 = 350.", expectedAnswer: "1", sourceLabels: [] },
  { id: "prop-pens", lesson: "properties", property: "commutative", prompt: "Mr. Han has 12 pens. Write two arrangements using the Commutative Property.", expectedAnswer: "3 × 4 = 4 × 3 = 12", sourceLabels: [] },
  { id: "prop-check-identity", lesson: "properties", property: "identity", prompt: "Complete: ___ × 1 = 12. Name the property.", expectedAnswer: "12; Identity Property", sourceLabels: [] },
  { id: "prop-check-zero", lesson: "properties", property: "zero", prompt: "Complete: 9 × ___ = 0. Name the property.", expectedAnswer: "0; Zero Property", sourceLabels: [] },
  { id: "prop-check-commute", lesson: "properties", property: "commutative", prompt: "Complete: 5 × 6 = ___ × 5. Name the property.", expectedAnswer: "6; Commutative Property", sourceLabels: [] },
  { id: "prop-exercise-25x52", lesson: "properties", property: "commutative", prompt: "Complete: 25 × 52 = 52 × ___.", expectedAnswer: "25", sourceLabels: ["Matrouh 22"] },
  { id: "prop-exercise-48x12", lesson: "properties", property: "commutative", prompt: "Complete: 48 × 12 = 12 × ___.", expectedAnswer: "48", sourceLabels: ["Souhag 22"] },
  { id: "prop-unknown-33", lesson: "properties", property: "commutative", prompt: "Find the unknown: 33 × 4 = 4 × a.", expectedAnswer: "a = 33", sourceLabels: [] },
  { id: "prop-unknown-9", lesson: "properties", property: "commutative", prompt: "Find the unknown: b × 9 = 9 × 8.", expectedAnswer: "b = 8", sourceLabels: [] },
  { id: "prop-unknown-16", lesson: "properties", property: "commutative", prompt: "Find the unknown: 16 × a = 7 × 16.", expectedAnswer: "a = 7", sourceLabels: [] },
  { id: "prop-unknown-100", lesson: "properties", property: "commutative", prompt: "Find the unknown: 3 × m = 100 × 3.", expectedAnswer: "m = 100", sourceLabels: [] },
  { id: "prop-football", lesson: "properties", property: "commutative", prompt: "There are 42 football players. Badr says 6 teams of 7; Salma says 7 teams of 6. Who is correct?", expectedAnswer: "Both are correct: 6 × 7 = 7 × 6 = 42", sourceLabels: [] },
  { id: "prop-beans", lesson: "properties", property: "commutative", prompt: "Mr. Saleh has 24 beans. Write two arrangements using the Commutative Property.", expectedAnswer: "3 × 8 = 8 × 3 = 24", sourceLabels: [] },
  { id: "prop-apples", lesson: "properties", property: "commutative", prompt: "Bassem has 20 apples. Write two arrangements using the Commutative Property.", expectedAnswer: "4 × 5 = 5 × 4 = 20", sourceLabels: [] },
  { id: "prop-zero-35", lesson: "properties", property: "zero", prompt: "35 × 0 = ___.", expectedAnswer: "0", sourceLabels: ["Cairo – El Nozha 23", "Giza 23"], choices: ["1", "34", "0", "43"] },
  { id: "prop-identity-element", lesson: "properties", property: "identity", prompt: "The multiplicative identity element is ___.", expectedAnswer: "1", sourceLabels: ["Cairo – El Shrouk 23"], choices: ["1", "2", "3", "4"] },
  { id: "prop-850", lesson: "properties", property: "identity", prompt: "If 850 × m = 850, then m = ___.", expectedAnswer: "1", sourceLabels: ["Ismailia 23"], choices: ["1", "850", "2", "0"] },
  { id: "prop-commutative-mcq", lesson: "properties", property: "commutative", prompt: "Which equation best explains the Commutative Property of Multiplication?", expectedAnswer: "9 × 6 = 6 × 9", sourceLabels: ["Alexandria – Borg El-Arab 22"], choices: ["3 × 1 = 3", "9 × 6 = 6 × 9", "6 × (2 × 4) = (6 × 2) × 4", "5 × 16 = (5 × 11) + (5 × 5)"] },
  { id: "prop-identity-mcq", lesson: "properties", property: "identity", prompt: "Which choice shows the Identity Property of Multiplication?", expectedAnswer: "1 × 6 = 6", sourceLabels: [], choices: ["0 × 6 = 0", "1 × 6 = 6", "1 × 2 = 2", "2 × 6 = 2"] },
];

export const MULTIPLICATION_PATTERN_QUESTIONS: readonly MultiplicationPropertiesQuestion[] = [
  { id: "pattern-4", lesson: "patterns", property: "pattern", prompt: "Complete: 4 × 1 = ___, 4 × 10 = ___, 4 × 100 = ___, 4 × 1,000 = ___.", expectedAnswer: "4, 40, 400, 4,000", sourceLabels: [] },
  { id: "pattern-6x10", lesson: "patterns", property: "pattern", prompt: "6 × 10 = ___.", expectedAnswer: "60", sourceLabels: [] },
  { id: "pattern-2x100", lesson: "patterns", property: "pattern", prompt: "2 × 100 = ___.", expectedAnswer: "200", sourceLabels: [] },
  { id: "pattern-7x1000", lesson: "patterns", property: "pattern", prompt: "7 × 1,000 = ___.", expectedAnswer: "7,000", sourceLabels: [] },
  { id: "pattern-21x10", lesson: "patterns", property: "pattern", prompt: "21 × 10 = ___.", expectedAnswer: "210", sourceLabels: [] },
  { id: "pattern-50x10", lesson: "patterns", property: "pattern", prompt: "50 × 10 = ___.", expectedAnswer: "500", sourceLabels: [] },
  { id: "pattern-80x100", lesson: "patterns", property: "pattern", prompt: "80 × 100 = ___.", expectedAnswer: "8,000", sourceLabels: [] },
  { id: "pattern-90", lesson: "patterns", property: "pattern", prompt: "Complete: 90 = 9 × ___.", expectedAnswer: "10", sourceLabels: [] },
  { id: "pattern-170", lesson: "patterns", property: "pattern", prompt: "Complete: 170 = ___ × 17.", expectedAnswer: "10", sourceLabels: [] },
  { id: "pattern-50000", lesson: "patterns", property: "pattern", prompt: "Complete: ___ × 1,000 = 50,000.", expectedAnswer: "50", sourceLabels: [] },
  { id: "pattern-check-5000", lesson: "patterns", property: "pattern", prompt: "1,000 × 5 = ___.", expectedAnswer: "5,000", sourceLabels: [] },
  { id: "pattern-check-100", lesson: "patterns", property: "pattern", prompt: "Complete: ___ = 100 × 1.", expectedAnswer: "100", sourceLabels: [] },
  { id: "pattern-check-300", lesson: "patterns", property: "pattern", prompt: "30 × 10 = ___.", expectedAnswer: "300", sourceLabels: [] },
  { id: "pattern-check-800", lesson: "patterns", property: "pattern", prompt: "800 = 8 × ___.", expectedAnswer: "100", sourceLabels: [] },
  { id: "pattern-check-190", lesson: "patterns", property: "pattern", prompt: "190 = ___ × 19.", expectedAnswer: "10", sourceLabels: [] },
  { id: "pattern-check-20000", lesson: "patterns", property: "pattern", prompt: "20,000 = ___ × 1,000.", expectedAnswer: "20", sourceLabels: [] },
  { id: "pattern-exercise-1000x2", lesson: "patterns", property: "pattern", prompt: "Complete: ___ = 1,000 × 2.", expectedAnswer: "2,000", sourceLabels: [] },
  { id: "pattern-exercise-700", lesson: "patterns", property: "pattern", prompt: "Complete: 700 = 7 × ___.", expectedAnswer: "100", sourceLabels: [] },
  { id: "pattern-exercise-9000", lesson: "patterns", property: "pattern", prompt: "Complete: 9 × ___ = 9,000.", expectedAnswer: "1,000", sourceLabels: [] },
  { id: "pattern-exercise-19000", lesson: "patterns", property: "pattern", prompt: "Complete: 19,000 = ___ × 19.", expectedAnswer: "1,000", sourceLabels: [] },
  { id: "pattern-exercise-24500", lesson: "patterns", property: "pattern", prompt: "Complete: ___ × 245 = 24,500.", expectedAnswer: "100", sourceLabels: ["Cairo – El-Tebbeen 22"] },
  { id: "pattern-exercise-12300", lesson: "patterns", property: "pattern", prompt: "123 × 100 = ___.", expectedAnswer: "12,300", sourceLabels: ["Giza 23"] },
  { id: "pattern-correct-thinking", lesson: "patterns", property: "pattern", prompt: "Tarek says 9 × 1,000 equals 900. What is the correct product?", expectedAnswer: "9,000", sourceLabels: [] },
  { id: "pattern-600x3", lesson: "patterns", property: "commutative", prompt: "600 × 3 = 3 × ___.", expectedAnswer: "600", sourceLabels: ["Cairo – El Shrouk 23"], choices: ["300", "400", "500", "600"] },
  { id: "pattern-34x100", lesson: "patterns", property: "pattern", prompt: "34 × ___ = 3,400.", expectedAnswer: "100", sourceLabels: ["Alexandria 23"], choices: ["1", "10", "100", "1,000"] },
  { id: "pattern-100000", lesson: "patterns", property: "pattern", prompt: "100,000 is ___ times the number 10,000.", expectedAnswer: "10", sourceLabels: ["Cairo 23"], choices: ["10", "100", "1,000", "10,000"] },
  { id: "pattern-51x100", lesson: "patterns", property: "pattern", prompt: "51 × 100 = ___.", expectedAnswer: "5,100", sourceLabels: [], choices: ["510", "510", "51,000", "0"] },
  { id: "pattern-a-times-4", lesson: "patterns", property: "commutative", prompt: "If a × 4 = 4 × 2, then a = ___.", expectedAnswer: "2", sourceLabels: ["Giza 23"], choices: ["8", "4", "2", "6"] },
];

export const MULTIPLICATION_PROPERTIES_AND_PATTERNS_BANK = [
  ...MULTIPLICATION_PROPERTIES_QUESTIONS,
  ...MULTIPLICATION_PATTERN_QUESTIONS,
] as const;
