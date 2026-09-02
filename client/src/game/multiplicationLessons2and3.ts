/**
 * Unit 5, Lessons 2 & 3 — Creating and Solving Multiplicative Comparison Equations.
 * Content is transcribed from the teacher-provided pages only. City-source labels
 * are mandatory red labels when these questions enter the future game.
 */

export type ComparisonEquationQuestion = {
  id: string;
  skill: "write-equation" | "solve-product" | "solve-factor" | "word-problem" | "comparison";
  prompt: string;
  equation: string;
  expectedAnswer: string;
  sourceLabels: readonly string[];
  choices?: readonly string[];
};

export const COMPARISON_EQUATION_RULES = {
  unknownProduct: "If the unknown is the product, use multiplication.",
  unknownFactor: "If the unknown is one of the two factors, use division.",
  giraffeModel: "x = 3 × 2, so x = 6.",
  factorModel: "6 = m × 2, so m = 6 ÷ 2 = 3.",
} as const;

export const COMPARISON_EQUATION_WORKED_EXAMPLES: readonly ComparisonEquationQuestion[] = [
  { id: "comp-eq-giraffe", skill: "solve-product", prompt: "A kangaroo is 2 m tall. A giraffe is 3 times as tall. How tall is the giraffe?", equation: "x = 3 × 2", expectedAnswer: "6 m", sourceLabels: [] },
  { id: "comp-eq-3-times-5", skill: "write-equation", prompt: "Write an equation: 3 times the number 5 is a.", equation: "3 × 5 = a", expectedAnswer: "3 × 5 = a", sourceLabels: [] },
  { id: "comp-eq-12-six", skill: "write-equation", prompt: "Write an equation: 12 is 6 times as many as m.", equation: "12 = 6 × m", expectedAnswer: "12 = 6 × m", sourceLabels: [] },
  { id: "comp-eq-3-times-7", skill: "solve-product", prompt: "What number is 3 times the number 7?", equation: "3 × 7 = m", expectedAnswer: "21", sourceLabels: [] },
  { id: "comp-eq-24-four", skill: "solve-factor", prompt: "24 is 4 times a number. What is the number?", equation: "24 = 4 × h", expectedAnswer: "6", sourceLabels: [] },
  { id: "comp-eq-12-three", skill: "solve-factor", prompt: "12 is 3 times a number. What is the number?", equation: "12 = 3 × a", expectedAnswer: "4", sourceLabels: [] },
  { id: "comp-eq-figs", skill: "word-problem", prompt: "Wael ate 5 figs. His older brother ate 4 times as many figs. How many figs did his brother eat?", equation: "a = 4 × 5", expectedAnswer: "20 figs", sourceLabels: [] },
  { id: "comp-eq-movie", skill: "word-problem", prompt: "There are 35 adults in line at a movie theater. That is 7 times the number of children in another line. How many children are in the line?", equation: "35 = 7 × n", expectedAnswer: "5 children", sourceLabels: [] },
];

