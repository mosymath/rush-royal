import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto("http://localhost:3000/?world=tables", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /OPEN ARCADE/ }).click();
  await page.screenshot({ path: "/home/ubuntu/screenshots/balloon-table-map-redesign.png", fullPage: true });
  await page.locator(".tt-table-card").first().click();
  await page.locator(".tt-free-balloons .tt-answer-balloon").first().waitFor();
  await page.screenshot({ path: "/home/ubuntu/screenshots/balloon-arcade-redesign.png", fullPage: true });
  console.log("visualScreenshotsPass");
} finally { await browser.close(); }
