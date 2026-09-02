import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("/home/ubuntu/round-rush-rounding-quest/node_modules/playwright");
const baseUrl = "http://127.0.0.1:3000";
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
const errors = [];

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

  await page.goto(`${baseUrl}/?world=bubble`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Pop your way through the Measurement chapter." }).waitFor();
  if (await page.locator(".bp-route-card").count() !== 7) throw new Error("Bubble Pop chapter must show seven independent lesson cards.");
  if (await page.locator(".bp-motion-icon").count() < 18) throw new Error("Bubble Pop chapter should replace static decorative route and reward symbols with premium motion icons.");
  const routeIconNames = await page.locator(".bp-route-icon .bp-motion-icon").evaluateAll((elements) => elements.map((element) => element.getAttribute("data-icon-name")));
  const expectedRouteIcons = ["ruler", "scale", "bottle", "clock", "stopwatch", "calculator", "abacus"];
  if (routeIconNames.length !== 7 || new Set(routeIconNames).size !== 7 || expectedRouteIcons.some((icon) => !routeIconNames.includes(icon))) throw new Error("Every Bubble Pop lesson must have its own distinct purpose-matched animated route icon.");
  if (!(await page.getByRole("button", { name: /MASTER 0 \/ 7/ }).isDisabled())) throw new Error("Master Chapter Challenge should be locked on a fresh progress state.");

  await page.getByRole("button", { name: /PLAY LENGTH/ }).click();
  await page.getByRole("heading", { name: "Length Bubble Pop" }).waitFor();
  await page.getByRole("button", { name: /START EASY BUBBLES/ }).click();
  await page.getByRole("heading", { name: "Which unit is best for the distance between two cities\?" }).waitFor();
  if (await page.locator(".bp-motion-icon").count() < 3) throw new Error("Bubble Pop gameplay should show animated route, score, and combo icons.");
  const bubbleVisuals = await page.locator(".bp-answer-bubble").evaluateAll((elements) => elements.map((element) => {
    const style = getComputedStyle(element);
    return { duration: style.animationDuration, border: style.borderTopColor, background: style.backgroundImage, backdrop: style.backdropFilter };
  }));
  if (!bubbleVisuals.every((bubble) => Number.parseFloat(bubble.duration) >= 16 && Number.parseFloat(bubble.duration) <= 18) || !bubbleVisuals.some((bubble) => bubble.duration !== "0s")) throw new Error("Bubble Pop answer bubbles should use long continuous smooth-flight loops rather than stepped motion.");
  if (!bubbleVisuals.every((bubble) => bubble.border.includes("255, 255, 255") && bubble.backdrop !== "none") || !bubbleVisuals.some((bubble) => bubble.background.includes("41, 201, 255")) || !bubbleVisuals.some((bubble) => bubble.background.includes("255, 51, 77")) || !bubbleVisuals.some((bubble) => bubble.background.includes("255, 217, 40")) || !bubbleVisuals.some((bubble) => bubble.background.includes("148, 75, 255"))) throw new Error("Bubble Pop answer bubbles do not use the required vibrant happy balloon-glass palette.");
  const travelStart = await page.locator(".bp-answer-bubble").first().evaluate((element) => getComputedStyle(element).transform);
  await page.waitForTimeout(700);
  const travelEnd = await page.locator(".bp-answer-bubble").first().evaluate((element) => getComputedStyle(element).transform);
  if (travelStart === travelEnd) throw new Error("Bubble Pop answer bubbles did not travel around their safe playfield routes.");
  await page.getByRole("button", { name: /metres \(m\)/ }).evaluate((element) => element.click());
  const wrongFeedback = page.locator(".bp-feedback.is-wrong");
  await wrongFeedback.waitFor();
  if (!/^round-rush-recorded-wrong-(keepGoing|youWereClose|tryAgain|almostThere)-bright$/.test(await wrongFeedback.getAttribute("data-feedback-audio") ?? "")) throw new Error("Bubble Pop wrong answers must use the shared bright supportive recorded clips.");
  await wrongFeedback.getByRole("button").click();
  await page.getByRole("heading", { name: "1 m = how many cm\?" }).waitFor();
  await page.getByRole("button", { name: /100 cm/ }).evaluate((element) => element.click());
  const correctFeedback = page.locator(".bp-feedback.is-correct");
  await correctFeedback.waitFor();
  if (!/^round-rush-recorded-(perfect|wellDone|brilliant|onARoll)$/.test(await correctFeedback.getAttribute("data-feedback-audio") ?? "")) throw new Error("Bubble Pop correct answers must use the shared recorded praise clips.");
  const correctBubble = page.locator(".bp-answer-bubble.is-correct");
  if (!(await correctBubble.getAttribute("class"))?.includes("is-correct") || !(await correctBubble.evaluate((element) => getComputedStyle(element).boxShadow.includes("255, 201, 60")))) throw new Error("Bubble Pop correct answers must show the luminous glass strike treatment.");
  const fireworks = page.locator(".bp-pop-confetti");
  await fireworks.waitFor();
  if (await fireworks.locator("i").count() !== 22 || Number.parseFloat(await fireworks.locator("i").nth(0).evaluate((element) => getComputedStyle(element).animationDuration)) < 1.4) throw new Error("Bubble Pop correct answers must show a long, energetic fireworks burst.");
  await page.getByRole("button", { name: "CHAPTER" }).click();
  await page.getByRole("heading", { name: "Choose a Bubble Pop route" }).waitFor();

  await page.goto(`${baseUrl}/?world=bubble&route=length&demo`, { waitUntil: "networkidle" });
  await page.locator(".bp-answer-bubble").first().waitFor();
  if (await page.locator(".bp-answer-bubble").count() !== 4) throw new Error("Direct Bubble Pop demo must render four answer bubbles.");

  const phone = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await phone.goto(`${baseUrl}/?world=bubble&route=length&demo`, { waitUntil: "networkidle" });
  const mobileBubbles = phone.locator(".bp-answer-bubble");
  await mobileBubbles.first().waitFor();
  if (await mobileBubbles.count() !== 4) throw new Error("Mobile Bubble Pop playfield must retain four answer bubbles.");
  for (let index = 0; index < 4; index += 1) {
    const box = await mobileBubbles.nth(index).boundingBox();
    if (!box || box.width < 100 || box.height < 100) throw new Error(`Mobile Bubble Pop answer ${index + 1} is not touch-safe.`);
  }
  await phone.close();

  const reduced = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await reduced.emulateMedia({ reducedMotion: "reduce" });
  await reduced.goto(`${baseUrl}/?world=bubble&route=length&demo`, { waitUntil: "networkidle" });
  const animationName = await reduced.locator(".bp-answer-bubble").first().evaluate((element) => getComputedStyle(element).animationName);
  if (animationName !== "none") throw new Error("Bubble Pop answer bubbles should remain still for reduced-motion users.");
  await reduced.locator(".bp-motion-icon").first().waitFor();
  if (await reduced.locator(".bp-motion-icon").first().getAttribute("data-motion") !== "static") throw new Error("Bubble Pop motion icons should use a static reduced-motion fallback.");
  await reduced.close();

  if (errors.length) throw new Error(`Bubble Pop browser errors: ${errors.join(" | ")}`);
  console.log(JSON.stringify({ bubblePopPass: true, sevenLessonCards: true, masterChallengeLocked: true, exactMosyPalette: true, fastBubbleMotion: true, strikeAndFireworks: true, recordedCorrectAudio: true, brightWrongAudio: true, directDemoRoute: true, mobileTouchTargets: true, reducedMotion: true }));
} finally {
  await browser.close();
}
