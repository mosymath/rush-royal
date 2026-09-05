import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../routers.js";
import type { TrpcContext } from "./context.js";
import { createFetchContext, type CookieToSet } from "./contextFetch.js";
import { initDb } from "../db.js";

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

function toWebRequest(request: Request): Request {
  // Some runtimes pass a path-relative URL; tRPC's fetch adapter needs an absolute one.
  if (request.url.startsWith("http")) return request;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "vercel.app";
  const proto = request.headers.get("x-forwarded-proto") || "https";
  return new Request(`${proto}://${host}${request.url}`, request as RequestInit & { duplex?: "half" });
}

/** Shared Vercel serverless handler for both /api/trpc and /api/trpc/*. */
export async function trpcHandler(request: Request): Promise<Response> {
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
    req: toWebRequest(request),
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
