import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(role: "user" | "admin"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 3, openId: `teacher-${role}`, email: "teacher@example.com", name: "Teacher", loginMethod: "manus", role,
    createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
  };
  return { user, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

describe("teacher profile backend controls", () => {
  it("rejects roster management calls from non-admin users", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    await expect(caller.player.teacherRename({ profileKey: "mosy-profile-key-0001", nickname: "New Student" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.player.teacherReset({ profileKey: "mosy-profile-key-0001" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.player.teacherRoster()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.player.teacherRosterPresets()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.player.teacherSaveRosterPreset({ name: "Level 3", search: "", minScore: null, maxScore: null, level: 3 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.player.teacherDeleteRosterPreset({ presetId: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.player.teacherSetDefaultRosterPreset({ presetId: null })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.player.teacherRosterReportPreference()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.player.teacherSaveRosterReportPreference({ className: "Class 5A" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("allows an administrator to reach the backend reset procedure", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    await expect(caller.player.teacherRename({ profileKey: "mosy-profile-key-0001", nickname: "New Student" })).resolves.toBeNull();
    await expect(caller.player.teacherReset({ profileKey: "mosy-profile-key-0001" })).resolves.toEqual({ success: true });
    await expect(caller.player.teacherRoster()).resolves.toEqual(expect.any(Array));
    await expect(caller.player.teacherRosterPresets()).resolves.toEqual(expect.any(Array));
    await expect(caller.player.teacherSetDefaultRosterPreset({ presetId: null })).resolves.toEqual({ success: true });
    await expect(caller.player.teacherRosterReportPreference()).resolves.toBeUndefined();
  });

  it("validates saved roster view filters before reaching persistence", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    await expect(caller.player.teacherSaveRosterPreset({ name: "X", search: "", minScore: null, maxScore: null, level: null })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.player.teacherSaveRosterPreset({ name: "Too high", search: "", minScore: null, maxScore: null, level: 11 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.player.teacherSaveRosterReportPreference({ className: "<unsafe>" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
