import { chromium } from "playwright";

const baseUrl = "http://127.0.0.1:3000";
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });

const worlds = [
  {
    name: "Bubble Pop",
    url: "/?world=bubble",
    start: page => page.getByRole("button", { name: /PLAY LENGTH/i }).click().then(() => page.getByRole("button", { name: /START EASY/i }).click()),
    grid: ".bp-bubble-arena",
  },
  {
    name: "Unit 4",
    url: "/?world=area&area-route=perimeter",
    start: page => page.getByRole("button", { name: /START EASY/i }).click(),
    grid: ".am-answer-grid",
  },
  {
    name: "Unit 5",
    url: "/?world=multiply&multiply-route=comparison-quest",
    start: page => page.getByRole("button", { name: /START EASY/i }).click(),
    grid: ".am-answer-grid",
  },
  {
    name: "Unit 6",
    url: "/?world=factors&factors-route=factor-trail",
    start: page => page.getByRole("button", { name: /START EASY/i }).click(),
    grid: ".am-answer-grid",
  },
  {
    name: "Unit 7 Part 1",
    url: "/?world=md-part1",
    start: page => page.getByRole("button", { name: /PLAY/i }).first().click().then(() => page.getByRole("button", { name: /START MISSION/i }).click()),
    grid: ".am-answer-grid",
  },
  {
    name: "Unit 7 Part 2",
    url: "/?world=md-part2",
    start: page => page.getByRole("button", { name: /PLAY/i }).first().click().then(() => page.getByRole("button", { name: /START MISSION/i }).click()),
    grid: ".am-answer-grid",
  },
  {
    name: "Unit 8",
    url: "/?world=order",
    start: page => page.getByRole("button", { name: /PLAY/i }).first().click().then(() => page.getByRole("button", { name: /START MISSION/i }).click()),
    grid: ".am-answer-grid",
  },
  {
    name: "Shape Studio",
    url: "/?world=shapes&shapes=play&quest=arcade",
    start: async () => undefined,
    grid: ".shapes-answer-grid",
  },
];

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const findings = {};
  for (const world of worlds) {
    const layouts = new Set();
    for (let launch = 0; launch < 3; launch += 1) {
      await page.goto(`${baseUrl}${world.url}`, { waitUntil: "domcontentloaded" });
      await world.start(page);
      const buttons = page.locator(`${world.grid} > button`);
      await buttons.first().waitFor();
      const answers = await buttons.evaluateAll(elements =>
        elements.map(element =>
          element.querySelector("b")?.textContent?.trim() ??
          element.textContent?.replace(/^\s*\d+\s*/, "").trim() ?? ""
        )
      );
      if (answers.length !== 4 || new Set(answers).size !== 4) {
        throw new Error(`${world.name} did not present four unique answer tiles: ${JSON.stringify(answers)}`);
      }
      layouts.add(answers.join(" | "));
    }
    if (layouts.size < 2) {
      throw new Error(`${world.name} answer tiles stayed in one fixed visible order across launches.`);
    }
    findings[world.name] = layouts.size;
  }
  console.log(JSON.stringify({ allWorldAnswerRandomizationPass: true, layouts: findings }));
} finally {
  await browser.close();
}
