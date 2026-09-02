export type ShapeDimension = "2d" | "3d";
export type Shape2dId = "circle" | "oval" | "triangle" | "square" | "rectangle" | "rhombus" | "trapezoid" | "parallelogram" | "kite" | "pentagon" | "hexagon" | "heptagon" | "octagon" | "nonagon" | "decagon" | "star" | "heart";
export type Shape3dId = "cube" | "rectangular-prism" | "sphere" | "hemisphere" | "cylinder" | "cone" | "square-pyramid" | "triangular-pyramid" | "triangular-prism" | "pentagonal-prism" | "pentagonal-pyramid" | "torus";
export type ShapeId = Shape2dId | Shape3dId;

export type Shape2D = {
  id: Shape2dId;
  label: string;
  sides: number;
  vertices: number;
  description: string;
  everydayExample: string;
  color: string;
};

export type Shape3D = {
  id: Shape3dId;
  label: string;
  faces: number;
  edges: number;
  vertices: number;
  curvedSurfaces: number;
  description: string;
  everydayExample: string;
  color: string;
};

export type ShapeQuestion = {
  id: string;
  level: string;
  prompt: string;
  cue: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  visualShape?: ShapeId;
};

export const SHAPES_2D: Shape2D[] = [
  { id: "circle", label: "Circle", sides: 0, vertices: 0, description: "A circle is a round 2D shape with one continuous curved boundary and no corners.", everydayExample: "a coin", color: "#ff6f9d" },
  { id: "oval", label: "Oval", sides: 0, vertices: 0, description: "An oval is a smooth curved shape that is stretched longer in one direction, with no corners.", everydayExample: "an egg outline", color: "#f6c84b" },
  { id: "triangle", label: "Triangle", sides: 3, vertices: 3, description: "A triangle is a flat shape with exactly three straight sides and three corners.", everydayExample: "a slice of pizza", color: "#8e79ff" },
  { id: "square", label: "Square", sides: 4, vertices: 4, description: "A square has four equal straight sides and four square corners.", everydayExample: "a floor tile", color: "#21c9e8" },
  { id: "rectangle", label: "Rectangle", sides: 4, vertices: 4, description: "A rectangle has four straight sides and four corners; opposite sides are equal in length.", everydayExample: "a book cover", color: "#ffb94a" },
  { id: "rhombus", label: "Rhombus", sides: 4, vertices: 4, description: "A rhombus is a four-sided shape with all sides the same length; it can look like a tilted diamond.", everydayExample: "a kite tile", color: "#ff7d7a" },
  { id: "trapezoid", label: "Trapezoid", sides: 4, vertices: 4, description: "A trapezoid is a four-sided shape with one pair of parallel sides.", everydayExample: "a lampshade outline", color: "#63d2b0" },
  { id: "parallelogram", label: "Parallelogram", sides: 4, vertices: 4, description: "A parallelogram has two pairs of parallel sides.", everydayExample: "a slanted card", color: "#7d9cff" },
  { id: "kite", label: "Kite", sides: 4, vertices: 4, description: "A kite is a four-sided shape with two pairs of neighbouring equal sides.", everydayExample: "a flying kite", color: "#fb85c1" },
  { id: "pentagon", label: "Pentagon", sides: 5, vertices: 5, description: "A pentagon is a flat shape with five straight sides and five corners.", everydayExample: "a home-plate sign", color: "#ff8068" },
  { id: "hexagon", label: "Hexagon", sides: 6, vertices: 6, description: "A hexagon is a flat shape with six straight sides and six corners.", everydayExample: "a honeycomb cell", color: "#a7d85b" },
  { id: "heptagon", label: "Heptagon", sides: 7, vertices: 7, description: "A heptagon is a flat shape with seven straight sides and seven corners.", everydayExample: "a seven-sided token", color: "#42c9ea" },
  { id: "octagon", label: "Octagon", sides: 8, vertices: 8, description: "An octagon is a flat shape with eight straight sides and eight corners.", everydayExample: "a stop-sign shape", color: "#cf7dff" },
  { id: "nonagon", label: "Nonagon", sides: 9, vertices: 9, description: "A nonagon is a flat shape with nine straight sides and nine corners.", everydayExample: "a nine-sided badge", color: "#fd9d63" },
  { id: "decagon", label: "Decagon", sides: 10, vertices: 10, description: "A decagon is a flat shape with ten straight sides and ten corners.", everydayExample: "a ten-sided game token", color: "#b784f5" },
  { id: "star", label: "Star", sides: 10, vertices: 10, description: "A five-point star has an outline with ten straight sides and ten corners.", everydayExample: "a prize badge", color: "#ffcf4a" },
  { id: "heart", label: "Heart", sides: 0, vertices: 1, description: "A heart is a special curved shape with a pointed bottom and rounded top curves.", everydayExample: "a love sticker", color: "#ff5e92" },
];

