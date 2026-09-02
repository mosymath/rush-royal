import type { AreaLevelId, AreaMissionQuestion, AreaRouteId } from "./areaMissionTypes";

type Seed = Omit<AreaMissionQuestion, "choices"> & { distractors: readonly [string, string, string] };
const make = (seed: Seed): AreaMissionQuestion => {
  const options = [seed.correctChoice, ...seed.distractors];
  const shift = seed.id.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % options.length;
  const rotated = options.slice(shift).concat(options.slice(0, shift));
  const choices: AreaMissionQuestion["choices"] = [rotated[0]!, rotated[1]!, rotated[2]!, rotated[3]!];
  return { ...seed, choices };
};
const q = (id: string, level: AreaLevelId, prompt: string, correctChoice: string, distractors: readonly [string, string, string], explanation: string, skill: string, sourceLabels: readonly string[] = [], teacherSourceId = id) => make({ id, level, prompt, correctChoice, distractors, explanation, skill, sourceLabels, teacherSourceId });

const perimeterSample = [
  q("perimeter-e1", "easy", "A rectangle is 7 cm long and 5 cm wide. What is its perimeter?", "24 cm", ["12 cm", "35 cm", "14 cm"], "Add all four outside sides: 7 + 5 + 7 + 5 = 24 cm.", "rectangle perimeter", ["Souhag 23"]),
  q("perimeter-e2", "easy", "A square has side length 3 cm. What is its perimeter?", "12 cm", ["9 cm", "6 cm", "16 cm"], "A square has four equal sides: 4 × 3 = 12 cm.", "square perimeter", ["Cairo – Rod El-Farag 23"]),
  q("perimeter-e3", "easy", "Which formula finds the perimeter of a square with side length s?", "P = 4 × s", ["P = s × s", "P = 2 × s", "P = s + 4"], "Perimeter means the distance around all four equal sides.", "perimeter formula"),
  q("perimeter-n1", "normal", "A rectangle is 8 cm by 6 cm. What is its perimeter?", "28 cm", ["14 cm", "48 cm²", "26 cm"], "2 × (8 + 6) = 28 cm.", "rectangle perimeter", ["Alex. – First Montaza 23"]),
  q("perimeter-n2", "normal", "A square has side length 8 cm. What is its perimeter?", "32 cm", ["16 cm", "64 cm²", "24 cm"], "4 × 8 = 32 cm.", "square perimeter", ["Alex. – West 23"]),
  q("perimeter-n3", "normal", "A rectangle is 5 m by 2 m. What is its perimeter?", "14 m", ["10 m", "20 m", "14 cm"], "5 + 2 + 5 + 2 = 14 m.", "units and perimeter", ["Cairo – El Nozha 23"]),
  q("perimeter-h1", "hard", "A rectangular gymnasium is 7 m long and 4 m wide. What fence length is needed around it?", "22 m", ["11 m", "28 m²", "24 m"], "The perimeter is 2 × (7 + 4) = 22 m.", "word problem perimeter", ["Port Said 22"]),
  q("perimeter-h2", "hard", "Which rectangle has perimeter 32 m?", "10 m by 6 m", ["8 m by 4 m", "12 m by 4 m", "20 m by 12 m"], "2 × (10 + 6) = 32 m.", "choose dimensions"),
  q("perimeter-h3", "hard", "A rectangle has length 16 cm and width 14 cm. Find its perimeter.", "60 cm", ["30 cm", "224 cm²", "58 cm"], "2 × (16 + 14) = 60 cm.", "rectangle perimeter", ["Cairo 23"]),
] as const;

