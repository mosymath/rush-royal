import { asc, desc, eq, sql } from "drizzle-orm";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import * as schema from "../drizzle/schema";
import { games, InsertUser, lessons, playerProfiles, teacherRosterFilterPresets, teacherRosterReportPreferences, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

type Db = BetterSQLite3Database<typeof schema>;

let _db: Db | null = null;

/** Resolve the on-disk SQLite path. Tests run against an in-memory database. */
function resolveDatabasePath(): string {
  if (process.env.DATABASE_PATH) return process.env.DATABASE_PATH;
  if (process.env.NODE_ENV === "test") return ":memory:";
  const dataDir = path.resolve(process.cwd(), "data");
  return path.join(dataDir, "mosy-math.db");
}

/**
 * Returns the shared SQLite-backed database, creating the file and applying
 * schema migrations on first use. Zero external configuration required.
 */
export async function getDb(): Promise<Db> {
  if (_db) return _db;
  const dbPath = resolveDatabasePath();
  if (dbPath !== ":memory:") {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite, { schema });
  const migrationsFolder = path.resolve(import.meta.dirname, "..", "drizzle");
  try {
    migrate(db, { migrationsFolder });
  } catch (error) {
    console.error("[Database] Migration failed:", error);
    throw error;
  }
  _db = db;
  return db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  updateSet.role = values.role;
  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  updateSet.updatedAt = new Date();
  await db.insert(users).values(values).onConflictDoUpdate({ target: users.openId, set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

/** Public catalog read for the main menu. */
export async function getMosyMathCatalog() {
  const db = await getDb();
  const [lessonRows, gameRows] = await Promise.all([
    db.select().from(lessons).orderBy(asc(lessons.sortOrder)),
    db.select().from(games).orderBy(asc(games.sortOrder)),
  ]);
  return { lessons: lessonRows, games: gameRows };
}

export type GuestPlayerProfileInput = {
  profileKey: string;
  nickname: string;
  avatarId: string;
  totalScore?: number;
  coins?: number;
  inventory?: string;
  effectId?: string;
  themeId?: string;
};

/** Retrieves a browser-owned Mosy player profile without storing a child's real identity. */
export async function getGuestPlayerProfile(profileKey: string) {
  const db = await getDb();
  const rows = await db.select().from(playerProfiles).where(eq(playerProfiles.profileKey, profileKey)).limit(1);
  return rows[0];
}

/** Creates or updates a nickname/avatar selection while retaining the cumulative score. */
export async function saveGuestPlayerProfile(input: GuestPlayerProfileInput) {
  const db = await getDb();
  const safeTotalScore = input.totalScore === undefined ? undefined : Math.min(10_000_000, Math.max(0, Math.round(input.totalScore)));
  const set: Record<string, unknown> = {
    nickname: input.nickname,
    avatarId: input.avatarId,
    updatedAt: new Date(),
  };
  if (safeTotalScore !== undefined) {
    set.totalScore = sql`max(${playerProfiles.totalScore}, ${safeTotalScore})`;
  }
  if (input.coins !== undefined) set.coins = Math.max(0, Math.round(input.coins));
  if (input.inventory !== undefined) set.inventory = input.inventory;
  if (input.effectId !== undefined) set.effectId = input.effectId;
  if (input.themeId !== undefined) set.themeId = input.themeId;
  await db.insert(playerProfiles).values(input).onConflictDoUpdate({ target: playerProfiles.profileKey, set });
  return getGuestPlayerProfile(input.profileKey);
}

/** Adds a verified client game award to the student's cumulative motivational score. */
export async function awardGuestPlayerScore(profileKey: string, points: number) {
  const db = await getDb();
  const safePoints = Math.min(5_000, Math.max(1, Math.round(points)));
  await db.update(playerProfiles).set({
    totalScore: sql`min(max(${playerProfiles.totalScore} + ${safePoints}, 0), 10000000)`,
    updatedAt: new Date(),
  }).where(eq(playerProfiles.profileKey, profileKey));
  return getGuestPlayerProfile(profileKey);
}

/** Adds coins earned from correct-answer streaks. */
export async function awardGuestPlayerCoins(profileKey: string, coins: number) {
  const db = await getDb();
  const safeCoins = Math.min(10_000, Math.max(0, Math.round(coins)));
  await db.update(playerProfiles).set({
    coins: sql`min(${playerProfiles.coins} + ${safeCoins}, 100000000)`,
    updatedAt: new Date(),
  }).where(eq(playerProfiles.profileKey, profileKey));
  return getGuestPlayerProfile(profileKey);
}

/** Spends coins; returns the updated profile, or null if the balance was insufficient. */
export async function spendGuestPlayerCoins(profileKey: string, coins: number) {
  const db = await getDb();
  const safeCoins = Math.max(1, Math.round(coins));
  const current = await getGuestPlayerProfile(profileKey);
  if (!current || current.coins < safeCoins) return null;
  await db.update(playerProfiles).set({
    coins: sql`${playerProfiles.coins} - ${safeCoins}`,
    updatedAt: new Date(),
  }).where(eq(playerProfiles.profileKey, profileKey));
  return getGuestPlayerProfile(profileKey);
}

/** Teacher-controlled nickname update for a shared classroom profile. */
export async function renameGuestPlayerProfile(profileKey: string, nickname: string) {
  const db = await getDb();
  await db.update(playerProfiles).set({ nickname, updatedAt: new Date() }).where(eq(playerProfiles.profileKey, profileKey));
  return getGuestPlayerProfile(profileKey);
}

/** Removes only the active student profile so the next student starts with a new backend record. */
export async function resetGuestPlayerProfile(profileKey: string) {
  const db = await getDb();
  await db.delete(playerProfiles).where(eq(playerProfiles.profileKey, profileKey));
  return true;
}

/** Classroom roster for an authenticated teacher; returns only the active game-profile fields. */
export async function listGuestPlayerProfiles() {
  const db = await getDb();
  return db.select({
    nickname: playerProfiles.nickname,
    avatarId: playerProfiles.avatarId,
    totalScore: playerProfiles.totalScore,
    coins: playerProfiles.coins,
    updatedAt: playerProfiles.updatedAt,
  }).from(playerProfiles).orderBy(desc(playerProfiles.updatedAt)).limit(250);
}

/** Adds an owned shop item id to a profile's inventory without duplicates. */
export async function addGuestPlayerInventoryItem(profileKey: string, itemId: string) {
  const db = await getDb();
  const current = await getGuestPlayerProfile(profileKey);
  if (!current) return null;
  const owned = current.inventory ? current.inventory.split(",").map((id) => id.trim()).filter(Boolean) : [];
  if (!owned.includes(itemId)) owned.push(itemId);
  await db.update(playerProfiles).set({ inventory: owned.join(","), updatedAt: new Date() }).where(eq(playerProfiles.profileKey, profileKey));
  return getGuestPlayerProfile(profileKey);
}

/** Equips a purchased avatar, effect, or theme for the active profile. */
export async function equipGuestPlayerShopItem(profileKey: string, itemId: string, category: "avatar" | "effect" | "theme") {
  const db = await getDb();
  const current = await getGuestPlayerProfile(profileKey);
  if (!current) return null;
  const owned = current.inventory ? current.inventory.split(",").map((id) => id.trim()) : [];
  if (!owned.includes(itemId)) return null;
  const set: Record<string, unknown> = { updatedAt: new Date() };
  if (category === "avatar") set.avatarId = itemId;
  if (category === "effect") set.effectId = itemId;
  if (category === "theme") set.themeId = itemId;
  await db.update(playerProfiles).set(set).where(eq(playerProfiles.profileKey, profileKey));
  return getGuestPlayerProfile(profileKey);
}

/** Seeds the built-in world catalog so the admin panel has units to open/close. */
export async function seedCatalogIfEmpty() {
  const db = await getDb();
  const existing = await db.select().from(lessons).limit(1);
  if (existing.length > 0) return;
  const defaults: (typeof lessons.$inferInsert)[] = [
    { id: "round-rush", title: "Round Rush — Rounding Numbers", description: "Round whole numbers to the nearest ten through million.", topic: "Rounding", accent: "#ff8c64", status: "active", sortOrder: 1 },
    { id: "shapes", title: "Shape Studio — 2D & 3D Shapes", description: "Identify, describe, and explore flat shapes and solid figures.", topic: "Geometry", accent: "#8ae6ca", status: "active", sortOrder: 2 },
    { id: "bubble-pop", title: "Bubble Pop — Measurement", description: "Metric length, mass, capacity, time, and elapsed time.", topic: "Measurement", accent: "#6ecdf1", status: "active", sortOrder: 3 },
    { id: "area", title: "Mission Explore Area — Unit 4", description: "Perimeter, area, unknown dimensions, and complex shapes.", topic: "Area & Perimeter", accent: "#ffb45e", status: "active", sortOrder: 4 },
    { id: "multiply", title: "Multiply & Conquer — Unit 5", description: "Multiplicative comparison, equations, and properties.", topic: "Multiplication", accent: "#f17d62", status: "active", sortOrder: 5 },
    { id: "tables", title: "Balloon Times Town — Tables", description: "Multiplication tables 1–12 through balloon groups.", topic: "Times Tables", accent: "#f6b75a", status: "active", sortOrder: 6 },
    { id: "factors", title: "Mission Factors & Multiples — Unit 6", description: "Factors, primes, GCF, multiples, and relationships.", topic: "Factors", accent: "#7c76bf", status: "active", sortOrder: 7 },
    { id: "md-part1", title: "Multiplication & Division — Unit 7 Part 1", description: "Area models, partial products, and remainders.", topic: "Computation", accent: "#8bb7ff", status: "active", sortOrder: 8 },
    { id: "md-part2", title: "Divide & Conquer — Unit 7 Part 2", description: "Division patterns, algorithms, and relationships.", topic: "Division", accent: "#b38dea", status: "active", sortOrder: 9 },
    { id: "order", title: "Order of Operations — Unit 8", description: "Evaluate expressions in the correct math order.", topic: "Order of Operations", accent: "#72cbb1", status: "active", sortOrder: 10 },
  ];
  await db.insert(lessons).values(defaults);
}

/** Admin read: full lesson (unit) list for the content-control panel. */
export async function listLessons() {
  const db = await getDb();
  return db.select().from(lessons).orderBy(asc(lessons.sortOrder));
}

/** Admin write: opens, closes, or archives one unit (lesson). */
export async function setLessonStatus(id: string, status: "active" | "upcoming" | "archived") {
  const db = await getDb();
  await db.update(lessons).set({ status, updatedAt: new Date() }).where(eq(lessons.id, id));
  return (await db.select().from(lessons).where(eq(lessons.id, id)).limit(1))[0] ?? null;
}

export type TeacherRosterFilterPresetInput = {
  name: string;
  search: string;
  minScore: number | null;
  maxScore: number | null;
  level: number | null;
};

/** Lists only the saved roster views owned by the current authenticated teacher. */
export async function listTeacherRosterFilterPresets(teacherOpenId: string) {
  const db = await getDb();
  return db.select().from(teacherRosterFilterPresets)
    .where(eq(teacherRosterFilterPresets.teacherOpenId, teacherOpenId))
    .orderBy(desc(teacherRosterFilterPresets.updatedAt), desc(teacherRosterFilterPresets.id));
}

/** Saves a named roster view for one teacher, replacing a prior preset with the same name. */
export async function saveTeacherRosterFilterPreset(teacherOpenId: string, input: TeacherRosterFilterPresetInput) {
  const db = await getDb();
  const existing = (await listTeacherRosterFilterPresets(teacherOpenId)).find((preset) => preset.name.localeCompare(input.name, undefined, { sensitivity: "accent" }) === 0);
  if (!existing && (await listTeacherRosterFilterPresets(teacherOpenId)).length >= 12) throw new Error("A teacher can save up to 12 roster filter presets.");
  const values = { name: input.name, search: input.search, minScore: input.minScore, maxScore: input.maxScore, level: input.level, updatedAt: new Date() };
  if (existing) {
    await db.update(teacherRosterFilterPresets).set(values).where(eq(teacherRosterFilterPresets.id, existing.id));
    return { ...existing, ...values };
  }
  await db.insert(teacherRosterFilterPresets).values({ teacherOpenId, ...values });
  return (await listTeacherRosterFilterPresets(teacherOpenId)).find((preset) => preset.name === input.name);
}

/** Deletes one saved roster view only after confirming it belongs to the current teacher. */
export async function deleteTeacherRosterFilterPreset(teacherOpenId: string, presetId: number) {
  const db = await getDb();
  const ownedPreset = (await listTeacherRosterFilterPresets(teacherOpenId)).find((preset) => preset.id === presetId);
  if (!ownedPreset) return false;
  await db.delete(teacherRosterFilterPresets).where(eq(teacherRosterFilterPresets.id, presetId));
  return true;
}

/** Marks one owned roster view as the teacher's startup view, or clears that setting. */
export async function setTeacherDefaultRosterFilterPreset(teacherOpenId: string, presetId: number | null) {
  const db = await getDb();
  if (presetId !== null && !(await listTeacherRosterFilterPresets(teacherOpenId)).some((preset) => preset.id === presetId)) return false;
  await db.update(teacherRosterFilterPresets).set({ isDefault: 0, updatedAt: new Date() }).where(eq(teacherRosterFilterPresets.teacherOpenId, teacherOpenId));
  if (presetId !== null) await db.update(teacherRosterFilterPresets).set({ isDefault: 1, updatedAt: new Date() }).where(eq(teacherRosterFilterPresets.id, presetId));
  return true;
}

/** Reads one teacher's report label; it is separate from all student profiles and saved views. */
export async function getTeacherRosterReportPreference(teacherOpenId: string) {
  const db = await getDb();
  const rows = await db.select().from(teacherRosterReportPreferences).where(eq(teacherRosterReportPreferences.teacherOpenId, teacherOpenId)).limit(1);
  return rows[0];
}

/** Saves or clears the optional class label used by one teacher's protected exports. */
export async function saveTeacherRosterReportPreference(teacherOpenId: string, className: string) {
  const db = await getDb();
  await db.insert(teacherRosterReportPreferences).values({ teacherOpenId, className, updatedAt: new Date() }).onConflictDoUpdate({ target: teacherRosterReportPreferences.teacherOpenId, set: { className, updatedAt: new Date() } });
  return getTeacherRosterReportPreference(teacherOpenId);
}
