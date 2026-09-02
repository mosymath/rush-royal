import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { MD1_ROUTES } from "../client/src/game/mdPart1Curriculum";
import { getMd1Questions } from "../client/src/game/mdPart1Questions";
import { masterUnlocked, readMd1 } from "../client/src/game/mdPart1Progress";

describe("Unit 7 Part 1 mission", () => {
  it("contains exactly six lesson missions and a 15-question Part 1 Master Challenge", () => {
    expect(MD1_ROUTES.filter((route) => !route.isMaster)).toHaveLength(6);
    expect(getMd1Questions("md1-master")).toHaveLength(15);
    expect(masterUnlocked(readMd1())).toBe(false);
  });
  it("provides ten Easy, Normal, and Hard source-only questions per Part 1 lesson", () => {
    MD1_ROUTES.filter((route) => !route.isMaster).forEach((route) => {
      expect(getMd1Questions(route.id, "easy")).toHaveLength(10);
      expect(getMd1Questions(route.id, "normal")).toHaveLength(10);
      expect(getMd1Questions(route.id, "hard")).toHaveLength(10);
      const questions = ["easy", "normal", "hard"].flatMap((level) => getMd1Questions(route.id, level as "easy" | "normal" | "hard"));
      expect(new Set(questions.map((question) => question.prompt)).size).toBe(30);
    });
  });
  it("keeps four meaningful selectable answers without placeholder text and includes source labels in the Part 1 Master Challenge", () => {
    (["model-masters", "partial-products", "algorithm-arcade", "estimate-station", "zero-zone", "remainder-rally"] as const).flatMap((route) => ["easy", "normal", "hard"].flatMap((level) => getMd1Questions(route, level as "easy" | "normal" | "hard"))).concat(getMd1Questions("md1-master")).forEach((question) => {
      expect(question.choices).toHaveLength(4);
      expect(question.choices).toContain(question.correctChoice);
      expect(question.choices.every((choice) => !/option\s*\d/i.test(choice))).toBe(true);
    });
    expect(getMd1Questions("md1-master").some((question) => question.sourceLabels.length > 0)).toBe(true);
  });
  it("randomizes the mission question order and each question's answer-tile order", () => {
    const gameplay = readFileSync("client/src/components/MdPart1World.tsx", "utf8");
    expect(gameplay).toContain("shuffle(getMd1Questions");
    expect(gameplay).toContain("const orderedChoices = useMemo");
    expect(gameplay).toContain("orderedChoices.map");
  });
  it("uses varied recorded praise and supportive clips after correct and wrong answers", () => {
    const gameplay = readFileSync("client/src/components/MdPart1World.tsx", "utf8");
    expect(gameplay).toContain("roundRushSound.motivate(correctMotivations");
    expect(gameplay).toContain("roundRushSound.motivateWrong(wrongMotivations");
    expect(gameplay).toContain("correctMotivations = [\"perfect\", \"wellDone\", \"onARoll\", \"brilliant\"]");
    expect(gameplay).toContain("wrongMotivations = [\"keepGoing\", \"youWereClose\", \"tryAgain\", \"almostThere\"]");
  });
});