const rotateChoices = <T,>(choices: T[], offset: number) => choices.map((_, index) => choices[(index + offset) % choices.length]);
const countChoices = (correct: number, offset: number) => {
  const values = Array.from({ length: 11 }, (_, index) => index);
  const distractors = values.filter((value) => value !== correct).sort((left, right) => Math.abs(left - correct) - Math.abs(right - correct) || left - right).slice(0, 3);
  return rotateChoices([String(correct), ...distractors.map(String)], offset);
};

export const TOKEN_TRAIL_QUESTIONS: ShapeQuestion[] = SHAPES_2D.flatMap((shape, index) => {
  const shapeChoices = rotateChoices([shape.label, SHAPES_2D[(index + 4) % SHAPES_2D.length].label, SHAPES_2D[(index + 9) % SHAPES_2D.length].label, SHAPES_2D[(index + 13) % SHAPES_2D.length].label], index % 4);
  const sideWord = shape.sides === 1 ? "side" : "sides";
  const cornerWord = shape.vertices === 1 ? "corner" : "corners";
  return [
    { id: `token-${shape.id}-identify`, level: "TOKEN TRAIL · SHAPE SPOTTER", prompt: "Which 2D shape is glowing in the token window?", cue: "Match the flat outline", choices: shapeChoices, correctAnswer: shape.label, explanation: `This is a ${shape.label}. ${shape.description}`, visualShape: shape.id },
    { id: `token-${shape.id}-sides`, level: "TOKEN TRAIL · SIDE SCOUT", prompt: `How many straight sides does a ${shape.label.toLowerCase()} have?`, cue: "Count only straight edges", choices: countChoices(shape.sides, index + 1), correctAnswer: String(shape.sides), explanation: `A ${shape.label.toLowerCase()} has ${shape.sides} straight ${sideWord}.`, visualShape: shape.id },
    { id: `token-${shape.id}-corners`, level: "TOKEN TRAIL · CORNER CATCHER", prompt: `How many corners does a ${shape.label.toLowerCase()} have?`, cue: "Find each point where edges meet", choices: countChoices(shape.vertices, index + 2), correctAnswer: String(shape.vertices), explanation: `A ${shape.label.toLowerCase()} has ${shape.vertices} ${cornerWord}.`, visualShape: shape.id },
  ];
});

