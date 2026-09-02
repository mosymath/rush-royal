import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("/home/ubuntu/round-rush-rounding-quest/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto("http://127.0.0.1:3000/?world=shapes", { waitUntil: "networkidle" });
  const ambientLights = await page.locator(".shapes-motion-light").count();
  if (ambientLights !== 8) throw new Error(`Expected 8 ambient Shape Studio lights, found ${ambientLights}.`);
  const lightAnimation = await page.locator(".shapes-motion-light").first().evaluate((node) => getComputedStyle(node).animationName);
  const heroAnimation = await page.locator(".shapes-hero-cube").evaluate((node) => getComputedStyle(node).animationName);
  if (lightAnimation === "none" || heroAnimation === "none") throw new Error(`Expected active Shape Studio motion, received light=${lightAnimation}, hero=${heroAnimation}.`);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  const reducedLightAnimation = await page.locator(".shapes-motion-light").first().evaluate((node) => getComputedStyle(node).animationName);
  const reducedHeroAnimation = await page.locator(".shapes-hero-cube").evaluate((node) => getComputedStyle(node).animationName);
  if (reducedLightAnimation !== "none" || reducedHeroAnimation !== "none") throw new Error(`Reduced-motion styles were not applied: light=${reducedLightAnimation}, hero=${reducedHeroAnimation}.`);
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  await mobilePage.goto("http://127.0.0.1:3000/?world=shapes", { waitUntil: "networkidle" });
  const mobileLights = await mobilePage.locator(".shapes-motion-light").count();
  const mobileLightAnimation = await mobilePage.locator(".shapes-motion-light").first().evaluate((node) => getComputedStyle(node).animationName);
  if (mobileLights !== 8 || mobileLightAnimation === "none") throw new Error(`Mobile Shape Studio motion is not active: lights=${mobileLights}, animation=${mobileLightAnimation}.`);
  const welcomeLayout = await mobilePage.evaluate(() => {
    const bounds = (selector) => Array.from(document.querySelectorAll(selector)).map((node) => { const rect = node.getBoundingClientRect(); return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom }; });
    return { width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth, lights: bounds(".shapes-motion-light"), doors: bounds(".shapes-world-door"), hero: bounds(".shapes-hero-stage") };
  });
  const outside = (rect) => rect.left < -4 || rect.right > welcomeLayout.width + 4 || rect.top < -12;
  if (welcomeLayout.scrollWidth > welcomeLayout.width + 2 || [...welcomeLayout.lights, ...welcomeLayout.doors, ...welcomeLayout.hero].some(outside)) throw new Error(`Animated Shape Studio welcome layout overflowed at phone width: ${JSON.stringify(welcomeLayout)}`);
  await mobilePage.goto("http://127.0.0.1:3000/?world=shapes&shapes=play&demo=1", { waitUntil: "networkidle" });
  await mobilePage.locator(".shapes-feedback").waitFor();
  const rewardLayout = await mobilePage.evaluate(() => {
    const select = (selector) => { const node = document.querySelector(selector); if (!node) return null; const rect = node.getBoundingClientRect(); return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom }; };
    return { width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth, hud: select(".shapes-play-hud"), feedback: select(".shapes-feedback"), lights: Array.from(document.querySelectorAll(".shapes-motion-light")).map((node) => { const rect = node.getBoundingClientRect(); return { left: rect.left, right: rect.right }; }) };
  });
  const outsideHorizontal = (rect) => !rect || rect.left < -4 || rect.right > rewardLayout.width + 4;
  if (rewardLayout.scrollWidth > rewardLayout.width + 2 || outsideHorizontal(rewardLayout.hud) || outsideHorizontal(rewardLayout.feedback) || rewardLayout.lights.some(outsideHorizontal)) throw new Error(`Animated Shape Quest layout overflowed at phone width: ${JSON.stringify(rewardLayout)}`);
  await mobilePage.emulateMedia({ reducedMotion: "reduce" });
  await mobilePage.reload({ waitUntil: "networkidle" });
  const mobileReducedLightAnimation = await mobilePage.locator(".shapes-motion-light").first().evaluate((node) => getComputedStyle(node).animationName);
  if (mobileReducedLightAnimation !== "none") throw new Error(`Mobile reduced-motion styles were not applied: ${mobileReducedLightAnimation}.`);
  await mobilePage.close();
  console.log(JSON.stringify({ shapeMotionPass: true, ambientLights, activeLightAnimation: lightAnimation, activeHeroAnimation: heroAnimation, reducedMotionVerified: true, mobileMotionVerified: true, mobileLayoutBoundsVerified: true }));
} finally {
  await browser.close();
}
