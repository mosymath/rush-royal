import { getShopItem, parseInventory, serializeInventory } from "@shared/shop";

export type MosyPlayerProfile = {
  profileKey: string;
  nickname: string;
  avatarId: string;
  totalScore: number;
  coins: number;
  inventory: string;
  effectId: string;
  themeId: string;
  recentAwardIds: string[];
  updatedAt: number;
};

export type PlayerScoreAward = {
  points: number;
  source: string;
  eventId: string;
};

export type PlayerCoinsAward = {
  coins: number;
  source: string;
  eventId: string;
};

/** X equals ten standard correct-answer awards. Bonus points still count, but one answer cannot promote a level. */
export const MOSY_LEVEL_BASE_SCORE = 1_000;

/** Player levels are determined only by cumulative motivational score: X, 2X, 3X, and so on. */
export const MOSY_PLAYER_LEVELS = [
  { level: 1, title: "Spark Starter", totalScore: 0 },
  { level: 2, title: "Cloud Chaser", totalScore: MOSY_LEVEL_BASE_SCORE },
  { level: 3, title: "Star Collector", totalScore: MOSY_LEVEL_BASE_SCORE * 2 },
  { level: 4, title: "Puzzle Pilot", totalScore: MOSY_LEVEL_BASE_SCORE * 3 },
  { level: 5, title: "Math Meteor", totalScore: MOSY_LEVEL_BASE_SCORE * 4 },
  { level: 6, title: "Orbit Expert", totalScore: MOSY_LEVEL_BASE_SCORE * 5 },
  { level: 7, title: "Galaxy Guide", totalScore: MOSY_LEVEL_BASE_SCORE * 6 },
  { level: 8, title: "Nova Navigator", totalScore: MOSY_LEVEL_BASE_SCORE * 7 },
  { level: 9, title: "Cosmic Champion", totalScore: MOSY_LEVEL_BASE_SCORE * 8 },
  { level: 10, title: "Mosy Math Adventure Master", totalScore: MOSY_LEVEL_BASE_SCORE * 9 },
] as const;

/** Each earned level gets its own compact celebration line; Level 1 is never a level-up event. */
export const MOSY_LEVEL_CELEBRATION_MESSAGES: Record<number, string> = {
  2: "A thousand sparks! Your first cloud trail is glowing.",
  3: "Two X sparks strong—your star collection is growing!",
  4: "Puzzle Pilot unlocked! You’re steering through bigger math missions.",
  5: "Math Meteor moment! Your skills are blazing bright.",
  6: "Orbit Expert achieved! Your practice is powering every answer.",
  7: "Galaxy Guide unlocked! Your smart thinking lights the way.",
  8: "Nova Navigator! You’re charting a brilliant path through math.",
  9: "Cosmic Champion! Your steady effort is shining across the galaxy.",
  10: "Mosy Math Adventure Master! You reached the top constellation—amazing work!",
};

export function getPlayerLevelCelebrationMessage(level: number) {
  return MOSY_LEVEL_CELEBRATION_MESSAGES[level] ?? "Your saved spark score reached a new milestone.";
}

/** Cosmetic rewards are derived from earned score milestones, so no extra student profile data is stored. */
export const MOSY_MILESTONE_REWARDS = [
  { level: 3, name: "Star Pin", kind: "badge", icon: "✦", effect: "starburst", description: "A bright Star Collector badge" },
  { level: 5, name: "Comet Cape", kind: "accessory", icon: "☄", effect: "cometTrail", description: "A glowing Math Meteor comet cape" },
  { level: 7, name: "Galaxy Goggles", kind: "accessory", icon: "◉", effect: "orbitRings", description: "Galaxy Guide goggles" },
  { level: 10, name: "Master Crown", kind: "badge", icon: "♛", effect: "crownRays", description: "The Mosy Math Adventure Master crown badge" },
] as const;

export type MosyMilestoneReward = (typeof MOSY_MILESTONE_REWARDS)[number];

export function getUnlockedMosyMilestoneRewards(totalScore: number) {
  const level = getPlayerLevelProgress(totalScore).level.level;
  return MOSY_MILESTONE_REWARDS.filter((reward) => level >= reward.level);
}

export function getNewMosyMilestoneReward(level: number) {
  return MOSY_MILESTONE_REWARDS.find((reward) => reward.level === level) ?? null;
}

export type PlayerLevelProgress = {
  level: (typeof MOSY_PLAYER_LEVELS)[number];
  nextLevel: (typeof MOSY_PLAYER_LEVELS)[number] | null;
  scoreIntoLevel: number;
  scoreToNextLevel: number;
  progressPercent: number;
};