const areaSample = [
  q("area-e1", "easy", "A rectangle is 7 cm long and 4 cm wide. What is its area?", "28 cm²", ["11 cm", "22 cm", "28 cm"], "Area is length × width: 7 × 4 = 28 cm².", "rectangle area", ["Cairo – Rod El Farag 23"]),
  q("area-e2", "easy", "A square has side length 4 m. What is its area?", "16 m²", ["8 m", "16 m", "12 m²"], "Area of a square is side × side: 4 × 4 = 16 m².", "square area", ["El-Menia – Dir Mawas 22"]),
  q("area-e3", "easy", "Which formula finds the area of a rectangle with length l and width w?", "A = l × w", ["A = l + w", "A = 2 × (l + w)", "A = l ÷ w"], "Area counts the square units that cover a rectangle.", "area formula", ["Cairo – El Shrouk 23"]),
  q("area-n1", "normal", "A square garden has side length 9 m. What is its area?", "81 m²", ["36 m", "18 m²", "72 m²"], "9 × 9 = 81 square metres.", "square area", ["Alex. – Al Agamy 23", "Cairo – El Salam 23"]),
  q("area-n2", "normal", "A rectangular garden is 7 m by 5 m. What is its area?", "35 m²", ["24 m", "12 m²", "70 m²"], "7 × 5 = 35 square metres.", "rectangle area", ["Souhag 23"]),
  q("area-n3", "normal", "A rectangle is 20 cm by 10 cm. What is its area?", "200 cm²", ["60 cm", "30 cm²", "2 cm²"], "20 × 10 = 200 square centimetres.", "rectangle area", ["Giza – El-Haram 22", "El-Monofia – Sers El-Layan 23"]),
  q("area-h1", "hard", "Which has the greater area: a 7 cm by 5 cm rectangle or a square with side length 6 cm?", "The 6 cm square", ["The 7 cm by 5 cm rectangle", "They are equal", "Not enough information"], "The rectangle has area 35 cm²; the square has area 36 cm².", "compare areas", ["Giza – Abo El Nomros 23"]),
  q("area-h2", "hard", "A 10 m by 8 m fish farm has what area?", "80 m²", ["18 m", "36 m²", "40 m²"], "10 × 8 = 80 m².", "word problem area"),
  q("area-h3", "hard", "A 6 m by 4 m hall is covered with 1 m by 1 m tiles. How many tiles are needed?", "24 tiles", ["10 tiles", "20 tiles", "48 tiles"], "The hall area is 6 × 4 = 24 m², so it needs 24 unit tiles.", "area tiling"),
] as const;

const unknownSample = [
  q("unknown-e1", "easy", "A rectangle has area 35 m² and length 7 m. What is its width?", "5 m", ["4 m", "6 m", "42 m"], "Width = area ÷ length = 35 ÷ 7 = 5 m.", "unknown rectangle side", ["El-Menia 23"]),
  q("unknown-e2", "easy", "A square has perimeter 24 cm. What is its side length?", "6 cm", ["4 cm", "8 cm", "12 cm"], "Divide the perimeter by four equal sides: 24 ÷ 4 = 6 cm.", "unknown square side", ["Alex. – El Montazah 23"]),
  q("unknown-e3", "easy", "A square has area 16 cm². What is its side length?", "4 cm", ["8 cm", "6 cm", "2 cm"], "4 × 4 = 16, so the side is 4 cm.", "unknown square side"),
  q("unknown-n1", "normal", "A rectangle has perimeter 28 cm and width 6 cm. What is its length?", "8 cm", ["14 cm", "22 cm", "4 cm"], "Half the perimeter is 14. Then 14 − 6 = 8 cm.", "unknown rectangle side"),
  q("unknown-n2", "normal", "A square has perimeter 40 cm. What is its side length?", "10 cm", ["4 cm", "20 cm", "160 cm"], "40 ÷ 4 = 10 cm.", "unknown square side", ["Cairo 23"]),
  q("unknown-n3", "normal", "A rectangle has area 42 km² and width 6 km. What is its length?", "7 km", ["6 km", "36 km", "48 km"], "42 ÷ 6 = 7 km.", "unknown rectangle side"),
  q("unknown-h1", "hard", "A rectangle has area 45 m² and length 9 m. What is its perimeter?", "28 m", ["5 m", "54 m", "36 m"], "Its width is 45 ÷ 9 = 5 m. Perimeter = 2 × (9 + 5) = 28 m.", "connected area and perimeter"),
  q("unknown-h2", "hard", "A garden has perimeter 26 m and width 6 m. What are its length and area?", "7 m and 42 m²", ["13 m and 78 m²", "7 m and 26 m²", "6 m and 36 m²"], "Half the perimeter is 13, so length is 13 − 6 = 7 m. Area is 7 × 6 = 42 m².", "connected unknown dimensions"),
  q("unknown-h3", "hard", "A square has area 49 cm². What are its side length and perimeter?", "7 cm and 28 cm", ["49 cm and 196 cm", "8 cm and 32 cm", "7 cm and 49 cm"], "The side is 7 cm because 7 × 7 = 49. Then 4 × 7 = 28 cm.", "connected square dimensions"),
] as const;

