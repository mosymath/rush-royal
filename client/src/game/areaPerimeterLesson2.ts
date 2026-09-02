/**
 * Unit 4, Lesson 2 — Finding Area.
 * Every sourceLabels value is transcribed from a teacher-supplied past-exam page
 * and must be rendered in red in the future Mosy Math Adventure game interface.
 */

export type AreaShape = "rectangle" | "square" | "comparison" | "unknown-dimensions" | "formula";

export type AreaQuestion = {
  id: string;
  shape: AreaShape;
  prompt: string;
  expectedAnswer: string;
  unit?: "m²" | "cm²" | "mm²" | "km²";
  dimensions?: { length?: number; width?: number; side?: number };
  sourceLabels: readonly string[];
  choices?: readonly string[];
};

export const FINDING_AREA_FORMULAS = {
  rectangle: ["A = length × width", "A = l × w"],
  square: ["A = side length × itself", "A = s × s"],
} as const;

export const FINDING_AREA_LESSON_TWO_PRACTICE: readonly AreaQuestion[] = [
  { id: "area-practice-hall-6-4", shape: "rectangle", prompt: "Sameh tiled a rectangular hall floor that is 6 m by 4 m. How many 1 m by 1 m tiles did he use?", expectedAnswer: "24", unit: "m²", dimensions: { length: 6, width: 4 }, sourceLabels: [] },
  { id: "area-practice-square-3", shape: "square", prompt: "Find the area of a square with side length 3 cm.", expectedAnswer: "9", unit: "cm²", dimensions: { side: 3 }, sourceLabels: [] },
  { id: "area-practice-rectangle-18-10", shape: "rectangle", prompt: "Find the area of a rectangle that is 18 m by 10 m.", expectedAnswer: "180", unit: "m²", dimensions: { length: 18, width: 10 }, sourceLabels: [] },
  { id: "area-practice-rectangle-6-8", shape: "rectangle", prompt: "Find the area of a rectangle that is 6 mm by 8 mm.", expectedAnswer: "48", unit: "mm²", dimensions: { length: 6, width: 8 }, sourceLabels: [] },
  { id: "area-practice-square-9", shape: "square", prompt: "Find the area of a square with side length 9 cm.", expectedAnswer: "81", unit: "cm²", dimensions: { side: 9 }, sourceLabels: [] },
  { id: "area-practice-area-perimeter-16-9", shape: "rectangle", prompt: "A rectangle is 16 m by 9 m. Find its area and perimeter.", expectedAnswer: "A = 144 m²; P = 50 m", unit: "m²", dimensions: { length: 16, width: 9 }, sourceLabels: [] },
  { id: "area-practice-area-perimeter-square-10", shape: "square", prompt: "A square has side length 10 mm. Find its area and perimeter.", expectedAnswer: "A = 100 mm²; P = 40 mm", unit: "mm²", dimensions: { side: 10 }, sourceLabels: [] },
  { id: "area-practice-fish-farm-10-8", shape: "rectangle", prompt: "A rectangular fish farm measures 10 m by 8 m. Find its area.", expectedAnswer: "80", unit: "m²", dimensions: { length: 10, width: 8 }, sourceLabels: [] },
  { id: "area-practice-compare-5-3-and-4", shape: "comparison", prompt: "Which has the greater area: a rectangle that is 5 cm by 3 cm, or a square with side length 4 cm?", expectedAnswer: "The 4 cm square", unit: "cm²", sourceLabels: [] },
  { id: "area-practice-factor-pairs-12", shape: "unknown-dimensions", prompt: "A rectangle has area 12 m². Give possible whole-number dimensions and find each perimeter.", expectedAnswer: "1 m × 12 m → 26 m; 2 m × 6 m → 16 m; 3 m × 4 m → 14 m", unit: "m²", sourceLabels: [] },
  { id: "area-practice-factor-pairs-36", shape: "unknown-dimensions", prompt: "Use 36 square tiles to form two possible rectangles. Label the dimensions, area, and perimeter of each arrangement.", expectedAnswer: "Any two valid factor-pair rectangles with area 36 square units", sourceLabels: [] },
  { id: "area-practice-challenge-24", shape: "unknown-dimensions", prompt: "A rectangle has area 24 cm² and a perimeter between 20 cm and 30 cm. Identify valid whole-number side lengths.", expectedAnswer: "2 cm × 12 cm, 3 cm × 8 cm, or 4 cm × 6 cm", unit: "cm²", sourceLabels: [] },
];

