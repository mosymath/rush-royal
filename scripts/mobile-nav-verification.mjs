import { chromium } from "playwright";

const baseUrl = "https://3000-iflq9uz50dt28lfjtcm3p-a6a715a0.us3.manus.computer";
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });

try {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "START" }).click();
  await page.waitForSelector(".mosy-menu");

  const libraryTrack = await page.locator("audio").evaluate((audio) => ({ count: document.querySelectorAll("audio").length, paused: audio.paused, time: audio.currentTime }));
  if (libraryTrack.count !== 1 || libraryTrack.paused) throw new Error("Library music did not start as one active shared track.");

  await page.getByRole("button", { name: /PLAY NEAREST 10/ }).click();
  await page.waitForSelector(".rr-play");
  await page.waitForTimeout(500);
  const gameTrack = await page.locator("audio").evaluate((audio) => ({ count: document.querySelectorAll("audio").length, paused: audio.paused, time: audio.currentTime }));
  if (gameTrack.count !== 1 || gameTrack.paused || gameTrack.time < libraryTrack.time) throw new Error("Shared music did not persist from library to game.");

  await page.getByRole("button", { name: "Turn background music off" }).click();
  const mutedInGame = await page.locator("audio").evaluate((audio) => audio.paused);
  if (!mutedInGame) throw new Error("Game music control did not pause the shared track.");

  await page.getByRole("button", { name: "MAIN MENU" }).click();
  await page.waitForSelector(".mosy-menu");
  const returnedState = await page.locator("audio").evaluate((audio) => ({ paused: audio.paused, label: document.body.innerText.includes("MUSIC OFF") }));
  if (!returnedState.paused || !returnedState.label) throw new Error("Main Menu did not preserve Music Off in the library.");

  await page.evaluate(() => {
    window.__hoverOscillators = 0;
    const originalCreateOscillator = AudioContext.prototype.createOscillator;
    AudioContext.prototype.createOscillator = function (...args) {
      window.__hoverOscillators += 1;
      return originalCreateOscillator.apply(this, args);
    };
  });
  const routeButton = page.getByRole("button", { name: /Rush Route/ });
  const box = await routeButton.boundingBox();
  if (!box) throw new Error("Rush Route tap target is unavailable on mobile.");
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  const touchHoverOscillators = await page.evaluate(() => window.__hoverOscillators);
  if (touchHoverOscillators !== 0) throw new Error("Touch interaction incorrectly emitted a hover cue.");

  await page.evaluate(() => { window.__hoverOscillators = 0; });
  const startScrollY = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 420);
  await page.waitForTimeout(200);
  const scrollResult = await page.evaluate(() => ({ scrollY: window.scrollY, hoverOscillators: window.__hoverOscillators, scrollHeight: document.documentElement.scrollHeight, viewportHeight: window.innerHeight }));
  if (scrollResult.scrollY <= startScrollY || scrollResult.hoverOscillators !== 0) throw new Error(`Phone scroll did not move safely without a hover cue: ${JSON.stringify({ startScrollY, scrollResult })}`);

  console.log(JSON.stringify({ mobilePass: true, libraryTrack, gameTrack, returnedState, touchHoverOscillators, scrollResult }));
} finally {
  await browser.close();
}