const complexSample = [
  q("complex-e1", "easy", "An L-shaped garden has outside sides 10 m, 3 m, 4 m, 6 m, 6 m, and 9 m. What is its perimeter?", "38 m", ["28 m", "66 m²", "40 m"], "Trace every outside side: 10 + 3 + 4 + 6 + 6 + 9 = 38 m.", "complex perimeter"),
  q("complex-e2", "easy", "Split the garden into a 10 m by 3 m rectangle and a 6 m by 6 m square. What is its area?", "66 m²", ["30 m²", "36 m²", "90 m²"], "30 m² + 36 m² = 66 m².", "complex area by addition"),
  q("complex-e3", "easy", "Complete the garden as a 10 m by 9 m rectangle and remove a 6 m by 4 m cutout. What is its area?", "66 m²", ["90 m²", "24 m²", "54 m²"], "90 m² − 24 m² = 66 m².", "complex area by subtraction"),
  q("complex-n1", "normal", "A 14 cm by 7 cm rectangle has a 4 cm by 5 cm cutout. What is the remaining area?", "78 cm²", ["42 cm²", "24 cm²", "87 cm²"], "14 × 7 = 98 cm². Remove 4 × 5 = 20 cm². 98 − 20 = 78 cm².", "complex area by subtraction"),
  q("complex-n2", "normal", "Combine an 8 cm by 2 cm rectangle and a 3 cm by 5 cm rectangle. What is their total area?", "31 cm²", ["16 cm²", "15 cm²", "40 cm²"], "8 × 2 = 16 and 3 × 5 = 15. Together: 31 cm².", "combine shapes"),
  q("complex-n3", "normal", "Two squares with side lengths 5 m and 2 m are joined. What is the perimeter of the new figure?", "24 m", ["7 m", "10 m", "35 m"], "The joined edge is inside the figure, so it is not counted. The outside total is 24 m.", "complex perimeter"),
  q("complex-h1", "hard", "A complex figure has top 23 m, right side 18 m, inner horizontal 13 m, and left short side 6 m. Find missing sides x and y.", "x = 10 m, y = 12 m", ["x = 13 m, y = 6 m", "x = 10 m, y = 6 m", "x = 12 m, y = 10 m"], "23 − 13 = 10 m, and 18 − 6 = 12 m.", "missing complex sides"),
  q("complex-h2", "hard", "A complex shape has an outer 10 km by 8 km rectangle with a 2 km by 3 km cutout. What is its area?", "74 km²", ["80 km²", "42 km²", "74 m²"], "80 km² − 6 km² = 74 km².", "complex area by subtraction"),
  q("complex-h3", "hard", "Two pictures each have area 36 cm². One is a 9 cm by 4 cm rectangle; the other is a square. Which has the greater perimeter?", "The 9 cm by 4 cm rectangle", ["The square", "They have equal perimeters", "Not enough information"], "The rectangle perimeter is 26 cm. The square side is 6 cm, so its perimeter is 24 cm.", "compare complex perimeters"),
] as const;

