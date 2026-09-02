import { chromium } from "playwright";

const baseUrl = "https://3000-iflq9uz50dt28lfjtcm3p-a6a715a0.us3.manus.computer";
const factors = { TEN: 10, HUNDRED: 100, THOUSAND: 1000, "TEN THOUSAND": 10000, "HUNDRED THOUSAND": 100000, MILLION: 1000000 };
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

try {
  await page.goto(`${baseUrl}/?screen=menu`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /PLAY NEAREST 10/ }).click();
  await page.waitForSelector(".rr-play");

  const messages = [];
  const audioPaths = [];
  for (let round = 0; round < 4; round += 1) {
    const prompt = await page.locator(".rr-question-plaque h2").textContent();
    const numberMatch = prompt?.match(/Round ([\d,]+)/i);
    const placeText = (await page.locator(".rr-route-mark strong").textContent())?.replace(/Nearest\s*/i, "").replace(/\s+/g, " ").trim().toUpperCase();
    if (!numberMatch || !placeText || !(placeText in factors)) throw new Error(`Could not calculate the route answer for: ${prompt}`);
    const number = Number(numberMatch[1].replaceAll(",", ""));
    const answer = Math.round(number / factors[placeText]) * factors[placeText];
    await page.getByRole("button", { name: new RegExp(`Choice \\d, ${answer.toLocaleString()}`) }).click();
    const feedback = page.locator(".rr-feedback strong");
    await feedback.waitFor();
    messages.push((await feedback.textContent())?.trim());
    audioPaths.push(await page.locator(".rr-feedback").getAttribute("data-feedback-audio"));
    if (round < 3) await page.locator(".rr-feedback button").click();
    if (round < 3) await page.waitForTimeout(100);
  }

  if (messages.some((message, index) => index > 0 && message === messages[index - 1])) throw new Error(`Encouragement repeated consecutively: ${JSON.stringify(messages)}`);
  if (!messages.includes("You are on a roll!")) throw new Error(`Expected the third-answer streak encouragement: ${JSON.stringify(messages)}`);
  if (audioPaths.some((path) => !/^round-rush-recorded-(perfect|wellDone|brilliant|onARoll)$/.test(path ?? ""))) throw new Error(`Round Rush recorded praise audio path was not applied: ${JSON.stringify(audioPaths)}`);
  console.log(JSON.stringify({ motivationRotationPass: true, recordedPraiseAudioPass: true, messages }));
} finally {
  await browser.close();
}
