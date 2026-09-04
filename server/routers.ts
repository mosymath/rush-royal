import { COOKIE_NAME } from "../shared/const.js";
import { getShopItem, parseInventory, SHOP_ITEMS } from "../shared/shop.js";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ADMIN_COOKIE, createAdminToken, verifyAdminPassword } from "./_core/adminSession.js";
import { getSessionCookieOptions } from "./_core/cookies.js";
import { systemRouter } from "./_core/systemRouter.js";
import { adminProcedure, publicProcedure, router } from "./_core/trpc.js";
import { addGuestPlayerInventoryItem, awardGuestPlayerCoins, awardGuestPlayerScore, deleteTeacherRosterFilterPreset, equipGuestPlayerShopItem, getGuestPlayerProfile, getMosyMathCatalog, getTeacherRosterReportPreference, listGuestPlayerProfiles, listLessons, listTeacherRosterFilterPresets, renameGuestPlayerProfile, resetGuestPlayerProfile, saveGuestPlayerProfile, saveTeacherRosterFilterPreset, saveTeacherRosterReportPreference, setLessonStatus, setTeacherDefaultRosterFilterPreset, spendGuestPlayerCoins } from "./db.js";

const adminCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: false,
  maxAge: 30 * 24 * 60 * 60 * 1000,
} as const;

const profileKeySchema = z.string().min(12).max(72);
const itemIdSchema = z.string().min(1).max(48);

/** Public Mosy Math API surface. */
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  admin: router({
    me: publicProcedure.query(({ ctx }) => ({ isAdmin: ctx.user?.role === "admin" })),
    login: publicProcedure.input(z.object({ password: z.string().min(1).max(128) })).mutation(async ({ ctx, input }) => {
      if (!verifyAdminPassword(input.password)) return { success: false } as const;
      const token = await createAdminToken();
      ctx.res.cookie(ADMIN_COOKIE, token, adminCookieOptions);
      return { success: true } as const;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(ADMIN_COOKIE, { path: "/" });
      return { success: true } as const;
    }),
    listLessons: adminProcedure.query(() => listLessons()),
    setLessonStatus: adminProcedure.input(z.object({
      id: z.string().min(1).max(64),
      status: z.enum(["active", "upcoming", "archived"]),
    })).mutation(({ input }) => setLessonStatus(input.id, input.status)),
  }),
  catalog: router({
    list: publicProcedure.query(() => getMosyMathCatalog()),
  }),
  shop: router({
    items: publicProcedure.query(() => SHOP_ITEMS),
    buy: publicProcedure.input(z.object({ profileKey: profileKeySchema, itemId: itemIdSchema })).mutation(async ({ input }) => {
      const item = getShopItem(input.itemId);
      if (!item) throw new TRPCError({ code: "NOT_FOUND", message: "Unknown shop item" });
      const profile = await getGuestPlayerProfile(input.profileKey);
      if (!profile) return null;
      if (parseInventory(profile.inventory).includes(input.itemId)) return profile;
      const spent = await spendGuestPlayerCoins(input.profileKey, item.cost);
      if (!spent) throw new TRPCError({ code: "BAD_REQUEST", message: "Not enough coins" });
      return addGuestPlayerInventoryItem(input.profileKey, input.itemId);
    }),
    equip: publicProcedure.input(z.object({ profileKey: profileKeySchema, itemId: itemIdSchema })).mutation(async ({ input }) => {
      const item = getShopItem(input.itemId);
      if (!item) throw new TRPCError({ code: "NOT_FOUND", message: "Unknown shop item" });
      return equipGuestPlayerShopItem(input.profileKey, input.itemId, item.category);
    }),
  }),
  player: router({
    get: publicProcedure.input(z.object({ profileKey: profileKeySchema })).query(async ({ input }) =>
      (await getGuestPlayerProfile(input.profileKey)) ?? null,
    ),
    save: publicProcedure.input(z.object({
      profileKey: profileKeySchema,
      nickname: z.string().trim().min(1).max(24),
      avatarId: z.string().min(1).max(48),
      totalScore: z.number().int().min(0).max(10_000_000).optional(),
      coins: z.number().int().min(0).max(100_000_000).optional(),
      inventory: z.string().max(5000).optional(),
      effectId: z.string().max(48).optional(),
      themeId: z.string().max(48).optional(),
    })).mutation(async ({ input }) => (await saveGuestPlayerProfile(input)) ?? null),
    award: publicProcedure.input(z.object({
      profileKey: profileKeySchema,
      points: z.number().int().min(1).max(5000),
    })).mutation(async ({ input }) => (await awardGuestPlayerScore(input.profileKey, input.points)) ?? null),
    awardCoins: publicProcedure.input(z.object({
      profileKey: profileKeySchema,
      coins: z.number().int().min(0).max(10000),
    })).mutation(async ({ input }) => (await awardGuestPlayerCoins(input.profileKey, input.coins)) ?? null),
    teacherRename: adminProcedure.input(z.object({
      profileKey: profileKeySchema,
      nickname: z.string().trim().min(2).max(18).regex(/^[^<>[\]{}\\/`$]+$/),
    })).mutation(async ({ input }) => (await renameGuestPlayerProfile(input.profileKey, input.nickname)) ?? null),
    teacherReset: adminProcedure.input(z.object({
      profileKey: profileKeySchema,
    })).mutation(async ({ input }) => ({ success: await resetGuestPlayerProfile(input.profileKey) })),
    teacherRoster: adminProcedure.query(() => listGuestPlayerProfiles()),
    teacherRosterPresets: adminProcedure.query(({ ctx }) => listTeacherRosterFilterPresets(ctx.user.openId)),
    teacherSaveRosterPreset: adminProcedure.input(z.object({
      name: z.string().trim().min(2).max(32).regex(/^[^<>[\]{}\\/`$]+$/),
      search: z.string().trim().max(64),
      minScore: z.number().int().min(0).max(10_000_000).nullable(),
      maxScore: z.number().int().min(0).max(10_000_000).nullable(),
      level: z.number().int().min(1).max(10).nullable(),
    })).mutation(({ ctx, input }) => saveTeacherRosterFilterPreset(ctx.user.openId, input)),
    teacherDeleteRosterPreset: adminProcedure.input(z.object({
      presetId: z.number().int().positive(),
    })).mutation(async ({ ctx, input }) => ({ success: await deleteTeacherRosterFilterPreset(ctx.user.openId, input.presetId) })),
    teacherSetDefaultRosterPreset: adminProcedure.input(z.object({
      presetId: z.number().int().positive().nullable(),
    })).mutation(async ({ ctx, input }) => ({ success: await setTeacherDefaultRosterFilterPreset(ctx.user.openId, input.presetId) })),
    teacherRosterReportPreference: adminProcedure.query(({ ctx }) => getTeacherRosterReportPreference(ctx.user.openId)),
    teacherSaveRosterReportPreference: adminProcedure.input(z.object({
      className: z.string().trim().max(80).regex(/^[^<>[\]{}\\/`$]*$/),
    })).mutation(({ ctx, input }) => saveTeacherRosterReportPreference(ctx.user.openId, input.className)),
  }),
});

export type AppRouter = typeof appRouter;
