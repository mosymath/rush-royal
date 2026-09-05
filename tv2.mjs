import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
const client = createTRPCClient({ links: [httpBatchLink({ url: "https://rush-royal.vercel.app/api/trpc", transformer: superjson })] });
async function t(label, fn) { try { const r = await fn(); console.log("OK:", label, "->", typeof r === "object" ? JSON.stringify(r) : r); } catch (e) { console.log("ERR:", label, "->", e.message); } }
await t("catalog.list", () => client.catalog.list.query().then(c => `${c.lessons.length} lessons; first=${c.lessons[0]?.id}/${c.lessons[0]?.status}`));
await t("shop.items", () => client.shop.items.query().then(i => `${i.length} items`));
await t("admin.login", () => client.admin.login.mutate({ password: "mosy-admin" }));
await t("admin.me", () => client.admin.me.query());
