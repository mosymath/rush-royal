export type PlaceId = "10" | "100" | "1000" | "10000" | "100000" | "1000000";
export type GameMode = "route" | "challenge" | "random";
export type ChallengeLevel = 1 | 2 | 3;
export type ChallengeDifficulty = "easy" | "normal" | "hard";
export type RoundingStrategy = "standard" | "midpoint" | "regrouping" | "inverse";

export type GamePhase = "welcome" | "playing" | "routeComplete";
export type RoundStatus = "ready" | "feedback";

export interface PlaceConfig {
  id: PlaceId;
  value: number;
  label: string;
  compactLabel: string;
  route: number;
  accent: string;
}

export interface ChallengeLevelConfig {
  level: ChallengeLevel;
  difficulty: ChallengeDifficulty;
  name: string;
  places: PlaceId[];
  questionCount: number;
  scoreMultiplier: number;
  rewardLabel: string;
}

export interface RoundQuestion {
  id: string;
  number: number;
  target: PlaceConfig;
  correctAnswer: number;
  choices: number[];
  highlightedDigitIndex: number;
  decidingDigitIndex: number;
  decidingDigit: number;
  ruleHint: string;
  explanation: string;
  strategy?: RoundingStrategy;
  context?: string;
  prompt?: string;
  targetResult?: number;
  sourceLabel?: string;
}

export interface AnswerFeedback {
  selected: number;
  correct: boolean;
  points?: number;
  motivation?: string;
}
