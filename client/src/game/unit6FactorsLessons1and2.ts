export type Unit6FactorsQuestion = {
  id: string;
  lesson: "factors" | "prime-composite";
  skill: "definition" | "factor-list" | "factor-check" | "factor-pairs" | "factor-riddle" | "prime-classify" | "prime-facts" | "sieve";
  prompt: string;
  expectedAnswer: string;
  explanation: string;
  sourceLabels: readonly string[];
  choices?: readonly string[];
};

export const UNIT6_FACTORS_LESSON_NOTES = {
  factors: [
    "A factor is a number multiplied by another number to get a product.",
    "Every whole number has the factor pair 1 and itself.",
    "A number has 2 as a factor when its ones digit is 0, 2, 4, 6, or 8.",
    "A number has 3 as a factor when its digit sum is a multiple of 3.",
    "A number has 5 as a factor when its ones digit is 0 or 5.",
    "A number has 6 as a factor when it is even and has 3 as a factor.",
    "A number has 9 as a factor when its digit sum is a multiple of 9.",
    "A number has 10 as a factor when its ones digit is 0.",
  ],
  primeComposite: [
    "A prime number has exactly two different factors: 1 and itself.",
    "A composite number has more than two factors.",
    "The number 1 is neither prime nor composite because it has one factor.",
    "2 is the smallest prime number and the only even prime number.",
  ],
} as const;

