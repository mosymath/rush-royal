import { chromium } from "playwright";

const baseUrl = "https://3000-iflq9uz50dt28lfjtcm3p-a6a715a0.us3.manus.computer";
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });

try {
  await page.goto(`${baseUrl}/?screen=menu`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".mosy-menu");
  await page.getByRole("button", { name: /PLAY NEAREST 10/ }).click();
  await page.waitForSelector(".rr-play");
  const choices = page.locator('button[aria-label^="Choice"]');
  const labels = await choices.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("aria-label") ?? ""));
  const wrongIndex = labels.findIndex((label) => !label.endsWith(", 420"));
  if (wrongIndex < 0) throw new Error(`Unable to find an intentionally wrong first answer: ${JSON.stringify(labels)}`);
  await choices.nth(wrongIndex).click();
  const panel = page.locator(".rr-feedback.is-wrong");
  await panel.waitFor();
  const box = await panel.boundingBox();
  const content = await panel.textContent();
  const pipBadge = await panel.evaluate((element) => getComputedStyle(element, "::before").content);
  const visible = Boolean(box && box.y >= 0 && box.y + box.height <= 812 && pipBadge.includes("PIP SAYS") && content?.includes("keep going") && content?.includes("Look right"));
  if (!visible) throw new Error(`Phone retry panel is not fully readable: ${JSON.stringify({ box, content })}`);
  console.log(JSON.stringify({ wrongFeedbackMobilePass: true, box, content: content?.replace(/\s+/g, " ").trim() }));
} finally {
  await browser.close();
}
