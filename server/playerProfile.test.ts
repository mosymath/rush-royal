import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { applyPlayerScoreAward, clearPlayerProfile, createPlayerProfile, getNewMosyMilestoneReward, getNewlyReachedPlayerLevel, getPlayerLevelCelebrationMessage, getPlayerLevelProgress, getUnlockedMosyMilestoneRewards, MOSY_LEVEL_BASE_SCORE, MOSY_LEVEL_CELEBRATION_MESSAGES, MOSY_PLAYER_LEVELS, nicknameError, readPlayerProfile } from "../client/src/game/playerProfile";
import { MOSY_AVATARS } from "../client/src/game/playerAvatars";

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
  clear() { this.values.clear(); }
}

describe("Mosy player profile", () => {
  it("keeps the original image characters and adds fifteen friendly animated icon choices", () => {
    expect(MOSY_AVATARS).toHaveLength(23);
    expect(MOSY_AVATARS.filter((avatar) => avatar.image)).toHaveLength(8);
    expect(MOSY_AVATARS.filter((avatar) => avatar.icon)).toHaveLength(15);
    expect(MOSY_AVATARS.map((avatar) => avatar.id)).toEqual(expect.arrayContaining(["pippin-panda", "pebble-penguin", "skelly", "kiwi-parrot"]));
  });

  beforeEach(() => {
    vi.stubGlobal("window", { localStorage: new MemoryStorage() });
    vi.stubGlobal("crypto", { randomUUID: () => "test-profile-id-0001" });
  });

  afterEach(() => vi.unstubAllGlobals());

  it("uses score-only X milestones based on ten standard correct-answer awards", () => {
    expect(MOSY_PLAYER_LEVELS).toHaveLength(10);
    expect(MOSY_PLAYER_LEVELS[0]?.totalScore).toBe(0);
    expect(MOSY_LEVEL_BASE_SCORE).toBe(1_000);
    expect(MOSY_PLAYER_LEVELS[1]?.totalScore).toBe(MOSY_LEVEL_BASE_SCORE);
    expect(MOSY_PLAYER_LEVELS[2]?.totalScore).toBe(MOSY_LEVEL_BASE_SCORE * 2);
    expect(MOSY_PLAYER_LEVELS[9]?.totalScore).toBe(MOSY_LEVEL_BASE_SCORE * 9);
    expect(getPlayerLevelProgress(MOSY_LEVEL_BASE_SCORE - 1).level.level).toBe(1);
    expect(getPlayerLevelProgress(MOSY_LEVEL_BASE_SCORE).level.level).toBe(2);
    expect(getPlayerLevelProgress(MOSY_LEVEL_BASE_SCORE * 2).level.level).toBe(3);
    expect(getPlayerLevelProgress(MOSY_LEVEL_BASE_SCORE * 9)).toMatchObject({ level: { level: 10 }, nextLevel: null, progressPercent: 100 });
  });

  it("detects a newly reached level once at a cumulative score milestone", () => {
    expect(getNewlyReachedPlayerLevel(MOSY_LEVEL_BASE_SCORE - 100, MOSY_LEVEL_BASE_SCORE)).toMatchObject({ level: 2, title: "Cloud Chaser" });
    expect(getNewlyReachedPlayerLevel(MOSY_LEVEL_BASE_SCORE, MOSY_LEVEL_BASE_SCORE)).toBeNull();
    expect(getNewlyReachedPlayerLevel(0, MOSY_LEVEL_BASE_SCORE - 1)).toBeNull();
    expect(getNewlyReachedPlayerLevel(MOSY_LEVEL_BASE_SCORE, MOSY_LEVEL_BASE_SCORE * 2)).toMatchObject({ level: 3, title: "Star Collector" });
  });

  it("gives every earned Level 2–10 milestone a distinct celebration message", () => {
    const messages = Array.from({ length: 9 }, (_, index) => getPlayerLevelCelebrationMessage(index + 2));
    expect(Object.keys(MOSY_LEVEL_CELEBRATION_MESSAGES).map(Number)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(new Set(messages).size).toBe(9);
    expect(getPlayerLevelCelebrationMessage(2)).toContain("A thousand sparks");
    expect(getPlayerLevelCelebrationMessage(10)).toContain("Mosy Math Adventure Master");
    expect(getPlayerLevelCelebrationMessage(1)).toBe("Your saved spark score reached a new milestone.");
  });

  it("derives compact cosmetic rewards only from selected earned milestones", () => {
    expect(getUnlockedMosyMilestoneRewards(0)).toEqual([]);
    expect(getUnlockedMosyMilestoneRewards(MOSY_LEVEL_BASE_SCORE * 2).map((reward) => reward.name)).toEqual(["Star Pin"]);
    expect(getUnlockedMosyMilestoneRewards(MOSY_LEVEL_BASE_SCORE * 6).map((reward) => reward.name)).toEqual(["Star Pin", "Comet Cape", "Galaxy Goggles"]);
    expect(getUnlockedMosyMilestoneRewards(MOSY_LEVEL_BASE_SCORE * 9).map((reward) => reward.name)).toEqual(["Star Pin", "Comet Cape", "Galaxy Goggles", "Master Crown"]);
    expect(getNewMosyMilestoneReward(3)).toMatchObject({ name: "Star Pin", kind: "badge" });
    expect(getUnlockedMosyMilestoneRewards(MOSY_LEVEL_BASE_SCORE * 9).map((reward) => reward.effect)).toEqual(["starburst", "cometTrail", "orbitRings", "crownRays"]);
    expect(getNewMosyMilestoneReward(4)).toBeNull();
  });

  it("saves a safe nickname and selected avatar for returning offline players", () => {
    const created = createPlayerProfile("Sky Learner", "pippin-panda");
    expect(created.nickname).toBe("Sky Learner");
    expect(readPlayerProfile()).toMatchObject({ nickname: "Sky Learner", avatarId: "pippin-panda", totalScore: 0 });
    expect(nicknameError("<script>")).not.toBeNull();
  });

  it("applies each cumulative score event once and retains it after a profile refresh", () => {
    createPlayerProfile("Sky Learner", "starlight");
    const first = applyPlayerScoreAward({ points: MOSY_LEVEL_BASE_SCORE, source: "round-rush", eventId: "score-event-1" });
    const duplicate = applyPlayerScoreAward({ points: MOSY_LEVEL_BASE_SCORE, source: "round-rush", eventId: "score-event-1" });
    expect(first.applied).toBe(true);
    expect(duplicate.applied).toBe(false);
    expect(readPlayerProfile()).toMatchObject({ totalScore: MOSY_LEVEL_BASE_SCORE });
    expect(getPlayerLevelProgress(readPlayerProfile()!.totalScore).level.level).toBe(2);
  });

  it("clears only the active shared-device profile so the next student can start fresh", () => {
    createPlayerProfile("Sky Learner", "pippin-panda");
    applyPlayerScoreAward({ points: 500, source: "round-rush", eventId: "reset-check" });
    clearPlayerProfile();
    expect(readPlayerProfile()).toBeNull();
  });
});