const perimeter = [...perimeterSample,
  q("perimeter-e4", "easy", "A square has side length 9 cm. What is its perimeter?", "36 cm", ["18 cm", "81 cm²", "27 cm"], "4 × 9 = 36 cm.", "square perimeter"),
  q("perimeter-e5", "easy", "A square has side length 27 cm. What is its perimeter?", "108 cm", ["54 cm", "81 cm", "729 cm²"], "4 × 27 = 108 cm.", "square perimeter"),
  q("perimeter-e6", "easy", "A rectangle is 30 mm long and 50 mm wide. What is its perimeter?", "160 mm", ["80 mm", "1,500 mm²", "100 mm"], "30 + 50 + 30 + 50 = 160 mm.", "rectangle perimeter"),
  q("perimeter-e7", "easy", "A rectangle is 67 m long and 21 m wide. What is its perimeter?", "176 m", ["88 m", "1,407 m²", "154 m"], "2 × (67 + 21) = 176 m.", "rectangle perimeter"),
  q("perimeter-e8", "easy", "A square has side length 33 mm. What is its perimeter?", "132 mm", ["66 mm", "99 mm", "1,089 mm²"], "4 × 33 = 132 mm.", "square perimeter"),
  q("perimeter-e9", "easy", "A rectangle is 8 cm long and 2 cm wide. What is its perimeter?", "20 cm", ["10 cm", "16 cm", "6 cm"], "8 + 2 + 8 + 2 = 20 cm.", "rectangle perimeter"),
  q("perimeter-e10", "easy", "A square has side length 5 cm. What is its perimeter?", "20 cm", ["10 cm", "25 cm²", "15 cm"], "4 × 5 = 20 cm.", "square perimeter", ["El-Monofia – Sers El Layan 23", "Cairo – El Nozha 23"]),
  q("perimeter-n4", "normal", "Which formula finds the perimeter of a rectangle with length l and width w?", "2 × (l + w)", ["l × w", "l + w", "4 × l"], "A rectangle has two lengths and two widths.", "rectangle formula", ["Cairo 23", "Alexandria – Montaza 22"]),
  q("perimeter-n5", "normal", "Complete: perimeter of a rectangle = (length + width) × ___.", "2", ["1", "3", "4"], "There are two of each side, so multiply the sum by 2.", "rectangle formula", ["Cairo – El-Salam 23"]),
  q("perimeter-n6", "normal", "A square carpet has side length 3 m. What is its perimeter?", "12 m", ["9 m²", "6 m", "16 m"], "4 × 3 = 12 m.", "square word problem", ["Giza 23"]),
  q("perimeter-n7", "normal", "Find the perimeter of a rectangle that is 8 cm by 5 cm.", "26 cm", ["13 cm", "40 cm²", "30 cm"], "2 × (8 + 5) = 26 cm.", "rectangle perimeter", ["Giza – Abo El Nomros 23"]),
  q("perimeter-n8", "normal", "A square has side length 8 cm. Its perimeter is…", "32 cm", ["16 cm", "64 cm²", "40 cm"], "Four equal sides of 8 cm make 32 cm.", "square perimeter", ["Alex. – West 23"]),
  q("perimeter-n9", "normal", "A rectangle is 16 cm by 14 cm. Which calculation finds its perimeter?", "2 × (16 + 14)", ["16 × 14", "16 + 14", "4 × 16"], "For a rectangle, double the sum of length and width.", "choose perimeter operation", ["Cairo 23"]),
  q("perimeter-n10", "normal", "A rectangle is 7 cm by 5 cm. Which expression adds all of its outside sides?", "7 + 5 + 7 + 5", ["7 × 5", "7 + 5", "2 × 7 + 5"], "Perimeter is the distance around every outside side.", "trace perimeter", ["Souhag 23"]),
  q("perimeter-h4", "hard", "A rectangle has length 16 cm and width 14 cm. Find its perimeter.", "60 cm", ["30 cm", "224 cm²", "58 cm"], "2 × (16 + 14) = 60 cm.", "multi-step perimeter", ["Cairo 23"]),
  q("perimeter-h5", "hard", "Which rectangle has a perimeter of 32 m?", "10 m by 6 m", ["8 m by 4 m", "12 m by 4 m", "20 m by 12 m"], "2 × (10 + 6) = 32 m.", "choose dimensions"),
  q("perimeter-h6", "hard", "A rectangular gymnasium is 7 m long and 4 m wide. How many metres of fence are needed?", "22 m", ["11 m", "28 m²", "24 m"], "The fence follows the outside: 2 × (7 + 4) = 22 m.", "perimeter word problem", ["Port Said 22"]),
  q("perimeter-h7", "hard", "A rectangle is 5 m long and 2 m wide. Why is 14 m the correct perimeter?", "5 + 2 + 5 + 2", ["5 × 2", "5 + 2", "14 × 2"], "Add all four outside sides, not the inside space.", "explain perimeter", ["Cairo – El Nozha 23"]),
  q("perimeter-h8", "hard", "For a square with side length s, which expression is equal to its perimeter?", "s + s + s + s", ["s × s", "2 × s", "s + 4"], "A square has four equal outside sides.", "formula reasoning"),
  q("perimeter-h9", "hard", "A rectangle is 30 mm by 50 mm. A student says its perimeter is 1,500 mm². What did the student calculate?", "The area", ["The perimeter", "The width", "The length"], "30 × 50 gives area, not perimeter.", "area versus perimeter"),
  q("perimeter-h10", "hard", "A square has a perimeter of 36 cm. Which side length matches the supplied square-perimeter rule?", "9 cm", ["6 cm", "12 cm", "18 cm"], "36 ÷ 4 = 9 cm.", "reverse perimeter"),
] as const;

