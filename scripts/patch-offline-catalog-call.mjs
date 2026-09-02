import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const assetsDirectory = "/home/ubuntu/RoundRush_Offline/assets";
const bundleName = (await (await import("node:fs/promises")).readdir(assetsDirectory))
  .find((file) => /^index-.*\.js$/.test(file));

if (!bundleName) throw new Error("The offline game bundle was not found.");

const bundlePath = path.join(assetsDirectory, bundleName);
const source = await readFile(bundlePath, "utf8");
const catalogCall = /i=s0\.catalog\.list\.useQuery\(void 0,\{retry:!1\}\)\.data\?\.lessons\.filter\(N=>N\.status==="active"\)\.length\|\|1,/;
const patched = source.replace(catalogCall, "i=1,");

if (patched === source) throw new Error("The expected optional catalog call was not found in the offline bundle.");
await writeFile(bundlePath, patched);
console.log(`Removed the optional hosted catalog request from ${bundleName}.`);