export function getPlayerLevelProgress(totalScore: number): PlayerLevelProgress {
  const safeScore = Math.max(0, Math.round(totalScore));
  const level = [...MOSY_PLAYER_LEVELS].reverse().find((item) => safeScore >= item.totalScore) ?? MOSY_PLAYER_LEVELS[0]!;
  const nextLevel = MOSY_PLAYER_LEVELS.find((item) => item.level === level.level + 1) ?? null;
  if (!nextLevel) return { level, nextLevel: null, scoreIntoLevel: safeScore - level.totalScore, scoreToNextLevel: 0, progressPercent: 100 };
  const levelSpan = nextLevel.totalScore - level.totalScore;
  const scoreIntoLevel = Math.max(0, safeScore - level.totalScore);
  return { level, nextLevel, scoreIntoLevel, scoreToNextLevel: Math.max(0, nextLevel.totalScore - safeScore), progressPercent: Math.min(100, Math.round((scoreIntoLevel / levelSpan) * 100)) };
}

/** Returns a new level only when a saved score event crosses a player milestone. */
export function getNewlyReachedPlayerLevel(previousTotalScore: number, updatedTotalScore: number) {
  const previousLevel = getPlayerLevelProgress(previousTotalScore).level;
  const updatedLevel = getPlayerLevelProgress(updatedTotalScore).level;
  return updatedLevel.level > previousLevel.level ? updatedLevel : null;
}

const STORAGE_KEY = "mosy-math-player-profile-v1";
const PROFILE_KEY = "mosy-math-player-key-v1";
const MAX_SCORE = 99_999_999;
const MAX_COINS = 100_000_000;
const MAX_RECENT_AWARDS = 180;

const safeStorage = () => {
  try { return window.localStorage; } catch { return null; }
};

const makeId = () => {
  try { return crypto.randomUUID(); } catch { return `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
};

export function normalizeNickname(value: string) {
  return value.normalize("NFC").replace(/\s+/g, " ").trim();
}

export function nicknameError(value: string) {
  const nickname = normalizeNickname(value);
  if (!nickname) return "Choose a nickname to begin.";
  if (nickname.length < 2) return "Use at least 2 characters.";
  if (nickname.length > 18) return "Keep your nickname to 18 characters or fewer.";
  if (/[<>[\]{}\\/`$]/.test(nickname)) return "Use letters, numbers, spaces, periods, apostrophes, or hyphens only.";
  return null;
}

export function getPlayerProfileKey() {
  const storage = safeStorage();
  if (!storage) return `temporary-${makeId()}`;
  const saved = storage.getItem(PROFILE_KEY);
  if (saved && saved.length >= 12) return saved;
  const profileKey = `mosy-${makeId()}`;
  storage.setItem(PROFILE_KEY, profileKey);
  return profileKey;
}

export function readPlayerProfile(): MosyPlayerProfile | null {
  const storage = safeStorage();
  if (!storage) return null;
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY) ?? "null") as Partial<MosyPlayerProfile> | null;
    if (!saved || typeof saved.nickname !== "string" || typeof saved.avatarId !== "string" || typeof saved.totalScore !== "number") return null;
    if (nicknameError(saved.nickname)) return null;
    return {
      profileKey: typeof saved.profileKey === "string" && saved.profileKey.length >= 12 ? saved.profileKey : getPlayerProfileKey(),
      nickname: normalizeNickname(saved.nickname),
      avatarId: saved.avatarId,
      totalScore: Math.max(0, Math.min(MAX_SCORE, Math.round(saved.totalScore))),
      coins: Math.max(0, Math.min(MAX_COINS, Math.round(saved.coins ?? 0))),
      inventory: typeof saved.inventory === "string" ? saved.inventory : "",
      effectId: typeof saved.effectId === "string" ? saved.effectId : "",
      themeId: typeof saved.themeId === "string" ? saved.themeId : "",
      recentAwardIds: Array.isArray(saved.recentAwardIds) ? saved.recentAwardIds.filter((item): item is string => typeof item === "string").slice(-MAX_RECENT_AWARDS) : [],
      updatedAt: typeof saved.updatedAt === "number" ? saved.updatedAt : Date.now(),
    };
  } catch { return null; }
}

