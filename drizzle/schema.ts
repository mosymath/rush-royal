import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

/**
 * Core identity table. Local delivery uses a password-based admin login instead
 * of the hosted OAuth flow, so this record stores the small set of identities we
 * still need to distinguish admin vs. student access.
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role", { enum: ["user", "admin"] }).notNull().default("user"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

/** Curriculum topics, such as Rounding Numbers or future Place Value lessons. */
export const lessons = sqliteTable("lessons", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  topic: text("topic").notNull(),
  accent: text("accent").notNull(),
  status: text("status", { enum: ["active", "upcoming", "archived"] }).notNull().default("upcoming"),
  sortOrder: integer("sortOrder").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

/** Playable formats that belong to one curriculum lesson. */
export const games = sqliteTable("games", {
  id: text("id").primaryKey(),
  lessonId: text("lessonId").notNull(),
  title: text("title").notNull(),
  gameType: text("gameType").notNull(),
  description: text("description").notNull(),
  thumbnailTone: text("thumbnailTone").notNull(),
  status: text("status", { enum: ["active", "upcoming", "archived"] }).notNull().default("upcoming"),
  sortOrder: integer("sortOrder").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

/** Structured levels within each game. */
export const gameLevels = sqliteTable("game_levels", {
  id: text("id").primaryKey(),
  gameId: text("gameId").notNull(),
  title: text("title").notNull(),
  levelOrder: integer("levelOrder").notNull(),
  rules: text("rules").notNull(),
  unlockCondition: text("unlockCondition"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

/** Future-ready score state; not required to play the public first game. */
export const playerProgress = sqliteTable(
  "player_progress",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("userId").notNull(),
    levelId: text("levelId").notNull(),
    highScore: integer("highScore").notNull().default(0),
    stars: integer("stars").notNull().default(0),
    completedAt: integer("completedAt", { mode: "timestamp_ms" }),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  },
  (table) => [uniqueIndex("player_progress_user_level_idx").on(table.userId, table.levelId)],
);

/** A privacy-conscious game profile for a student using Mosy Math without an account. */
export const playerProfiles = sqliteTable("player_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Random browser-generated identifier; avoids collecting a student's real identity. */
  profileKey: text("profileKey").notNull().unique(),
  nickname: text("nickname").notNull(),
  avatarId: text("avatarId").notNull(),
  totalScore: integer("totalScore").notNull().default(0),
  /** Player coins earned from correct-answer streaks; spent in the shop. */
  coins: integer("coins").notNull().default(0),
  /** Comma-separated ids of purchased shop items (avatars, effects, themes). */
  inventory: text("inventory").notNull().default(""),
  /** Id of the equipped effect (celebration animation). Empty means default. */
  effectId: text("effectId").notNull().default(""),
  /** Id of the equipped theme (world color theme). Empty means default. */
  themeId: text("themeId").notNull().default(""),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

/** Saved roster views belong to a teacher account and never contain student profile data. */
export const teacherRosterFilterPresets = sqliteTable(
  "teacher_roster_filter_presets",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    teacherOpenId: text("teacherOpenId").notNull(),
    name: text("name").notNull(),
    search: text("search").notNull(),
    minScore: integer("minScore"),
    maxScore: integer("maxScore"),
    level: integer("level"),
    isDefault: integer("isDefault").notNull().default(0),
    createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  },
  (table) => [uniqueIndex("teacher_roster_preset_owner_name_idx").on(table.teacherOpenId, table.name)],
);

/** Non-student teacher report preferences, used only in protected roster exports. */
export const teacherRosterReportPreferences = sqliteTable("teacher_roster_report_preferences", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teacherOpenId: text("teacherOpenId").notNull().unique(),
  className: text("className").notNull().default(""),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Lesson = typeof lessons.$inferSelect;
export type Game = typeof games.$inferSelect;
export type GameLevel = typeof gameLevels.$inferSelect;
export type PlayerProfile = typeof playerProfiles.$inferSelect;
export type TeacherRosterFilterPreset = typeof teacherRosterFilterPresets.$inferSelect;
export type TeacherRosterReportPreference = typeof teacherRosterReportPreferences.$inferSelect;
