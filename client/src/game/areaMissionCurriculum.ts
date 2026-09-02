import type { AreaMissionRoute } from "./areaMissionTypes";

export const AREA_MISSION_ROUTES: readonly AreaMissionRoute[] = [
  { id: "perimeter", lesson: "LESSON 1", title: "Finding Perimeter", shortTitle: "Perimeter Trail", subtitle: "Trace every outside edge", description: "Follow the garden trail and total the distance around rectangles and squares.", theme: "trail", accent: "#FF6B4A", accentSoft: "#FFE0D7", icon: "ruler", reward: { name: "Trail Beacon", color: "#FF6B4A" }, questionCount: 30 },
  { id: "area", lesson: "LESSON 2", title: "Finding Area", shortTitle: "Tile Trek", subtitle: "Cover the whole space", description: "Lay glowing tiles across squares and rectangles to discover their area.", theme: "tiles", accent: "#2EC4B6", accentSoft: "#D7FBF6", icon: "tiles", reward: { name: "Tile Gem", color: "#2EC4B6" }, questionCount: 30 },
  { id: "unknown-dimensions", lesson: "LESSON 3", title: "Unknown Dimensions", shortTitle: "Compass Code", subtitle: "Reveal the missing side", description: "Use area and perimeter clues to unlock the hidden dimension.", theme: "compass", accent: "#7B61FF", accentSoft: "#E9E4FF", icon: "compass", reward: { name: "Compass Crystal", color: "#7B61FF" }, questionCount: 30 },
  { id: "complex-shapes", lesson: "LESSON 4", title: "Complex Shapes", shortTitle: "Garden Grid", subtitle: "Split, trace, solve", description: "Explore L-shaped gardens, trace their outer edges, and combine simple areas.", theme: "garden", accent: "#FFB703", accentSoft: "#FFF1C4", icon: "garden", reward: { name: "Garden Star", color: "#FFB703" }, questionCount: 30 },
  { id: "area-explorer-mission", lesson: "FINAL MISSION", title: "Area Explorer Mission", shortTitle: "Final Mission", subtitle: "Explore the whole unit", description: "A mixed expedition across perimeter, area, unknown dimensions, and complex shapes.", theme: "final", accent: "#F05D9E", accentSoft: "#FFE0EF", icon: "star", reward: { name: "Area Explorer Crown", color: "#F05D9E" }, questionCount: 12, isMaster: true },
] as const;

export function getAreaMissionRoute(routeId: import("./areaMissionTypes").AreaRouteId) {
  const route = AREA_MISSION_ROUTES.find((item) => item.id === routeId);
  if (!route) throw new Error(`Unknown Mission Explore Area route: ${routeId}`);
  return route;
}
