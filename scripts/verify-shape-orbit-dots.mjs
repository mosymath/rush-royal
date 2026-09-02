import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("/home/ubuntu/round-rush-rounding-quest/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
const views = [
  { name: "2D Shape Arcade", url: "http://127.0.0.1:3000/?world=shapes&shapes=learn2d", selector: ".shapes-2d-model .shapes-orbit-light-system" },
  { name: "3D Shape Galaxy", url: "http://127.0.0.1:3000/?world=shapes&shapes=learn3d", selector: ".shapes-studio-wrap .shapes-orbit-light-system" },
  { name: "Shape Quest", url: "http://127.0.0.1:3000/?world=shapes&shapes=play", selector: ".shapes-question-visual .shapes-orbit-light-system" },
];

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  for (const view of views) {
    await page.goto(view.url, { waitUntil: "networkidle" });
    const system = page.locator(view.selector);
    await system.waitFor();
    const dotCount = await system.locator(".shapes-orbit-dot").count();
    const animationDetails = await system.locator(".shapes-orbit-dot").evaluateAll((nodes) => nodes.map((node) => { const style = getComputedStyle(node); return { name: style.animationName, duration: style.animationDuration, delay: style.animationDelay, path: style.offsetPath }; }));
    const [firstDot, secondDot] = animationDetails;
    if (dotCount !== 2 || animationDetails.some((detail) => detail.name === "none" || !detail.path.includes("ellipse")) || firstDot.name !== secondDot.name || firstDot.duration !== secondDot.duration || firstDot.delay === secondDot.delay || firstDot.path !== secondDot.path) throw new Error(`${view.name} did not render two synchronized dots on one exact ellipse path: ${JSON.stringify({ dotCount, animationDetails })}`);
    const separation = await system.evaluate((node) => { const systemBox = node.getBoundingClientRect(); const dots = Array.from(node.querySelectorAll(".shapes-orbit-dot")).map((dot) => dot.getBoundingClientRect()); const distance = Math.hypot((dots[0].left + dots[0].width / 2) - (dots[1].left + dots[1].width / 2), (dots[0].top + dots[0].height / 2) - (dots[1].top + dots[1].height / 2)); return { distance, minimum: Math.min(systemBox.width, systemBox.height) * 0.35 }; });
    if (separation.distance < separation.minimum) throw new Error(`${view.name} orbit lights converged instead of remaining opposite: ${JSON.stringify(separation)}`);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(views[0].url, { waitUntil: "networkidle" });
  const reducedNames = await page.locator(`${views[0].selector} .shapes-orbit-dot`).evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).animationName));
  if (reducedNames.some((name) => name !== "none")) throw new Error(`Orbit dots did not stop for reduced-motion preference: ${reducedNames.join(", ")}`);
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  for (const view of views) {
    await mobilePage.goto(view.url, { waitUntil: "networkidle" });
    const system = mobilePage.locator(view.selector);
    await system.waitFor();
    const mobileDots = system.locator(".shapes-orbit-dot");
    const mobileCount = await mobileDots.count();
    const mobileAnimationDetails = await mobileDots.evaluateAll((nodes) => nodes.map((node) => { const style = getComputedStyle(node); return { name: style.animationName, duration: style.animationDuration, delay: style.animationDelay, path: style.offsetPath }; }));
    const mobileBounds = await mobileDots.evaluateAll((nodes) => nodes.map((node) => { const rect = node.getBoundingClientRect(); return { left: rect.left, right: rect.right, width: window.innerWidth }; }));
    const mobileSeparation = await system.evaluate((node) => { const systemBox = node.getBoundingClientRect(); const dots = Array.from(node.querySelectorAll(".shapes-orbit-dot")).map((dot) => dot.getBoundingClientRect()); const distance = Math.hypot((dots[0].left + dots[0].width / 2) - (dots[1].left + dots[1].width / 2), (dots[0].top + dots[0].height / 2) - (dots[1].top + dots[1].height / 2)); return { distance, minimum: Math.min(systemBox.width, systemBox.height) * 0.35 }; });
    const [firstMobileDot, secondMobileDot] = mobileAnimationDetails;
    if (mobileCount !== 2 || mobileAnimationDetails.some((detail) => detail.name === "none" || !detail.path.includes("ellipse")) || firstMobileDot.name !== secondMobileDot.name || firstMobileDot.duration !== secondMobileDot.duration || firstMobileDot.delay === secondMobileDot.delay || firstMobileDot.path !== secondMobileDot.path || mobileBounds.some((box) => box.left < -3 || box.right > box.width + 3) || mobileSeparation.distance < mobileSeparation.minimum) throw new Error(`${view.name} mobile orbit dots failed shared-path validation: ${JSON.stringify({ mobileCount, mobileAnimationDetails, mobileBounds, mobileSeparation })}`);
  }
  await mobilePage.emulateMedia({ reducedMotion: "reduce" });
  for (const view of views) {
    await mobilePage.goto(view.url, { waitUntil: "networkidle" });
    const mobileReducedNames = await mobilePage.locator(`${view.selector} .shapes-orbit-dot`).evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).animationName));
    if (mobileReducedNames.some((name) => name !== "none")) throw new Error(`${view.name} mobile orbit dots did not stop for reduced motion: ${mobileReducedNames.join(", ")}`);
  }
  await mobilePage.close();
  console.log(JSON.stringify({ orbitDotPass: true, coveredViews: views.map((view) => view.name), twoDotsPerShapeView: true, reducedMotionVerified: true, mobileOrbitDotsVerified: true }));
} finally {
  await browser.close();
}
