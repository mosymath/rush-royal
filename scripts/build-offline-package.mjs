import { execFileSync } from "node:child_process";
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const staticAssetsRoot = "/home/ubuntu/webdev-static-assets";
const packageRoot = "/home/ubuntu/MosyMath_Offline_Delivery";
const buildRoot = path.join(projectRoot, "dist", "offline-single");
const sourceRoot = path.join(packageRoot, "MosyMath_Source");
const trustedStorageOrigin = "https://roundrush-lh4ncu65.manus.space";

const mediaEntries = [
  ["astronaut-floating.lottie", "astronaut-floating_5009485d.lottie"],
  ["mosy-avatar-reference.png", "mosy-avatar-reference_14386445.png"],
  ["mosy-avatar-orbit.png", "mosy-avatar-orbit_2f3d9017.png"],
  ["mosy-avatar-comet.png", "mosy-avatar-comet_c2c2827a.png"],
  ["mosy-avatar-spark.png", "mosy-avatar-spark_b0707add.png"],
  ["mosy-avatar-aurora.png", "mosy-avatar-aurora_8fbaeae3.png"],
  ["mosy-avatar-galaxy.png", "mosy-avatar-galaxy_431bc9fd.png"],
  ["mosy-avatar-solar.png", "mosy-avatar-solar_095fc0fd.png"],
  ["mosy-avatar-nova.png", "mosy-avatar-nova_1a66ea72.png"],
  ["bubble-pop-icons/bubbles.json", "bubbles_93705305.json"],
  ["bubble-pop-icons/clap.json", "clap_0b61e1e4.json"],
  ["bubble-pop-icons/coin.json", "coin_6f0b57ca.json"],
  ["bubble-pop-icons/comet.json", "comet_d6399d3b.json"],
  ["bubble-pop-icons/confetti-ball.json", "confetti-ball_24abaecf.json"],
  ["bubble-pop-icons/confetti.json", "confetti_3a4458d5.json"],
  ["bubble-pop-icons/crystal-ball.json", "crystal-ball_caa07fa6.json"],
  ["bubble-pop-icons/gem-stone.json", "gem-stone_ec7df8a2.json"],
  ["bubble-pop-icons/planet.json", "planet_d46f3b64.json"],
  ["bubble-pop-icons/warning.json", "warning_6d5118cd.json"],
  ["bubble-pop-icons/wrapped-gift.json", "wrapped-gift_583fd0c9.json"],
  ["bubble-pop-route-icons/ruler.json", "ruler_b38abce0.json"],
  ["bubble-pop-route-icons/scale.json", "scale_ad8b1c6c.json"],
  ["bubble-pop-route-icons/bottle.json", "bottle_45eb9433.json"],
  ["bubble-pop-route-icons/clock.json", "clock_5c3c8e80.json"],
  ["bubble-pop-route-icons/stopwatch.json", "stopwatch_3cfb6d59.json"],
  ["bubble-pop-route-icons/calculator.json", "calculator_24c4bc67.json"],
  ["bubble-pop-route-icons/abacus.json", "abacus_363f759e.json"],
  ["bubble-pop-master-challenge-crest.png", "bubble-pop-master-challenge-crest_d24830b0.png"],
  ["bubble-pop-measurement-chapter-crest.png", "bubble-pop-measurement-chapter-crest_1743656d.png"],
  ["mission-explore-area-unit4-visual-target.png", "mission-explore-area-unit4-visual-target_13331744.png"],
  ["multiplication-tables-visual-target.png", "multiplication-tables-visual-target_862e74dc.png"],
  ["mosy-math-round-rush-background.wav", "mosy-math-round-rush-background_f189fba7.wav"],
  ["mosy-perfect.wav", "mosy-perfect_efd04be5.wav"],
  ["mosy-well-done.wav", "mosy-well-done_591d5a0f.wav"],
  ["mosy-brilliant.wav", "mosy-brilliant_4f1568f4.wav"],
  ["mosy-on-a-roll.wav", "mosy-on-a-roll_dcb0b07e.wav"],
  ["mosy-keep-going-bright.mp3", "mosy-keep-going-bright_69bc9001.mp3"],
  ["mosy-you-were-close-bright.mp3", "mosy-you-were-close-bright_fe36bd04.mp3"],
  ["mosy-try-again-bright.mp3", "mosy-try-again-bright_57fa3da7.mp3"],
  ["mosy-almost-there-bright.mp3", "mosy-almost-there-bright_7501efe7.mp3"],
];

const sourceIgnore = new Set(["node_modules", ".git", "dist", ".manus-logs", "coverage"]);

const mimeType = (filename) => {
  const extension = path.extname(filename).toLowerCase();
  return ({ ".json": "application/json", ".lottie": "application/octet-stream", ".png": "image/png", ".mp3": "audio/mpeg", ".wav": "audio/wav", ".wasm": "application/wasm" })[extension] ?? "application/octet-stream";
};

const dataUrl = async (filename) => {
  const bytes = await readFile(filename);
  return `data:${mimeType(filename)};base64,${bytes.toString("base64")}`;
};