export const COMPARISON_EQUATION_PRACTICE: readonly ComparisonEquationQuestion[] = [
  { id: "comp-eq-practice-7-2", skill: "write-equation", prompt: "Write an equation: 7 times the number 2 is a.", equation: "7 × 2 = a", expectedAnswer: "7 × 2 = a", sourceLabels: [] },
  { id: "comp-eq-practice-2-7", skill: "write-equation", prompt: "Write an equation: 2 times the number 7 is a.", equation: "2 × 7 = a", expectedAnswer: "2 × 7 = a", sourceLabels: [] },
  { id: "comp-eq-practice-18-6", skill: "write-equation", prompt: "Write an equation: 18 is 6 times as many as a.", equation: "18 = 6 × a", expectedAnswer: "18 = 6 × a", sourceLabels: [] },
  { id: "comp-eq-practice-4-3", skill: "write-equation", prompt: "Write an equation: 4 times the number 3 is a.", equation: "4 × 3 = a", expectedAnswer: "4 × 3 = a", sourceLabels: [] },
  { id: "comp-eq-practice-24-4", skill: "write-equation", prompt: "Write an equation: 24 is 4 times as many as a.", equation: "24 = 4 × a", expectedAnswer: "24 = 4 × a", sourceLabels: [] },
  { id: "comp-eq-practice-25-5", skill: "write-equation", prompt: "Write an equation: 25 is 5 times as many as a.", equation: "25 = 5 × a", expectedAnswer: "25 = 5 × a", sourceLabels: [] },
  { id: "comp-eq-practice-30-5", skill: "write-equation", prompt: "Write an equation: 30 is 5 times as many as a.", equation: "30 = 5 × a", expectedAnswer: "30 = 5 × a", sourceLabels: [] },
  { id: "comp-eq-practice-7-4", skill: "write-equation", prompt: "Write an equation: 7 times as many as 4 is a.", equation: "7 × 4 = a", expectedAnswer: "7 × 4 = a", sourceLabels: [] },
  { id: "comp-eq-practice-48", skill: "write-equation", prompt: "Write an equation: 6 times the number a is 48.", equation: "6 × a = 48", expectedAnswer: "6 × a = 48", sourceLabels: [] },
  { id: "comp-eq-practice-27-9", skill: "write-equation", prompt: "Write an equation: 27 is a times the number 9.", equation: "27 = a × 9", expectedAnswer: "27 = a × 9", sourceLabels: [] },
  { id: "comp-eq-solve-y", skill: "solve-product", prompt: "Solve: y = 5 × 10.", equation: "y = 5 × 10", expectedAnswer: "50", sourceLabels: [] },
  { id: "comp-eq-solve-a", skill: "solve-factor", prompt: "Solve: a × 3 = 15.", equation: "a × 3 = 15", expectedAnswer: "5", sourceLabels: [] },
  { id: "comp-eq-solve-b", skill: "solve-factor", prompt: "Solve: 7 × b = 21.", equation: "7 × b = 21", expectedAnswer: "3", sourceLabels: [] },
  { id: "comp-eq-solve-x", skill: "solve-product", prompt: "Solve: 3 × 4 = x.", equation: "3 × 4 = x", expectedAnswer: "12", sourceLabels: [] },
  { id: "comp-eq-solve-p", skill: "solve-factor", prompt: "Solve: 5 × p = 50.", equation: "5 × p = 50", expectedAnswer: "10", sourceLabels: [] },
  { id: "comp-eq-solve-m", skill: "solve-factor", prompt: "Solve: m × 4 = 16.", equation: "m × 4 = 16", expectedAnswer: "4", sourceLabels: [] },
  { id: "comp-eq-solve-z", skill: "solve-product", prompt: "Solve: z = 5 × 1.", equation: "z = 5 × 1", expectedAnswer: "5", sourceLabels: [] },
  { id: "comp-eq-solve-n", skill: "solve-factor", prompt: "Solve: n × 2 = 18.", equation: "n × 2 = 18", expectedAnswer: "9", sourceLabels: [] },
  { id: "comp-eq-solve-k", skill: "solve-factor", prompt: "Solve: 5 × k = 35.", equation: "5 × k = 35", expectedAnswer: "7", sourceLabels: [] },
  { id: "comp-eq-nadia", skill: "word-problem", prompt: "Nadia collected 5 marbles in March. By May she had 4 times as many marbles. How many marbles did Nadia have in May?", equation: "a = 4 × 5", expectedAnswer: "20 marbles", sourceLabels: [] },
  { id: "comp-eq-hamed", skill: "word-problem", prompt: "Hamed had 12 cookies, which was 3 times as many cookies as his brother Ahmed. How many cookies did Ahmed have?", equation: "12 = 3 × a", expectedAnswer: "4 cookies", sourceLabels: [] },
  { id: "comp-eq-aida", skill: "comparison", prompt: "Aida walked 21 minutes to school on Monday. On Tuesday, she rode her bike for 7 minutes. How many times as many minutes was riding her bike as walking?", equation: "21 = 3 × 7", expectedAnswer: "3", sourceLabels: [] },
  { id: "comp-eq-menna", skill: "word-problem", prompt: "Menna ran around the soccer field 4 times. Aya ran around the field twice as many times as Menna. How many times did Aya run?", equation: "a = 2 × 4", expectedAnswer: "8 times", sourceLabels: [] },
  { id: "comp-eq-rana", skill: "comparison", prompt: "Rana has 6 mangoes. Her brother Sherif has 18. How many times as many mangoes does Sherif have?", equation: "18 = 3 × 6", expectedAnswer: "3", sourceLabels: [] },
  { id: "comp-eq-salads", skill: "word-problem", prompt: "A restaurant sold eight times as many salads as steaks. If they sold four steaks, how many salads did they sell?", equation: "a = 8 × 4", expectedAnswer: "32 salads", sourceLabels: [] },
  { id: "comp-eq-transport-truck", skill: "comparison", prompt: "A truck has 6 seats and a motorcycle has 2 seats. How many times as many seats are in a truck than on a motorcycle?", equation: "6 = 3 × 2", expectedAnswer: "3", sourceLabels: [] },
  { id: "comp-eq-transport-bus", skill: "comparison", prompt: "A bus has 36 seats and a truck has 6 seats. How many times as many seats are on a bus than in a truck?", equation: "36 = 6 × 6", expectedAnswer: "6", sourceLabels: [] },
  { id: "comp-eq-transport-metro", skill: "comparison", prompt: "A metro train has 48 seats and a car has 4 seats. How many times as many seats are on the metro train than in a car?", equation: "48 = 12 × 4", expectedAnswer: "12", sourceLabels: [] },
  { id: "comp-eq-challenge-chocolate", skill: "word-problem", prompt: "Bassem sold 9 chocolate bars. Marwan sold three times as many as Bassem. Esslam sold 9 fewer than Marwan. How many bars did Esslam sell?", equation: "(3 × 9) − 9", expectedAnswer: "18 bars", sourceLabels: [] },
];

