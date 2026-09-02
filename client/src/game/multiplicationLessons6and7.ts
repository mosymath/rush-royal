/** Unit 5, Lessons 6 & 7 — Associative Property and Applying Patterns. */

export type AssociativePatternQuestion = {
  id: string;
  lesson: "associative" | "applied-patterns";
  skill: "grouping" | "product" | "pattern" | "missing-factor" | "word-problem" | "property";
  prompt: string;
  expectedAnswer: string;
  sourceLabels: readonly string[];
  choices?: readonly string[];
};

export const ASSOCIATIVE_PATTERN_RULES = {
  associative: "When you group factors in different ways, the product is the same.",
  grouping: "Use parentheses to group the factors you multiply first.",
  decomposition: "Use decomposition and the Associative Property to multiply by multiples of 10, 100, and 1,000.",
  sandwich: "4 × 2 × 2 = (4 × 2) × 2 = 4 × (2 × 2) = 16.",
} as const;

export const ASSOCIATIVE_PROPERTY_QUESTIONS: readonly AssociativePatternQuestion[] = [
  { id: "assoc-sandwich", lesson: "associative", skill: "product", prompt: "Make Super Cheesy Sandwiches for 4 people. Each person gets 2 sandwiches and each sandwich has 2 slices of cheese. How many slices are needed?", expectedAnswer: "16 slices", sourceLabels: [] },
  { id: "assoc-missing-6-2-5", lesson: "associative", skill: "grouping", prompt: "Complete: (6 × 2) × 5 = 6 × (___ × 5).", expectedAnswer: "2", sourceLabels: [] },
  { id: "assoc-missing-20-15-10", lesson: "associative", skill: "grouping", prompt: "Complete: (20 × ___) × 10 = 20 × (15 × 10).", expectedAnswer: "15", sourceLabels: [] },
  { id: "assoc-missing-7-5-2", lesson: "associative", skill: "grouping", prompt: "Complete: 7 × (5 × 2) = (7 × ___) × 2.", expectedAnswer: "5", sourceLabels: [] },
  { id: "assoc-missing-315-16-120", lesson: "associative", skill: "grouping", prompt: "Complete: 315 × (16 × 120) = (___ × ___) × 120.", expectedAnswer: "315 × 16", sourceLabels: [] },
  { id: "assoc-product-3-2-9", lesson: "associative", skill: "product", prompt: "Solve by multiplying the parentheses first: (3 × 2) × 9.", expectedAnswer: "54", sourceLabels: [] },
  { id: "assoc-product-10-5-3", lesson: "associative", skill: "product", prompt: "Solve by multiplying the parentheses first: 10 × (5 × 3).", expectedAnswer: "150", sourceLabels: [] },
  { id: "assoc-product-3-2-5", lesson: "associative", skill: "grouping", prompt: "Place parentheses two ways to find 3 × 2 × 5.", expectedAnswer: "(3 × 2) × 5 = 3 × (2 × 5) = 30", sourceLabels: [] },
  { id: "assoc-product-4-10-2", lesson: "associative", skill: "grouping", prompt: "Place parentheses two ways to find 4 × 10 × 2.", expectedAnswer: "(4 × 10) × 2 = 4 × (10 × 2) = 80", sourceLabels: [] },
  { id: "assoc-commute-3-7-2", lesson: "associative", skill: "property", prompt: "Use Commutative and Associative Properties to solve 3 × 7 × 2.", expectedAnswer: "42", sourceLabels: [] },
  { id: "assoc-commute-4-8-2", lesson: "associative", skill: "property", prompt: "Use Commutative and Associative Properties to solve 4 × 8 × 2.", expectedAnswer: "64", sourceLabels: [] },
  { id: "assoc-check-4-2-6", lesson: "associative", skill: "product", prompt: "Find each product: (4 × 2) × 6.", expectedAnswer: "48", sourceLabels: [] },
  { id: "assoc-check-5-5-2", lesson: "associative", skill: "product", prompt: "Find each product: 5 × (5 × 2).", expectedAnswer: "50", sourceLabels: [] },
  { id: "assoc-check-8-5-2", lesson: "associative", skill: "product", prompt: "Find each product: 8 × 5 × 2.", expectedAnswer: "80", sourceLabels: [] },
  { id: "assoc-check-3-2-8", lesson: "associative", skill: "product", prompt: "Find each product: 3 × 2 × 8.", expectedAnswer: "48", sourceLabels: [] },
  { id: "assoc-exercise-3-3-4", lesson: "associative", skill: "product", prompt: "Solve: (3 × 3) × 4.", expectedAnswer: "36", sourceLabels: [] },
  { id: "assoc-exercise-5-2-3", lesson: "associative", skill: "product", prompt: "Solve: (5 × 2) × 3.", expectedAnswer: "30", sourceLabels: [] },
  { id: "assoc-exercise-2-3-4", lesson: "associative", skill: "product", prompt: "Solve: 2 × (3 × 4).", expectedAnswer: "24", sourceLabels: [] },
  { id: "assoc-exercise-5-2-3b", lesson: "associative", skill: "product", prompt: "Solve: 5 × (2 × 3).", expectedAnswer: "30", sourceLabels: [] },
  { id: "assoc-exercise-2-6-3", lesson: "associative", skill: "product", prompt: "Solve: (2 × 6) × 3.", expectedAnswer: "36", sourceLabels: [] },
  { id: "assoc-exercise-9-2-3", lesson: "associative", skill: "product", prompt: "Solve: 9 × (2 × 3).", expectedAnswer: "54", sourceLabels: [] },
  { id: "assoc-exercise-8-6-5", lesson: "associative", skill: "product", prompt: "Solve: 8 × (6 × 5).", expectedAnswer: "240", sourceLabels: [] },
  { id: "assoc-exercise-4-5-7", lesson: "associative", skill: "product", prompt: "Solve: (4 × 5) × 7.", expectedAnswer: "140", sourceLabels: [] },
  { id: "assoc-parentheses-5-4-2", lesson: "associative", skill: "grouping", prompt: "Place parentheses two ways to find 5 × 4 × 2.", expectedAnswer: "40", sourceLabels: [] },
  { id: "assoc-parentheses-8-5-10", lesson: "associative", skill: "grouping", prompt: "Place parentheses two ways to find 8 × 5 × 10.", expectedAnswer: "400", sourceLabels: [] },
  { id: "assoc-water", lesson: "associative", skill: "word-problem", prompt: "Aisha bought 3 packs of water bottles. Each pack had 3 rows of 4 bottles. How many bottles did she buy?", expectedAnswer: "36 bottles", sourceLabels: [] },
  { id: "assoc-hany", lesson: "associative", skill: "word-problem", prompt: "Hany works 20 hours a week. If he earns L.E. 6 per hour, how much does he earn in two weeks?", expectedAnswer: "L.E. 240", sourceLabels: [] },
  { id: "assoc-anny", lesson: "associative", skill: "word-problem", prompt: "Anny runs 2 kilometres a day, five days a week. How many kilometres does she run in 10 weeks?", expectedAnswer: "100 km", sourceLabels: [] },
  { id: "assoc-heba-ashraf", lesson: "associative", skill: "property", prompt: "Heba calculates (4 × 8) × 10 and Ashraf calculates 4 × (8 × 10). Are their results the same?", expectedAnswer: "Yes, both equal 320", sourceLabels: [] },
  { id: "assoc-farouk", lesson: "associative", skill: "grouping", prompt: "Farouk solves 2 × 7 × 4. Show two groupings and the product.", expectedAnswer: "(2 × 7) × 4 = 2 × (7 × 4) = 56", sourceLabels: [] },
  { id: "assoc-mom", lesson: "associative", skill: "word-problem", prompt: "Marwan receives L.E. 5 each school day and pays L.E. 3 for lunch. How much will he save in 10 weeks of 5 school days?", expectedAnswer: "L.E. 100", sourceLabels: [] },
];

