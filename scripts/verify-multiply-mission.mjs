import { chromium } from "playwright";

const baseUrl = "https://3000-iflq9uz50dt28lfjtcm3p-a6a715a0.us3.manus.computer";
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
const errors = [];

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

  await page.goto(`${baseUrl}/?world=multiply`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: /Multiply & Conquer/i }).waitFor();
  if (await page.locator(".am-route-grid article").count() !== 7) throw new Error("Multiply & Conquer must show seven lesson missions.");
  if (await page.getByRole("button", { name: /MASTER THE 7 ROUTES/i }).isDisabled() !== true) throw new Error("Multiplication Master Exam should begin locked.");

  await page.goto(`${baseUrl}/?world=multiply&multiply-route=comparison-quest`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /START EASY MISSION/i }).click();
  await page.locator(".am-progress > span").waitFor();
  if ((await page.locator(".am-progress > span").textContent())?.trim() !== "1 / 10") throw new Error("Easy must start a full ten-question multiplication mission.");
  const answer = page.locator(".am-answer-grid button").filter({ hasText: await page.locator(".am-answer-grid button").first().locator("b").textContent() ?? "" }).first();
  await answer.click();
  await page.getByRole("status").waitFor();
  const chapterMusic = await page.locator("audio").evaluate((audio) => !audio.paused);
  if (!chapterMusic) throw new Error("Shared background music did not start after Unit 5 mission launch.");

  await page.evaluate(() => window.localStorage.setItem("mosy-math-multiplication-mission-progress-v1", JSON.stringify({
    "comparison-quest": { unlockedLevel: "hard", completedLevels: ["easy", "normal", "hard"], bestScores: {} },
    "equation-forge": { unlockedLevel: "hard", completedLevels: ["easy", "normal", "hard"], bestScores: {} },
    "equation-rescue": { unlockedLevel: "hard", completedLevels: ["easy", "normal", "hard"], bestScores: {} },
    "property-parade": { unlockedLevel: "hard", completedLevels: ["easy", "normal", "hard"], bestScores: {} },
    "pattern-power": { unlockedLevel: "hard", completedLevels: ["easy", "normal", "hard"], bestScores: {} },
    "grouping-galaxy": { unlockedLevel: "hard", completedLevels: ["easy", "normal", "hard"], bestScores: {} },
    "pattern-launch": { unlockedLevel: "hard", completedLevels: ["easy", "normal", "hard"], bestScores: {} },
  })));
  await page.goto(`${baseUrl}/?world=multiply&multiply-route=multiplication-master-exam`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /START MASTER EXAM/i }).click();
  for (const correctAnswer of ["5", "100", "0", "3 × 5 = 5 × 3", "[3 × 7] × 2 = 3 × [7 × 2]", "75"]) {
    const clicked = await page.locator(".am-answer-grid button").evaluateAll((buttons, answer) => {
      const button = buttons.find((item) => item.querySelector("b")?.textContent?.trim() === answer);
      button?.click();
      return Boolean(button);
    }, correctAnswer);
    if (!clicked) throw new Error(`Master Exam answer token was not found: ${correctAnswer}`);
    await page.waitForTimeout(1800);
  }
  if ((await page.locator(".am-source-labels b").count()) < 1 || !(await page.locator(".am-source-labels").textContent())?.includes("Giza – Abo El-Nomros 23")) throw new Error("A red teacher-source label should be shown on the labeled Unit 5 Master Exam item.");

  await page.evaluate(() => window.localStorage.setItem("mosy-math-multiplication-mission-progress-v1", JSON.stringify({
    "comparison-quest": { unlockedLevel: "hard", completedLevels: ["easy", "normal"], bestScores: {} },
    "equation-forge": { unlockedLevel: "easy", completedLevels: [], bestScores: {} },
    "equation-rescue": { unlockedLevel: "easy", completedLevels: [], bestScores: {} },
    "property-parade": { unlockedLevel: "easy", completedLevels: [], bestScores: {} },
    "pattern-power": { unlockedLevel: "easy", completedLevels: [], bestScores: {} },
    "grouping-galaxy": { unlockedLevel: "easy", completedLevels: [], bestScores: {} },
    "pattern-launch": { unlockedLevel: "easy", completedLevels: [], bestScores: {} },
  })));
  await page.goto(`${baseUrl}/?world=multiply&multiply-route=comparison-quest`, { waitUntil: "networkidle" });
  await page.locator(".am-levels button").nth(2).click();
  await page.getByRole("button", { name: /START HARD MISSION/i }).click();
  if ((await page.locator(".am-progress > span").textContent())?.trim() !== "1 / 10") throw new Error("Hard must start a full ten-question multiplication mission.");

  const mobile = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  await mobile.emulateMedia({ reducedMotion: "reduce" });
  await mobile.goto(`${baseUrl}/?world=multiply`, { waitUntil: "networkidle" });
  const launch = mobile.getByRole("button", { name: /PLAY PATTERN LAUNCH/i });
  const launchBox = await launch.boundingBox();
  if (!launchBox || launchBox.width < 44 || launchBox.height < 44) throw new Error("Pattern Launch mobile control is not touch-friendly.");
  const reducedMotion = await mobile.locator(".am-map-orb").first().evaluate((element) => getComputedStyle(element).animationName);
  if (reducedMotion !== "none") throw new Error("Multiply & Conquer did not disable decorative motion under reduced-motion preference.");
  await mobile.close();

  if (errors.length) throw new Error(`Console errors detected: ${errors.join(" | ")}`);
  console.log(JSON.stringify({ multiplicationMissionPass: true, sevenRoutes: true, tenQuestionsPerLevel: true, lockedMasterExam: true, redExamLabels: true, sharedMusic: true, feedback: true, mobileTouch: true, reducedMotion: true }));
} finally {
  await browser.close();
}
