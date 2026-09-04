import { sql } from "@vercel/postgres";

/**
 * Postgres-backed data layer for Vercel. Uses @vercel/postgres (Neon driver)
 * which auto-reads POSTGRES_URL / POSTGRES_URL_NON_POOLING / DATABASE_URL.
 * When no database is configured the functions degrade gracefully so the
 * static client still works offline.
 */

export type LessonStatus = "active" | "upcoming" | "archived";

export type Lesson = {
  id: string;
  title: string;
  description: string;
  topic: string;
  accent: string;
  status: LessonStatus;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PlayerProfile = {
  id: number;
  profileKey: string;
  nickname: string;
  avatarId: string;
  totalScore: number;
  coins: number;
  inventory: string;
  effectId: string;
  themeId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
};

export type InsertUser = Partial<Omit<User, "id">> & { openId: string };

export type TeacherRosterFilterPreset = {
  id: number;
  teacherOpenId: string;
  name: string;
  search: string;
  minScore: number | null;
  maxScore: number | null;
  level: number | null;
  isDefault: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TeacherRosterReportPreference = {
  id: number;
  teacherOpenId: string;
  className: string;
  createdAt: Date;
  updatedAt: Date;
};

function hasDb(): boolean {
  return Boolean(
    process.env.POSTGRES_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.POSTGRES_URL_NO_SSL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.DATABASE_URL,
  );
}

const num = (value: unknown): number => (typeof value === "string" ? Number(value) : (value as number));
const toDate = (value: unknown): Date => new Date(num(value));

/** Idempotent schema creation, run lazily on first use. */
export async function initDb() {
  if (!hasDb()) return;
  await sql`
    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      topic TEXT NOT NULL,
      accent TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'upcoming',
      "sortOrder" INTEGER NOT NULL,
      "createdAt" BIGINT NOT NULL,
      "updatedAt" BIGINT NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS player_profiles (
      id SERIAL PRIMARY KEY,
      "profileKey" TEXT UNIQUE NOT NULL,
      nickname TEXT NOT NULL,
      "avatarId" TEXT NOT NULL,
      "totalScore" INTEGER NOT NULL DEFAULT 0,
      coins INTEGER NOT NULL DEFAULT 0,
      inventory TEXT NOT NULL DEFAULT '',
      "effectId" TEXT NOT NULL DEFAULT '',
      "themeId" TEXT NOT NULL DEFAULT '',
      "createdAt" BIGINT NOT NULL,
      "updatedAt" BIGINT NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS teacher_roster_filter_presets (
      id SERIAL PRIMARY KEY,
      "teacherOpenId" TEXT NOT NULL,
      name TEXT NOT NULL,
      search TEXT NOT NULL,
      "minScore" INTEGER,
      "maxScore" INTEGER,
      level INTEGER,
      "isDefault" INTEGER NOT NULL DEFAULT 0,
      "createdAt" BIGINT NOT NULL,
      "updatedAt" BIGINT NOT NULL,
      UNIQUE ("teacherOpenId", name)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS teacher_roster_report_preferences (
      id SERIAL PRIMARY KEY,
      "teacherOpenId" TEXT UNIQUE NOT NULL,
      "className" TEXT NOT NULL DEFAULT '',
      "createdAt" BIGINT NOT NULL,
      "updatedAt" BIGINT NOT NULL
    )
  `;
}

function mapProfile(row: Record<string, unknown>): PlayerProfile {
  return {
    id: num(row.id),
    profileKey: row.profileKey as string,
    nickname: row.nickname as string,
    avatarId: row.avatarId as string,
    totalScore: num(row.totalScore),
    coins: num(row.coins),
    inventory: (row.inventory as string) ?? "",
    effectId: (row.effectId as string) ?? "",
    themeId: (row.themeId as string) ?? "",
    createdAt: toDate(row.createdAt),
    updatedAt: toDate(row.updatedAt),
  };
}

function mapLesson(row: Record<string, unknown>): Lesson {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    topic: row.topic as string,
    accent: row.accent as string,
    status: row.status as LessonStatus,
    sortOrder: num(row.sortOrder),
    createdAt: toDate(row.createdAt),
    updatedAt: toDate(row.updatedAt),
  };
}

export async function upsertUser(user: InsertUser): Promise<void> {
  // The hosted OAuth user table is not used for the local password admin flow.
  if (!user.openId) throw new Error("User openId is required for upsert");
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  // The hosted OAuth user table is not used for the local password admin flow.
  void openId;
  return undefined;
}

/** Public catalog read for the main menu. */
export async function getMosyMathCatalog(): Promise<{ lessons: Lesson[]; games: unknown[] }> {
  if (!hasDb()) return { lessons: [], games: [] };
  const rows = await sql`SELECT * FROM lessons ORDER BY "sortOrder" ASC`;
  return { lessons: rows.rows.map((r) => mapLesson(r as Record<string, unknown>)), games: [] };
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

export async function getGuestPlayerProfile(profileKey: string): Promise<PlayerProfile | undefined> {
  if (!hasDb()) return undefined;
  const rows = await sql`SELECT * FROM player_profiles WHERE "profileKey" = ${profileKey} LIMIT 1`;
  return rows.rows[0] ? mapProfile(rows.rows[0] as Record<string, unknown>) : undefined;
}

export async function saveGuestPlayerProfile(input: GuestPlayerProfileInput): Promise<PlayerProfile | undefined> {
  if (!hasDb()) return undefined;
  const now = Date.now();
  const safeTotalScore = input.totalScore === undefined ? 0 : Math.min(10_000_000, Math.max(0, Math.round(input.totalScore)));
  const rows = await sql`
    INSERT INTO player_profiles ("profileKey", nickname, "avatarId", "totalScore", coins, inventory, "effectId", "themeId", "createdAt", "updatedAt")
    VALUES (${input.profileKey}, ${input.nickname}, ${input.avatarId}, ${safeTotalScore}, ${input.coins ?? 0}, ${input.inventory ?? ""}, ${input.effectId ?? ""}, ${input.themeId ?? ""}, ${now}, ${now})
    ON CONFLICT ("profileKey") DO UPDATE SET
      nickname = EXCLUDED.nickname,
      "avatarId" = EXCLUDED."avatarId",
      "totalScore" = GREATEST(player_profiles."totalScore", EXCLUDED."totalScore"),
      coins = EXCLUDED.coins,
      inventory = EXCLUDED.inventory,
      "effectId" = EXCLUDED."effectId",
      "themeId" = EXCLUDED."themeId",
      "updatedAt" = EXCLUDED."updatedAt"
    RETURNING *
  `;
  return rows.rows[0] ? mapProfile(rows.rows[0] as Record<string, unknown>) : undefined;
}

export async function awardGuestPlayerScore(profileKey: string, points: number): Promise<PlayerProfile | undefined> {
  if (!hasDb()) return undefined;
  const safePoints = Math.min(5_000, Math.max(1, Math.round(points)));
  const rows = await sql`
    UPDATE player_profiles SET
      "totalScore" = LEAST(GREATEST("totalScore" + ${safePoints}, 0), 10000000),
      "updatedAt" = ${Date.now()}
    WHERE "profileKey" = ${profileKey}
    RETURNING *
  `;
  return rows.rows[0] ? mapProfile(rows.rows[0] as Record<string, unknown>) : undefined;
}

export async function awardGuestPlayerCoins(profileKey: string, coins: number): Promise<PlayerProfile | undefined> {
  if (!hasDb()) return undefined;
  const safeCoins = Math.min(10_000, Math.max(0, Math.round(coins)));
  const rows = await sql`
    UPDATE player_profiles SET coins = LEAST(coins + ${safeCoins}, 100000000), "updatedAt" = ${Date.now()}
    WHERE "profileKey" = ${profileKey}
    RETURNING *
  `;
  return rows.rows[0] ? mapProfile(rows.rows[0] as Record<string, unknown>) : undefined;
}

export async function spendGuestPlayerCoins(profileKey: string, coins: number): Promise<PlayerProfile | null> {
  if (!hasDb()) return null;
  const safeCoins = Math.max(1, Math.round(coins));
  const rows = await sql`
    UPDATE player_profiles SET coins = coins - ${safeCoins}, "updatedAt" = ${Date.now()}
    WHERE "profileKey" = ${profileKey} AND coins >= ${safeCoins}
    RETURNING *
  `;
  return rows.rows[0] ? mapProfile(rows.rows[0] as Record<string, unknown>) : null;
}

export async function addGuestPlayerInventoryItem(profileKey: string, itemId: string): Promise<PlayerProfile | null> {
  if (!hasDb()) return null;
  const current = await getGuestPlayerProfile(profileKey);
  if (!current) return null;
  const owned = current.inventory ? current.inventory.split(",").map((id) => id.trim()).filter(Boolean) : [];
  if (!owned.includes(itemId)) owned.push(itemId);
  const rows = await sql`
    UPDATE player_profiles SET inventory = ${owned.join(",")}, "updatedAt" = ${Date.now()}
    WHERE "profileKey" = ${profileKey}
    RETURNING *
  `;
  return rows.rows[0] ? mapProfile(rows.rows[0] as Record<string, unknown>) : null;
}

export async function equipGuestPlayerShopItem(profileKey: string, itemId: string, category: "avatar" | "effect" | "theme"): Promise<PlayerProfile | null> {
  if (!hasDb()) return null;
  const current = await getGuestPlayerProfile(profileKey);
  if (!current) return null;
  const owned = current.inventory ? current.inventory.split(",").map((id) => id.trim()) : [];
  if (!owned.includes(itemId)) return null;
  let rows;
  if (category === "avatar") rows = await sql`UPDATE player_profiles SET "avatarId" = ${itemId}, "updatedAt" = ${Date.now()} WHERE "profileKey" = ${profileKey} RETURNING *`;
  else if (category === "effect") rows = await sql`UPDATE player_profiles SET "effectId" = ${itemId}, "updatedAt" = ${Date.now()} WHERE "profileKey" = ${profileKey} RETURNING *`;
  else rows = await sql`UPDATE player_profiles SET "themeId" = ${itemId}, "updatedAt" = ${Date.now()} WHERE "profileKey" = ${profileKey} RETURNING *`;
  return rows.rows[0] ? mapProfile(rows.rows[0] as Record<string, unknown>) : null;
}

export async function renameGuestPlayerProfile(profileKey: string, nickname: string): Promise<PlayerProfile | undefined> {
  if (!hasDb()) return undefined;
  const rows = await sql`UPDATE player_profiles SET nickname = ${nickname}, "updatedAt" = ${Date.now()} WHERE "profileKey" = ${profileKey} RETURNING *`;
  return rows.rows[0] ? mapProfile(rows.rows[0] as Record<string, unknown>) : undefined;
}

export async function resetGuestPlayerProfile(profileKey: string): Promise<boolean> {
  if (!hasDb()) return true;
  await sql`DELETE FROM player_profiles WHERE "profileKey" = ${profileKey}`;
  return true;
}

export async function listGuestPlayerProfiles(): Promise<PlayerProfile[]> {
  if (!hasDb()) return [];
  const rows = await sql`SELECT * FROM player_profiles ORDER BY "updatedAt" DESC LIMIT 250`;
  return rows.rows.map((r) => mapProfile(r as Record<string, unknown>));
}

export async function seedCatalogIfEmpty(): Promise<void> {
  if (!hasDb()) return;
  const existing = await sql`SELECT id FROM lessons LIMIT 1`;
  if (existing.rows.length > 0) return;
  const now = Date.now();
  const defaults = [
    ["round-rush", "Round Rush - Rounding Numbers", "Round whole numbers to the nearest ten through million.", "Rounding", "#ff8c64", 1],
    ["shapes", "Shape Studio - 2D & 3D Shapes", "Identify, describe, and explore flat shapes and solid figures.", "Geometry", "#8ae6ca", 2],
    ["bubble-pop", "Bubble Pop - Measurement", "Metric length, mass, capacity, time, and elapsed time.", "Measurement", "#6ecdf1", 3],
    ["area", "Mission Explore Area - Unit 4", "Perimeter, area, unknown dimensions, and complex shapes.", "Area & Perimeter", "#ffb45e", 4],
    ["multiply", "Multiply & Conquer - Unit 5", "Multiplicative comparison, equations, and properties.", "Multiplication", "#f17d62", 5],
    ["tables", "Balloon Times Town - Tables", "Multiplication tables 1-12 through balloon groups.", "Times Tables", "#f6b75a", 6],
    ["factors", "Mission Factors & Multiples - Unit 6", "Factors, primes, GCF, multiples, and relationships.", "Factors", "#7c76bf", 7],
    ["md-part1", "Multiplication & Division - Unit 7 Part 1", "Area models, partial products, and remainders.", "Computation", "#8bb7ff", 8],
    ["md-part2", "Divide & Conquer - Unit 7 Part 2", "Division patterns, algorithms, and relationships.", "Division", "#b38dea", 9],
    ["order", "Order of Operations - Unit 8", "Evaluate expressions in the correct math order.", "Order of Operations", "#72cbb1", 10],
  ] as const;
  for (const [id, title, description, topic, accent, sortOrder] of defaults) {
    await sql`INSERT INTO lessons (id, title, description, topic, accent, status, "sortOrder", "createdAt", "updatedAt") VALUES (${id}, ${title}, ${description}, ${topic}, ${accent}, 'active', ${sortOrder}, ${now}, ${now}) ON CONFLICT (id) DO NOTHING`;
  }
}

export async function listLessons(): Promise<Lesson[]> {
  if (!hasDb()) return [];
  const rows = await sql`SELECT * FROM lessons ORDER BY "sortOrder" ASC`;
  return rows.rows.map((r) => mapLesson(r as Record<string, unknown>));
}

export async function setLessonStatus(id: string, status: LessonStatus): Promise<Lesson | null> {
  if (!hasDb()) return null;
  const rows = await sql`UPDATE lessons SET status = ${status}, "updatedAt" = ${Date.now()} WHERE id = ${id} RETURNING *`;
  return rows.rows[0] ? mapLesson(rows.rows[0] as Record<string, unknown>) : null;
}

export type TeacherRosterFilterPresetInput = {
  name: string;
  search: string;
  minScore: number | null;
  maxScore: number | null;
  level: number | null;
};

function mapPreset(row: Record<string, unknown>): TeacherRosterFilterPreset {
  return {
    id: num(row.id),
    teacherOpenId: row.teacherOpenId as string,
    name: row.name as string,
    search: row.search as string,
    minScore: row.minScore === null ? null : num(row.minScore),
    maxScore: row.maxScore === null ? null : num(row.maxScore),
    level: row.level === null ? null : num(row.level),
    isDefault: num(row.isDefault),
    createdAt: toDate(row.createdAt),
    updatedAt: toDate(row.updatedAt),
  };
}

export async function listTeacherRosterFilterPresets(teacherOpenId: string): Promise<TeacherRosterFilterPreset[]> {
  if (!hasDb()) return [];
  const rows = await sql`SELECT * FROM teacher_roster_filter_presets WHERE "teacherOpenId" = ${teacherOpenId} ORDER BY "updatedAt" DESC, id DESC`;
  return rows.rows.map((r) => mapPreset(r as Record<string, unknown>));
}

export async function saveTeacherRosterFilterPreset(teacherOpenId: string, input: TeacherRosterFilterPresetInput) {
  if (!hasDb()) return undefined;
  const existing = (await listTeacherRosterFilterPresets(teacherOpenId)).find(
    (preset) => preset.name.localeCompare(input.name, undefined, { sensitivity: "accent" }) === 0,
  );
  if (!existing && (await listTeacherRosterFilterPresets(teacherOpenId)).length >= 12)
    throw new Error("A teacher can save up to 12 roster filter presets.");
  const now = Date.now();
  const rows = await sql`
    INSERT INTO teacher_roster_filter_presets ("teacherOpenId", name, search, "minScore", "maxScore", level, "isDefault", "createdAt", "updatedAt")
    VALUES (${teacherOpenId}, ${input.name}, ${input.search}, ${input.minScore}, ${input.maxScore}, ${input.level}, 0, ${now}, ${now})
    ON CONFLICT ("teacherOpenId", name) DO UPDATE SET
      search = EXCLUDED.search,
      "minScore" = EXCLUDED."minScore",
      "maxScore" = EXCLUDED."maxScore",
      level = EXCLUDED.level,
      "updatedAt" = EXCLUDED."updatedAt"
    RETURNING *
  `;
  return rows.rows[0] ? mapPreset(rows.rows[0] as Record<string, unknown>) : undefined;
}

export async function deleteTeacherRosterFilterPreset(teacherOpenId: string, presetId: number): Promise<boolean> {
  if (!hasDb()) return false;
  const owned = (await listTeacherRosterFilterPresets(teacherOpenId)).find((preset) => preset.id === presetId);
  if (!owned) return false;
  await sql`DELETE FROM teacher_roster_filter_presets WHERE id = ${presetId}`;
  return true;
}

export async function setTeacherDefaultRosterFilterPreset(teacherOpenId: string, presetId: number | null): Promise<boolean> {
  if (!hasDb()) return true;
  if (presetId !== null && !(await listTeacherRosterFilterPresets(teacherOpenId)).some((preset) => preset.id === presetId)) return false;
  await sql`UPDATE teacher_roster_filter_presets SET "isDefault" = 0, "updatedAt" = ${Date.now()} WHERE "teacherOpenId" = ${teacherOpenId}`;
  if (presetId !== null) await sql`UPDATE teacher_roster_filter_presets SET "isDefault" = 1, "updatedAt" = ${Date.now()} WHERE id = ${presetId}`;
  return true;
}

export async function getTeacherRosterReportPreference(teacherOpenId: string): Promise<TeacherRosterReportPreference | undefined> {
  if (!hasDb()) return undefined;
  const rows = await sql`SELECT * FROM teacher_roster_report_preferences WHERE "teacherOpenId" = ${teacherOpenId} LIMIT 1`;
  if (!rows.rows[0]) return undefined;
  const r = rows.rows[0] as Record<string, unknown>;
  return { id: num(r.id), teacherOpenId: r.teacherOpenId as string, className: r.className as string, createdAt: toDate(r.createdAt), updatedAt: toDate(r.updatedAt) };
}

export async function saveTeacherRosterReportPreference(teacherOpenId: string, className: string): Promise<TeacherRosterReportPreference | undefined> {
  if (!hasDb()) return undefined;
  const now = Date.now();
  const rows = await sql`
    INSERT INTO teacher_roster_report_preferences ("teacherOpenId", "className", "createdAt", "updatedAt")
    VALUES (${teacherOpenId}, ${className}, ${now}, ${now})
    ON CONFLICT ("teacherOpenId") DO UPDATE SET "className" = EXCLUDED."className", "updatedAt" = EXCLUDED."updatedAt"
    RETURNING *
  `;
  if (!rows.rows[0]) return undefined;
  const r = rows.rows[0] as Record<string, unknown>;
  return { id: num(r.id), teacherOpenId: r.teacherOpenId as string, className: r.className as string, createdAt: toDate(r.createdAt), updatedAt: toDate(r.updatedAt) };
}
