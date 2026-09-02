import type { BubbleRoute, BubbleRouteId } from "@/game/bubblePopTypes";

export const BUBBLE_ROUTES: readonly BubbleRoute[] = [
  { id: "length", lesson: "LESSON 1", title: "Length Bubble Pop", shortTitle: "Length", subtitle: "Sky Ruler Bubble Bay", description: "Choose units, convert length, and solve sparkling ruler missions.", theme: "length", accent: "#22c8d6", accentSoft: "#d4fbff", icon: "↔", reward: { name: "Sky Ruler Crystal", emoji: "✦", color: "#22c8d6" }, questionCount: 6 },
  { id: "mass", lesson: "LESSON 2", title: "Mass Bubble Pop", shortTitle: "Mass", subtitle: "Balance Bubble Garden", description: "Balance grams, kilograms, and tons in friendly weight challenges.", theme: "mass", accent: "#59b977", accentSoft: "#e2fae8", icon: "⚖", reward: { name: "Balance Bloom Crystal", emoji: "✿", color: "#59b977" }, questionCount: 6 },
  { id: "capacity", lesson: "LESSON 3", title: "Capacity Bubble Pop", shortTitle: "Capacity", subtitle: "Aqua Bubble Lab", description: "Mix litres and millilitres for bright liquid missions.", theme: "capacity", accent: "#38bdf8", accentSoft: "#ddf6ff", icon: "◒", reward: { name: "Aqua Lab Crystal", emoji: "◈", color: "#38bdf8" }, questionCount: 6 },
  { id: "time", lesson: "LESSON 4", title: "Time Bubble Pop", shortTitle: "Time", subtitle: "Clockwork Bubble Station", description: "Read clocks and travel from weeks down to seconds.", theme: "time", accent: "#a78bfa", accentSoft: "#efe8ff", icon: "◷", reward: { name: "Clockwork Crystal", emoji: "◷", color: "#a78bfa" }, questionCount: 6 },
  { id: "elapsed-time", lesson: "LESSON 5", title: "Elapsed Time Bubble Pop", shortTitle: "Elapsed Time", subtitle: "Time Trail Bubble Express", description: "Follow the timetable and find how much time has passed.", theme: "elapsed", accent: "#f472b6", accentSoft: "#ffe3f2", icon: "⌚", reward: { name: "Time Trail Crystal", emoji: "✧", color: "#f472b6" }, questionCount: 6 },
  { id: "add-subtract", lesson: "LESSON 6", title: "Measurement Mission: Add & Subtract", shortTitle: "Add & Subtract", subtitle: "Measure Rescue Bubble Base", description: "Convert first, then solve mixed measurement missions.", theme: "rescue", accent: "#fb923c", accentSoft: "#fff0dc", icon: "±", reward: { name: "Mission Compass Crystal", emoji: "✥", color: "#fb923c" }, questionCount: 6 },
  { id: "multiply-divide", lesson: "LESSON 7", title: "Measurement Mission: Multiply & Divide", shortTitle: "Multiply & Divide", subtitle: "Operations Bubble Expedition", description: "Use equal groups and smart conversions to clear the expedition.", theme: "operations", accent: "#84cc16", accentSoft: "#effbd8", icon: "×", reward: { name: "Operations Star Crystal", emoji: "★", color: "#84cc16" }, questionCount: 6 },
  { id: "master-challenge", lesson: "FINAL TEST", title: "Master Chapter Challenge", shortTitle: "Master Challenge", subtitle: "Unit Three Assessment", description: "Bring every measurement skill together in one bright final challenge.", theme: "master", accent: "#fbbf24", accentSoft: "#fff5cf", icon: "★", reward: { name: "Measurement Master Star", emoji: "★", color: "#fbbf24" }, questionCount: 10, isMaster: true },
] as const;

export function getBubbleRoute(id: BubbleRouteId): BubbleRoute {
  const route = BUBBLE_ROUTES.find((candidate) => candidate.id === id);
  if (!route) throw new Error(`Unknown Bubble Pop route: ${id}`);
  return route;
}
