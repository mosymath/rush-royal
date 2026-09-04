import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { parse as parseCookieHeader } from "cookie";
import type { User } from "../db";
import { ADMIN_COOKIE, verifyAdminToken } from "./adminSession";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

function readCookie(req: CreateExpressContextOptions["req"], name: string): string | null {
  const header = req.headers.cookie;
  if (typeof header !== "string") return null;
  try {
    return parseCookieHeader(header)[name] ?? null;
  } catch {
    return null;
  }
}

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

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // Local password login takes priority for self-hosted deployments.
  const adminCookie = readCookie(opts.req, ADMIN_COOKIE);
  if (await verifyAdminToken(adminCookie)) {
    user = buildLocalAdminUser();
  } else {
    try {
      user = await sdk.authenticateRequest(opts.req);
    } catch {
      // Authentication is optional for public procedures.
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
