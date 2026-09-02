import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("/home/ubuntu/round-rush-rounding-quest/node_modules/playwright");
const offlineFile = "/home/ubuntu/MosyMath_Offline_Delivery/MosyMath_Complete_Offline.html";
const externalRequests = [];
const browserErrors = [];
const failedRequests = [];

const assertVisualMediaReady = async (page, label) => {
  await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete));
  const failedImages = await page.locator("img").evaluateAll((images) => images.filter((image) => image.naturalWidth === 0).map((image) => image.getAttribute("alt") || image.getAttribute("src") || "unnamed image"));
  if (failedImages.length) throw new Error(`${label} has broken image sources: ${failedImages.join(", ")}`);
};
const browser = await chromium.launch({
  headless: true,
  executablePath: "/usr/bin/chromium",
  args: ["--allow-file-access-from-files"],
});

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") browserErrors.push(message.text()); });
  page.on("requestfailed", (request) => failedRequests.push(`${request.url()} :: ${request.failure()?.errorText ?? "unknown failure"}`));
  page.on("request", (request) => {
    const url = request.url();
    if (!url.startsWith("file:") && !url.startsWith("data:") && !url.startsWith("blob:")) externalRequests.push(url);
  });

  await page.goto(pathToFileURL(offlineFile).href, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Mosy Math" }).waitFor();
  await page.getByRole("button", { name: /START/ }).click();
  await page.getByRole("heading", { name: "Pick your play spark\." }).waitFor();
  if (await page.getByText("TEACHER CONTROLS").count() !== 0) throw new Error("Offline game unexpectedly exposed backend-only teacher controls.");
  await page.getByRole("textbox", { name: "NICKNAME" }).fill("Offline Star");
  if (await page.locator('.mosy-avatar-grid img[src^="data:image/png;base64,"]').count() !== 8) throw new Error("Offline player setup is missing embedded avatar artwork.");
  if (await page.locator(".mosy-avatar-grid button").count() !== 23) throw new Error("Offline player setup is missing the expanded character choices.");
  await page.getByRole("button", { name: /LET’S PLAY/ }).click();
  await page.getByRole("heading", { name: /Pick your school year/ }).waitFor();
  await page.getByRole("button", { name: "ENTER G4 LIBRARY" }).click();
  await page.getByRole("heading", { name: /Learning worlds/ }).waitFor();
  await assertVisualMediaReady(page, "Offline main menu");
  await page.waitForTimeout(150);
  await page.evaluate(() => window.dispatchEvent(new CustomEvent("mosy:score-award", { detail: { points: 1000, source: "offline-regression", eventId: "offline-profile-award" } })));
  const offlineProfileAfterAward = await page.evaluate(() => JSON.parse(localStorage.getItem("mosy-math-player-profile-v1") ?? "null"));
  if (offlineProfileAfterAward?.totalScore !== 1000) throw new Error(`Offline score award did not persist: ${JSON.stringify(offlineProfileAfterAward)}`);
  await page.getByText("LEVEL UP!").waitFor();
  if (!/Level 2.*Cloud Chaser/.test(await page.locator(".mosy-level-up").innerText())) throw new Error("Offline level-up celebration did not announce the reached player level.");
  if (!/A thousand sparks/.test(await page.locator(".mosy-level-up").innerText())) throw new Error("Offline level-up celebration did not use the Level 2-specific message.");
  await page.waitForTimeout(3_800);
  if (await page.locator(".mosy-level-up").count() !== 0) throw new Error("Offline level-up celebration did not dismiss after its short display.");
  await page.waitForTimeout(100);
  if (!/1,000\s*·\s*LV 2/.test(await page.locator(".mosy-player-badge").innerText())) throw new Error("Offline player badge did not render the saved Level 2 score.");
  await page.evaluate(() => window.dispatchEvent(new CustomEvent("mosy:score-award", { detail: { points: 1000, source: "offline-reward-regression", eventId: "offline-profile-reward-award" } })));
  await page.getByText("LEVEL UP!").waitFor();
  if (!/Level 3.*Star Collector/.test(await page.locator(".mosy-level-up").innerText()) || !/STAR PIN UNLOCKED/.test(await page.locator(".mosy-level-up").innerText())) throw new Error("Offline Level 3 celebration did not show the Star Pin cosmetic reward.");
  if (await page.locator(".mosy-reward-flourish--starburst").count() !== 1) throw new Error("Offline Level 3 celebration did not render the Star Pin visual flourish.");
  await page.waitForTimeout(3_800);
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: /START/ }).click();
  await page.getByRole("heading", { name: /Pick your school year/ }).waitFor();
  await page.getByRole("button", { name: "ENTER G4 LIBRARY" }).click();
  await page.getByRole("heading", { name: /Learning worlds/ }).waitFor();
  if (!/2,000\s*·\s*LV 3/.test(await page.locator(".mosy-player-badge").innerText())) throw new Error("Offline player score and earned reward level did not survive refresh.");
  await page.getByRole("button", { name: /Edit Mosy player profile/ }).click();
  await page.getByRole("heading", { name: "Pick your play spark." }).waitFor();
  const rewardsGallery = page.getByRole("list", { name: "Milestone reward gallery" });
  if (!/Star Pin[\s\S]*UNLOCKED/.test(await rewardsGallery.innerText()) || !/Comet Cape[\s\S]*LEVEL 5/.test(await rewardsGallery.innerText())) throw new Error("Offline rewards gallery did not show earned and upcoming milestone states.");
  const galleryLabels = await rewardsGallery.getByRole("listitem").evaluateAll((items) => items.map((item) => item.getAttribute("aria-label") ?? ""));
  if (!galleryLabels.some((label) => label.includes("starburst flourish preview")) || !galleryLabels.some((label) => label.includes("cometTrail flourish preview")) || !galleryLabels.some((label) => label.includes("orbitRings flourish preview")) || !galleryLabels.some((label) => label.includes("crownRays flourish preview"))) throw new Error("Offline rewards gallery did not expose every reward flourish preview.");
  await page.getByRole("button", { name: "CANCEL" }).click();
  await page.getByRole("heading", { name: /Learning worlds/ }).waitFor();
  const bundledMusic = await page.locator("audio").evaluate((audio) => audio.currentSrc.startsWith("data:audio/wav;base64,"));
  if (!bundledMusic) throw new Error("Offline game background music is not embedded as local data.");
  await page.getByRole("button", { name: /OPEN BALLOON TIMES TOWN/ }).click();
  await page.getByRole("heading", { name: /Count the balloons/ }).waitFor();
  await assertVisualMediaReady(page, "Offline Balloon Times Town welcome");
  await page.getByRole("button", { name: /EXPLORE TABLES/ }).click();
  await page.locator(".tt-equation-ribbon").waitFor();
  await page.locator(".tt-explorer-controls > div").first().locator(".tt-number-row button").nth(3).click();
  if ((await page.locator(".tt-equation-ribbon").innerText()).replace(/\s/g, "") !== "4×3=12") throw new Error("Offline Tables Explorer did not update its exact balloon-group equation.");
  if (await page.locator(".tt-balloon-group").count() !== 4) throw new Error("Offline Tables Explorer did not render the chosen number of balloon groups.");
  await page.getByRole("button", { name: "TIMES TOWN" }).click();
  await page.getByRole("button", { name: /OPEN ARCADE/ }).click();
  await page.locator(".tt-table-select.is-arcade").waitFor();
  if (await page.locator(".tt-master-card.is-locked").count() !== 1) throw new Error("Offline Balloon Arcade master challenge should begin locked until the twelve table routes are cleared.");
  await page.locator(".tt-table-card").first().click();
  await page.locator(".tt-arcade-answers button").first().waitFor();
  if (await page.locator(".tt-arcade-answers button").count() !== 4) throw new Error("Offline Balloon Arcade did not render four fair answer balloons.");
  await page.getByRole("button", { name: "TABLES" }).click();
  await page.getByRole("button", { name: "TIMES TOWN" }).click();
  await page.getByRole("button", { name: /START QUEST/ }).click();
  await page.locator(".tt-table-select.is-choice").waitFor();
  await page.locator(".tt-table-card").first().click();
  await page.locator(".tt-choice-answers button").first().waitFor();
  if (await page.locator(".tt-choice-answers button").count() !== 4) throw new Error("Offline Choice Quest did not render four fair answer cards.");
  await page.getByRole("button", { name: "TABLES" }).click();
  await page.getByRole("button", { name: "TIMES TOWN" }).click();
  await page.getByRole("button", { name: "LIBRARY" }).click();
  await page.getByRole("heading", { name: "Learning worlds" }).waitFor();
  await page.evaluate(() => localStorage.setItem("mosy-math-multiplication-tables-progress-v1", JSON.stringify({ arcadeCompleted: Array.from({ length: 12 }, (_, index) => index + 1), choiceCompleted: Array.from({ length: 12 }, (_, index) => index + 1), arcadeBestScores: {}, choiceBestScores: {} })));
  await page.getByRole("button", { name: /OPEN BALLOON TIMES TOWN/ }).click();
  await page.getByRole("button", { name: /OPEN ARCADE/ }).click();
  await page.locator(".tt-master-card.is-open").waitFor();
  await page.locator(".tt-master-card.is-open").click();
  await page.getByText("ALL-TABLES MASTER").first().waitFor();
  await page.getByRole("button", { name: "TABLES" }).click();
  await page.getByRole("button", { name: "TIMES TOWN" }).click();
  await page.getByRole("button", { name: /START QUEST/ }).click();
  await page.locator(".tt-master-card.is-open").waitFor();
  await page.locator(".tt-master-card.is-open").click();
  await page.getByText("ALL-TABLES MASTER").first().waitFor();
  await page.getByRole("button", { name: "TABLES" }).click();
  await page.getByRole("button", { name: "TIMES TOWN" }).click();
  await page.getByRole("button", { name: "LIBRARY" }).click();
  await page.getByRole("heading", { name: "Learning worlds" }).waitFor();
  await page.getByRole("button", { name: /OPEN BUBBLE POP CHAPTER/ }).click();
  await page.getByRole("heading", { name: "Pop your way through the Measurement chapter\." }).waitFor();
  if (await page.locator(".bp-motion-icon").count() < 18) throw new Error("Offline Bubble Pop chapter is missing its bundled animated icons.");
  await page.waitForFunction(() => document.querySelectorAll(".bp-motion-icon-loading").length === 0);
  await assertVisualMediaReady(page, "Offline Bubble Pop chapter");
  await page.getByRole("button", { name: "MAIN MENU" }).click();
  await page.getByRole("heading", { name: "Learning worlds" }).waitFor();
  await page.getByRole("button", { name: /LEARN SHAPES/ }).click();
  await page.getByRole("heading", { name: "CHOOSE YOUR SHAPE WORLD" }).waitFor();
  await page.getByRole("button", { name: /2D SHAPES/ }).click();
  await page.getByRole("heading", { name: "2D SHAPE ARCADE" }).waitFor();
  if (await page.locator(".shapes-crystal-token").count() !== 1) throw new Error("Offline Shape Studio is missing its bundled 2D glass model.");
  await page.getByRole("button", { name: "MAIN MENU" }).click();
  await page.getByRole("heading", { name: "Learning worlds" }).waitFor();

  const verifyWorldRoute = async (launcher) => {
    await page.getByRole("button", { name: launcher }).click();
    await page.getByRole("button", { name: "MAIN MENU" }).first().waitFor();
    await page.getByRole("button", { name: "MAIN MENU" }).first().click();
    await page.getByRole("heading", { name: "Learning worlds" }).waitFor();
  };

  await verifyWorldRoute(/OPEN MISSION EXPLORE AREA/);
  await verifyWorldRoute(/OPEN MULTIPLY & CONQUER/);
  await verifyWorldRoute(/OPEN FACTORS & MULTIPLES/);
  await verifyWorldRoute(/OPEN UNIT 7.*PART 1/);
  await verifyWorldRoute(/OPEN UNIT 7.*PART 2/);
  await verifyWorldRoute(/OPEN ORDER OF OPERATIONS/);

  await page.getByRole("button", { name: /PLAY NEAREST 10/ }).click();
  await page.locator(".rr-play").waitFor();
  const gameMusic = await page.locator("audio").evaluate((audio) => audio.currentSrc.startsWith("data:audio/wav;base64,"));
  if (!gameMusic) throw new Error("Offline Round Rush background music is not embedded as local data.");
  await page.waitForTimeout(800);
  if (externalRequests.length) throw new Error(`Offline game made external network requests: ${externalRequests.join(" | ")}`);
  if (browserErrors.length) throw new Error(`Offline game browser errors: ${browserErrors.join(" | ")} :: failed requests: ${failedRequests.join(" | ")}`);
  console.log(JSON.stringify({ offlinePackagePass: true, playerProfileSetup: true, savedLevelProgression: true, bundledPlayerAvatars: true, bundledBackgroundMusic: true, balloonTimesTownExplorer: true, balloonArcadeAndChoiceQuest: true, balloonMasterChallenges: true, bubblePopAnimatedIcons: true, shapeStudioLaunch: true, allWorldLaunches: true, roundRushLaunch: true, noExternalNetworkRequests: true }));
} finally {
  await browser.close();
}
