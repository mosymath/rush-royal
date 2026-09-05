import { trpcHandler } from "../server/_core/trpcHandler.js";

export const config = { runtime: "nodejs" };
export function GET(request: Request) {
  return trpcHandler(request);
}
export function POST(request: Request) {
  return trpcHandler(request);
}
export function HEAD(request: Request) {
  return trpcHandler(request);
}
export function OPTIONS(request: Request) {
  return trpcHandler(request);
}