export const SHAPES_3D: Shape3D[] = [
  { id: "cube", label: "Cube", faces: 6, edges: 12, vertices: 8, curvedSurfaces: 0, description: "A cube is a solid with six matching square faces.", everydayExample: "a building block", color: "#79cfe3" },
  { id: "rectangular-prism", label: "Rectangular Prism", faces: 6, edges: 12, vertices: 8, curvedSurfaces: 0, description: "A rectangular prism is a box-shaped solid with six rectangular faces.", everydayExample: "a cereal box", color: "#f3a46f" },
  { id: "sphere", label: "Sphere", faces: 0, edges: 0, vertices: 0, curvedSurfaces: 1, description: "A sphere is perfectly round. It has one curved surface and no flat faces, edges, or vertices.", everydayExample: "a ball", color: "#f2c95f" },
  { id: "hemisphere", label: "Hemisphere", faces: 1, edges: 1, vertices: 0, curvedSurfaces: 1, description: "A hemisphere is half of a sphere, with one flat circular face and one curved surface.", everydayExample: "a bowl", color: "#87cfe2" },
  { id: "cylinder", label: "Cylinder", faces: 2, edges: 2, vertices: 0, curvedSurfaces: 1, description: "A cylinder has two flat circular faces connected by one curved surface.", everydayExample: "a soup can", color: "#b2a0e8" },
  { id: "cone", label: "Cone", faces: 1, edges: 1, vertices: 1, curvedSurfaces: 1, description: "A cone has one flat circular face, one curved surface, and one pointed vertex.", everydayExample: "an ice-cream cone", color: "#f08ead" },
  { id: "square-pyramid", label: "Square Pyramid", faces: 5, edges: 8, vertices: 5, curvedSurfaces: 0, description: "A square pyramid has a square base and four triangular faces that meet at one top vertex.", everydayExample: "a pyramid model", color: "#c4a0e4" },
  { id: "triangular-pyramid", label: "Triangular Pyramid", faces: 4, edges: 6, vertices: 4, curvedSurfaces: 0, description: "A triangular pyramid has four triangular faces and four vertices.", everydayExample: "a four-sided dice shape", color: "#ef9e7d" },
  { id: "triangular-prism", label: "Triangular Prism", faces: 5, edges: 9, vertices: 6, curvedSurfaces: 0, description: "A triangular prism has two triangular faces and three rectangular faces.", everydayExample: "a tent shape", color: "#86cba9" },
  { id: "pentagonal-prism", label: "Pentagonal Prism", faces: 7, edges: 15, vertices: 10, curvedSurfaces: 0, description: "A pentagonal prism has two pentagonal faces and five rectangular faces.", everydayExample: "a five-sided tube", color: "#9baee8" },
  { id: "pentagonal-pyramid", label: "Pentagonal Pyramid", faces: 6, edges: 10, vertices: 6, curvedSurfaces: 0, description: "A pentagonal pyramid has a five-sided base and five triangular side faces.", everydayExample: "a fantasy crystal", color: "#d69acb" },
  { id: "torus", label: "Torus", faces: 0, edges: 0, vertices: 0, curvedSurfaces: 1, description: "A torus is a rounded ring with one continuous curved surface and no edges or vertices.", everydayExample: "a doughnut", color: "#f09bb5" },
];

