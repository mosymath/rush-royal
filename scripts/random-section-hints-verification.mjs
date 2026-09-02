import { chromium } from "playwright";

const baseUrl = "https://3000-iflq9uz50dt28lfjtcm3p-a6a715a0.us3.manus.computer";
const factors = { TEN: 10, HUNDRED: 100, THOUSAND: 1000, "TEN THOUSAND": 10000, "HUNDRED THOUSAND": 100000, MILLION: 1000000 };
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

async function currentAnswer() {
  const prompt = (await page.locator(".rr-question-plaque h2").textContent())?.replace(/\s+/g, " ").trim() ?? "";
  const place = (await page.locator(".rr-route-mark strong").textContent())?.replace(/Nearest\s*/i, "").replace(/\s+/g, " ").trim().toUpperCase();
  const factor = factors[place];
  const number = prompt.match(/Round ([\d,]+)/i)?.[1];
  if (!number || !factor) throw new Error(`Unable to resolve a direct Random Mix answer: ${prompt} / ${place}`);
  return Math.round(Number(number.replaceAll(",", "")) / factor) * factor;
}

try {
  await page.goto(`${baseUrl}/?screen=menu`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".mosy-menu", { timeout: 10000 });
  await page.getByRole("button", { name: /^Random Mix/ }).click();
  await page.getByRole("button", { name: /PLAY RANDOM MIX/ }).click();
  await page.waitForSelector(".rr-play", { timeout: 10000 });

  const seen = new Set();
  const records = [];
  for (let index = 0; index < 10; index += 1) {
    const place = (await page.locator(".rr-route-mark strong").textContent())?.replace(/Nearest\s*/i, "").replace(/\s+/g, " ").trim();
    const shown = await page.locator(".rr-game-shell").evaluate((element) => element.classList.contains("has-rounding-hints"));
    const firstAtPlace = !seen.has(place);
    records.push({ place, hint: shown ? "shown" : "hidden", firstAtPlace });
    if (shown !== firstAtPlace) throw new Error(`Unexpected section hint state: ${JSON.stringify(records)}`);
    seen.add(place);
    if (index === 9) break;
    const answer = await currentAnswer();
    await page.getByRole("button", { name: new RegExp(`Choice \\d, ${answer.toLocaleString()}`) }).click();
    await page.locator(".rr-feedback").waitFor();
    await page.locator(".rr-feedback button").click();
    await page.waitForTimeout(120);
  }

  if (!records.some((record) => !record.firstAtPlace)) throw new Error(`No rounding place repeated in Random Mix: ${JSON.stringify(records)}`);
  console.log(JSON.stringify({ randomSectionHintPass: true, records }));
} finally {
  await browser.close();
}
