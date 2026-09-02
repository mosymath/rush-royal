export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  /** Local SQLite file path. Defaults to ./data/mosy-math.db. */
  databasePath: process.env.DATABASE_PATH ?? "",
  /** Password that unlocks the admin (teacher/owner) panel. */
  adminPassword: process.env.ADMIN_PASSWORD ?? "mosy-admin",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};
