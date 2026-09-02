import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("/home/ubuntu/round-rush-rounding-quest/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

try {
  await page.goto("http://127.0.0.1:3000/?world=shapes", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /2D SHAPE ARCADE/ }).click();
  await page.getByRole("heading", { name: "2D SHAPE ARCADE" }).waitFor();
  await page.getByRole("button", { name: "Decagon" }).click();
  await page.getByText("10 STRAIGHT SIDES").waitFor();
  await page.getByRole("button", { name: /PLAY TOKEN TRAIL/ }).last().click();
  await page.getByRole("heading", { name: "TOKEN TRAIL" }).waitFor();
  await page.getByText("MISSION 1 / 51").waitFor();
  await page.locator(".shapes-answer-grid button").filter({ hasText: "Circle" }).click();
  await page.getByText("Perfect! Token captured! +1 token").waitFor();
  await page.getByRole("button", { name: "MAIN MENU" }).click();
  await page.getByRole("button", { name: /PLAY QUEST/ }).click();
  await page.getByRole("heading", { name: "CHOOSE YOUR QUEST WORLD" }).waitFor();
  if (await page.locator(".shapes-play-selector .shapes-orbit-dot").count() !== 4) throw new Error("The phone Play Quest selector does not show both two-dot orbits.");
  await page.getByRole("button", { name: /2D TOKEN TRAIL/ }).click();
  await page.getByRole("heading", { name: "TOKEN TRAIL" }).waitFor();
  await page.getByText("MISSION 1 / 51").waitFor();
  await page.getByRole("button", { name: "MAIN MENU" }).click();
  await page.getByRole("button", { name: /PLAY QUEST/ }).click();
  await page.getByRole("heading", { name: "CHOOSE YOUR QUEST WORLD" }).waitFor();
  await page.getByRole("button", { name: /3D GALAXY QUEST/ }).click();
  await page.getByRole("heading", { name: "GALAXY QUEST" }).waitFor();
  await page.getByRole("button", { name: "MAIN MENU" }).click();
  await page.getByRole("button", { name: /LEARN SHAPES/ }).click();
  await page.getByRole("heading", { name: "CHOOSE YOUR SHAPE WORLD" }).waitFor();
  if (await page.locator(".shapes-learn-world-choice .shapes-orbit-dot").count() !== 4) throw new Error("The phone Learn Shapes selector does not show both two-dot orbits.");
  await page.getByRole("button", { name: /3D SHAPES/ }).click();
  await page.getByRole("heading", { name: "3D SHAPE GALAXY" }).waitFor();
  const canvas = page.locator("canvas.shapes-studio-canvas");
  await canvas.waitFor();
  const box = await canvas.boundingBox();
  if (!box) throw new Error("Mobile Shape Galaxy canvas is not visible.");
  for (let swipe = 0; swipe < 2; swipe += 1) {
    const startX = box.x + box.width * 0.08;
    const endX = box.x + box.width * 0.92;
    await canvas.dispatchEvent("pointerdown", { pointerType: "touch", pointerId: 11 + swipe, clientX: startX, clientY: box.y + box.height * 0.5, bubbles: true });
    await canvas.dispatchEvent("pointermove", { pointerType: "touch", pointerId: 11 + swipe, clientX: endX, clientY: box.y + box.height * 0.42, bubbles: true });
    await canvas.dispatchEvent("pointerup", { pointerType: "touch", pointerId: 11 + swipe, clientX: endX, clientY: box.y + box.height * 0.42, bubbles: true });
  }
  if (await canvas.getAttribute("data-touch-orbit") !== "true") throw new Error("Touch orbit was not accepted by the 3D viewer.");
  const touchOrbitRadians = Number(await canvas.getAttribute("data-orbit-radians"));
  if (touchOrbitRadians < Math.PI * 2) throw new Error(`Full touch orbit was not reached: ${touchOrbitRadians} radians`);
  const touchCameraRadians = Number(await canvas.getAttribute("data-touch-camera-radians"));
  const cameraAlpha = Number(await canvas.getAttribute("data-camera-alpha"));
  if (touchCameraRadians < Math.PI * 2 || Math.abs(cameraAlpha) < Math.PI * 2) throw new Error(`Actual Babylon camera alpha did not complete a full touch orbit: ${cameraAlpha} radians after ${touchCameraRadians} radians of touch rotation`);
  const cameraBetaAfterForwardOrbit = Number(await canvas.getAttribute("data-camera-beta"));
  await canvas.dispatchEvent("pointerdown", { pointerType: "touch", pointerId: 21, clientX: box.x + box.width * 0.9, clientY: box.y + box.height * 0.54, bubbles: true });
  await canvas.dispatchEvent("pointermove", { pointerType: "touch", pointerId: 21, clientX: box.x + box.width * 0.1, clientY: box.y + box.height * 0.54, bubbles: true });
  await canvas.dispatchEvent("pointerup", { pointerType: "touch", pointerId: 21, clientX: box.x + box.width * 0.1, clientY: box.y + box.height * 0.54, bubbles: true });
  const cameraAlphaAfterReverseOrbit = Number(await canvas.getAttribute("data-camera-alpha"));
  if (cameraAlphaAfterReverseOrbit >= cameraAlpha - Math.PI) throw new Error(`Reverse horizontal touch drag did not rotate the camera back: ${cameraAlpha} to ${cameraAlphaAfterReverseOrbit}.`);
  await canvas.dispatchEvent("pointerdown", { pointerType: "touch", pointerId: 22, clientX: box.x + box.width * 0.5, clientY: box.y + box.height * 0.78, bubbles: true });
  await canvas.dispatchEvent("pointermove", { pointerType: "touch", pointerId: 22, clientX: box.x + box.width * 0.5, clientY: box.y + box.height * 0.22, bubbles: true });
  await canvas.dispatchEvent("pointerup", { pointerType: "touch", pointerId: 22, clientX: box.x + box.width * 0.5, clientY: box.y + box.height * 0.22, bubbles: true });
  const cameraBetaAfterUpwardDrag = Number(await canvas.getAttribute("data-camera-beta"));
  if (cameraBetaAfterUpwardDrag <= cameraBetaAfterForwardOrbit + 0.25) throw new Error(`Upward touch drag did not reveal a higher viewing angle: ${cameraBetaAfterForwardOrbit} to ${cameraBetaAfterUpwardDrag}.`);
  await canvas.dispatchEvent("pointerdown", { pointerType: "touch", pointerId: 23, clientX: box.x + box.width * 0.5, clientY: box.y + box.height * 0.22, bubbles: true });
  await canvas.dispatchEvent("pointermove", { pointerType: "touch", pointerId: 23, clientX: box.x + box.width * 0.5, clientY: box.y + box.height * 0.78, bubbles: true });
  await canvas.dispatchEvent("pointerup", { pointerType: "touch", pointerId: 23, clientX: box.x + box.width * 0.5, clientY: box.y + box.height * 0.78, bubbles: true });
  const cameraBetaAfterDownwardDrag = Number(await canvas.getAttribute("data-camera-beta"));
  if (cameraBetaAfterDownwardDrag >= cameraBetaAfterUpwardDrag - 0.25) throw new Error(`Downward touch drag did not reveal a lower viewing angle: ${cameraBetaAfterUpwardDrag} to ${cameraBetaAfterDownwardDrag}.`);
  await page.getByRole("button", { name: "Rotate shape right" }).click();
  await page.getByRole("button", { name: /RESET VIEW/ }).click();
  await page.getByText(/full 360° orbit/).waitFor();
  await page.getByRole("button", { name: /LAUNCH GALAXY QUEST/ }).last().click();
  await page.getByRole("heading", { name: "GALAXY QUEST" }).waitFor();
  const galaxyAnswers = ["Cube", "Sphere", "1", "Cylinder", "6", "4", "Hemisphere", "10", "Torus"];
  for (let index = 0; index < galaxyAnswers.length; index += 1) {
    const choiceIndex = await page.locator(".shapes-answer-grid button").evaluateAll((buttons, answer) => buttons.findIndex((button) => button.textContent?.trim().endsWith(answer)), galaxyAnswers[index]);
    if (choiceIndex < 0) throw new Error(`Galaxy answer was not rendered: ${galaxyAnswers[index]}`);
    await page.locator(".shapes-answer-grid button").nth(choiceIndex).click();
    await page.getByText("Galaxy spark collected! +1 spark").waitFor();
    await page.getByRole("button", { name: index === galaxyAnswers.length - 1 ? "CLAIM REWARD" : "NEXT MISSION" }).click();
  }
  await page.getByRole("heading", { name: "Galaxy mission complete!" }).waitFor();
  const resultStats = (await page.locator(".shapes-result-stats").textContent())?.replace(/\s+/g, " ").trim() ?? "";
  if (!resultStats.includes("SPARKS9") || !resultStats.includes("MISSIONS9")) throw new Error(`Unexpected Galaxy Quest mobile results: ${resultStats}`);
  await page.locator(".shapes-results-card").getByRole("button", { name: "MAIN MENU" }).click();
  await page.getByRole("heading", { name: "Learning worlds" }).waitFor();
  if (errors.length) throw new Error(`Mobile Shapes errors: ${errors.join(" | ")}`);
  console.log(JSON.stringify({ shapesMobilePass: true, playQuestSelectorMobile: true, directTokenTrailLaunchMobile: true, directGalaxyQuestLaunchMobile: true, tokenTrailTouchFlow: true, full360TouchOrbitVerified: true, reverseHorizontalTouchOrbitVerified: true, upwardAndDownwardTouchTiltVerified: true, orbitButtonAndReset: true, galaxyQuestCompletionAfterTouch: true, navigationVerified: true }));
} finally {
  await browser.close();
}
