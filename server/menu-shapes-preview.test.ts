import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";

const hubSource = readFileSync(resolve(process.cwd(), "client/src/components/MosyHub.tsx"), "utf8");
const hubStyles = readFileSync(resolve(process.cwd(), "client/src/components/mosyHub.css"), "utf8");

it("renders a glass 3D solid alongside clear 2D glass tokens", () => {
  expect(hubSource).toContain("mosy-shapes-cube");
  expect(hubSource).toContain("mosy-glass-triangle");
  expect(hubSource).toContain("mosy-glass-hexagon");
  expect(hubStyles).toContain("mosyGlassSolidFloat");
  expect(hubStyles).toContain("mosy-shapes-cube i:first-child");
});

it("keeps a still alternative for students who prefer reduced motion", () => {
  expect(hubStyles).toContain("@media(prefers-reduced-motion:reduce)");
  expect(hubStyles).toContain(".mosy-shapes-cube,.mosy-shapes-light-field,.mosy-shapes-orb");
});