const area = [...areaSample,
  q("area-e4", "easy", "A square has side length 3 cm. What is its area?", "9 cm²", ["12 cm", "6 cm²", "3 cm²"], "3 × 3 = 9 cm².", "square area"),
  q("area-e5", "easy", "A rectangle is 18 m by 10 m. What is its area?", "180 m²", ["28 m", "80 m²", "360 m²"], "18 × 10 = 180 m².", "rectangle area"),
  q("area-e6", "easy", "A rectangle is 6 mm by 8 mm. What is its area?", "48 mm²", ["14 mm", "28 mm²", "56 mm²"], "6 × 8 = 48 mm².", "rectangle area"),
  q("area-e7", "easy", "A square has side length 9 cm. What is its area?", "81 cm²", ["36 cm", "18 cm²", "72 cm²"], "9 × 9 = 81 cm².", "square area"),
  q("area-e8", "easy", "A rectangle is 5 cm by 3 cm. What is its area?", "15 cm²", ["8 cm", "16 cm²", "30 cm²"], "5 × 3 = 15 cm².", "rectangle area"),
  q("area-e9", "easy", "A rectangle is 6 cm by 4 cm. What is its area?", "24 cm²", ["10 cm", "20 cm²", "48 cm²"], "6 × 4 = 24 cm².", "rectangle area", ["El-Sharkia 22"]),
  q("area-e10", "easy", "A square has side length 6 cm. What is its area?", "36 cm²", ["24 cm", "12 cm²", "30 cm²"], "6 × 6 = 36 cm².", "square area", ["El-Behiera – Hosh Essa 23"]),
  q("area-n4", "normal", "A square picture has side length 8 cm. What area of glass covers it?", "64 cm²", ["32 cm", "16 cm²", "64 cm"], "8 × 8 = 64 cm².", "area word problem", ["El-Kalyoubia 22"]),
  q("area-n5", "normal", "A rectangle is 9 cm by 5 cm. What is its area?", "45 cm²", ["14 cm", "28 cm²", "90 cm²"], "9 × 5 = 45 cm².", "rectangle area", ["Cairo 23"]),
  q("area-n6", "normal", "A square-shaped room has side length 3 m. What is its area?", "9 m²", ["12 m", "6 m²", "9 m"], "3 × 3 = 9 m².", "square word problem", ["Cairo – El Nozha 23"]),
  q("area-n7", "normal", "Amgad has a square garden with side length 6 m. What is its area?", "36 m²", ["24 m", "12 m²", "30 m²"], "6 × 6 = 36 m².", "square word problem", ["Giza 23"]),
  q("area-n8", "normal", "A rectangle is 10 mm long and 8 mm wide. What is its area?", "80 mm²", ["18 mm", "40 mm²", "160 mm²"], "10 × 8 = 80 mm².", "rectangle area"),
  q("area-n9", "normal", "A square has side length 5 cm. Which calculation finds its area?", "5 × 5", ["5 + 5 + 5 + 5", "2 × (5 + 5)", "5 ÷ 5"], "Area of a square is side × side.", "choose area operation"),
  q("area-n10", "normal", "A rectangle is 8 cm by 3 cm. What is its area?", "24 cm²", ["11 cm", "16 cm²", "48 cm²"], "8 × 3 = 24 cm².", "rectangle area", ["El-Behiera 23", "Cairo – El Marg 23"]),
  q("area-h4", "hard", "A rectangle is 16 m by 9 m. What are its area and perimeter?", "144 m² and 50 m", ["25 m² and 50 m", "144 m and 50 m²", "72 m² and 25 m"], "Area: 16 × 9 = 144 m². Perimeter: 2 × (16 + 9) = 50 m.", "area and perimeter"),
  q("area-h5", "hard", "A square has side length 10 mm. What are its area and perimeter?", "100 mm² and 40 mm", ["20 mm² and 40 mm", "100 mm and 40 mm²", "40 mm² and 100 mm"], "10 × 10 = 100 mm² and 4 × 10 = 40 mm.", "area and perimeter"),
  q("area-h6", "hard", "Which is greater: a 5 cm by 3 cm rectangle or a square with side length 4 cm?", "The 4 cm square", ["The 5 cm by 3 cm rectangle", "They are equal", "Not enough information"], "The rectangle area is 15 cm²; the square area is 16 cm².", "compare areas"),
  q("area-h7", "hard", "A rectangular banquet table is 8 m by 6 m. What area of glass is needed for its top?", "48 m²", ["14 m", "28 m²", "96 m²"], "8 × 6 = 48 m².", "area word problem"),
  q("area-h8", "hard", "A rectangular ant farm measures 20 cm by 8 cm. What is its area?", "160 cm²", ["28 cm", "80 cm²", "320 cm²"], "20 × 8 = 160 cm².", "area word problem"),
  q("area-h9", "hard", "A square-shaped room has side length 4 m. What is its area?", "16 m²", ["8 m", "12 m²", "16 m"], "4 × 4 = 16 m².", "square word problem", ["Souhag 22"]),
  q("area-h10", "hard", "A 6 m by 4 m hall is covered with 1 m by 1 m tiles. How many tiles are needed?", "24 tiles", ["10 tiles", "20 tiles", "48 tiles"], "Its area is 24 m², so it takes 24 one-square-metre tiles.", "area tiling"),
] as const;

