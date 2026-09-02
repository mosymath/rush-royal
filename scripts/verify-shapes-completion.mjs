import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("/home/ubuntu/round-rush-rounding-quest/node_modules/playwright");
const answers = ["Triangle", "Circle", "6", "Square", "Cube", "Sphere", "1", "Cylinder", "6", "Octagon", "4", "A rectangle is 2D", "Rhombus", "10", "Hemisphere", "10", "Torus", "Trapezoid"];
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

try {
  await page.goto("http://127.0.0.1:3000/?world=shapes&shapes=play", { waitUntil: "networkidle" });
  for (let index = 0; index < answers.length; index += 1) {
    const choiceIndex = await page.locator(".shapes-answer-grid button").evaluateAll((buttons, answer) => buttons.findIndex((button) => button.textContent?.trim().endsWith(answer)), answers[index]);
    if (choiceIndex < 0) throw new Error(`The expected answer choice was not rendered: ${answers[index]}`);
    await page.locator(".shapes-answer-grid button").nth(choiceIndex).click();
    await page.getByText("Shape Star unlocked!").waitFor();
    await page.getByRole("button", { name: index === answers.length - 1 ? "CLAIM REWARD" : "NEXT MISSION" }).click();
  }
  await page.getByRole("heading", { name: "You made the worlds glow!" }).waitFor();
  const stats = (await page.locator(".shapes-result-stats").textContent())?.replace(/\s+/g, " ").trim() ?? "";
  if (!stats.includes("MISSIONS18") || !stats.includes("HEARTS5")) throw new Error(`Unexpected Shapes completion stats: ${stats}`);
  console.log(JSON.stringify({ shapesCompletionPass: true, stats }));
} finally {
  await browser.close();
}
