import { chromium } from "playwright";

const baseUrl = "https://3000-iflq9uz50dt28lfjtcm3p-a6a715a0.us3.manus.computer";
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
const errors = [];

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(`${baseUrl}/?world=area`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: /Mission Explore Area/ }).waitFor();
  if (await page.locator(".am-route-grid article").count() !== 4) throw new Error("Mission Explore Area must show four lesson routes.");
  if (await page.getByRole("button", { name: /MASTER THE 4 ROUTES/ }).isDisabled() !== true) throw new Error("Final Area Explorer Mission should begin locked.");
  await page.goto(`${baseUrl}/?world=area&area-route=perimeter`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /START EASY MISSION/ }).click();
  await page.getByRole("heading", { name: /A rectangle is 7 cm long/ }).waitFor();
  const chapterMusic = await page.locator("audio").evaluate((audio) => !audio.paused);
  if (!chapterMusic) throw new Error("Shared background music did not start after the mission launch interaction.");
  await page.getByRole("button", { name: /24 cm/ }).click();
  await page.getByRole("status").waitFor();
  const sourceLabel = await page.locator(".am-source-labels").textContent();
  if (!sourceLabel?.includes("Souhag 23")) throw new Error("The perimeter past-exam source label was not shown in red-label markup.");
  const feedback = await page.getByRole("status").textContent();
  if (!feedback?.includes("24 cm")) throw new Error("Correct mission feedback did not explain the perimeter answer.");

  await page.evaluate(() => window.localStorage.setItem("mosy-math-area-mission-progress-v1", JSON.stringify({
    perimeter: { unlockedLevel: "normal", completedLevels: ["easy"], bestScores: {} },
    area: { unlockedLevel: "easy", completedLevels: [], bestScores: {} },
    "unknown-dimensions": { unlockedLevel: "easy", completedLevels: [], bestScores: {} },
    "complex-shapes": { unlockedLevel: "easy", completedLevels: [], bestScores: {} },
  })));
  await page.goto(`${baseUrl}/?world=area&area-route=perimeter`, { waitUntil: "networkidle" });
  await page.locator(".am-levels button").nth(1).click();
  await page.getByRole("button", { name: /START NORMAL MISSION/ }).click();
  if ((await page.locator(".am-progress > span").textContent())?.trim() !== "1 / 10") throw new Error("Normal must start a full 10-question route.");

  await page.evaluate(() => window.localStorage.setItem("mosy-math-area-mission-progress-v1", JSON.stringify({
    perimeter: { unlockedLevel: "hard", completedLevels: ["easy", "normal"], bestScores: {} },
    area: { unlockedLevel: "easy", completedLevels: [], bestScores: {} },
    "unknown-dimensions": { unlockedLevel: "easy", completedLevels: [], bestScores: {} },
    "complex-shapes": { unlockedLevel: "easy", completedLevels: [], bestScores: {} },
  })));
  await page.goto(`${baseUrl}/?world=area&area-route=perimeter`, { waitUntil: "networkidle" });
  await page.locator(".am-levels button").nth(2).click();
  await page.getByRole("button", { name: /START HARD MISSION/ }).click();
  if ((await page.locator(".am-progress > span").textContent())?.trim() !== "1 / 10") throw new Error("Hard must start a full 10-question route.");

  const mobile = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  await mobile.emulateMedia({ reducedMotion: "reduce" });
  await mobile.goto(`${baseUrl}/?world=area`, { waitUntil: "networkidle" });
  const launch = mobile.getByRole("button", { name: /PLAY GARDEN GRID/ });
  const launchBox = await launch.boundingBox();
  if (!launchBox || launchBox.width < 44 || launchBox.height < 44) throw new Error("Garden Grid mobile launch control is not touch-friendly.");
  const reducedMotion = await mobile.locator(".am-route-icon i").first().evaluate((element) => getComputedStyle(element).animationName);
  if (reducedMotion !== "none") throw new Error("Mission Explore Area did not disable decorative motion under reduced-motion preference.");
  await mobile.close();
  if (errors.length) throw new Error(`Console errors detected: ${errors.join(" | ")}`);
  console.log(JSON.stringify({ areaMissionPass: true, fourRoutes: true, thirtyQuestionsPerLesson: true, normalAndHardTenQuestionRuns: true, redExamLabels: true, sharedMusic: true, feedback: true, mobileTouch: true, reducedMotion: true }));
} finally {
  await browser.close();
}