export const FINDING_AREA_PAST_EXAM_QUESTIONS: readonly AreaQuestion[] = [
  { id: "area-exam-area-perimeter-6-4", shape: "rectangle", prompt: "A rectangle is 6 cm by 4 cm. Find its area and perimeter.", expectedAnswer: "A = 24 cm²; P = 20 cm", unit: "cm²", dimensions: { length: 6, width: 4 }, sourceLabels: ["El-Monofia – Sadat City 23"] },
  { id: "area-exam-area-perimeter-5-3", shape: "rectangle", prompt: "A rectangle is 5 cm by 3 cm. Find its area and perimeter.", expectedAnswer: "A = 15 cm²; P = 16 cm", unit: "cm²", dimensions: { length: 5, width: 3 }, sourceLabels: ["El-Menia 23"] },
  { id: "area-exam-area-perimeter-square-9", shape: "square", prompt: "A square has side length 9 m. Find its area and perimeter.", expectedAnswer: "A = 81 m²; P = 36 m", unit: "m²", dimensions: { side: 9 }, sourceLabels: [] },
  { id: "area-exam-complete-square-formula", shape: "formula", prompt: "Complete: Area of a square = ___ × ___.", expectedAnswer: "side length × side length", sourceLabels: ["Alex. – West 23"] },
  { id: "area-exam-complete-rectangle-7-4", shape: "rectangle", prompt: "A rectangle has length 7 cm and width 4 cm. Find its area.", expectedAnswer: "28", unit: "cm²", dimensions: { length: 7, width: 4 }, sourceLabels: ["Cairo – Rod El Farag 23"] },
  { id: "area-exam-complete-rectangle-8-3", shape: "rectangle", prompt: "A rectangle has length 8 cm and width 3 cm. Find its area.", expectedAnswer: "24", unit: "cm²", dimensions: { length: 8, width: 3 }, sourceLabels: ["El-Behiera 23", "Cairo – El Marg 23"] },
  { id: "area-exam-complete-garden-square-9", shape: "square", prompt: "A square garden has side length 9 m. Find its area.", expectedAnswer: "81", unit: "m²", dimensions: { side: 9 }, sourceLabels: ["Alex. – Al Agamy 23", "Cairo – El Salam 23"] },
  { id: "area-exam-complete-rectangle-5-3", shape: "rectangle", prompt: "The dimensions of a rectangle are 5 cm and 3 cm. Find its area.", expectedAnswer: "15", unit: "cm²", dimensions: { length: 5, width: 3 }, sourceLabels: [] },
  { id: "area-exam-complete-rectangle-6-4", shape: "rectangle", prompt: "A rectangle is 6 cm long and 4 cm wide. Find its area.", expectedAnswer: "24", unit: "cm²", dimensions: { length: 6, width: 4 }, sourceLabels: ["El-Sharkia 22"] },
  { id: "area-exam-complete-rectangle-10-8", shape: "rectangle", prompt: "A rectangle is 10 mm long and 8 mm wide. Find its area.", expectedAnswer: "80", unit: "mm²", dimensions: { length: 10, width: 8 }, sourceLabels: [] },
  { id: "area-exam-complete-square-4", shape: "square", prompt: "A square has side length 4 m. Find its area.", expectedAnswer: "16", unit: "m²", dimensions: { side: 4 }, sourceLabels: ["El-Menia – Dir Mawas 22"] },
  { id: "area-exam-complete-square-6", shape: "square", prompt: "A square has side length 6 cm. Find its area.", expectedAnswer: "36", unit: "cm²", dimensions: { side: 6 }, sourceLabels: ["El-Behiera – Hosh Essa 23"] },
  { id: "area-exam-glass-square-8", shape: "square", prompt: "Hussein has a square picture with side length 8 cm. What area of glass is needed to cover it?", expectedAnswer: "64", unit: "cm²", dimensions: { side: 8 }, sourceLabels: ["El-Kalyoubia 22"] },
  { id: "area-exam-rectangle-9-5", shape: "rectangle", prompt: "Find the area of a rectangle with length 9 cm and width 5 cm.", expectedAnswer: "45", unit: "cm²", dimensions: { length: 9, width: 5 }, sourceLabels: ["Cairo 23"] },
  { id: "area-exam-square-5", shape: "square", prompt: "Find the area of a square with side length 5 cm.", expectedAnswer: "25", unit: "cm²", dimensions: { side: 5 }, sourceLabels: [] },
  { id: "area-exam-room-square-3", shape: "square", prompt: "A square-shaped room has side length 3 m. Find its area.", expectedAnswer: "9", unit: "m²", dimensions: { side: 3 }, sourceLabels: ["Cairo – El Nozha 23"] },
  { id: "area-exam-garden-square-6", shape: "square", prompt: "Amgad has a square garden with side length 6 m. Find its area.", expectedAnswer: "36", unit: "m²", dimensions: { side: 6 }, sourceLabels: ["Giza 23"] },
  { id: "area-exam-garden-rectangle-7-5", shape: "rectangle", prompt: "A rectangular garden is 7 m by 5 m. Find its area.", expectedAnswer: "35", unit: "m²", dimensions: { length: 7, width: 5 }, sourceLabels: ["Souhag 23"] },
  { id: "area-exam-compare-7-5-and-6", shape: "comparison", prompt: "Which is greater: the area of a rectangle that is 7 cm by 5 cm, or a square with side length 6 cm?", expectedAnswer: "The 6 cm square", unit: "cm²", sourceLabels: ["Giza – Abo El Nomros 23"] },
  { id: "area-exam-banquet-table-8-6", shape: "rectangle", prompt: "A banquet table is 8 m by 6 m. Find the area of glass needed to cover its top.", expectedAnswer: "48", unit: "m²", dimensions: { length: 8, width: 6 }, sourceLabels: [] },
  { id: "area-exam-ant-farm-20-8", shape: "rectangle", prompt: "A rectangular ant farm measures 20 cm by 8 cm. Find its area.", expectedAnswer: "160", unit: "cm²", dimensions: { length: 20, width: 8 }, sourceLabels: [] },
  { id: "area-exam-room-square-4", shape: "square", prompt: "A square-shaped room has side length 4 m. Find its area.", expectedAnswer: "16", unit: "m²", dimensions: { side: 4 }, sourceLabels: ["Souhag 22"] },
  { id: "area-exam-mcq-rectangle-formula", shape: "formula", prompt: "If a rectangle has length l and width w, which formula gives its area?", expectedAnswer: "A = l × w", sourceLabels: ["Cairo – El Shrouk 23"], choices: ["A = l − w", "A = l + w", "A = l × w", "A = l ÷ w"] },
  { id: "area-exam-mcq-square-formula", shape: "formula", prompt: "Area of a square = side length × ___.", expectedAnswer: "itself", sourceLabels: ["Ismailia 23"], choices: ["itself", "width", "4", "height"] },
  { id: "area-exam-mcq-square-6-km", shape: "square", prompt: "A square has side length 6 km. Find its area.", expectedAnswer: "36 km²", unit: "km²", dimensions: { side: 6 }, sourceLabels: [] },
  { id: "area-exam-mcq-rectangle-8-4", shape: "rectangle", prompt: "A rectangle is 8 cm by 4 cm. Find its area.", expectedAnswer: "32", unit: "cm²", dimensions: { length: 8, width: 4 }, sourceLabels: ["Giza – 6th October 22"], choices: ["32", "12", "24", "64"] },
  { id: "area-exam-mcq-rectangle-8-5", shape: "rectangle", prompt: "A rectangle is 8 cm by 5 cm. Find its area.", expectedAnswer: "40", unit: "cm²", dimensions: { length: 8, width: 5 }, sourceLabels: ["El-Dakahlia 22"], choices: ["3", "13", "26", "40"] },
  { id: "area-exam-mcq-rectangle-20-10", shape: "rectangle", prompt: "A rectangle is 20 cm by 10 cm. Find its area.", expectedAnswer: "200", unit: "cm²", dimensions: { length: 20, width: 10 }, sourceLabels: ["Giza – El-Haram 22", "El-Monofia – Sers El-Layan 23"], choices: ["2 × 20 + 2 × 10", "20 + 10", "60", "200"] },
  { id: "area-exam-mcq-rectangle-9-6", shape: "rectangle", prompt: "A rectangle is 9 cm by 6 cm. Find its area.", expectedAnswer: "54", unit: "cm²", dimensions: { length: 9, width: 6 }, sourceLabels: ["El-Monofia – Quesna 23"], choices: ["54", "30", "45", "15"] },
  { id: "area-exam-mcq-rectangle-4-3", shape: "rectangle", prompt: "A rectangle is 4 cm by 3 cm. Find its area.", expectedAnswer: "12", unit: "cm²", dimensions: { length: 4, width: 3 }, sourceLabels: ["Cairo – El Nozha 23"], choices: ["12", "16", "10", "20"] },
  { id: "area-exam-mcq-square-5", shape: "square", prompt: "A square has side length 5 cm. Find its area.", expectedAnswer: "25", unit: "cm²", dimensions: { side: 5 }, sourceLabels: ["Cairo – El Nozha 23"], choices: ["21", "25", "12", "10"] },
  { id: "area-exam-mcq-square-6", shape: "square", prompt: "A square has side length 6 cm. Find its area.", expectedAnswer: "36", unit: "cm²", dimensions: { side: 6 }, sourceLabels: ["Souhag 23"], choices: ["11", "30", "24", "36"] },
];

export const FINDING_AREA_QUESTION_BANK = [
  ...FINDING_AREA_LESSON_TWO_PRACTICE,
  ...FINDING_AREA_PAST_EXAM_QUESTIONS,
] as const;

export const getRedAreaExamSourceLabels = (question: AreaQuestion) => question.sourceLabels;