const unknown = [...unknownSample,
  q("unknown-e4", "easy", "A square has perimeter 20 cm. What is its side length?", "5 cm", ["4 cm", "10 cm", "20 cm"], "20 ÷ 4 = 5 cm.", "unknown square side", ["El-Behiera – Hosh Essa 23"]),
  q("unknown-e5", "easy", "A square has perimeter 28 cm. What is its side length?", "7 cm", ["6 cm", "8 cm", "14 cm"], "28 ÷ 4 = 7 cm.", "unknown square side", ["Giza – Awseem 23"]),
  q("unknown-e6", "easy", "A square has perimeter 40 cm. What is its side length?", "10 cm", ["4 cm", "20 cm", "40 cm"], "40 ÷ 4 = 10 cm.", "unknown square side", ["El-Behiera 23"]),
  q("unknown-e7", "easy", "A square has perimeter 36 cm. What is its side length?", "9 cm", ["6 cm", "12 cm", "18 cm"], "36 ÷ 4 = 9 cm.", "unknown square side", ["Aswan – Kom Ombo 22"]),
  q("unknown-e8", "easy", "A square has area 49 km². What is its side length?", "7 km", ["6 km", "8 km", "49 km"], "7 × 7 = 49, so the side is 7 km.", "unknown square side"),
  q("unknown-e9", "easy", "A rectangle has area 28 cm² and width 4 cm. What is its length?", "7 cm", ["4 cm", "8 cm", "32 cm"], "28 ÷ 4 = 7 cm.", "unknown rectangle side"),
  q("unknown-e10", "easy", "A rectangle has area 50 square units and length 10 units. What is its width?", "5 units", ["4 units", "6 units", "60 units"], "50 ÷ 10 = 5 units.", "unknown rectangle side"),
  q("unknown-n4", "normal", "A rectangle has area 99 m² and width 11 m. What is its length?", "9 m", ["8 m", "10 m", "110 m"], "99 ÷ 11 = 9 m.", "unknown rectangle side"),
  q("unknown-n5", "normal", "A rectangle has perimeter 24 cm and width 8 cm. What is its length?", "4 cm", ["12 cm", "8 cm", "16 cm"], "Half the perimeter is 12. 12 − 8 = 4 cm.", "unknown rectangle side"),
  q("unknown-n6", "normal", "A rectangle has perimeter 26 units and width 5 units. What is its length?", "8 units", ["13 units", "6 units", "21 units"], "Half the perimeter is 13. 13 − 5 = 8 units.", "unknown rectangle side"),
  q("unknown-n7", "normal", "A rectangle has perimeter 44 m and length 15 m. What is its width?", "7 m", ["22 m", "14 m", "29 m"], "Half the perimeter is 22. 22 − 15 = 7 m.", "unknown rectangle side"),
  q("unknown-n8", "normal", "A square has area 25 m². What is its side length?", "5 m", ["4 m", "6 m", "25 m"], "5 × 5 = 25.", "unknown square side"),
  q("unknown-n9", "normal", "A square has area 64 cm². What is its side length?", "8 cm", ["6 cm", "7 cm", "16 cm"], "8 × 8 = 64.", "unknown square side"),
  q("unknown-n10", "normal", "A square has area 16 cm². What is its perimeter?", "16 cm", ["4 cm", "8 cm", "64 cm"], "The side is 4 cm, then 4 × 4 = 16 cm.", "connected square dimensions", ["Cairo – El-Kobba 22"]),
  q("unknown-h4", "hard", "A rectangle has perimeter 20 m and width 6 m. What is its length?", "4 m", ["10 m", "6 m", "20 m"], "Half the perimeter is 10. 10 − 6 = 4 m.", "unknown rectangle side"),
  q("unknown-h5", "hard", "A rectangle has area 15 cm² and width 3 cm. What is its perimeter?", "16 cm", ["8 cm", "15 cm", "16 cm²"], "Its length is 5 cm. Then 2 × (5 + 3) = 16 cm.", "connected area and perimeter"),
  q("unknown-h6", "hard", "A square has area 1 m². What is its perimeter?", "4 m", ["1 m", "2 m", "3 m"], "The side is 1 m, so the perimeter is 4 m.", "connected square dimensions"),
  q("unknown-h7", "hard", "A blanket has width 3 m and perimeter 14 m. What is its length?", "4 m", ["17 m", "11 m", "8 m"], "Half the perimeter is 7. 7 − 3 = 4 m.", "unknown rectangle side", ["Alexandria – Borg El-Arab 22"]),
  q("unknown-h8", "hard", "A rectangle has perimeter 32 m and length 9 m. What is its area?", "63 m²", ["41 m²", "72 m²", "18 m²"], "Half the perimeter is 16, so width is 7. Area is 9 × 7 = 63 m².", "connected area and perimeter"),
  q("unknown-h9", "hard", "A square has area 49 cm². What are its side length and perimeter?", "7 cm and 28 cm", ["49 cm and 196 cm", "8 cm and 32 cm", "7 cm and 49 cm"], "7 × 7 = 49, then 4 × 7 = 28 cm.", "connected square dimensions"),
  q("unknown-h10", "hard", "A rectangular garden has area 12 m² and width 3 m. What is its length?", "4 m", ["3 m", "6 m", "9 m"], "12 ÷ 3 = 4 m.", "unknown rectangle side"),
] as const;

