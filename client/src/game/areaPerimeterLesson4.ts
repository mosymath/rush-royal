/**
 * Unit 4, Lesson 4 — Complex Shapes.
 * This final bank powers Mission Explore Area – Unit 4. Source labels are
 * transcribed from the supplied past-exam material and must display in red.
 */

export const MISSION_EXPLORE_AREA_TITLE = "Mission Explore Area – Unit 4";

export type ComplexShapeQuestion = {
  id: string;
  prompt: string;
  expectedAnswer: string;
  strategy: "add-parts" | "subtract-cutout" | "trace-perimeter" | "combine-shapes" | "unknown-sides";
  sourceLabels: readonly string[];
  choices?: readonly string[];
};

export const COMPLEX_SHAPES_STRATEGIES = [
  "Trace and add every outside side to find the perimeter.",
  "Separate the complex figure into rectangles and squares, then add their areas.",
  "Complete the figure to a large rectangle, subtract the missing rectangle, and keep the same total area.",
  "Find missing side lengths before calculating perimeter or area.",
  "A complex figure's area does not change when it is divided in different ways.",
] as const;

export const COMPLEX_SHAPES_LESSON_FOUR_PRACTICE: readonly ComplexShapeQuestion[] = [
  { id: "complex-learn-garden", prompt: "Andy wants to fence an L-shaped garden. Its outside sides are 10 m, 3 m, 4 m, 6 m, 6 m, and 9 m. Find the fence length and area.", expectedAnswer: "P = 38 m; A = 66 m²", strategy: "add-parts", sourceLabels: [] },
  { id: "complex-learn-garden-add", prompt: "Split Andy's garden into a 10 m by 3 m rectangle and a 6 m by 6 m square. Find its area.", expectedAnswer: "30 m² + 36 m² = 66 m²", strategy: "add-parts", sourceLabels: [] },
  { id: "complex-learn-garden-subtract", prompt: "Complete Andy's garden as a 10 m by 9 m rectangle, then remove a 6 m by 4 m rectangle. Find its area.", expectedAnswer: "90 m² − 24 m² = 66 m²", strategy: "subtract-cutout", sourceLabels: [] },
  { id: "complex-example-unknown-sides", prompt: "A complex figure has top side 23 m, right side 18 m, inner horizontal side 13 m, and left short side 6 m. Find missing sides x and y, then find perimeter and area.", expectedAnswer: "x = 10 m; y = 12 m; P = 82 m; A = 258 m²", strategy: "unknown-sides", sourceLabels: [] },
  { id: "complex-example-combine", prompt: "Combine an 8 cm by 2 cm rectangle and a 3 cm by 5 cm rectangle into the shown complex shape. Find its perimeter and area.", expectedAnswer: "P = 32 cm; A = 31 cm²", strategy: "combine-shapes", sourceLabels: [] },
  { id: "complex-check-understanding", prompt: "An L-shaped figure has top 9 m, right outer side 2 m, inner horizontal side 7 m, inner vertical side 5 m, and the remaining lower and left sides unknown. Find the missing sides, perimeter, and area.", expectedAnswer: "x = 7 m; y = 2 m; P = 32 m; A = 28 m²", strategy: "unknown-sides", sourceLabels: [] },
  { id: "complex-exercise-a", prompt: "Calculate the area and perimeter of complex shape a, showing your work.", expectedAnswer: "Student calculation using outside-side tracing and rectangle decomposition", strategy: "trace-perimeter", sourceLabels: [] },
  { id: "complex-exercise-b", prompt: "Calculate the area and perimeter of complex shape b with outside dimensions 24 m by 18 m and a 13 m by 12 m cutout.", expectedAnswer: "P = 84 m; A = 276 m²", strategy: "subtract-cutout", sourceLabels: [] },
  { id: "complex-exercise-c", prompt: "Calculate the area and perimeter of complex shape c, showing your work.", expectedAnswer: "Student calculation using outside-side tracing and rectangle decomposition", strategy: "trace-perimeter", sourceLabels: [] },
  { id: "complex-exercise-d", prompt: "Calculate the area and perimeter of complex shape d, showing your work.", expectedAnswer: "Student calculation using outside-side tracing and rectangle decomposition", strategy: "trace-perimeter", sourceLabels: [] },
  { id: "complex-exercise-e", prompt: "Calculate the area and perimeter of complex shape e, showing your work.", expectedAnswer: "Student calculation using outside-side tracing and rectangle decomposition", strategy: "trace-perimeter", sourceLabels: [] },
  { id: "complex-exercise-f", prompt: "Calculate the area and perimeter of complex shape f, showing your work.", expectedAnswer: "Student calculation using outside-side tracing and rectangle decomposition", strategy: "trace-perimeter", sourceLabels: [] },
  { id: "complex-exam-area-opposite", prompt: "Find the area of the opposite complex figure.", expectedAnswer: "Student calculation using rectangle decomposition", strategy: "add-parts", sourceLabels: ["Alex. – Al-Agamy 23"] },
  { id: "complex-exam-area-perimeter", prompt: "Find the area and perimeter of the opposite L-shaped figure.", expectedAnswer: "Student calculation using missing-side reasoning and rectangle decomposition", strategy: "unknown-sides", sourceLabels: ["Ismailia 23"] },
  { id: "complex-challenge-combine", prompt: "Combine a 10 cm by 2 cm rectangle and a 3 cm by 7 cm rectangle into a complex shape. Label the sides, then find its area and perimeter.", expectedAnswer: "A = 41 cm²; perimeter depends on the valid joined arrangement", strategy: "combine-shapes", sourceLabels: [] },
];

