import type { BubbleLevelId, BubbleQuestion, BubbleRouteId } from "@/game/bubblePopTypes";

type QuestionSeed = Omit<BubbleQuestion, "choices"> & { distractors: readonly [string, string, string] };

function makeQuestion(seed: QuestionSeed): BubbleQuestion {
  const ordered = [seed.correctChoice, ...seed.distractors] as string[];
  const shift = seed.id.split("").reduce((total, character) => total + character.charCodeAt(0), 0) % ordered.length;
  const rotated = ordered.slice(shift).concat(ordered.slice(0, shift));
  const choices: BubbleQuestion["choices"] = [rotated[0]!, rotated[1]!, rotated[2]!, rotated[3]!];
  return { ...seed, choices };
}

const q = (id: string, level: BubbleLevelId, prompt: string, correctChoice: string, distractors: readonly [string, string, string], explanation: string, skill: string) => makeQuestion({ id, level, prompt, correctChoice, distractors, explanation, skill });

const length = [
  q("length-e1", "easy", "Which unit is best for the distance between two cities?", "kilometres (km)", ["metres (m)", "centimetres (cm)", "millimetres (mm)"], "Long distances between places are measured in kilometres.", "choose a length unit"),
  q("length-e2", "easy", "1 m = how many cm?", "100 cm", ["10 cm", "1,000 cm", "1 cm"], "One metre has 100 centimetres.", "metres to centimetres"),
  q("length-e3", "easy", "1 cm = how many mm?", "10 mm", ["100 mm", "1 mm", "1,000 mm"], "One centimetre has 10 millimetres.", "centimetres to millimetres"),
  q("length-n1", "normal", "5 km 45 m = how many metres?", "5,045 m", ["545 m", "5,450 m", "4,055 m"], "5 km is 5,000 m, then add 45 m.", "mixed kilometres and metres"),
  q("length-n2", "normal", "897 mm = ___ cm ___ mm.", "89 cm 7 mm", ["8 cm 97 mm", "89 cm 70 mm", "897 cm 0 mm"], "Every 10 mm makes 1 cm. 897 mm is 89 groups of 10 mm and 7 mm left.", "mixed centimetres and millimetres"),
  q("length-n3", "normal", "Which length is greatest?", "3 m", ["299 cm", "2,950 mm", "29 dm"], "3 m = 300 cm = 3,000 mm, so it is the greatest value.", "compare length"),
  q("length-h1", "hard", "A ribbon is 2 m 35 cm long. Another is 165 cm long. How long are they together?", "4 m", ["3 m", "400 cm", "5 m"], "2 m 35 cm is 235 cm. 235 cm + 165 cm = 400 cm = 4 m.", "add converted lengths"),
  q("length-h2", "hard", "A 20 m rope is cut into 4 equal pieces. How long is each piece?", "5 m", ["4 m", "80 m", "500 cm"], "20 ÷ 4 = 5, so each piece is 5 m long.", "divide length"),
  q("length-h3", "hard", "Fill the missing value: 9 m + 450 mL is not a valid length model. Which unit must replace mL?", "cm", ["L", "kg", "seconds"], "Length can use centimetres, not millilitres, kilograms, or seconds.", "choose compatible units"),
] as const;