const complex = [...complexSample,
  q("complex-e4", "easy", "In the complex-shape example, 23 m − 13 m gives missing side x. What is x?", "10 m", ["6 m", "12 m", "36 m"], "The whole top is 23 m and the inner part is 13 m, so x is 10 m.", "missing complex side"),
  q("complex-e5", "easy", "In the complex-shape example, 18 m − 6 m gives missing side y. What is y?", "12 m", ["10 m", "13 m", "24 m"], "The whole height is 18 m and the short left side is 6 m.", "missing complex side"),
  q("complex-e6", "easy", "An 8 cm by 2 cm rectangle has what area?", "16 cm²", ["10 cm", "6 cm²", "32 cm²"], "8 × 2 = 16 cm².", "part area"),
  q("complex-e7", "easy", "A 3 cm by 5 cm rectangle has what area?", "15 cm²", ["8 cm", "10 cm²", "30 cm²"], "3 × 5 = 15 cm².", "part area"),
  q("complex-e8", "easy", "A 10 m by 3 m rectangle has what area?", "30 m²", ["13 m", "20 m²", "60 m²"], "10 × 3 = 30 m².", "part area"),
  q("complex-e9", "easy", "A 6 m by 6 m square has what area?", "36 m²", ["12 m", "30 m²", "42 m²"], "6 × 6 = 36 m².", "part area"),
  q("complex-e10", "easy", "A 10 m by 9 m completed rectangle has what area?", "90 m²", ["19 m", "19 m²", "81 m²"], "10 × 9 = 90 m².", "complete complex shape"),
  q("complex-n4", "normal", "The complex-shape example has sections 13 m by 6 m and 10 m by 18 m. What is their total area?", "258 m²", ["198 m²", "240 m²", "276 m²"], "13 × 6 = 78 and 10 × 18 = 180. Together: 258 m².", "add complex areas"),
  q("complex-n5", "normal", "An L-shaped figure comes from a 10 cm by 9 cm rectangle with a 6 cm by 4 cm cutout. What is its area?", "66 cm²", ["90 cm²", "24 cm²", "54 cm²"], "90 − 24 = 66 cm².", "subtract complex area"),
  q("complex-n6", "normal", "A 14 cm by 7 cm outer rectangle has a 4 cm by 5 cm cutout. What calculation removes the cutout?", "98 − 20", ["98 + 20", "14 + 7", "4 × 5"], "First find 98 cm² outside and 20 cm² missing, then subtract.", "choose complex-area operation"),
  q("complex-n7", "normal", "A 10 km by 8 km outer rectangle has a 2 km by 3 km cutout. What area is removed?", "6 km²", ["5 km²", "10 km²", "16 km²"], "2 × 3 = 6 km².", "cutout area"),
  q("complex-n8", "normal", "The perimeter of a complex figure is found by…", "Adding every outside side", ["Adding the inside lines", "Multiplying length by width", "Adding only the two longest sides"], "Trace the outside boundary only.", "complex perimeter strategy"),
  q("complex-n9", "normal", "A complex figure is divided into two rectangles of areas 12 m² and 54 m². What is the whole area?", "66 m²", ["42 m²", "54 m²", "648 m²"], "Add 12 + 54 = 66 m².", "add complex areas"),
  q("complex-n10", "normal", "The same complex garden can be split in different ways. What stays the same?", "Its area", ["Its number of parts", "Its colour", "Its longest side"], "Splitting a figure differently does not change its area.", "complex-area concept"),
  q("complex-h4", "hard", "The complex-shape example has outside sides 23, 18, 10, 12, 13, and 6 metres. What is its perimeter?", "82 m", ["59 m", "258 m²", "72 m"], "Add all six outside sides: 82 m.", "complex perimeter"),
  q("complex-h5", "hard", "A 10 km by 8 km outer rectangle has a 2 km by 3 km cutout. What is its area?", "74 km²", ["80 km²", "42 km²", "74 m²"], "80 − 6 = 74 km².", "subtract complex area"),
  q("complex-h6", "hard", "Two squares with sides 5 m and 2 m are joined. Why is their perimeter not 28 m?", "The shared side is inside the new figure", ["The squares have no perimeter", "Area replaces perimeter", "Only the smaller square counts"], "A joined edge is no longer outside, so it is not counted.", "reason about complex perimeter"),
  q("complex-h7", "hard", "Combine a 10 cm by 2 cm rectangle and a 3 cm by 7 cm rectangle. What is the total area?", "41 cm²", ["20 cm²", "21 cm²", "34 cm²"], "10 × 2 = 20 and 3 × 7 = 21. Total: 41 cm².", "combine shapes"),
  q("complex-h8", "hard", "Which shape has greater perimeter: a 9 cm by 4 cm rectangle or a square with area 36 cm²?", "The 9 cm by 4 cm rectangle", ["The square", "They have equal perimeters", "Not enough information"], "The rectangle perimeter is 26 cm; the square side is 6 cm, so its perimeter is 24 cm.", "compare complex perimeters"),
  q("complex-h9", "hard", "A complex L-shape has outer rectangle area 98 cm² and cutout area 20 cm². What is the remaining area?", "78 cm²", ["118 cm²", "42 cm²", "87 cm²"], "Subtract 20 from 98.", "subtract complex area"),
  q("complex-h10", "hard", "For the complex garden, which method also gives 66 m²?", "90 m² − 24 m²", ["90 m² + 24 m²", "10 m + 9 m", "6 m × 4 m"], "Complete the large rectangle and subtract the missing part.", "choose complex-area method"),
] as const;

const mission = [
  perimeter[0], area[0], unknown[0], complex[0], perimeter[4], area[4], unknown[4], complex[4], perimeter[6], area[6], unknown[6], complex[6],
].map((question, index) => ({ ...question, id: `mission-${index + 1}` })) as AreaMissionQuestion[];

const ALL = { perimeter, area, "unknown-dimensions": unknown, "complex-shapes": complex, "area-explorer-mission": mission } as const;
export const AREA_MISSION_QUESTION_BANK = ALL;
export function getAreaMissionQuestions(routeId: AreaRouteId, level?: AreaLevelId): AreaMissionQuestion[] {
  const bank = ALL[routeId] as readonly AreaMissionQuestion[];
  return routeId === "area-explorer-mission" || !level ? [...bank] : bank.filter((question) => question.level === level);
}