export const COMPARISON_EQUATION_PAST_EXAM_QUESTIONS: readonly ComparisonEquationQuestion[] = [
  { id: "comp-eq-exam-3-times-7", skill: "write-equation", prompt: "The equation based on the comparison statement “3 times the number 7” is ___.", equation: "3 × 7 = A", expectedAnswer: "3 × 7 = A", sourceLabels: [], choices: ["3 × 7 = A", "7 − 3 = A", "3 + 7 = A", "7 ÷ 3 = A"] },
  { id: "comp-eq-exam-45-9", skill: "write-equation", prompt: "The equation based on the comparison statement “45 is a times the number 9” is ___.", equation: "45 = a × 9", expectedAnswer: "45 = a × 9", sourceLabels: [], choices: ["45 = 9 − a", "45 = a × 9", "45 = a + 9", "45 = 9 − a"] },
  { id: "comp-eq-exam-10-times-13", skill: "solve-product", prompt: "What number is 10 times the number 13?", equation: "a = 10 × 13", expectedAnswer: "130", sourceLabels: [], choices: ["130", "3", "23", "1,300"] },
  { id: "comp-eq-exam-cars", skill: "word-problem", prompt: "There are 4 bicycles on a road and 14 times as many cars as bicycles. How many cars are on the road?", equation: "a = 14 × 4", expectedAnswer: "56", sourceLabels: ["Suez 22"], choices: ["46", "14", "56", "18"] },
  { id: "comp-eq-exam-adults", skill: "comparison", prompt: "There were 24 adults and 3 children in line at a movie theater. How many times as many adults were in the line as children?", equation: "24 = 8 × 3", expectedAnswer: "8", sourceLabels: [], choices: ["28", "36", "7", "8"] },
  { id: "comp-eq-exam-texts", skill: "comparison", prompt: "Noha sent 18 text messages a day. Ali sent 3 a day. How many times as many texts did Noha send as Ali?", equation: "18 = 6 × 3", expectedAnswer: "6", sourceLabels: [], choices: ["5", "8", "3", "6"] },
  { id: "comp-eq-exam-money", skill: "comparison", prompt: "Hanan has L.E. 5 and Mohamed has L.E. 50. Mohamed's money equals ___ times Hanan's money.", equation: "50 = 10 × 5", expectedAnswer: "10", sourceLabels: ["Cairo – El-Salam 23"], choices: ["3", "10", "300", "5"] },
  { id: "comp-eq-exam-ola", skill: "word-problem", prompt: "Ola had 4 times as many pounds as her sister. Her sister has 3 pounds. How much money does Ola have?", equation: "a = 4 × 3", expectedAnswer: "12", sourceLabels: [], choices: ["10", "11", "12", "13"] },
  { id: "comp-eq-exam-hala", skill: "solve-factor", prompt: "Hala made seven times as many basketball shots as she missed. If she made 28 shots, how many shots did she miss?", equation: "28 = 7 × a", expectedAnswer: "4", sourceLabels: [], choices: ["1", "2", "3", "4"] },
  { id: "comp-eq-exam-hany", skill: "solve-factor", prompt: "Hany is twice as old as his brother. His brother is 8 years old. Which equation can be used to find Hany's age?", equation: "2 × a = 8", expectedAnswer: "2 × a = 8", sourceLabels: [], choices: ["2 + a = 8", "2 × a = 8", "2 × 8 = a", "8 + 2 = a"] },
];

export const COMPARISON_EQUATION_QUESTION_BANK = [
  ...COMPARISON_EQUATION_WORKED_EXAMPLES,
  ...COMPARISON_EQUATION_PRACTICE,
  ...COMPARISON_EQUATION_PAST_EXAM_QUESTIONS,
] as const;