const mass = [
  q("mass-e1", "easy", "Which unit is best for the mass of an apple?", "grams (g)", ["kilograms (kg)", "tons", "litres (L)"], "An apple has a small mass, so grams are sensible.", "choose a mass unit"),
  q("mass-e2", "easy", "1 kg = how many g?", "1,000 g", ["100 g", "10 g", "10,000 g"], "One kilogram has 1,000 grams.", "kilograms to grams"),
  q("mass-e3", "easy", "1 ton = how many kg?", "1,000 kg", ["100 kg", "10 kg", "1,000,000 kg"], "A ton is equal to 1,000 kilograms.", "tons to kilograms"),
  q("mass-n1", "normal", "35 kg and 35 g = how many grams?", "35,035 g", ["3,535 g", "35,000 g", "53,035 g"], "35 kg is 35,000 g. Add 35 g.", "mixed kilograms and grams"),
  q("mass-n2", "normal", "6,000 kg = how many tons?", "6 tons", ["60 tons", "600 tons", "0.6 ton"], "1 ton is 1,000 kg, so 6,000 kg is 6 tons.", "kilograms to tons"),
  q("mass-n3", "normal", "Which mass is smallest?", "980 g", ["1 kg", "1,050 g", "2 kg"], "1 kg equals 1,000 g, so 980 g is the smallest.", "compare mass"),
  q("mass-h1", "hard", "A fizzy can has mass 300 g. Jana buys 6 cans. What is the total mass?", "1 kg 800 g", ["1 kg 600 g", "18 kg", "300 g"], "6 × 300 g = 1,800 g, which is 1 kg 800 g.", "multiply mass"),
  q("mass-h2", "hard", "Sarah buys 3 kg 400 g of sugar and 5 kg 217 g of rice. What is the total mass?", "8 kg 617 g", ["8 kg 517 g", "9 kg 617 g", "8,617 kg"], "Add kilograms and grams: 3 kg 400 g + 5 kg 217 g = 8 kg 617 g.", "add mixed mass"),
  q("mass-h3", "hard", "10 balls have a total mass of 130,000 g. What is the mass of each ball in kg?", "13 kg", ["130 kg", "1.3 kg", "13,000 kg"], "130,000 g ÷ 10 = 13,000 g = 13 kg.", "divide and convert mass"),
] as const;

const capacity = [
  q("capacity-e1", "easy", "Which unit is best for a swimming pool?", "litres (L)", ["millilitres (mL)", "grams (g)", "metres (m)"], "A pool holds a large amount of liquid, so litres are suitable.", "choose a capacity unit"),
  q("capacity-e2", "easy", "1 L = how many mL?", "1,000 mL", ["100 mL", "10 mL", "10,000 mL"], "One litre has 1,000 millilitres.", "litres to millilitres"),
  q("capacity-e3", "easy", "2 L = how many mL?", "2,000 mL", ["200 mL", "20 mL", "200,000 mL"], "2 × 1,000 mL = 2,000 mL.", "litres to millilitres"),
  q("capacity-n1", "normal", "1 L 13 mL = how many mL?", "1,013 mL", ["113 mL", "1,300 mL", "13,000 mL"], "1 L is 1,000 mL, then add 13 mL.", "mixed capacity conversion"),
  q("capacity-n2", "normal", "5,050 mL = ___ L ___ mL.", "5 L 50 mL", ["50 L 5 mL", "5 L 500 mL", "505 L 0 mL"], "5,000 mL is 5 L, leaving 50 mL.", "mixed capacity form"),
  q("capacity-n3", "normal", "Which capacity is greatest?", "2 L", ["1,900 mL", "1 L 950 mL", "1,999 mL"], "2 L is 2,000 mL, which is greatest.", "compare capacity"),
  q("capacity-h1", "hard", "A cow gives 22 L 500 mL of milk daily. How much milk do 10 cows give in litres?", "225 L", ["225,000 L", "22,500 L", "22.5 L"], "22 L 500 mL is 22,500 mL. Multiply by 10, then convert 225,000 mL to 225 L.", "multiply capacity"),
  q("capacity-h2", "hard", "A water purifier cleans 10 L 50 mL each day. How much does it clean in 10 days?", "100 L 500 mL", ["10 L 500 mL", "1,005 L", "105 L"], "10 L 50 mL × 10 = 100 L 500 mL.", "capacity rate"),
  q("capacity-h3", "hard", "Mostafa shares 32 L of soda equally with 7 friends and himself. How much does each person get?", "4 L", ["5 L", "32 L", "3 L"], "There are 8 people. 32 L ÷ 8 = 4 L each.", "divide capacity"),
] as const;

