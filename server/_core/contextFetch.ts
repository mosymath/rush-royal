import { parse as parseCookieHeader } from "cookie";
import type { User } from "../db.js";
import { ADMIN_COOKIE, verifyAdminToken } from "./adminSession.js";

export type CookieToSet = { name: string; value: string; options: Record<string, unknown> };

export type FetchContext = {
  user: User | null;
  req: { protocol: string; headers: Record<string, string | string[] | undefined> };
  res: {
    cookie: (name: string, value: string, options?: Record<string, unknown>) => void;
    clearCookie: (name: string, options?: Record<string, unknown>) => void;
  };
};

function buildLocalAdminUser(): User {
  const now = new Date();
  return {
    id: -1,
    openId: "local-admin",
    name: "Mosy Math Admin",
    email: null,
    loginMethod: "password",
    role: "admin",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };
}

export async function createFetchContext(req: Request, jar: CookieToSet[]): Promise<FetchContext> {
  const isHttps = new URL(req.url).protocol === "https:";
  let user: User | null = null;
  try {
    const cookies = parseCookieHeader(req.headers.get("cookie") ?? "");
    if (await verifyAdminToken(cookies[ADMIN_COOKIE])) user = buildLocalAdminUser();
  } catch {
    user = null;
  }

  return {
    user,
    req: { protocol: isHttps ? "https" : "http", headers: { "x-forwarded-proto": isHttps ? "https" : undefined } },
    res: {
      cookie(name, value, options) {
        jar.push({ name, value, options: options ?? {} });
      },
      clearCookie(name, options) {
        jar.push({ name, value: "", options: { ...(options ?? {}), maxAge: -1 } });
      },
    },
  };
}
