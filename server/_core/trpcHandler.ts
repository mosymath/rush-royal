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

/** Shared Vercel serverless handler for both /api/trpc and /api/trpc/*. */
export async function trpcHandler(req: Request): Promise<Response> {
  if (!initialized) {
    try {
      await initDb();
    } catch (error) {
      console.error("[Database] init failed:", error);
    }
    initialized = true;
  }

  // Vercel hands the function a path-relative URL (e.g. "/api/trpc?batch=1");
  // the tRPC fetch adapter calls `new URL(req.url)`, which needs an absolute URL.
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "vercel.app";
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const init: RequestInit & { duplex?: "half" } = { method: req.method, headers: req.headers };
  if (req.body) {
    init.body = req.body;
    init.duplex = "half";
  }
  const request = new Request(new URL(req.url, `${proto}://${host}`).toString(), init);

  const jar: CookieToSet[] = [];
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
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