const time = [
  q("time-e1", "easy", "How many days are in 1 week?", "7 days", ["5 days", "24 days", "60 days"], "One week has 7 days.", "weeks to days"),
  q("time-e2", "easy", "How many minutes are in 1 hour?", "60 minutes", ["24 minutes", "100 minutes", "30 minutes"], "One hour has 60 minutes.", "hours to minutes"),
  q("time-e3", "easy", "Which clock phrase means 1:30?", "half past 1", ["quarter past 1", "quarter to 1", "1 o’clock"], "Thirty minutes after 1 is half past 1.", "read a clock"),
  q("time-n1", "normal", "6 minutes 30 seconds = how many seconds?", "390 seconds", ["330 seconds", "630 seconds", "306 seconds"], "6 minutes is 360 seconds. Add 30 seconds.", "minutes and seconds"),
  q("time-n2", "normal", "1 day and 6 hours = how many hours?", "30 hours", ["7 hours", "36 hours", "66 hours"], "One day is 24 hours. 24 + 6 = 30.", "days to hours"),
  q("time-n3", "normal", "1 week and 3 days = how many days?", "10 days", ["8 days", "9 days", "7 days"], "1 week is 7 days. 7 + 3 = 10.", "weeks and days"),
  q("time-h1", "hard", "Adel spends 6 hours at school. How do we calculate this time in minutes?", "multiply 6 by 60", ["add 6 with 60", "multiply 6 by 24", "add 6 with 24"], "There are 60 minutes in an hour, so multiply 6 by 60.", "choose an operation"),
  q("time-h2", "hard", "Samira studies for 30 minutes a day for 8 days. How many hours does she study?", "4 hours", ["240 hours", "8 hours", "30 hours"], "30 × 8 = 240 minutes. 240 minutes = 4 hours.", "multiply and convert time"),
  q("time-h3", "hard", "Which unit is most sensible for the time it takes to blink?", "seconds", ["weeks", "days", "hours"], "A blink is very short, so seconds are sensible.", "choose a time unit"),
] as const;

const elapsed = [
  q("elapsed-e1", "easy", "What time is 35 minutes after 8:25?", "9:00", ["8:50", "9:25", "8:60"], "From 8:25, 35 more minutes lands at 9:00.", "add elapsed time"),
  q("elapsed-e2", "easy", "What time is 25 minutes after 6:34?", "6:59", ["6:09", "7:59", "6:49"], "34 + 25 = 59, so the hour does not change.", "add minutes"),
  q("elapsed-e3", "easy", "The elapsed time from 3:50 A.M. to 7:00 A.M. is…", "3 hr 10 min", ["3 hr 50 min", "4 hr 10 min", "4 hr 50 min"], "3:50 to 4:00 is 10 min, then 3 more hours to 7:00.", "find elapsed time"),
  q("elapsed-n1", "normal", "A swim lasts half an hour each day for 5 days. How many minutes is that?", "150 minutes", ["30 minutes", "120 minutes", "300 minutes"], "Half an hour is 30 minutes. 30 × 5 = 150 minutes.", "repeat elapsed time"),
  q("elapsed-n2", "normal", "A film starts at 2:45 P.M. and ends at 4:20 P.M. How long is it?", "1 hr 35 min", ["1 hr 25 min", "2 hr 35 min", "1 hr 75 min"], "2:45 to 3:45 is 1 hour, then 35 more minutes to 4:20.", "find duration"),
  q("elapsed-n3", "normal", "School begins at 7:40 A.M. After 1 hr 25 min, what time is it?", "9:05 A.M.", ["8:05 A.M.", "9:15 A.M.", "8:65 A.M."], "7:40 + 1 hour is 8:40. Add 25 minutes to get 9:05.", "add hours and minutes"),
  q("elapsed-h1", "hard", "An ant climbs 4 m each day but slides 2 m each night in a 20 m well. How many days does it take to get out?", "9 days", ["10 days", "8 days", "5 days"], "After 8 full days and nights it is at 16 m. On day 9 it climbs to 20 m and gets out before sliding.", "multi-step elapsed problem"),
  q("elapsed-h2", "hard", "A bus leaves at 11:50 A.M. and travels for 2 hr 25 min. When does it arrive?", "2:15 P.M.", ["1:15 P.M.", "2:05 P.M.", "12:15 P.M."], "11:50 + 2 hours is 1:50 P.M. Add 25 minutes to get 2:15 P.M.", "AM PM time addition"),
  q("elapsed-h3", "hard", "A learner studies from 5:35 P.M. to 7:10 P.M. How long is the study time?", "1 hr 35 min", ["1 hr 25 min", "2 hr 35 min", "95 hr"], "5:35 to 6:35 is 1 hour, then 35 minutes to 7:10.", "find AM PM duration"),
] as const;