export const SHAPE_QUESTIONS: ShapeQuestion[] = [
  { id: "q1", level: "LEVEL 1 · SHAPE SPOTTER", prompt: "Which 2D shape has 3 straight sides?", cue: "Think about sides", choices: ["Circle", "Triangle", "Pentagon", "Hexagon"], correctAnswer: "Triangle", explanation: "A triangle has exactly 3 straight sides and 3 corners.", visualShape: "triangle" },
  { id: "q2", level: "LEVEL 1 · SHAPE SPOTTER", prompt: "Which shape is completely round with no corners?", cue: "Look for a curved boundary", choices: ["Square", "Circle", "Rectangle", "Triangle"], correctAnswer: "Circle", explanation: "A circle has one continuous curve and no vertices.", visualShape: "circle" },
  { id: "q3", level: "LEVEL 1 · SHAPE SPOTTER", prompt: "How many sides does a hexagon have?", cue: "Count the straight edges", choices: ["4", "5", "6", "8"], correctAnswer: "6", explanation: "The prefix hex- helps us remember that a hexagon has 6 sides.", visualShape: "hexagon" },
  { id: "q4", level: "LEVEL 1 · SHAPE SPOTTER", prompt: "Which shape has 4 equal sides?", cue: "All four sides match", choices: ["Rectangle", "Square", "Pentagon", "Triangle"], correctAnswer: "Square", explanation: "A square has 4 equal sides and 4 corners.", visualShape: "square" },
  { id: "q5", level: "LEVEL 2 · SOLID SCOUT", prompt: "Which solid has 6 square faces?", cue: "Think of a building block", choices: ["Cube", "Sphere", "Cone", "Cylinder"], correctAnswer: "Cube", explanation: "A cube is made from 6 matching square faces.", visualShape: "cube" },
  { id: "q6", level: "LEVEL 2 · SOLID SCOUT", prompt: "Which solid has no flat faces, edges, or vertices?", cue: "It is round in every direction", choices: ["Cone", "Sphere", "Cube", "Cylinder"], correctAnswer: "Sphere", explanation: "A sphere has one curved surface and no flat faces, edges, or vertices.", visualShape: "sphere" },
  { id: "q7", level: "LEVEL 2 · SOLID SCOUT", prompt: "How many vertices does a cone have?", cue: "Find the pointed corner", choices: ["0", "1", "2", "3"], correctAnswer: "1", explanation: "A cone comes to one pointed vertex at the top.", visualShape: "cone" },
  { id: "q8", level: "LEVEL 2 · SOLID SCOUT", prompt: "Which solid has 2 flat circular faces?", cue: "Think of a can", choices: ["Cylinder", "Sphere", "Cube", "Square Pyramid"], correctAnswer: "Cylinder", explanation: "A cylinder has 2 circular flat faces and one curved surface.", visualShape: "cylinder" },
  { id: "q9", level: "LEVEL 3 · PROPERTY PRO", prompt: "How many vertices does a triangular prism have?", cue: "Count both triangular ends", choices: ["3", "4", "6", "8"], correctAnswer: "6", explanation: "A triangular prism has 3 vertices on each triangular end: 6 altogether.", visualShape: "triangular-prism" },
  { id: "q10", level: "LEVEL 3 · PROPERTY PRO", prompt: "Which 2D shape has 8 sides?", cue: "Eight straight sides", choices: ["Hexagon", "Octagon", "Pentagon", "Rectangle"], correctAnswer: "Octagon", explanation: "An octagon has 8 sides and 8 corners.", visualShape: "octagon" },
  { id: "q11", level: "LEVEL 3 · PROPERTY PRO", prompt: "A square pyramid has a square base and how many triangular faces?", cue: "Look from the base to the peak", choices: ["2", "3", "4", "5"], correctAnswer: "4", explanation: "A square pyramid has 4 triangular side faces around its square base.", visualShape: "square-pyramid" },
  { id: "q12", level: "LEVEL 3 · PROPERTY PRO", prompt: "Which statement is true?", cue: "Use 2D and 3D vocabulary", choices: ["A circle has vertices", "A sphere has flat faces", "A rectangle is 2D", "A cone has 3 vertices"], correctAnswer: "A rectangle is 2D", explanation: "A rectangle is a flat 2D shape. The other statements are not true.", visualShape: "rectangle" },
  { id: "q13", level: "LEVEL 4 · ARCADE ACE", prompt: "Which shape is often called a diamond?", cue: "All sides match", choices: ["Rhombus", "Trapezoid", "Oval", "Heptagon"], correctAnswer: "Rhombus", explanation: "A rhombus has four equal sides and often looks like a tilted diamond.", visualShape: "rhombus" },
  { id: "q14", level: "LEVEL 4 · ARCADE ACE", prompt: "How many sides does a decagon have?", cue: "Count to ten", choices: ["8", "9", "10", "12"], correctAnswer: "10", explanation: "A decagon has 10 straight sides and 10 corners.", visualShape: "decagon" },
  { id: "q15", level: "LEVEL 4 · ARCADE ACE", prompt: "Which 3D solid is half of a sphere?", cue: "Think of a bowl", choices: ["Hemisphere", "Cylinder", "Cone", "Torus"], correctAnswer: "Hemisphere", explanation: "A hemisphere is half of a sphere with one flat circular face.", visualShape: "hemisphere" },
  { id: "q16", level: "LEVEL 4 · ARCADE ACE", prompt: "How many vertices does a pentagonal prism have?", cue: "Count both pentagon ends", choices: ["5", "8", "10", "12"], correctAnswer: "10", explanation: "A pentagonal prism has 5 vertices on each pentagonal end, for 10 in total.", visualShape: "pentagonal-prism" },
  { id: "q17", level: "LEVEL 5 · GALAXY CHAMPION", prompt: "Which solid is shaped like a rounded ring?", cue: "It looks like a doughnut", choices: ["Torus", "Sphere", "Cone", "Cube"], correctAnswer: "Torus", explanation: "A torus is a rounded ring with no edges or vertices.", visualShape: "torus" },
  { id: "q18", level: "LEVEL 5 · GALAXY CHAMPION", prompt: "Which quadrilateral has one pair of parallel sides?", cue: "Look for one matching direction", choices: ["Trapezoid", "Rhombus", "Square", "Kite"], correctAnswer: "Trapezoid", explanation: "A trapezoid has one pair of parallel sides.", visualShape: "trapezoid" },
];

export const getShape2D = (id: Shape2dId) => SHAPES_2D.find((shape) => shape.id === id) ?? SHAPES_2D[0];
export const getShape3D = (id: Shape3dId) => SHAPES_3D.find((shape) => shape.id === id) ?? SHAPES_3D[0];
export const getShapeQuestion = (index: number) => SHAPE_QUESTIONS[index % SHAPE_QUESTIONS.length];
