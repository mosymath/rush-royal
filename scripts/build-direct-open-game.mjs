import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const packageRoot = "/home/ubuntu/RoundRush_Offline";
const assetsRoot = path.join(packageRoot, "assets");
const mediaRoot = path.join(packageRoot, "media");
const output = "/home/ubuntu/RoundRush_FULL_GAME.html";

const names = await readdir(assetsRoot);
const jsName = names.find((name) => /^index-.*\.js$/.test(name));
const cssName = names.find((name) => /^index-.*\.css$/.test(name));
if (!jsName || !cssName) throw new Error("Compiled game JavaScript or CSS is missing.");

const mimeType = (filename) => {
  if (filename.endsWith(".wav")) return "audio/wav";
  if (filename.endsWith(".lottie")) return "application/octet-stream";
  if (filename.endsWith(".wasm")) return "application/wasm";
  if (filename.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
};

const asDataUrl = async (filename) => {
  const bytes = await readFile(filename);
  return `data:${mimeType(filename)};base64,${bytes.toString("base64")}`;
};

let gameScript = await readFile(path.join(assetsRoot, jsName), "utf8");
for (const mediaName of await readdir(mediaRoot)) {
  const dataUrl = await asDataUrl(path.join(mediaRoot, mediaName));
  gameScript = gameScript.replaceAll(`./media/${mediaName}`, dataUrl);
  gameScript = gameScript.replaceAll(`media/${mediaName}`, dataUrl);
}
const lottieWasm = await asDataUrl(path.join(mediaRoot, "dotlottie-player.wasm"));
gameScript = gameScript
  .replaceAll("https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@0.79.2/dist/dotlottie-player.wasm", lottieWasm)
  .replaceAll("https://unpkg.com/@lottiefiles/dotlottie-web@0.79.2/dist/dotlottie-player.wasm", lottieWasm);

const css = await readFile(path.join(assetsRoot, cssName), "utf8");
const icon = await asDataUrl(path.join(packageRoot, "favicon.svg"));
const safeScript = gameScript.replaceAll("</script>", "<\\/script>");

const document = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
  <meta name="theme-color" content="#23325F" />
  <meta name="description" content="Round Rush — a direct-open Mosy Math rounding game." />
  <link rel="icon" type="image/svg+xml" href="${icon}" />
  <title>Round Rush: Rounding Quest</title>
  <style>${css}</style>
</head>
<body>
  <div id="root"></div>
  <script type="module">${safeScript}</script>
</body>
</html>`;

await writeFile(output, document);
console.log(`Created direct-open full game: ${output}`);