export const APPLIED_PATTERN_QUESTIONS: readonly AssociativePatternQuestion[] = [
  { id: "applied-8x30", lesson: "applied-patterns", skill: "pattern", prompt: "Find the product using decomposition: 8 × 30.", expectedAnswer: "240", sourceLabels: [] },
  { id: "applied-9x60", lesson: "applied-patterns", skill: "pattern", prompt: "Solve: 9 × 60.", expectedAnswer: "540", sourceLabels: [] },
  { id: "applied-600x7", lesson: "applied-patterns", skill: "pattern", prompt: "Solve: 600 × 7.", expectedAnswer: "4,200", sourceLabels: [] },
  { id: "applied-4000x6", lesson: "applied-patterns", skill: "pattern", prompt: "Solve: 4,000 × 6.", expectedAnswer: "24,000", sourceLabels: [] },
  { id: "applied-4x40", lesson: "applied-patterns", skill: "pattern", prompt: "Use decomposition and the Associative Property: 4 × 40.", expectedAnswer: "160", sourceLabels: [] },
  { id: "applied-5x500", lesson: "applied-patterns", skill: "pattern", prompt: "Use decomposition and the Associative Property: 5 × 500.", expectedAnswer: "2,500", sourceLabels: [] },
  { id: "applied-2x8000", lesson: "applied-patterns", skill: "pattern", prompt: "Use decomposition and the Associative Property: 2 × 8,000.", expectedAnswer: "16,000", sourceLabels: [] },
  { id: "applied-tens-30", lesson: "applied-patterns", skill: "pattern", prompt: "30 = ___ tens.", expectedAnswer: "3", sourceLabels: [] },
  { id: "applied-tens-80", lesson: "applied-patterns", skill: "pattern", prompt: "80 = ___ tens.", expectedAnswer: "8", sourceLabels: [] },
  { id: "applied-tens-140", lesson: "applied-patterns", skill: "pattern", prompt: "140 = ___ tens.", expectedAnswer: "14", sourceLabels: [] },
  { id: "applied-hundreds-600", lesson: "applied-patterns", skill: "pattern", prompt: "600 = ___ hundreds.", expectedAnswer: "6", sourceLabels: [] },
  { id: "applied-thousands-5000", lesson: "applied-patterns", skill: "pattern", prompt: "5,000 = ___ thousands.", expectedAnswer: "5", sourceLabels: ["Alex. – El-Montazah 23"] },
  { id: "applied-triangle-40", lesson: "applied-patterns", skill: "missing-factor", prompt: "A triangle shows 40 at the top and 10 at the base. What missing factor completes the multiplication?", expectedAnswer: "4", sourceLabels: [] },
  { id: "applied-triangle-300", lesson: "applied-patterns", skill: "missing-factor", prompt: "A triangle shows 300 at the top and 100 at the base. What missing factor completes the multiplication?", expectedAnswer: "3", sourceLabels: [] },
  { id: "applied-triangle-5000", lesson: "applied-patterns", skill: "missing-factor", prompt: "A triangle shows 5,000 at the top and 1,000 at the base. What missing factor completes the multiplication?", expectedAnswer: "5", sourceLabels: [] },
  { id: "applied-7x20", lesson: "applied-patterns", skill: "pattern", prompt: "Solve: 7 × 20.", expectedAnswer: "140", sourceLabels: [] },
  { id: "applied-5x50", lesson: "applied-patterns", skill: "pattern", prompt: "Solve: 5 × 50.", expectedAnswer: "250", sourceLabels: [] },
  { id: "applied-4x700", lesson: "applied-patterns", skill: "pattern", prompt: "Solve: 4 × 700.", expectedAnswer: "2,800", sourceLabels: [] },
  { id: "applied-3x4000", lesson: "applied-patterns", skill: "pattern", prompt: "Solve: 3 × 4,000.", expectedAnswer: "12,000", sourceLabels: [] },
  { id: "applied-9x500", lesson: "applied-patterns", skill: "pattern", prompt: "Solve: 9 × 500.", expectedAnswer: "4,500", sourceLabels: [] },
  { id: "applied-200x3", lesson: "applied-patterns", skill: "pattern", prompt: "Solve: 200 × 3.", expectedAnswer: "600", sourceLabels: ["Cairo – El Nozha 23"] },
  { id: "applied-500x7", lesson: "applied-patterns", skill: "pattern", prompt: "Solve: 500 × 7.", expectedAnswer: "3,500", sourceLabels: ["El-Monofia – Sadat City 23"] },
  { id: "applied-600x3", lesson: "applied-patterns", skill: "pattern", prompt: "Solve: 600 × 3.", expectedAnswer: "1,800", sourceLabels: ["Cairo – El Shrouk 23"] },
  { id: "applied-7000x6", lesson: "applied-patterns", skill: "pattern", prompt: "Solve: 7,000 × 6.", expectedAnswer: "42,000", sourceLabels: [] },
  { id: "applied-4000x5", lesson: "applied-patterns", skill: "pattern", prompt: "Solve: 4,000 × 5.", expectedAnswer: "20,000", sourceLabels: [] },
  { id: "applied-mcq-8000", lesson: "applied-patterns", skill: "pattern", prompt: "8,000 = ___ tens.", expectedAnswer: "800", sourceLabels: ["Giza 23"], choices: ["800", "80,000", "80", "8"] },
  { id: "applied-mcq-700", lesson: "applied-patterns", skill: "pattern", prompt: "700 = ___ hundreds.", expectedAnswer: "7", sourceLabels: ["Cairo – El Nozha 23"], choices: ["7", "700", "70", "7,000"] },
  { id: "applied-mcq-group-2-5-4", lesson: "applied-patterns", skill: "grouping", prompt: "Complete: 2 × (5 × 4) = (2 × ___) × 4.", expectedAnswer: "5", sourceLabels: ["Souhag 23"], choices: ["0", "1", "10", "5"] },
  { id: "applied-mcq-associative", lesson: "applied-patterns", skill: "property", prompt: "Which expression represents the Associative Property?", expectedAnswer: "[2 × 5] × 3 = 2 × [5 × 3]", sourceLabels: ["El-Beheira 23"], choices: ["11 × 129 = 129 × 11", "[2 × 5] × 3 = 2 × [5 × 3]", "0 × 17 = 0", "[2 × L] + W"] },
  { id: "applied-mcq-253", lesson: "applied-patterns", skill: "grouping", prompt: "Complete: 253 + (226 + 142) = [253 + ___] + 142.", expectedAnswer: "226", sourceLabels: ["Alexandria 23"], choices: ["253", "226", "142", "368"] },
  { id: "applied-mcq-2-3-4", lesson: "applied-patterns", skill: "product", prompt: "2 × 3 × 4 = ___.", expectedAnswer: "24", sourceLabels: [], choices: ["234", "9", "24", "10"] },
  { id: "applied-mcq-zero", lesson: "applied-patterns", skill: "product", prompt: "(300 × 7) × 0 = ___.", expectedAnswer: "0", sourceLabels: [], choices: ["2,100", "3,070", "zero", "307"] },
  { id: "applied-mcq-triangle-70", lesson: "applied-patterns", skill: "missing-factor", prompt: "A triangle shows 70 at the top and 10 at the base. What missing factor completes it?", expectedAnswer: "7", sourceLabels: [], choices: ["7,000", "70", "700", "7"] },
  { id: "applied-mcq-5000x2", lesson: "applied-patterns", skill: "pattern", prompt: "5,000 × 2 = ___.", expectedAnswer: "10 thousands", sourceLabels: [], choices: ["1,000", "2 thousands", "10 Hundreds", "10 Thousands"] },
  { id: "applied-mcq-associative-equation", lesson: "applied-patterns", skill: "property", prompt: "Which equation best explains the Associative Property of Multiplication?", expectedAnswer: "[3 × 7] × 2 = 3 × [7 × 2]", sourceLabels: ["Alexandria – El-Montazah 22"], choices: ["[4 × 6] × 1 = 4 × 6", "[3 × 7] × 2 = 3 × [7 × 2]", "[4 × 6] × 1 = 4 × 6", "[11 × 8] × 9 = 9 × [11 × 8]"] },
];

export const ASSOCIATIVE_AND_APPLIED_PATTERN_BANK = [...ASSOCIATIVE_PROPERTY_QUESTIONS, ...APPLIED_PATTERN_QUESTIONS] as const;
