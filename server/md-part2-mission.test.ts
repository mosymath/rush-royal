import { describe, expect, it } from "vitest";
import { MD2_ROUTES, md2Master, md2Questions, md2Read } from "../client/src/game/mdPart2";

describe("Unit 7 Part 2 mission", () => {
  it("has five lesson routes and a 15-question assessment Master Challenge", () => {
    expect(MD2_ROUTES.filter((route) => !route.master)).toHaveLength(5);
    expect(md2Questions("md2-master")).toHaveLength(15);
    expect(md2Master(md2Read())).toBe(false);
  });
  it("has ten unique prompts at every level of every route", () => {
    MD2_ROUTES.filter((route) => !route.master).forEach((route) => {
      const questions = (["easy", "normal", "hard"] as const).flatMap((level) => md2Questions(route.id, level));
      expect(questions).toHaveLength(30);
      expect(new Set(questions.map((question) => question.prompt)).size).toBe(30);
      expect(questions.every((question) => question.choices.includes(question.correctChoice))).toBe(true);
    });
  });
  it("keeps a labeled assessment item", () => {
    expect(md2Questions("md2-master").some((question) => question.sourceLabels.length > 0)).toBe(true);
  });
});
