/**
 * Unit 4, Lesson 1 — Finding Perimeter.
 * Source labels are copied from the teacher-provided past-exam pages and must be
 * rendered in red whenever these questions appear in the future game interface.
 */

export type PerimeterShape = "rectangle" | "square" | "construction" | "formula";

export type PerimeterQuestion = {
  id: string;
  shape: PerimeterShape;
  prompt: string;
  expectedAnswer: string;
  unit?: "m" | "cm" | "mm";
  dimensions?: { length?: number; width?: number; side?: number };
  sourceLabels: readonly string[];
  choices?: readonly string[];
};

export const FINDING_PERIMETER_FORMULAS = {
  rectangle: [
    "P = length + width + length + width",
    "P = 2 × length + 2 × width",
    "P = 2 × (length + width)",
  ],
  square: [
    "P = side + side + side + side",
    "P = 4 × side",
  ],
} as const;

export const FINDING_PERIMETER_LESSON_ONE_PRACTICE: readonly PerimeterQuestion[] = [
  { id: "perimeter-practice-square-3", shape: "square", prompt: "Find the perimeter of a square with side length 3 m.", expectedAnswer: "12", unit: "m", dimensions: { side: 3 }, sourceLabels: [] },
  { id: "perimeter-practice-square-9", shape: "square", prompt: "Find the perimeter of a square with side length 9 cm.", expectedAnswer: "36", unit: "cm", dimensions: { side: 9 }, sourceLabels: [] },
  { id: "perimeter-practice-square-27", shape: "square", prompt: "Find the perimeter of a square with side length 27 cm.", expectedAnswer: "108", unit: "cm", dimensions: { side: 27 }, sourceLabels: [] },
  { id: "perimeter-practice-rectangle-30-50", shape: "rectangle", prompt: "Find the perimeter of a rectangle that is 30 mm long and 50 mm wide.", expectedAnswer: "160", unit: "mm", dimensions: { length: 30, width: 50 }, sourceLabels: [] },
  { id: "perimeter-practice-rectangle-67-21", shape: "rectangle", prompt: "Find the perimeter of a rectangle that is 67 m long and 21 m wide.", expectedAnswer: "176", unit: "m", dimensions: { length: 67, width: 21 }, sourceLabels: [] },
  { id: "perimeter-practice-square-33", shape: "square", prompt: "Find the perimeter of a square with side length 33 mm.", expectedAnswer: "132", unit: "mm", dimensions: { side: 33 }, sourceLabels: [] },
];