export function writePlayerProfile(profile: MosyPlayerProfile) {
  safeStorage()?.setItem(STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

/** Clears only the active student cache and browser profile key for a shared-device handoff. */
export function clearPlayerProfile() {
  const storage = safeStorage();
  storage?.removeItem(STORAGE_KEY);
  storage?.removeItem(PROFILE_KEY);
}

export function createPlayerProfile(nickname: string, avatarId: string): MosyPlayerProfile {
  const error = nicknameError(nickname);
  if (error) throw new Error(error);
  const existing = readPlayerProfile();
  return writePlayerProfile({
    profileKey: getPlayerProfileKey(),
    nickname: normalizeNickname(nickname),
    avatarId,
    totalScore: existing?.totalScore ?? 0,
    coins: existing?.coins ?? 0,
    inventory: existing?.inventory ?? "",
    effectId: existing?.effectId ?? "",
    themeId: existing?.themeId ?? "",
    recentAwardIds: existing?.recentAwardIds ?? [],
    updatedAt: Date.now(),
  });
}

/** Applies a score award only once, including if a feedback render fires more than once. */
export function applyPlayerScoreAward(award: PlayerScoreAward) {
  const profile = readPlayerProfile();
  if (!profile || !Number.isFinite(award.points) || award.points <= 0 || profile.recentAwardIds.includes(award.eventId)) {
    return { applied: false, profile };
  }
  const updated = writePlayerProfile({
    ...profile,
    totalScore: Math.min(MAX_SCORE, profile.totalScore + Math.round(award.points)),
    recentAwardIds: [...profile.recentAwardIds, award.eventId].slice(-MAX_RECENT_AWARDS),
    updatedAt: Date.now(),
  });
  return { applied: true, profile: updated };
}

/** World runtimes call this at their existing correct-answer moment. */
export function awardPlayerScore(points: number, source: string, eventId = makeId()) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<PlayerScoreAward>("mosy:score-award", { detail: { points, source, eventId } }));
}

/** Applies a coin award exactly once, mirroring the score-award dedupe guard. */
export function applyPlayerCoinsAward(award: PlayerCoinsAward) {
  const profile = readPlayerProfile();
  if (!profile || !Number.isFinite(award.coins) || award.coins <= 0 || profile.recentAwardIds.includes(award.eventId)) {
    return { applied: false, profile };
  }
  const updated = writePlayerProfile({
    ...profile,
    coins: Math.min(MAX_COINS, profile.coins + Math.round(award.coins)),
    recentAwardIds: [...profile.recentAwardIds, award.eventId].slice(-MAX_RECENT_AWARDS),
    updatedAt: Date.now(),
  });
  return { applied: true, profile: updated };
}

/** Awards shop coins earned from correct-answer streaks. */
export function awardPlayerCoins(coins: number, source: string, eventId = makeId()) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<PlayerCoinsAward>("mosy:coins-award", { detail: { coins, source, eventId } }));
}

/** Writes a server-synced profile shape back into the local store. */
export function writePlayerProfileFromBackend(profile: {
  profileKey: string;
  nickname: string;
  avatarId: string;
  totalScore?: number;
  coins?: number;
  inventory?: string;
  effectId?: string;
  themeId?: string;
}) {
  const current = readPlayerProfile();
  return writePlayerProfile({
    profileKey: profile.profileKey,
    nickname: normalizeNickname(profile.nickname),
    avatarId: profile.avatarId,
    totalScore: Math.max(0, Math.min(MAX_SCORE, Math.round(profile.totalScore ?? current?.totalScore ?? 0))),
    coins: Math.max(0, Math.min(MAX_COINS, Math.round(profile.coins ?? current?.coins ?? 0))),
    inventory: profile.inventory ?? current?.inventory ?? "",
    effectId: profile.effectId ?? current?.effectId ?? "",
    themeId: profile.themeId ?? current?.themeId ?? "",
    recentAwardIds: current?.recentAwardIds ?? [],
    updatedAt: Date.now(),
  });
}

export type ShopActionResult = { ok: boolean; profile: MosyPlayerProfile; error?: string };

/** Purchases a shop item with coins (client-authoritative; synced to backend after). */
export function buyShopItem(profile: MosyPlayerProfile, itemId: string): ShopActionResult {
  const item = getShopItem(itemId);
  if (!item) return { ok: false, profile, error: "Unknown item." };
  if (parseInventory(profile.inventory).includes(itemId)) return { ok: true, profile };
  if (profile.coins < item.cost) return { ok: false, profile, error: "Not enough coins." };
  const inventory = serializeInventory([...parseInventory(profile.inventory), itemId]);
  const updated = writePlayerProfile({ ...profile, coins: profile.coins - item.cost, inventory, updatedAt: Date.now() });
  return { ok: true, profile: updated };
}

/** Equips a purchased avatar, effect, or theme. */
export function equipShopItem(profile: MosyPlayerProfile, itemId: string): ShopActionResult {
  const item = getShopItem(itemId);
  if (!item || !parseInventory(profile.inventory).includes(itemId)) return { ok: false, profile, error: "Own this item first." };
  let next: MosyPlayerProfile = profile;
  if (item.category === "avatar") next = { ...profile, avatarId: item.id };
  else if (item.category === "effect") next = { ...profile, effectId: item.id };
  else if (item.category === "theme") next = { ...profile, themeId: item.id };
  return { ok: true, profile: writePlayerProfile({ ...next, updatedAt: Date.now() }) };
}
