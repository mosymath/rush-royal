import { describe, expect, it } from "vitest";
import { shuffleForPresentation } from "../client/src/game/answerFairness";
import { AREA_MISSION_QUESTION_BANK } from "../client/src/game/areaMissionQuestions";
import { BUBBLE_QUESTION_BANK } from "../client/src/game/bubblePopQuestions";
import { FACTORS_MISSION_QUESTION_BANK } from "../client/src/game/factorsMissionQuestions";
import { MD1_BANK } from "../client/src/game/mdPart1Questions";
import { MD2_BANK } from "../client/src/game/mdPart2";
import { MULTIPLICATION_MISSION_QUESTION_BANK } from "../client/src/game/multiplicationMissionQuestions";
import { O_BANK } from "../client/src/game/orderMission";
import { SHAPE_QUESTIONS, TOKEN_TRAIL_QUESTIONS } from "../client/src/game/shapes";
import { createQuestion, PLACES } from "../client/src/game/rounding";

type AuditQuestion = {
  id: string;
  choices: readonly string[];
  correctChoice?: string;
  correct?: string;
  correctAnswer?: string;
};

const canonical = (value: string) =>
  value.normalize("NFC").replace(/[\s,]/g, "").toLowerCase();

const valuesFrom = (bank: Record<string, readonly AuditQuestion[]>) =>
  Object.values(bank).flat();

function expectValidAndFair(label: string, questions: readonly AuditQuestion[]) {
  expect(questions.length, `${label} has questions`).toBeGreaterThan(0);
  for (const question of questions) {
    const correct =
      question.correctChoice ?? question.correct ?? question.correctAnswer;
    expect(correct, `${label}/${question.id} has a correct answer`).toBeTruthy();
    expect(question.choices, `${label}/${question.id} has four choices`).toHaveLength(4);
    const normalizedChoices = question.choices.map(canonical);
    expect(
      new Set(normalizedChoices).size,
      `${label}/${question.id} has four unique choices`
    ).toBe(4);
    expect(
      normalizedChoices,
      `${label}/${question.id} exposes its correct answer as a selectable choice`
    ).toContain(canonical(correct!));
    expect(
      question.choices.some(choice => /^choice\s*\d+$/i.test(choice.trim())),
      `${label}/${question.id} has no placeholder answer`
    ).toBe(false);

    const positions = new Set(
      Array.from({ length: 48 }, (_, run) => {
        const shuffled = shuffleForPresentation(
          question.choices,
          `${label}:${question.id}:run-${run}`
        );
        return shuffled.findIndex(choice => canonical(choice) === canonical(correct!));
      })
    );
    expect(
      positions.size,
      `${label}/${question.id} correct answer is not fixed in one tile position`
    ).toBeGreaterThan(1);
  }
}

describe("all-world answer fairness", () => {
  it("keeps every mission bank correct, selectable, complete, and position-randomizable", () => {
    expectValidAndFair("Unit 4", valuesFrom(AREA_MISSION_QUESTION_BANK));
    expectValidAndFair("Bubble Pop", valuesFrom(BUBBLE_QUESTION_BANK));
    expectValidAndFair("Unit 5", valuesFrom(MULTIPLICATION_MISSION_QUESTION_BANK));
    expectValidAndFair("Unit 6", valuesFrom(FACTORS_MISSION_QUESTION_BANK));
    expectValidAndFair("Unit 7 Part 1", valuesFrom(MD1_BANK));
    expectValidAndFair("Unit 7 Part 2", valuesFrom(MD2_BANK));
    expectValidAndFair("Unit 8", valuesFrom(O_BANK));
    expectValidAndFair("Shape Studio", [
      ...TOKEN_TRAIL_QUESTIONS,
      ...SHAPE_QUESTIONS,
    ]);
  });

  it("generates Round Rush answer pods with a selectable correct answer in varied positions", () => {
    for (const place of PLACES) {
      const positions = new Set<number>();
      for (let seed = 1; seed <= 64; seed += 1) {
        const question = createQuestion(place.id, seed);
        expect(question.choices).toContain(question.correctAnswer);
        positions.add(question.choices.indexOf(question.correctAnswer));
      }
      expect(positions.size, `${place.id} Round Rush positions vary`).toBeGreaterThan(1);
    }
  });
});