const addSubtract = [
  q("add-e1", "easy", "Which operation helps find the total mass of two bags?", "addition", ["subtraction", "division", "comparison"], "To find a total, add the two masses.", "choose an operation"),
  q("add-e2", "easy", "8 m + 45 cm = how many cm?", "845 cm", ["53 cm", "8,045 cm", "845 m"], "8 m is 800 cm. 800 + 45 = 845 cm.", "convert then add length"),
  q("add-e3", "easy", "3 L 250 mL − 750 mL = …", "2 L 500 mL", ["3 L 500 mL", "2 L 50 mL", "2,500 L"], "3 L 250 mL is 3,250 mL. Subtract 750 mL to get 2,500 mL.", "subtract capacity"),
  q("add-n1", "normal", "10 books are 8 cm 5 mm high each. What total height do they make?", "85 cm", ["8 cm 50 mm", "800 cm", "85 mm"], "8 cm 5 mm is 85 mm. 85 × 10 = 850 mm = 85 cm.", "multiply converted length"),
  q("add-n2", "normal", "A child has 5 kg 217 g of rice and 3 kg 400 g of sugar. What is the total?", "8 kg 617 g", ["8 kg 517 g", "7 kg 617 g", "8,617 kg"], "Add kilograms and grams separately: 5 + 3 kg and 217 + 400 g.", "add mixed mass"),
  q("add-n3", "normal", "A bottle has 9 L and another has 450 mL. How much capacity is that altogether?", "9 L 450 mL", ["9,450 L", "9 L 45 mL", "450 L"], "The units are already compatible as a mixed capacity value.", "add capacity"),
  q("add-h1", "hard", "A runner walks 1 km 350 m in the morning and 850 m in the evening. How far altogether?", "2 km 200 m", ["1 km 1,200 m", "2 km 20 m", "2,200 km"], "1 km 350 m is 1,350 m. Add 850 m to get 2,200 m = 2 km 200 m.", "multi-step length addition"),
  q("add-h2", "hard", "A recipe needs 2 L 750 mL of juice. There are 1 L 900 mL available. How much more is needed?", "850 mL", ["1 L 850 mL", "950 mL", "850 L"], "2,750 mL − 1,900 mL = 850 mL.", "capacity subtraction"),
  q("add-h3", "hard", "A journey lasts 3 hr 45 min. After 1 hr 20 min, how much time remains?", "2 hr 25 min", ["2 hr 15 min", "4 hr 5 min", "2 hr 65 min"], "Subtract 1 hr 20 min from 3 hr 45 min.", "time subtraction"),
] as const;

const multiplyDivide = [
  q("ops-e1", "easy", "A building is 20 m tall. A bridge is 5 m tall. How many times taller is the building?", "4", ["3", "10", "15"], "20 ÷ 5 = 4.", "divide a length"),
  q("ops-e2", "easy", "A cyclist rides 10 km per day for 5 days. How far does the cyclist ride?", "50 km", ["2 km", "5 km", "5,000 m"], "10 × 5 = 50 kilometres.", "multiply a length"),
  q("ops-e3", "easy", "A water purifier cleans 10 L 50 mL every day for 10 days. Which operation starts the solution?", "multiply", ["subtract", "divide", "compare"], "The amount is repeated every day, so multiply by the number of days.", "choose a repeated-rate operation"),
  q("ops-n1", "normal", "Sami has 25 m of cloth and cuts it into 5 equal pieces. What is each piece?", "5 m", ["4 m", "50 cm", "125 cm"], "25 ÷ 5 = 5 metres.", "divide length"),
  q("ops-n2", "normal", "Mohamed rides 10 km per day. How many metres does he cover in 5 days?", "50,000 m", ["50 m", "5,000 m", "500 m"], "10 km × 5 = 50 km. 50 km is 50,000 m.", "multiply then convert length"),
  q("ops-n3", "normal", "Ayman drinks 500 mL of water 4 times each day. How much is that in one week?", "14 L", ["14,000 L", "2 L", "28 L"], "500 mL × 4 × 7 = 14,000 mL = 14 L.", "capacity rate"),
  q("ops-h1", "hard", "10 cows each give 22 L 500 mL of milk. The milk is bottled in 1 L bottles. How many bottles are needed?", "225 bottles", ["22 bottles", "2,250 bottles", "22,500 bottles"], "22,500 mL × 10 = 225,000 mL = 225 L, so 225 one-litre bottles are needed.", "multi-step capacity division"),
  q("ops-h2", "hard", "10 balls have a total mass of 130,000 g. Each ball has the same mass. What is each mass?", "13 kg", ["130 kg", "1.3 kg", "13,000 kg"], "130,000 g ÷ 10 = 13,000 g = 13 kg.", "divide and convert mass"),
  q("ops-h3", "hard", "An ant walks 3,000 m every day for 5 days. How many kilometres does it walk?", "15 km", ["3 km", "150 km", "15,000 km"], "3,000 m × 5 = 15,000 m = 15 km.", "multiply then convert length"),
] as const;

