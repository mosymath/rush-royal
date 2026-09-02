import { chromium } from "playwright";

const baseUrl = "https://3000-iflq9uz50dt28lfjtcm3p-a6a715a0.us3.manus.computer";
const factors = { TEN: 10, HUNDRED: 100, THOUSAND: 1000, "TEN THOUSAND": 10000, "HUNDRED THOUSAND": 100000, MILLION: 1000000 };
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

try {
  await page.goto(`${baseUrl}/?screen=menu`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".mosy-menu");
  await page.getByRole("button", { name: /PLAY NEAREST 10/ }).click();
  await page.waitForSelector(".rr-play");

  const feedback = [];
  for (let index = 0; index < 3; index += 1) {
    const choices = page.locator('button[aria-label^="Choice"]');
    const prompt = (await page.locator(".rr-question-plaque h2").textContent())?.replace(/\s+/g, " ").trim() ?? "";
    const place = (await page.locator(".rr-route-mark strong").textContent())?.replace(/Nearest\s*/i, "").replace(/\s+/g, " ").trim().toUpperCase();
    const number = prompt.match(/Round ([\d,]+)/i)?.[1];
    const factor = factors[place];
    if (!number || !factor) throw new Error(`Unable to calculate a deliberate wrong answer for ${prompt}`);
    const correct = Math.round(Number(number.replaceAll(",", "")) / factor) * factor;
    const choiceValues = await choices.evaluateAll((nodes) => nodes.map((node) => ({ label: node.getAttribute("aria-label") ?? "" })));
    const wrongIndex = choiceValues.findIndex(({ label }) => Number(label.match(/, ([\d,]+)$/)?.[1]?.replaceAll(",", "")) !== correct);
    if (wrongIndex < 0) throw new Error(`No wrong answer pod found for ${prompt}`);
    await choices.nth(wrongIndex).click();
    await page.locator(".rr-feedback.is-wrong").waitFor();
    feedback.push({
      encouragement: (await page.locator(".rr-feedback strong").textContent())?.trim(),
      ruleHint: (await page.locator(".rr-feedback p").textContent())?.trim(),
      audio: await page.locator(".rr-feedback").getAttribute("data-feedback-audio"),
    });
    if (index < 2) await page.locator(".rr-feedback button").click();
    if (index < 2) await page.waitForTimeout(100);
  }

  if (new Set(feedback.map((item) => item.encouragement)).size !== feedback.length) throw new Error(`Wrong-answer encouragement repeated: ${JSON.stringify(feedback)}`);
  if (feedback.some((item) => !item.ruleHint?.includes("Look right"))) throw new Error(`Rounding rule hint is missing: ${JSON.stringify(feedback)}`);
  if (feedback.some((item) => !/^round-rush-recorded-wrong-(keepGoing|youWereClose|tryAgain|almostThere)-bright$/.test(item.audio ?? ""))) throw new Error(`Round Rush refreshed bright wrong-answer motivation clip was not applied: ${JSON.stringify(feedback)}`);
  console.log(JSON.stringify({ wrongEncouragementPass: true, recordedWrongMotivationPass: true, feedback }));
} finally {
  await browser.close();
}