export const FINDING_PERIMETER_PAST_EXAM_QUESTIONS: readonly PerimeterQuestion[] = [
  { id: "perimeter-exam-complete-rectangle-formula", shape: "formula", prompt: "Complete: The perimeter of a rectangle = (length + width) × ___.", expectedAnswer: "2", sourceLabels: ["Cairo – El-Salam 23"] },
  { id: "perimeter-exam-complete-rectangle-symbols", shape: "formula", prompt: "Complete: A rectangle has length (l) and width (w). Its perimeter = ___.", expectedAnswer: "2 × (l + w)", sourceLabels: ["Cairo 23"] },
  { id: "perimeter-exam-complete-square-symbols", shape: "formula", prompt: "Complete: If the side length of a square is (s), then its perimeter = ___ × ___.", expectedAnswer: "4 × s", sourceLabels: ["Alex. – El-Agamy 23"] },
  { id: "perimeter-exam-rectangle-7-5", shape: "rectangle", prompt: "Find the perimeter of a rectangle with length 7 cm and width 5 cm.", expectedAnswer: "24", unit: "cm", dimensions: { length: 7, width: 5 }, sourceLabels: ["Souhag 23"] },
  { id: "perimeter-exam-square-3", shape: "square", prompt: "A square has side length 3 cm. Find its perimeter.", expectedAnswer: "12", unit: "cm", dimensions: { side: 3 }, sourceLabels: ["Cairo – Rod El-Farag 23"] },
  { id: "perimeter-exam-carpet-square-3", shape: "square", prompt: "A carpet is shaped like a square with side length 3 m. Find its perimeter.", expectedAnswer: "12", unit: "m", dimensions: { side: 3 }, sourceLabels: ["Giza 23"] },
  { id: "perimeter-exam-gymnasium-7-4", shape: "rectangle", prompt: "A rectangular gymnasium is 7 m long and 4 m wide. Find its perimeter.", expectedAnswer: "22", unit: "m", dimensions: { length: 7, width: 4 }, sourceLabels: ["Port Said 22"] },
  { id: "perimeter-exam-rectangle-8-6", shape: "rectangle", prompt: "Find the perimeter of a rectangle with length 8 cm and width 6 cm.", expectedAnswer: "28", unit: "cm", dimensions: { length: 8, width: 6 }, sourceLabels: ["Alex. – First Montaza 23"] },
  { id: "perimeter-exam-rectangle-16-14", shape: "rectangle", prompt: "Find the perimeter of a rectangle with length 16 cm and width 14 cm.", expectedAnswer: "60", unit: "cm", dimensions: { length: 16, width: 14 }, sourceLabels: ["Cairo 23"] },
  { id: "perimeter-exam-mcq-rectangle-formula", shape: "formula", prompt: "A rectangle has length l and width w. Which formula gives its perimeter?", expectedAnswer: "2 × (l + w)", sourceLabels: ["Cairo 23", "Alexandria – Montaza 22"], choices: ["l + w", "l × w", "2 × (l + w)", "(2 × l) + w"] },
  { id: "perimeter-exam-mcq-square-formula", shape: "formula", prompt: "Which formula gives the perimeter of a square when s is its side length?", expectedAnswer: "P = 4 × s", sourceLabels: [], choices: ["P = 4 + s", "P = 4 × s", "P = s × s", "P = s + s"] },
  { id: "perimeter-exam-mcq-rectangle-8-5", shape: "rectangle", prompt: "Find the perimeter of a rectangle with length 8 cm and width 5 cm.", expectedAnswer: "26", unit: "cm", dimensions: { length: 8, width: 5 }, sourceLabels: ["Giza – Abo El Nomros 23"], choices: ["13", "26", "30", "40"] },
  { id: "perimeter-exam-mcq-rectangle-8-2", shape: "rectangle", prompt: "Find the perimeter of a rectangle that is 8 cm long and 2 cm wide.", expectedAnswer: "20", unit: "cm", dimensions: { length: 8, width: 2 }, sourceLabels: [], choices: ["20", "10", "16", "6"] },
  { id: "perimeter-exam-mcq-square-8", shape: "square", prompt: "A square has side length 8 cm. Find its perimeter.", expectedAnswer: "32", unit: "cm", dimensions: { side: 8 }, sourceLabels: ["Alex. – West 23"], choices: ["16", "24", "32", "40"] },
  { id: "perimeter-exam-mcq-square-5", shape: "square", prompt: "A square has side length 5 cm. Find its perimeter.", expectedAnswer: "20", unit: "cm", dimensions: { side: 5 }, sourceLabels: ["El-Monofia – Sers El Layan 23", "Cairo – El Nozha 23"], choices: ["20", "25", "15", "35"] },
  { id: "perimeter-exam-mcq-rectangle-5-2", shape: "rectangle", prompt: "Find the perimeter of a rectangle that is 5 m long and 2 m wide.", expectedAnswer: "14 m", unit: "m", dimensions: { length: 5, width: 2 }, sourceLabels: ["Cairo – El Nozha 23"], choices: ["10 m", "20 m", "14 m", "14 cm"] },
  { id: "perimeter-exam-mcq-perimeter-32", shape: "rectangle", prompt: "Which rectangle has a perimeter of 32 m?", expectedAnswer: "10 m by 6 m", unit: "m", sourceLabels: [], choices: ["20 m by 12 m", "8 m by 4 m", "12 m by 4 m", "10 m by 6 m"] },
];

export const FINDING_PERIMETER_QUESTION_BANK = [
  ...FINDING_PERIMETER_LESSON_ONE_PRACTICE,
  ...FINDING_PERIMETER_PAST_EXAM_QUESTIONS,
] as const;

export const getRedExamSourceLabels = (question: PerimeterQuestion) => question.sourceLabels;
