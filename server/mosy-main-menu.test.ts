import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const hubSource = readFileSync(resolve(projectRoot, "client/src/components/MosyHub.tsx"), "utf8");
const hubStyles = readFileSync(resolve(projectRoot, "client/src/components/mosyHub.css"), "utf8");
const warmFireflyStyles = readFileSync(resolve(projectRoot, "client/src/components/mosyWarmFireflies.css"), "utf8");

describe("Mosy Math distinct mission-card art", () => {
  it("gives Unit 7 Part 1, Unit 7 Part 2, and Unit 8 independent animated hero treatments", () => {
    expect(hubSource).toContain('className="mosy-library-fireflies"');
    expect(hubSource).toContain("Array.from({ length: 104 }");
    expect(hubSource).toContain('className="mosy-roundrush3d-visual"');
    expect(hubSource).toContain('className="mosy-lesson-card mosy-md1-card"');
    expect(hubSource).toContain('className="mosy-lesson-card mosy-md2-card"');
    expect(hubSource).toContain('className="mosy-lesson-card mosy-order-card"');
    expect(hubSource).toContain('className="mosy-lesson-card mosy-area3d-card"');
    expect(hubSource).toContain('className="mosy-lesson-card mosy-multiply3d-card"');
    expect(hubSource).toContain('className="mosy-lesson-card mosy-factors3d-card"');
    expect(hubSource).not.toContain('className="mosy-lesson-card mosy-factors-card"');
    expect(hubStyles).toContain(".mosy-md1-visual");
    expect(hubStyles).toContain(".mosy-md2-visual");
    expect(hubStyles).toContain(".mosy-order-visual");
    expect(hubStyles).toContain(".mosy-area3d-visual");
    expect(hubStyles).toContain(".mosy-multiply3d-visual");
    expect(hubStyles).toContain(".mosy-factors3d-visual");
    expect(hubStyles).toContain(".mosy-roundrush3d-visual");
    expect(hubStyles).toContain(".mosy-lesson-card:before");
    expect(hubStyles).toContain("backdrop-filter:blur(18px)");
    expect(hubStyles).toContain(".mosy-lesson-copy:before");
    expect(hubStyles).toContain("--mosy-glass-a");
    expect(hubStyles).toContain(".mosy-order-card{--mosy-glass-a");
    expect(hubStyles).toContain(".mosy-library-fireflies");
    expect(hubStyles).toContain("@keyframes mosyFireflyApproach");
    expect(hubStyles).toContain(".mosy-library-fireflies i{animation:none");
    expect(hubStyles).toContain(".mosy-library:before");
    expect(hubStyles).toContain("linear-gradient(155deg,#142559");
    expect(hubSource).toContain('import "./mosyWarmFireflies.css"');
    expect(warmFireflyStyles).toContain(".mosy-library > .mosy-lesson-card::before");
    expect(warmFireflyStyles).toContain('content: "✦"');
    expect(warmFireflyStyles).toContain("rgba(255, 255, 255, 0.52)");
    expect(warmFireflyStyles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(hubStyles).toContain("@media(prefers-reduced-motion:reduce)");
  });

  it("retains the direct launch routes for all three independent mission cards", () => {
    expect(hubSource).toContain("onClick={launchRoundRush}");
    expect(hubSource).toContain('setScreen("md-part1")');
    expect(hubSource).toContain('setScreen("md-part2")');
    expect(hubSource).toContain('setScreen("order")');
    expect(hubSource).toContain('setScreen("area")');
    expect(hubSource).toContain('setScreen("multiply")');
    expect(hubSource).toContain('setScreen("factors")');
  });
});