export const COMPLEX_SHAPES_MULTIPLE_CHOICE: readonly ComplexShapeQuestion[] = [
  { id: "complex-mcq-perimeter-1", prompt: "What is the perimeter of the shown stepped complex figure?", expectedAnswer: "12 cm", strategy: "trace-perimeter", sourceLabels: [], choices: ["10 cm", "12 cm", "13 cm", "15 cm"] },
  { id: "complex-mcq-area-14-7", prompt: "What is the area of a 14 cm by 7 cm outer rectangle with a 4 cm by 5 cm cutout?", expectedAnswer: "78 cm²", strategy: "subtract-cutout", sourceLabels: [], choices: ["24 cm²", "42 cm²", "78 cm²", "87 cm²"] },
  { id: "complex-mcq-area-l", prompt: "What is the area of the shown L-shaped figure with an outer 10 cm by 9 cm rectangle and a 6 cm by 6 cm cutout?", expectedAnswer: "54 cm²", strategy: "subtract-cutout", sourceLabels: [], choices: ["54 m²", "32 m²", "32 cm²", "54 cm²"] },
  { id: "complex-mcq-perimeter-l", prompt: "What is the perimeter of the shown L-shaped figure with outside width 8 cm and height 10 cm?", expectedAnswer: "36 cm", strategy: "trace-perimeter", sourceLabels: [], choices: ["70 m", "36 m", "36 cm", "70 cm"] },
  { id: "complex-mcq-area-u", prompt: "What is the area of a 10 km by 8 km outer rectangle with a 2 km by 3 km cutout?", expectedAnswer: "74 km²", strategy: "subtract-cutout", sourceLabels: [], choices: ["74 m²", "42 km²", "42 m", "74 km²"] },
  { id: "complex-mcq-joined-squares", prompt: "Two squares with side lengths 5 m and 2 m are joined to make a figure. What is its perimeter?", expectedAnswer: "24 m", strategy: "combine-shapes", sourceLabels: [], choices: ["7 m", "10 m", "24 m", "35 m"] },
  { id: "complex-mcq-combined-rectangles", prompt: "Combine a 3 cm by 5 cm rectangle and an 8 cm by 2 cm rectangle. What is the area of the resulting complex figure?", expectedAnswer: "31 cm²", strategy: "combine-shapes", sourceLabels: [], choices: ["18 cm²", "31 cm²", "36 cm²", "40 cm²"] },
];

export const COMPLEX_SHAPES_QUESTION_BANK = [
  ...COMPLEX_SHAPES_LESSON_FOUR_PRACTICE,
  ...COMPLEX_SHAPES_MULTIPLE_CHOICE,
] as const;

export const getRedComplexShapeExamSourceLabels = (question: ComplexShapeQuestion) => question.sourceLabels;
