export type MosyAvatar = {
  id: string;
  name: string;
  hue: string;
  image?: string;
  icon?: string;
};

export const MOSY_AVATARS: MosyAvatar[] = [
  { id: "starlight", name: "Starlight", image: "manus-storage/mosy-avatar-reference_14386445.png", hue: "#ff8c64" },
  { id: "orbit", name: "Orbit", image: "manus-storage/mosy-avatar-orbit_2f3d9017.png", hue: "#6ecdf1" },
  { id: "comet", name: "Comet", image: "manus-storage/mosy-avatar-comet_c2c2827a.png", hue: "#b997ff" },
  { id: "spark", name: "Spark", image: "manus-storage/mosy-avatar-spark_b0707add.png", hue: "#ffd05e" },
  { id: "aurora", name: "Aurora", image: "manus-storage/mosy-avatar-aurora_8fbaeae3.png", hue: "#8ae6ca" },
  { id: "galaxy", name: "Galaxy", image: "manus-storage/mosy-avatar-galaxy_431bc9fd.png", hue: "#ed91bd" },
  { id: "solar", name: "Solar", image: "manus-storage/mosy-avatar-solar_095fc0fd.png", hue: "#ffd05e" },
  { id: "nova", name: "Nova", image: "manus-storage/mosy-avatar-nova_1a66ea72.png", hue: "#8bb7ff" },
  { id: "pippin-panda", name: "Pippin Panda", icon: "🐼", hue: "#7c76bf" },
  { id: "pebble-penguin", name: "Pebble Penguin", icon: "🐧", hue: "#76b7df" },
  { id: "skelly", name: "Skelly", icon: "💀", hue: "#b38dea" },
  { id: "coco-kitten", name: "Coco Kitten", icon: "🐱", hue: "#ff9a71" },
  { id: "waffles-puppy", name: "Waffles Puppy", icon: "🐶", hue: "#f6b75a" },
  { id: "hazel-fox", name: "Hazel Fox", icon: "🦊", hue: "#f17d62" },
  { id: "bubbles-bunny", name: "Bubbles Bunny", icon: "🐰", hue: "#e797ca" },
  { id: "sunny-lion", name: "Sunny Lion", icon: "🦁", hue: "#ffc85a" },
  { id: "tiko-turtle", name: "Tiko Turtle", icon: "🐢", hue: "#72cbb1" },
  { id: "niblet-koala", name: "Niblet Koala", icon: "🐨", hue: "#91a3c9" },
  { id: "milo-monkey", name: "Milo Monkey", icon: "🐵", hue: "#be8c64" },
  { id: "dot-dragon", name: "Dot Dragon", icon: "🐲", hue: "#9a80e0" },
  { id: "luma-unicorn", name: "Luma Unicorn", icon: "🦄", hue: "#d18ae9" },
  { id: "rocco-raccoon", name: "Rocco Raccoon", icon: "🦝", hue: "#96a2b8" },
  { id: "kiwi-parrot", name: "Kiwi Parrot", icon: "🦜", hue: "#f18c72" },
];

export const getMosyAvatar = (avatarId?: string) => MOSY_AVATARS.find((avatar) => avatar.id === avatarId) ?? MOSY_AVATARS[0]!;

/** Premium avatars unlocked by purchasing them in the shop. */
export const MOSY_PREMIUM_AVATARS: MosyAvatar[] = [
  { id: "astro-pup", name: "Astro Pup", icon: "🐶", hue: "#7c76bf" },
  { id: "crystal-fox", name: "Crystal Fox", icon: "🦊", hue: "#f17d62" },
  { id: "neon-panda", name: "Neon Panda", icon: "🐼", hue: "#8ae6ca" },
  { id: "galaxy-bear", name: "Galaxy Bear", icon: "🐻", hue: "#b38dea" },
  { id: "ruby-owl", name: "Ruby Owl", icon: "🦉", hue: "#ed91bd" },
  { id: "cosmo-cat", name: "Cosmo Cat", icon: "🐱", hue: "#8bb7ff" },
];

export const getAnyMosyAvatar = (avatarId?: string) => {
  return MOSY_PREMIUM_AVATARS.find((avatar) => avatar.id === avatarId) ?? getMosyAvatar(avatarId);
};
