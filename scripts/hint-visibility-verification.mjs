import { chromium } from "playwright";

const baseUrl = "https://3000-iflq9uz50dt28lfjtcm3p-a6a715a0.us3.manus.computer";
const factors = { TEN: 10, HUNDRED: 100, THOUSAND: 1000, "TEN THOUSAND": 10000, "HUNDRED THOUSAND": 100000, MILLION: 1000000 };
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

async function openLibrary() {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.setItem("mosy-math-round-rush-unlocked-level", "3"));
  await page.goto(`${baseUrl}/?screen=menu`, { waitUntil: "networkidle" });
}

async function advanceToSecondQuestion() {
  await page.locator('button[aria-label^="Choice"]').first().click();
  await page.locator(".rr-feedback").waitFor();
  await page.locator(".rr-feedback button").click();
  await page.waitForFunction(() => document.querySelector(".rr-game-shell")?.classList.contains("no-rounding-hints") || document.querySelector(".rr-game-shell")?.classList.contains("has-rounding-hints"));
  await page.waitForTimeout(80);
}

async function hintClass() {
  return page.locator(".rr-game-shell").evaluate((element) => element.classList.contains("has-rounding-hints") ? "shown" : "hidden");
}

async function answerCurrentQuestionCorrectly() {
  const prompt = (await page.locator(".rr-question-plaque h2").textContent())?.replace(/\s+/g, " ").trim() ?? "";
  const placeText = (await page.locator(".rr-route-mark strong").textContent())?.replace(/Nearest\s*/i, "").replace(/\s+/g, " ").trim().toUpperCase();
  if (!placeText || !(placeText in factors)) throw new Error(`Unknown rounding place: ${placeText}`);
  const factor = factors[placeText];
  const directNumber = prompt.match(/Round ([\d,]+)/i)?.[1];
  const targetResult = prompt.match(/round to ([\d,]+) to the nearest/i)?.[1];
  const answer = directNumber
    ? Math.round(Number(directNumber.replaceAll(",", "")) / factor) * factor
    : targetResult
      ? [...await page.locator('button[aria-label^="Choice"]').allTextContents()].map((text) => Number(text.match(/[\d,]+/)?.[0]?.replaceAll(",", ""))).find((choice) => Math.round(choice / factor) * factor === Number(targetResult.replaceAll(",", "")))
      : undefined;
  if (answer === undefined) throw new Error(`Could not calculate answer for: ${prompt}`);
  await page.getByRole("button", { name: new RegExp(`Choice \\d, ${answer.toLocaleString()}`) }).click();
  await page.locator(".rr-feedback").waitFor();
  await page.locator(".rr-feedback button").click();
}

async function runChallenge(levelName) {
  await openLibrary();
  await page.getByRole("button", { name: /^Challenge/ }).click();
  await page.locator(".mosy-launch-levels button").filter({ hasText: levelName }).click();
  await page.getByRole("button", { name: new RegExp(`PLAY ${levelName.toUpperCase()} LEVEL`) }).click();
  await page.waitForSelector(".rr-play");
  const first = await hintClass();
  await advanceToSecondQuestion();
  const second = await hintClass();
  return { first, second };
}

async function runMode(modeName, launchName) {
  await openLibrary();
  if (modeName) await page.getByRole("button", { name: new RegExp(`^${modeName}`) }).click();
  await page.getByRole("button", { name: new RegExp(launchName) }).click();
  await page.waitForSelector(".rr-play");
  const first = await hintClass();
  await advanceToSecondQuestion();
  const second = await hintClass();
  return { first, second };
}

async function verifyRandomSections() {
  await openLibrary();
  await page.getByRole("button", { name: /^Random Mix/ }).click();
  await page.getByRole("button", { name: /PLAY RANDOM MIX/ }).click();
  await page.waitForSelector(".rr-play");
  const seen = new Set();
  const records = [];
  for (let question = 1; question <= 10; question += 1) {
    const place = (await page.locator(".rr-route-mark strong").textContent())?.replace(/Nearest\s*/i, "").replace(/\s+/g, " ").trim();
    const hint = await hintClass();
    records.push({ place, hint, firstAtPlace: !seen.has(place) });
    if (!seen.has(place) && hint !== "shown") throw new Error(`New Random Mix place did not introduce a hint: ${JSON.stringify(records)}`);
    if (seen.has(place) && hint !== "hidden") throw new Error(`Repeated Random Mix place still showed a hint: ${JSON.stringify(records)}`);
    seen.add(place);
    if (question < 10) await answerCurrentQuestionCorrectly();
  }
  if (records.filter((record) => !record.firstAtPlace).length === 0) throw new Error(`Random Mix did not repeat a place: ${JSON.stringify(records)}`);
  return records;
}

try {
  const easy = await runChallenge("Easy");
  const normal = await runChallenge("Normal");
  const hard = await runChallenge("Hard");
  const route = await runMode(null, "PLAY NEAREST 10");
  const random = await runMode("Random Mix", "PLAY RANDOM MIX");
  const randomSections = await verifyRandomSections();
  const results = { easy, normal, hard, route, random, randomSections };

  if (easy.first !== "shown" || easy.second !== "shown") throw new Error(`Easy hints should remain shown: ${JSON.stringify(results)}`);
  for (const [mode, result] of Object.entries({ normal, hard, route })) {
    if (result.first !== "shown" || result.second !== "hidden") throw new Error(`${mode} hint visibility is incorrect: ${JSON.stringify(results)}`);
  }
  console.log(JSON.stringify({ hintVisibilityPass: true, results }));
} finally {
  await browser.close();
}
