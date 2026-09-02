import type { MultiplicationMissionRoute, MultiplicationRouteId } from "./multiplicationMissionTypes";

export const MULTIPLICATION_MISSION_ROUTES: readonly MultiplicationMissionRoute[] = [
  { id: "comparison-quest", lesson: "LESSON 1", title: "Multiplicative Comparison", shortTitle: "Multiplier Match", subtitle: "Spot the times-as-many link", description: "Build equal groups, read tape models, and reveal the multiplier.", accent: "#FF6B4A", accentSoft: "#FFE0D7", icon: "×", reward: { name: "Multiplier Gem", color: "#FF6B4A" }, questionCount: 30 },
  { id: "equation-forge", lesson: "LESSON 2", title: "Create Comparison Equations", shortTitle: "Equation Forge", subtitle: "Turn clues into equations", description: "Forge a multiplication equation from every comparison clue.", accent: "#2EC4B6", accentSoft: "#D7FBF6", icon: "=", reward: { name: "Equation Spark", color: "#2EC4B6" }, questionCount: 30 },
  { id: "equation-rescue", lesson: "LESSON 3", title: "Solve Comparison Equations", shortTitle: "Factor Rescue", subtitle: "Unlock the missing factor", description: "Use multiplication and division clues to recover the hidden value.", accent: "#7B61FF", accentSoft: "#E9E4FF", icon: "?", reward: { name: "Factor Key", color: "#7B61FF" }, questionCount: 30 },
  { id: "property-parade", lesson: "LESSON 4", title: "Multiplication Properties", shortTitle: "Property Parade", subtitle: "Swap, keep one, or zero out", description: "Collect commutative, identity, and zero-property badges.", accent: "#F05D9E", accentSoft: "#FFE0EF", icon: "↔", reward: { name: "Property Badge", color: "#F05D9E" }, questionCount: 30 },
  { id: "pattern-power", lesson: "LESSON 5", title: "Multiplication Patterns", shortTitle: "Pattern Power", subtitle: "Launch by tens and hundreds", description: "Use basic facts and zero patterns to power the board.", accent: "#FFB703", accentSoft: "#FFF1C4", icon: "10", reward: { name: "Zero Rocket", color: "#FFB703" }, questionCount: 30 },
  { id: "grouping-galaxy", lesson: "LESSON 6", title: "Associative Property", shortTitle: "Grouping Galaxy", subtitle: "Regroup for a smart product", description: "Move parenthesis groups to reveal a faster multiplication route.", accent: "#3F8EFC", accentSoft: "#DFEDFF", icon: "()", reward: { name: "Group Orb", color: "#3F8EFC" }, questionCount: 30 },
  { id: "pattern-launch", lesson: "LESSON 7", title: "Applying Patterns", shortTitle: "Pattern Launch", subtitle: "Decompose and multiply", description: "Launch through multiples of 10, 100, and 1,000 with strategy.", accent: "#28B987", accentSoft: "#DDF8EB", icon: "⇢", reward: { name: "Launch Crystal", color: "#28B987" }, questionCount: 30 },
  { id: "multiplication-master-exam", lesson: "MASTER EXAM", title: "Multiplication Master Exam", shortTitle: "Master Exam", subtitle: "Play the whole unit", description: "A mixed final arena using the supplied Unit Five Assessment.", accent: "#FFB703", accentSoft: "#FFF1C4", icon: "★", reward: { name: "Multiplier Crown", color: "#FFB703" }, questionCount: 15, isMaster: true },
] as const;

export function getMultiplicationMissionRoute(routeId: MultiplicationRouteId) {
  const route = MULTIPLICATION_MISSION_ROUTES.find((item) => item.id === routeId);
  if (!route) throw new Error(`Unknown multiplication mission route: ${routeId}`);
  return route;
}
