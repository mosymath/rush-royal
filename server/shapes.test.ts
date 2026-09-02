import { describe, expect, it } from "vitest";
import { getShape2D, getShape3D, getShapeQuestion, SHAPES_2D, SHAPES_3D, SHAPE_QUESTIONS, TOKEN_TRAIL_QUESTIONS } from "../client/src/game/shapes";

describe("Shapes World curriculum", () => {
  it("covers the expanded 2D Shape Arcade and 3D Shape Galaxy collections", () => {
    expect(SHAPES_2D).toHaveLength(17);
    expect(SHAPES_3D).toHaveLength(12);
    expect(SHAPES_2D.map((shape) => shape.id)).toEqual(expect.arrayContaining(["rhombus", "trapezoid", "parallelogram", "kite", "decagon", "star", "heart"]));
    expect(SHAPES_3D.map((shape) => shape.id)).toEqual(expect.arrayContaining(["hemisphere", "triangular-pyramid", "pentagonal-prism", "pentagonal-pyramid", "torus"]));
  });

  it("uses accurate edge, face, and vertex facts for curved solids", () => {
    expect(getShape3D("sphere")).toMatchObject({ faces: 0, edges: 0, vertices: 0, curvedSurfaces: 1 });
    expect(getShape3D("cylinder")).toMatchObject({ faces: 2, edges: 2, vertices: 0, curvedSurfaces: 1 });
    expect(getShape3D("cone")).toMatchObject({ faces: 1, edges: 1, vertices: 1, curvedSurfaces: 1 });
    expect(getShape3D("hemisphere")).toMatchObject({ faces: 1, edges: 1, vertices: 0, curvedSurfaces: 1 });
    expect(getShape3D("torus")).toMatchObject({ faces: 0, edges: 0, vertices: 0, curvedSurfaces: 1 });
  });

  it("uses accurate side and corner facts for 2D shapes", () => {
    expect(getShape2D("triangle")).toMatchObject({ sides: 3, vertices: 3 });
    expect(getShape2D("hexagon")).toMatchObject({ sides: 6, vertices: 6 });
    expect(getShape2D("circle")).toMatchObject({ sides: 0, vertices: 0 });
    expect(getShape2D("decagon")).toMatchObject({ sides: 10, vertices: 10 });
    expect(getShape2D("rhombus")).toMatchObject({ sides: 4, vertices: 4 });
  });

  it("provides a complete answerable eighteen-mission Shape Quest", () => {
    expect(SHAPE_QUESTIONS).toHaveLength(18);
    expect(SHAPE_QUESTIONS.every((question) => question.choices.includes(question.correctAnswer))).toBe(true);
    expect(getShapeQuestion(18).id).toBe(SHAPE_QUESTIONS[0].id);
  });

  it("covers identification, sides, and corners for every learned Token Trail shape", () => {
    expect(TOKEN_TRAIL_QUESTIONS).toHaveLength(SHAPES_2D.length * 3);
    expect(TOKEN_TRAIL_QUESTIONS.every((question) => question.choices.includes(question.correctAnswer))).toBe(true);
    SHAPES_2D.forEach((shape) => {
      expect(TOKEN_TRAIL_QUESTIONS.find((question) => question.id === `token-${shape.id}-identify`)?.correctAnswer).toBe(shape.label);
      expect(TOKEN_TRAIL_QUESTIONS.find((question) => question.id === `token-${shape.id}-sides`)?.correctAnswer).toBe(String(shape.sides));
      expect(TOKEN_TRAIL_QUESTIONS.find((question) => question.id === `token-${shape.id}-corners`)?.correctAnswer).toBe(String(shape.vertices));
    });
  });
});
