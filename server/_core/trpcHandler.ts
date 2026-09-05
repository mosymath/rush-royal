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

async function readBody(req: Record<string, unknown>): Promise<string | null> {
  if (req.method === "GET" || req.method === "HEAD") return null;
  const body = req.body;
  if (typeof body === "string") return body;
  if (Buffer.isBuffer(body)) return body.toString("utf8");
  if (body != null && typeof body === "object") {
    const b = body as { pipe?: unknown; [Symbol.asyncIterator]?: unknown };
    if (typeof b.pipe === "function" || b[Symbol.asyncIterator]) {
      const chunks: Buffer[] = [];
      for await (const chunk of body as AsyncIterable<Uint8Array>) chunks.push(Buffer.from(chunk));
      return Buffer.concat(chunks).toString("utf8");
    }
    return JSON.stringify(body);
  }
  return null;
}

/** Shared Vercel serverless handler for both /api/trpc and /api/trpc/*. */
export async function trpcHandler(req: Record<string, unknown>): Promise<Response> {
  if (!initialized) {
    try {
      await initDb();
    } catch (error) {
      console.error("[Database] init failed:", error);
    }
    initialized = true;
  }

  const headersObj = (req.headers ?? {}) as Record<string, string | string[] | undefined>;
  const host = headersObj["x-forwarded-host"] ?? headersObj.host ?? "vercel.app";
  const proto = headersObj["x-forwarded-proto"] ?? "https";
  const url = new URL(req.url as string, `${proto}://${host}`).toString();
  const method = (req.method as string) ?? "GET";

  const headers = new Headers();
  for (const [key, value] of Object.entries(headersObj)) {
    if (typeof value === "string") headers.set(key, value);
    else if (Array.isArray(value)) value.forEach((item) => headers.append(key, item));
  }

  const body = await readBody(req);
  const init: RequestInit & { duplex?: "half" } = { method, headers };
  if (body !== null) {
    init.body = body;
    init.duplex = "half";
  }
  const request = new Request(url, init);

  const jar: CookieToSet[] = [];
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: (opts) => createFetchContext(opts.req, jar) as unknown as TrpcContext,
  });

  if (jar.length === 0) return response;

  const respHeaders = new Headers(response.headers);
  for (const cookie of jar) {
    respHeaders.append("set-cookie", serializeCookie(cookie.name, cookie.value, cookie.options));
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers: respHeaders });
}
