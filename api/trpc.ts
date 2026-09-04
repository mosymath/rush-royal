import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../server/routers";
import type { TrpcContext } from "../server/_core/context";
import { createFetchContext, type CookieToSet } from "../server/_core/contextFetch";
import { initDb } from "../server/db";

export const config = { runtime: "nodejs" };

let initialized = false;

function serializeCookie(name: string, value: string, options: Record<string, unknown>): string {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (typeof options.path === "string") parts.push(`Path=${options.path}`);
  if (typeof options.maxAge === "number") parts.push(`Max-Age=${options.maxAge}`);
  if (options.expires) parts.push(`Expires=${options.expires}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  if (typeof options.sameSite === "string") parts.push(`SameSite=${options.sameSite}`);
  return parts.join("; ");
}

export default async function handler(req: Request): Promise<Response> {
  if (!initialized) {
    try {
      await initDb();
    } catch (error) {
      console.error("[Database] init failed:", error);
    }
    initialized = true;
  }

  const jar: CookieToSet[] = [];
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: (opts) => createFetchContext(opts.req, jar) as unknown as TrpcContext,
  });

  if (jar.length === 0) return response;

  const headers = new Headers(response.headers);
  for (const cookie of jar) {
    headers.append("set-cookie", serializeCookie(cookie.name, cookie.value, cookie.options));
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