const master = [
  q("master-1", "easy", "5 kg = 5,000 ___.", "g", ["m", "day", "L"], "1 kg equals 1,000 g, so 5 kg equals 5,000 g.", "mass conversion"),
  q("master-2", "easy", "9 m − 80 cm = ___ cm.", "820 cm", ["10 cm", "100 cm", "820 m"], "9 m is 900 cm. 900 − 80 = 820 cm.", "length subtraction"),
  q("master-3", "easy", "___ L = 17,000 mL.", "17", ["170", "1,700", "170,000"], "17,000 mL ÷ 1,000 = 17 L.", "capacity conversion"),
  q("master-4", "normal", "1 day and 6 hours = ___ hours.", "30", ["7", "66", "36"], "A day is 24 hours. 24 + 6 = 30 hours.", "time conversion"),
  q("master-5", "normal", "The elapsed time from 3:50 A.M. to 7:00 A.M. is…", "3 hr 10 min", ["3 hr 50 min", "4 hr 10 min", "4 hr 50 min"], "Move 10 minutes to 4:00 A.M., then 3 hours to 7:00 A.M.", "elapsed time"),
  q("master-6", "normal", "Which symbol makes 17 ton ___ 7,000 kg true?", ">", ["=", "<", "otherwise"], "17 tons is 17,000 kg, which is greater than 7,000 kg.", "compare mass"),
  q("master-7", "hard", "8 kg 37 g = ___ g.", "8,037 g", ["837 g", "8,370 g", "80,037 g"], "8 kg is 8,000 g. Add 37 g.", "mixed mass"),
  q("master-8", "hard", "8:25 + 35 minutes = …", "9:00", ["8:60", "8:50", "9:25"], "25 + 35 = 60 minutes, so the time becomes 9:00.", "time addition"),
  q("master-9", "hard", "31,310 g = ___ kg ___ g.", "31 kg 310 g", ["3 kg 1,310 g", "31 kg 31 g", "310 kg 31 g"], "31,000 g is 31 kg, leaving 310 g.", "mixed mass form"),
  q("master-10", "hard", "9,000 mL = ___ litres.", "9", ["90", "900", "9,000"], "9,000 mL ÷ 1,000 = 9 L.", "capacity conversion"),
  q("master-11", "hard", "A building is 20 m tall and a bridge is 5 m tall. How many times taller is the building?", "4", ["3", "10", "15"], "20 ÷ 5 = 4.", "application division"),
  q("master-12", "hard", "6,000 kg = ___ ton.", "6", ["60", "600", "0.6"], "Every 1,000 kg makes 1 ton, so 6,000 kg is 6 tons.", "tons conversion"),
] as const;

const ALL = { length, mass, capacity, time, "elapsed-time": elapsed, "add-subtract": addSubtract, "multiply-divide": multiplyDivide, "master-challenge": master } as const;

export function getBubbleQuestions(routeId: BubbleRouteId, level?: BubbleLevelId): BubbleQuestion[] {
  const bank = ALL[routeId] as readonly BubbleQuestion[];
  return routeId === "master-challenge" || !level ? [...bank] : bank.filter((question) => question.level === level);
}

export const BUBBLE_QUESTION_BANK = ALL;