/** The delivery source folder is resettable; restore only this app's known persisted assets when required. */
const storageDataUrl = async (localName, storageName) => {
  const localPath = path.join(staticAssetsRoot, localName);
  try {
    return await dataUrl(localPath);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
    const response = await fetch(`${trustedStorageOrigin}/manus-storage/${storageName}`);
    if (!response.ok) throw new Error(`Could not restore offline media ${storageName}: ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    await mkdir(path.dirname(localPath), { recursive: true });
    await writeFile(localPath, bytes);
    return `data:${mimeType(localPath)};base64,${bytes.toString("base64")}`;
  }
};

const localDotLottieWasm = async () => {
  const target = path.join(staticAssetsRoot, "dotlottie-player.wasm");
  try {
    return await dataUrl(target);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
    const pnpmRoot = path.join(projectRoot, "node_modules", ".pnpm");
    const dotLottiePackage = (await readdir(pnpmRoot)).find((entry) => entry.startsWith("@lottiefiles+dotlottie-web@"));
    if (!dotLottiePackage) throw new Error("The installed DotLottie WebAssembly package was not available for offline delivery.");
    const wasm = await readFile(path.join(pnpmRoot, dotLottiePackage, "node_modules", "@lottiefiles", "dotlottie-web", "dist", "dotlottie-player.wasm"));
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, wasm);
    return `data:application/wasm;base64,${wasm.toString("base64")}`;
  }
};

const localPathFromBuildReference = (reference) => path.join(buildRoot, reference.replace(/^\.\//, "").replace(/^\//, ""));

const inlineBuildAssets = async () => {
  let html = await readFile(path.join(buildRoot, "index.html"), "utf8");
  html = html
    .replace(/\s*<link[^>]+fonts\.googleapis\.com[^>]*>/gi, "")
    .replace(/\s*<link[^>]+fonts\.gstatic\.com[^>]*>/gi, "")
    .replace(/\s*<link[^>]+rel=["']icon["'][^>]*>/gi, "")
    .replace(/\s*<script[^>]+umami[^>]*><\/script>/gi, "");

  const cssLinks = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+\.css)["'][^>]*>/gi)];
  for (const [tag, reference] of cssLinks) {
    const css = await readFile(localPathFromBuildReference(reference), "utf8");
    html = html.replace(tag, `<style>${css}</style>`);
  }

  const scriptMatch = html.match(/<script\s+type=["']module["'][^>]+src=["']([^"']+\.js)["'][^>]*><\/script>/i);
  if (!scriptMatch) throw new Error("The offline build did not produce a module entry script.");
  let script = await readFile(localPathFromBuildReference(scriptMatch[1]), "utf8");
  for (const [localName, storageName] of mediaEntries) {
    const encoded = await storageDataUrl(localName, storageName);
    script = script.replaceAll(`/manus-storage/${storageName}`, encoded);
  }
  // The production bundle contains diagnostic strings with literal </script> text.
  // Encode the opening character in those strings so HTML parsing cannot terminate
  // the inlined module early while preserving the runtime string value.
  script = script.replace(/<\/script/gi, "\\x3C/script");
  const offlineWasm = await localDotLottieWasm();
  html = html.replace(scriptMatch[0], () => `<script>window.__MOSY_DOTLOTTIE_WASM_URL__=${JSON.stringify(offlineWasm)};</script><script type="module">${script}</script>`);
  return html;
};

const copySourceTree = async () => {
  await cp(projectRoot, sourceRoot, {
    recursive: true,
    filter: (source) => !source.split(path.sep).some((part) => sourceIgnore.has(part)),
  });
  await cp(staticAssetsRoot, path.join(sourceRoot, "offline-media"), { recursive: true });
};

if (process.env.SKIP_CLIENT_BUILD !== "1") {
  execFileSync("pnpm", ["exec", "vite", "build", "--config", "scripts/offline-vite.config.mjs"], { cwd: projectRoot, stdio: "inherit" });
}

await rm(packageRoot, { recursive: true, force: true });
await mkdir(packageRoot, { recursive: true });

const offlineHtml = await inlineBuildAssets();
const offlineHtmlPath = path.join(packageRoot, "MosyMath_Complete_Offline.html");
await writeFile(offlineHtmlPath, offlineHtml, "utf8");
await copySourceTree();

const readme = `# Mosy Math — Complete Offline Delivery\n\nOpen **MosyMath_Complete_Offline.html** directly in Chrome, Edge, Firefox, or Safari. No web server, account, or hosted Manus address is required.\n\nThe offline HTML embeds the complete Mosy Math app, including Round Rush, Shape Studio, Bubble Pop, all question banks, background music, correct/wrong-answer voice clips, Lottie animations, and Bubble Pop crests. Browser sound rules mean that music begins after the player presses Start, which is normal for offline browser games.\n\nThe **MosyMath_Source** folder contains the complete editable React/TypeScript project, its package files, tests, build scripts, and a copy of all original media in **offline-media**. To edit the source later, install Node.js 22+, run \`pnpm install\`, then \`pnpm dev\`.\n`;
await writeFile(path.join(packageRoot, "README.md"), readme, "utf8");

const sourceArchivePath = path.join(packageRoot, "MosyMath_Complete_Source_and_Offline.zip");
execFileSync("zip", ["-qr", sourceArchivePath, "MosyMath_Complete_Offline.html", "README.md", "MosyMath_Source"], { cwd: packageRoot, stdio: "inherit" });

const htmlSize = (await stat(offlineHtmlPath)).size;
const archiveSize = (await stat(sourceArchivePath)).size;
const packageFiles = await readdir(packageRoot);
console.log(JSON.stringify({ packageRoot, packageFiles, htmlSize, archiveSize, embeddedMedia: mediaEntries.length }));
