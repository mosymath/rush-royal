/**
 * Unit 4, Lesson 3 — Unknown Dimensions.
 * Red source labels are copied from the supplied past-exam material and are a
 * required visual element whenever those questions are rendered in the game.
 */

export type UnknownDimensionShape = "rectangle-area" | "rectangle-perimeter" | "square-area" | "square-perimeter" | "table" | "comparison" | "formula";

export type UnknownDimensionQuestion = {
  id: string;
  shape: UnknownDimensionShape;
  prompt: string;
  expectedAnswer: string;
  unit?: "m" | "cm" | "mm" | "km" | "m²" | "cm²" | "mm²" | "km²";
  given?: Record<string, number>;
  sourceLabels: readonly string[];
  choices?: readonly string[];
};

export const UNKNOWN_DIMENSIONS_RULES = {
  rectangle: [
    "A = l × w",
    "l = A ÷ w",
    "w = A ÷ l",
    "P = 2 × (l + w)",
    "l = (P ÷ 2) − w",
    "w = (P ÷ 2) − l",
  ],
  square: [
    "A = s × s",
    "P = s × 4",
    "s = P ÷ 4",
  ],
} as const;

export const UNKNOWN_DIMENSIONS_LESSON_THREE_PRACTICE: readonly UnknownDimensionQuestion[] = [
  { id: "unknown-practice-rectangle-area-35-7", shape: "rectangle-area", prompt: "A rectangular flower garden has area 35 m² and length 7 m. Find its width.", expectedAnswer: "5", unit: "m", given: { area: 35, length: 7 }, sourceLabels: [] },
  { id: "unknown-practice-square-area-36", shape: "square-area", prompt: "A square has area 36 cm². Find its side length.", expectedAnswer: "6", unit: "cm", given: { area: 36 }, sourceLabels: [] },
  { id: "unknown-practice-rectangle-perimeter-28-6", shape: "rectangle-perimeter", prompt: "A rectangle has perimeter 28 cm and width 6 cm. Find its length.", expectedAnswer: "8", unit: "cm", given: { perimeter: 28, width: 6 }, sourceLabels: [] },
  { id: "unknown-practice-square-perimeter-36", shape: "square-perimeter", prompt: "A square has perimeter 36 cm. Find its side length.", expectedAnswer: "9", unit: "cm", given: { perimeter: 36 }, sourceLabels: [] },
  { id: "unknown-practice-example-area-28-4", shape: "rectangle-area", prompt: "A rectangle has area 28 cm² and width 4 cm. Find its length and perimeter.", expectedAnswer: "l = 7 cm; P = 22 cm", unit: "cm", given: { area: 28, width: 4 }, sourceLabels: [] },
  { id: "unknown-practice-example-square-area-16", shape: "square-area", prompt: "A square has area 16 m². Find its side length and perimeter.", expectedAnswer: "s = 4 m; P = 16 m", unit: "m", given: { area: 16 }, sourceLabels: [] },
  { id: "unknown-practice-example-perimeter-20-6", shape: "rectangle-perimeter", prompt: "A rectangle has perimeter 20 m and length 6 m. Find its width and area.", expectedAnswer: "w = 4 m; A = 24 m²", unit: "m", given: { perimeter: 20, length: 6 }, sourceLabels: [] },
  { id: "unknown-practice-example-square-perimeter-32", shape: "square-perimeter", prompt: "A square has perimeter 32 cm. Find its side length and area.", expectedAnswer: "s = 8 cm; A = 64 cm²", unit: "cm", given: { perimeter: 32 }, sourceLabels: [] },
  { id: "unknown-practice-area-28-7", shape: "rectangle-area", prompt: "A rectangle has area 28 cm² and length 7 cm. Find its unknown width.", expectedAnswer: "4", unit: "cm", given: { area: 28, length: 7 }, sourceLabels: [] },
  { id: "unknown-practice-area-50-10", shape: "rectangle-area", prompt: "A rectangle has area 50 square units and length 10 units. Find its unknown width.", expectedAnswer: "5", given: { area: 50, length: 10 }, sourceLabels: [] },
  { id: "unknown-practice-area-99-11", shape: "rectangle-area", prompt: "A rectangle has area 99 m² and width 11 m. Find its unknown length.", expectedAnswer: "9", unit: "m", given: { area: 99, width: 11 }, sourceLabels: [] },
  { id: "unknown-practice-perimeter-24-8", shape: "rectangle-perimeter", prompt: "A rectangle has perimeter 24 cm and width 8 cm. Find its unknown length.", expectedAnswer: "4", unit: "cm", given: { perimeter: 24, width: 8 }, sourceLabels: [] },
  { id: "unknown-practice-perimeter-26-5", shape: "rectangle-perimeter", prompt: "A rectangle has perimeter 26 units and width 5 units. Find its unknown length.", expectedAnswer: "8", given: { perimeter: 26, width: 5 }, sourceLabels: [] },
  { id: "unknown-practice-perimeter-44-15", shape: "rectangle-perimeter", prompt: "A rectangle has perimeter 44 m and length 15 m. Find its unknown width.", expectedAnswer: "7", unit: "m", given: { perimeter: 44, length: 15 }, sourceLabels: [] },
  { id: "unknown-practice-square-area-25", shape: "square-area", prompt: "A square has area 25 m². Find its unknown side length.", expectedAnswer: "5", unit: "m", given: { area: 25 }, sourceLabels: [] },
  { id: "unknown-practice-square-area-49", shape: "square-area", prompt: "A square has area 49 cm². Find its unknown side length.", expectedAnswer: "7", unit: "cm", given: { area: 49 }, sourceLabels: [] },
  { id: "unknown-practice-square-area-64", shape: "square-area", prompt: "A square has area 64 cm². Find its unknown side length.", expectedAnswer: "8", unit: "cm", given: { area: 64 }, sourceLabels: [] },
  { id: "unknown-practice-table-side-9", shape: "table", prompt: "Complete the square table: side length 9 m. Find the area and perimeter.", expectedAnswer: "A = 81 m²; P = 36 m", unit: "m", given: { side: 9 }, sourceLabels: [] },
  { id: "unknown-practice-table-area-64", shape: "table", prompt: "Complete the square table: area 64 cm². Find the side length and perimeter.", expectedAnswer: "s = 8 cm; P = 32 cm", unit: "cm", given: { area: 64 }, sourceLabels: [] },
  { id: "unknown-practice-table-perimeter-24", shape: "table", prompt: "Complete the square table: perimeter 24 mm. Find the side length and area.", expectedAnswer: "s = 6 mm; A = 36 mm²", unit: "mm", given: { perimeter: 24 }, sourceLabels: [] },
  { id: "unknown-practice-flowerbed-12-3", shape: "rectangle-area", prompt: "A rectangular flowerbed has area 12 m² and width 3 m. Find its length.", expectedAnswer: "4", unit: "m", given: { area: 12, width: 3 }, sourceLabels: [] },
  { id: "unknown-practice-painting-28-4", shape: "rectangle-area", prompt: "Ali sketched a rectangular painting with area 28 cm² and width 4 cm. Find its perimeter.", expectedAnswer: "22", unit: "cm", given: { area: 28, width: 4 }, sourceLabels: [] },
  { id: "unknown-practice-picture-square-49", shape: "square-area", prompt: "A square picture has area 49 cm². Find the width and length of its frame.", expectedAnswer: "7 cm by 7 cm", unit: "cm", given: { area: 49 }, sourceLabels: [] },
  { id: "unknown-practice-garden-perimeter-26-6", shape: "rectangle-perimeter", prompt: "A rectangular garden has 26 m of fencing and width 6 m. Find its length and area.", expectedAnswer: "l = 7 m; A = 42 m²", unit: "m", given: { perimeter: 26, width: 6 }, sourceLabels: [] },
  { id: "unknown-practice-playground-perimeter-40", shape: "square-perimeter", prompt: "Mai walked once around a square playground for 40 m. Find its area.", expectedAnswer: "100", unit: "m²", given: { perimeter: 40 }, sourceLabels: [] },
  { id: "unknown-practice-rectangle-width-6-plus-2", shape: "rectangle-perimeter", prompt: "A rectangle is 6 m wide and its length is 2 m more than its width. Find its area and perimeter.", expectedAnswer: "A = 48 m²; P = 28 m", unit: "m²", given: { width: 6, length: 8 }, sourceLabels: [] },
  { id: "unknown-practice-compare-area-36", shape: "comparison", prompt: "Two pictures each have area 36 cm². One is a rectangle with length 9 cm and the other is a square. Which has the greater perimeter?", expectedAnswer: "The 9 cm by 4 cm rectangle", unit: "cm", sourceLabels: [] },
];