export const UNIT6_FACTORS_LESSONS_1_AND_2_QUESTIONS: readonly Unit6FactorsQuestion[] = [
  { id: "u6-l1-definition-factor", lesson: "factors", skill: "definition", prompt: "Complete: A factor is a number multiplied by another number to get a ___.", expectedAnswer: "product", explanation: "The lesson defines factors as numbers multiplied to make a product.", sourceLabels: [] },
  { id: "u6-l1-factors-12", lesson: "factors", skill: "factor-list", prompt: "List all the factors of 12.", expectedAnswer: "1, 2, 3, 4, 6, 12", explanation: "The factor pairs are 1 × 12, 2 × 6, and 3 × 4.", sourceLabels: [] },
  { id: "u6-l1-factors-36", lesson: "factors", skill: "factor-list", prompt: "List all the factors of 36.", expectedAnswer: "1, 2, 3, 4, 6, 9, 12, 18, 36", explanation: "The shown factor pairs are 1×36, 2×18, 3×12, 4×9, and 6×6.", sourceLabels: [] },
  { id: "u6-l1-is-3-factor-29", lesson: "factors", skill: "factor-check", prompt: "Is 3 a factor of 29?", expectedAnswer: "No", explanation: "2 + 9 = 11, and 11 is not reached when skip counting by 3.", sourceLabels: [] },
  { id: "u6-l1-is-9-factor-54", lesson: "factors", skill: "factor-check", prompt: "Is 9 a factor of 54?", expectedAnswer: "Yes", explanation: "5 + 4 = 9, and 9 is reached when skip counting by 9.", sourceLabels: [] },
  { id: "u6-l1-is-6-factor-48", lesson: "factors", skill: "factor-check", prompt: "Is 6 a factor of 48?", expectedAnswer: "Yes", explanation: "48 is even and 4 + 8 = 12, so it also has 3 as a factor.", sourceLabels: [] },
  { id: "u6-l1-factors-48", lesson: "factors", skill: "factor-list", prompt: "List all the factors of 48.", expectedAnswer: "1, 2, 3, 4, 6, 8, 12, 16, 24, 48", explanation: "Stop when the factor pairs repeat after 6 × 8.", sourceLabels: [] },
  { id: "u6-l1-five-factor-50", lesson: "factors", skill: "factor-check", prompt: "5 is a factor of ___.", expectedAnswer: "50", explanation: "A number ending in 0 or 5 has 5 as a factor.", sourceLabels: [], choices: ["50", "51", "52", "53"] },
  { id: "u6-l1-factor-20", lesson: "factors", skill: "factor-check", prompt: "Which number is a factor of 20?", expectedAnswer: "10", explanation: "20 = 2 × 10.", sourceLabels: [], choices: ["6", "10", "30", "40"] },
  { id: "u6-l1-factor-count-11", lesson: "factors", skill: "factor-pairs", prompt: "The number 11 has ___ factors.", expectedAnswer: "2", explanation: "Its only factors are 1 and 11.", sourceLabels: [], choices: ["2", "3", "4", "5"] },
  { id: "u6-l1-factor-count-32", lesson: "factors", skill: "factor-pairs", prompt: "The number 32 has ___ factors.", expectedAnswer: "6", explanation: "The factors are 1, 2, 4, 8, 16, and 32.", sourceLabels: [], choices: ["4", "6", "8", "10"] },
  { id: "u6-l1-every-number-factor", lesson: "factors", skill: "definition", prompt: "Which is the factor of every whole number?", expectedAnswer: "1", explanation: "Every whole number has the factor pair 1 and itself.", sourceLabels: [], choices: ["0", "1", "2", "10"] },
  { id: "u6-l1-factor-26-2", lesson: "factors", skill: "factor-check", prompt: "Is 2 a factor of 26?", expectedAnswer: "Yes", explanation: "26 ends in 6, an even digit.", sourceLabels: [] },
  { id: "u6-l1-factor-70-10", lesson: "factors", skill: "factor-check", prompt: "Is 10 a factor of 70?", expectedAnswer: "Yes", explanation: "70 ends in 0.", sourceLabels: [] },
  { id: "u6-l1-factor-15-2", lesson: "factors", skill: "factor-check", prompt: "Is 2 a factor of 15?", expectedAnswer: "No", explanation: "15 does not end in an even digit.", sourceLabels: [] },
  { id: "u6-l1-factor-16-5", lesson: "factors", skill: "factor-check", prompt: "Is 5 a factor of 16?", expectedAnswer: "No", explanation: "16 does not end in 0 or 5.", sourceLabels: [] },
  { id: "u6-l1-factor-84-6", lesson: "factors", skill: "factor-check", prompt: "Is 6 a factor of 84?", expectedAnswer: "Yes", explanation: "84 is even and 8 + 4 = 12, which is divisible by 3.", sourceLabels: [] },
  { id: "u6-l1-factor-53-3", lesson: "factors", skill: "factor-check", prompt: "Is 3 a factor of 53?", expectedAnswer: "No", explanation: "5 + 3 = 8, which is not divisible by 3.", sourceLabels: [] },
  { id: "u6-l1-factor-32-4", lesson: "factors", skill: "factor-check", prompt: "Is 4 a factor of 32?", expectedAnswer: "Yes", explanation: "32 appears in skip counting by 4.", sourceLabels: [] },
  { id: "u6-l1-factor-48-7", lesson: "factors", skill: "factor-check", prompt: "Is 7 a factor of 48?", expectedAnswer: "No", explanation: "48 does not appear in the 7-times table.", sourceLabels: [] },
  { id: "u6-l1-factors-6", lesson: "factors", skill: "factor-list", prompt: "List all the factors of 6.", expectedAnswer: "1, 2, 3, 6", explanation: "The factor pairs are 1 × 6 and 2 × 3.", sourceLabels: ["Alex. 23"] },
  { id: "u6-l1-factors-16", lesson: "factors", skill: "factor-list", prompt: "List all the factors of 16.", expectedAnswer: "1, 2, 4, 8, 16", explanation: "The factor pairs are 1 × 16, 2 × 8, and 4 × 4.", sourceLabels: [] },
  { id: "u6-l1-factors-38", lesson: "factors", skill: "factor-list", prompt: "List all the factors of 38.", expectedAnswer: "1, 2, 19, 38", explanation: "38 is even, so its pairs are 1 × 38 and 2 × 19.", sourceLabels: [] },
  { id: "u6-l1-factors-25", lesson: "factors", skill: "factor-list", prompt: "List all the factors of 25.", expectedAnswer: "1, 5, 25", explanation: "The factor pairs are 1 × 25 and 5 × 5.", sourceLabels: [] },
  { id: "u6-l1-factors-54", lesson: "factors", skill: "factor-list", prompt: "List all the factors of 54.", expectedAnswer: "1, 2, 3, 6, 9, 18, 27, 54", explanation: "Use factor pairs from 1 × 54 through 6 × 9.", sourceLabels: [] },
  { id: "u6-l1-factors-21", lesson: "factors", skill: "factor-list", prompt: "List all the factors of 21.", expectedAnswer: "1, 3, 7, 21", explanation: "The factor pairs are 1 × 21 and 3 × 7.", sourceLabels: [] },
  { id: "u6-l1-factors-19", lesson: "factors", skill: "factor-list", prompt: "List all the factors of 19.", expectedAnswer: "1, 19", explanation: "19 has only the factor pair 1 × 19.", sourceLabels: [] },
  { id: "u6-l1-factor-riddle-6", lesson: "factors", skill: "factor-riddle", prompt: "I am an even number between 1 and 10. Some of my factors include 1, 2, and 3. What number am I?", expectedAnswer: "6", explanation: "6 is even and has factors 1, 2, 3, and 6.", sourceLabels: [] },
  { id: "u6-l1-factor-riddle-28", lesson: "factors", skill: "factor-riddle", prompt: "I am an even number between 20 and 30. Some of my factors include 1, 2, 4, 7, and 14. What number am I?", expectedAnswer: "28", explanation: "28 has the listed factors and is between 20 and 30.", sourceLabels: [] },
  { id: "u6-l1-factor-riddle-50", lesson: "factors", skill: "factor-riddle", prompt: "I am an even number greater than 40 and less than 60. I have 10 as a factor. What number am I?", expectedAnswer: "50", explanation: "50 is the only multiple of 10 in that interval.", sourceLabels: [] },
  { id: "u6-l1-factor-riddle-24", lesson: "factors", skill: "factor-riddle", prompt: "I am a two-digit number. One of my factor pairs is 4 and 6, and my tens digit is less than my ones digit. What number am I?", expectedAnswer: "24", explanation: "4 × 6 = 24 and 2 is less than 4.", sourceLabels: [] },
  { id: "u6-l1-factor-riddle-35", lesson: "factors", skill: "factor-riddle", prompt: "I am a two-digit number. One of my factor pairs is 5 and 7, and my tens digit is less than my ones digit. What number am I?", expectedAnswer: "35", explanation: "5 × 7 = 35 and 3 is less than 5.", sourceLabels: [] },
  { id: "u6-l2-prime-9", lesson: "prime-composite", skill: "prime-classify", prompt: "Is 9 prime or composite?", expectedAnswer: "Composite", explanation: "9 has factors 1, 3, and 9, so it has more than two factors.", sourceLabels: [] },
  { id: "u6-l2-prime-13", lesson: "prime-composite", skill: "prime-classify", prompt: "Is 13 prime or composite?", expectedAnswer: "Prime", explanation: "13 has exactly two factors: 1 and 13.", sourceLabels: [] },
  { id: "u6-l2-prime-19", lesson: "prime-composite", skill: "prime-classify", prompt: "Is 19 prime or composite?", expectedAnswer: "Prime", explanation: "19 has exactly two factors: 1 and 19.", sourceLabels: [] },
  { id: "u6-l2-prime-1", lesson: "prime-composite", skill: "prime-facts", prompt: "Is 1 prime, composite, or neither?", expectedAnswer: "Neither", explanation: "1 has only one factor, so it is neither prime nor composite.", sourceLabels: [] },
  { id: "u6-l2-smallest-prime", lesson: "prime-composite", skill: "prime-facts", prompt: "The smallest prime number is ___.", expectedAnswer: "2", explanation: "2 has exactly two factors and is the smallest prime number.", sourceLabels: ["Giza 23"], choices: ["0", "1", "2", "3"] },
  { id: "u6-l2-prime-factor-count", lesson: "prime-composite", skill: "prime-facts", prompt: "A prime number has ___ factors only.", expectedAnswer: "2", explanation: "A prime has the two different factors 1 and itself.", sourceLabels: ["Souhag 23"], choices: ["0", "2", "1", "4"] },
  { id: "u6-l2-prime-two-factors", lesson: "prime-composite", skill: "prime-facts", prompt: "The prime number has two different factors which are ___ and ___.", expectedAnswer: "1 and itself", explanation: "Those are the only two factors of any prime number.", sourceLabels: [] },
  { id: "u6-l2-only-even-prime", lesson: "prime-composite", skill: "prime-facts", prompt: "The only even prime number is ___.", expectedAnswer: "2", explanation: "Every other even number has at least 1, 2, and itself as factors.", sourceLabels: ["Giza – Abo El-Nomros 23"] },
  { id: "u6-l2-primes-60-70", lesson: "prime-composite", skill: "sieve", prompt: "List the prime numbers between 60 and 70.", expectedAnswer: "61, 67", explanation: "61 and 67 are the only numbers in this interval with exactly two factors.", sourceLabels: [] },
  { id: "u6-l2-37", lesson: "prime-composite", skill: "prime-classify", prompt: "The number 37 has ___ factors and it is a ___ number.", expectedAnswer: "2; prime", explanation: "37 has exactly the factors 1 and 37.", sourceLabels: [] },
  { id: "u6-l2-15", lesson: "prime-composite", skill: "prime-classify", prompt: "The number 15 is a ___ number because it has ___ factors.", expectedAnswer: "composite; more than 2", explanation: "15 has factors 1, 3, 5, and 15.", sourceLabels: [] },
  { id: "u6-l2-classify-24", lesson: "prime-composite", skill: "prime-classify", prompt: "List the factors of 24, then classify it as prime or composite.", expectedAnswer: "1, 2, 3, 4, 6, 8, 12, 24; composite", explanation: "24 has more than two factors.", sourceLabels: ["Alex. – West 22"] },
  { id: "u6-l2-classify-12", lesson: "prime-composite", skill: "prime-classify", prompt: "List the factors of 12, then classify it as prime or composite.", expectedAnswer: "1, 2, 3, 4, 6, 12; composite", explanation: "12 has more than two factors.", sourceLabels: ["Cairo – El-Salam 23"] },
  { id: "u6-l2-primes-46-62", lesson: "prime-composite", skill: "sieve", prompt: "Write all prime numbers between 46 and 62.", expectedAnswer: "47, 53, 59, 61", explanation: "These are the only numbers from 47 through 61 with exactly two factors.", sourceLabels: [] },
  { id: "u6-l2-composites-5-23", lesson: "prime-composite", skill: "sieve", prompt: "Write all composite numbers between 5 and 23.", expectedAnswer: "6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22", explanation: "Each listed number has more than two factors.", sourceLabels: [] },
  { id: "u6-l2-mcq-factors-16", lesson: "prime-composite", skill: "factor-list", prompt: "All the factors of 16 are ___.", expectedAnswer: "1, 2, 4, 8, 16", explanation: "These are all the factor pairs of 16.", sourceLabels: ["Giza 23"], choices: ["1, 16", "2, 4, 8", "1, 2, 4, 8", "1, 2, 4, 8, 16"] },
  { id: "u6-l2-mcq-factors-8", lesson: "prime-composite", skill: "factor-list", prompt: "1, 2, 4, and 8 are factors of the number ___.", expectedAnswer: "8", explanation: "Those are exactly the factors of 8.", sourceLabels: ["Souhag 22"], choices: ["15", "8", "17", "18"] },
  { id: "u6-l2-mcq-3-and-7", lesson: "prime-composite", skill: "factor-pairs", prompt: "3 and 7 are factors of ___.", expectedAnswer: "42", explanation: "42 has both 3 and 7 as factors.", sourceLabels: ["El-Monofia – Quesna 23"], choices: ["36", "35", "18", "42"] },
  { id: "u6-l2-mcq-factor-63", lesson: "prime-composite", skill: "factor-check", prompt: "___ is a factor of 63.", expectedAnswer: "7", explanation: "63 = 7 × 9.", sourceLabels: ["Ismailia 22"], choices: ["2", "5", "7", "11"] },
  { id: "u6-l2-mcq-15-count", lesson: "prime-composite", skill: "factor-pairs", prompt: "The number 15 has ___ factors.", expectedAnswer: "4", explanation: "The factors of 15 are 1, 3, 5, and 15.", sourceLabels: ["Giza 23"], choices: ["2", "3", "4", "5"] },
  { id: "u6-l2-mcq-smallest-odd-prime", lesson: "prime-composite", skill: "prime-facts", prompt: "The smallest odd prime number is ___.", expectedAnswer: "3", explanation: "2 is the smallest prime but is even, so 3 is the smallest odd prime.", sourceLabels: ["Cairo 23"], choices: ["0", "1", "2", "3"] },
  { id: "u6-l2-mcq-prime-after-15", lesson: "prime-composite", skill: "prime-classify", prompt: "The prime number just after 15 is ___.", expectedAnswer: "17", explanation: "16 is composite and 17 has exactly two factors.", sourceLabels: ["Alex. 23"], choices: ["16", "17", "18", "12"] },
  { id: "u6-l2-mcq-not-prime", lesson: "prime-composite", skill: "prime-classify", prompt: "Which of the following is not a prime number?", expectedAnswer: "15", explanation: "15 has factors 1, 3, 5, and 15.", sourceLabels: ["Cairo – El-Marg 23"], choices: ["7", "15", "19", "13"] },
  { id: "u6-l2-mcq-prime", lesson: "prime-composite", skill: "prime-classify", prompt: "Which of the following is a prime number?", expectedAnswer: "11", explanation: "11 has only two factors, 1 and 11.", sourceLabels: ["El-Sharkia – Abo Kebeir 22"], choices: ["1", "11", "14", "50"] },
  { id: "u6-l2-mcq-one-factor", lesson: "prime-composite", skill: "prime-facts", prompt: "Which statement is true?", expectedAnswer: "1 is a factor of any number.", explanation: "Every whole number has 1 as a factor.", sourceLabels: [], choices: ["1 is a factor of only odd numbers.", "1 is not a factor of any number.", "1 is a factor of any number.", "1 is a factor of only 0."] },
] as const;

export const UNIT6_FACTORS_LESSON_1_QUESTIONS = UNIT6_FACTORS_LESSONS_1_AND_2_QUESTIONS.filter((question) => question.lesson === "factors");
export const UNIT6_PRIME_COMPOSITE_LESSON_2_QUESTIONS = UNIT6_FACTORS_LESSONS_1_AND_2_QUESTIONS.filter((question) => question.lesson === "prime-composite");
