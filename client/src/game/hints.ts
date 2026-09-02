import type { ChallengeLevel, GameMode } from "./types";

type HintVisibilityInput = {
  gameMode: GameMode;
  activeLevel: ChallengeLevel;
  isFirstInSection: boolean;
};

/** Easy keeps the teaching marks throughout; every other section receives them only on its opening question. */
export function shouldShowRoundingHints({ gameMode, activeLevel, isFirstInSection }: HintVisibilityInput) {
  return (gameMode === "challenge" && activeLevel === 1) || isFirstInSection;
}
