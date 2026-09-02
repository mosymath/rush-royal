/**
 * Mosy Math shop catalog. Shared by the client (to render the shop) and the
 * server (to validate purchases and costs). Items are purchased with coins
 * earned from correct-answer streaks.
 */

export type ShopCategory = "avatar" | "effect" | "theme";

export type ShopItem = {
  id: string;
  category: ShopCategory;
  name: string;
  description: string;
  cost: number;
  /** Emoji preview used by the shop tiles and equipped badges. */
  preview: string;
  /** Accent color used for the item tile and (for themes) the world tint. */
  accent: string;
};

export const SHOP_ITEMS: ShopItem[] = [
  // ---- Effects (correct-answer / celebration flourishes) ----
  { id: "confetti", category: "effect", name: "Confetti Blast", description: "Rainbow confetti bursts on every correct answer.", cost: 150, preview: "🎉", accent: "#ff9ac4" },
  { id: "fireworks", category: "effect", name: "Fireworks Finale", description: "A grand fireworks shower for your victories.", cost: 250, preview: "🎆", accent: "#ffd05e" },
  { id: "rainbow", category: "effect", name: "Rainbow Burst", description: "A full rainbow arc lights up each right answer.", cost: 200, preview: "🌈", accent: "#8ae6ca" },
  { id: "starlight", category: "effect", name: "Starlight Shower", description: "Golden sparkles rain down when you get it right.", cost: 150, preview: "✨", accent: "#ffe3a3" },
  { id: "comet", category: "effect", name: "Comet Trail", description: "A bright comet streaks across your celebrations.", cost: 300, preview: "☄️", accent: "#b997ff" },

  // ---- Themes (world color accents) ----
  { id: "sunset", category: "theme", name: "Sunset Carnival", description: "Warm coral and gold skies for every world.", cost: 200, preview: "🌅", accent: "#ff8c64" },
  { id: "ocean", category: "theme", name: "Ocean Adventure", description: "Cool teal and blue seas across the arcade.", cost: 200, preview: "🌊", accent: "#6ecdf1" },
  { id: "candy", category: "theme", name: "Candy Cloud", description: "Soft pink and mint candy clouds everywhere.", cost: 200, preview: "🍭", accent: "#f6a5c0" },
  { id: "galaxy", category: "theme", name: "Galaxy Night", description: "Deep violet and star-gold cosmic tones.", cost: 300, preview: "🌌", accent: "#8b7bd8" },
  { id: "mint", category: "theme", name: "Mint Forest", description: "Fresh green and cream woodland colors.", cost: 150, preview: "🌿", accent: "#72cbb1" },

  // ---- Premium avatars (unlockable player characters) ----
  { id: "astro-pup", category: "avatar", name: "Astro Pup", description: "A space-loving puppy ready for orbit.", cost: 400, preview: "🐶", accent: "#7c76bf" },
  { id: "crystal-fox", category: "avatar", name: "Crystal Fox", description: "A clever fox with a sparkling crystal coat.", cost: 500, preview: "🦊", accent: "#f17d62" },
  { id: "neon-panda", category: "avatar", name: "Neon Panda", description: "A glowing panda that lights up the night.", cost: 450, preview: "🐼", accent: "#8ae6ca" },
  { id: "galaxy-bear", category: "avatar", name: "Galaxy Bear", description: "A big friendly bear from the stars.", cost: 500, preview: "🐻", accent: "#b38dea" },
  { id: "ruby-owl", category: "avatar", name: "Ruby Owl", description: "A wise owl with a ruby-red sparkle.", cost: 400, preview: "🦉", accent: "#ed91bd" },
  { id: "cosmo-cat", category: "avatar", name: "Cosmo Cat", description: "A cool cosmic cat with curious eyes.", cost: 450, preview: "🐱", accent: "#8bb7ff" },
];

export function getShopItem(id: string) {
  return SHOP_ITEMS.find((item) => item.id === id) ?? null;
}

export function getShopItemCost(id: string) {
  return getShopItem(id)?.cost ?? 0;
}

export const SHOP_CATEGORIES: { id: ShopCategory; label: string; icon: string }[] = [
  { id: "avatar", label: "Avatars", icon: "🧑‍🚀" },
  { id: "effect", label: "Effects", icon: "🎉" },
  { id: "theme", label: "Themes", icon: "🎨" },
];

/** Parses a stored inventory string (comma-separated ids) into a safe set. */
export function parseInventory(inventory: string | null | undefined): string[] {
  if (!inventory) return [];
  return inventory.split(",").map((id) => id.trim()).filter((id) => getShopItem(id) !== null);
}

/** Serializes an owned-item id array into the stored inventory string. */
export function serializeInventory(ids: string[]) {
  return Array.from(new Set(ids.filter((id) => getShopItem(id) !== null))).join(",");
}