export const UNKNOWN_DIMENSIONS_PAST_EXAM_QUESTIONS: readonly UnknownDimensionQuestion[] = [
  { id: "unknown-exam-square-perimeter-20", shape: "square-perimeter", prompt: "A square has perimeter 20 cm. Find its side length.", expectedAnswer: "5", unit: "cm", given: { perimeter: 20 }, sourceLabels: ["El-Behiera – Hosh Essa 23"] },
  { id: "unknown-exam-square-perimeter-24", shape: "square-perimeter", prompt: "A square has perimeter 24 cm. Find its side length.", expectedAnswer: "6", unit: "cm", given: { perimeter: 24 }, sourceLabels: ["Alex. – El Montazah 23"] },
  { id: "unknown-exam-square-perimeter-28", shape: "square-perimeter", prompt: "A square has perimeter 28 cm. Find its side length.", expectedAnswer: "7", unit: "cm", given: { perimeter: 28 }, sourceLabels: ["Giza – Awseem 23"] },
  { id: "unknown-exam-square-perimeter-40", shape: "square-perimeter", prompt: "A square has perimeter 40 cm. Find its side length.", expectedAnswer: "10", unit: "cm", given: { perimeter: 40 }, sourceLabels: ["El-Behiera 23"] },
  { id: "unknown-exam-square-perimeter-36", shape: "square-perimeter", prompt: "A square has perimeter 36 cm. Find its side length.", expectedAnswer: "9", unit: "cm", given: { perimeter: 36 }, sourceLabels: ["Aswan – Kom Ombo 22"] },
  { id: "unknown-exam-square-area-49-km", shape: "square-area", prompt: "A square has area 49 km². Find its side length.", expectedAnswer: "7", unit: "km", given: { area: 49 }, sourceLabels: [] },
  { id: "unknown-exam-square-area-16-perimeter", shape: "square-area", prompt: "A square has area 16 cm². Find its perimeter.", expectedAnswer: "16", unit: "cm", given: { area: 16 }, sourceLabels: ["Cairo – El-Kobba 22"] },
  { id: "unknown-exam-rectangle-perimeter-26-width-4", shape: "rectangle-perimeter", prompt: "A rectangle has perimeter 26 cm and width 4 cm. Find its length.", expectedAnswer: "9", unit: "cm", given: { perimeter: 26, width: 4 }, sourceLabels: [] },
  { id: "unknown-exam-rectangle-perimeter-32-length-9", shape: "rectangle-perimeter", prompt: "A rectangle has perimeter 32 m and length 9 m. Find its area.", expectedAnswer: "63", unit: "m²", given: { perimeter: 32, length: 9 }, sourceLabels: [] },
  { id: "unknown-exam-rectangle-area-42-width-6", shape: "rectangle-area", prompt: "A rectangle has area 42 km² and width 6 km. Find its length.", expectedAnswer: "7", unit: "km", given: { area: 42, width: 6 }, sourceLabels: [] },
  { id: "unknown-exam-rectangle-area-45-length-9", shape: "rectangle-area", prompt: "A rectangle has area 45 m² and length 9 m. Find its perimeter.", expectedAnswer: "28", unit: "m", given: { area: 45, length: 9 }, sourceLabels: [] },
  { id: "unknown-exam-mcq-length-rule", shape: "formula", prompt: "Which rule finds the length of a rectangle from its area and width?", expectedAnswer: "Area ÷ width", sourceLabels: [], choices: ["Area ÷ length", "Area ÷ width", "Length × width", "Area × width"] },
  { id: "unknown-exam-mcq-area-35-length-7", shape: "rectangle-area", prompt: "A rectangle has area 35 cm² and length 7 cm. Find its width.", expectedAnswer: "5 cm", unit: "cm", given: { area: 35, length: 7 }, sourceLabels: ["El-Menia 23"], choices: ["4 cm", "5 cm", "6 cm", "7 cm"] },
  { id: "unknown-exam-mcq-square-area-36-km", shape: "square-area", prompt: "A square has area 36 km². Find its side length.", expectedAnswer: "6 km", unit: "km", given: { area: 36 }, sourceLabels: ["Alex. – First Montaza 23"], choices: ["4 km", "5 km", "6 km", "9 km"] },
  { id: "unknown-exam-mcq-square-perimeter-28", shape: "square-perimeter", prompt: "A square has perimeter 28 cm. Find its side length.", expectedAnswer: "7 cm", unit: "cm", given: { perimeter: 28 }, sourceLabels: ["Souhag 23"], choices: ["7 cm", "14 cm", "5 cm", "4 cm"] },
  { id: "unknown-exam-mcq-square-perimeter-40", shape: "square-perimeter", prompt: "A square has perimeter 40 cm. Find its side length.", expectedAnswer: "10 cm", unit: "cm", given: { perimeter: 40 }, sourceLabels: ["Cairo 23"], choices: ["4 cm", "1,600 cm", "160 cm", "10 cm"] },
  { id: "unknown-exam-mcq-rectangle-perimeter-20-width-6", shape: "rectangle-perimeter", prompt: "A rectangle has perimeter 20 m and width 6 m. Find its length x.", expectedAnswer: "4 m", unit: "m", given: { perimeter: 20, width: 6 }, sourceLabels: [], choices: ["10 m", "20 m", "6 m", "4 m"] },
  { id: "unknown-exam-mcq-square-area-16", shape: "square-area", prompt: "A square has area 16 cm². Find side length y.", expectedAnswer: "4 cm", unit: "cm", given: { area: 16 }, sourceLabels: [], choices: ["4 cm", "6 cm", "10 cm", "8 cm"] },
  { id: "unknown-exam-mcq-rectangle-area-15-width-3", shape: "rectangle-area", prompt: "A rectangle has area 15 cm² and width 3 cm. Find its perimeter.", expectedAnswer: "16 cm", unit: "cm", given: { area: 15, width: 3 }, sourceLabels: [], choices: ["8 cm", "15 cm", "16 cm", "16 cm²"] },
  { id: "unknown-exam-mcq-square-area-1", shape: "square-area", prompt: "A square has area 1 m². Find its perimeter.", expectedAnswer: "4 m", unit: "m", given: { area: 1 }, sourceLabels: [], choices: ["1 m", "2 m", "3 m", "4 m"] },
  { id: "unknown-exam-mcq-blanket-perimeter-14-width-3", shape: "rectangle-perimeter", prompt: "A blanket has width 3 m and perimeter 14 m. Find its length.", expectedAnswer: "4 m", unit: "m", given: { perimeter: 14, width: 3 }, sourceLabels: ["Alexandria – Borg El-Arab 22"], choices: ["17 m", "11 m", "8 m", "4 m"] },
];

export const UNKNOWN_DIMENSIONS_QUESTION_BANK = [
  ...UNKNOWN_DIMENSIONS_LESSON_THREE_PRACTICE,
  ...UNKNOWN_DIMENSIONS_PAST_EXAM_QUESTIONS,
] as const;

export const getRedUnknownDimensionExamSourceLabels = (question: UnknownDimensionQuestion) => question.sourceLabels;
