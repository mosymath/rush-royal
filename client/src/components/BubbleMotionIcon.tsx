import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";

const offlineWasmUrl = typeof window === "undefined" ? undefined : (window as Window & { __MOSY_DOTLOTTIE_WASM_URL__?: string }).__MOSY_DOTLOTTIE_WASM_URL__;
if (offlineWasmUrl) setWasmUrl(offlineWasmUrl);

const ICON_SOURCES = {
  bubbles: "manus-storage/bubbles_93705305.json",
  clap: "manus-storage/clap_0b61e1e4.json",
  coin: "manus-storage/coin_6f0b57ca.json",
  comet: "manus-storage/comet_d6399d3b.json",
  confetti: "manus-storage/confetti_3a4458d5.json",
  confettiBall: "manus-storage/confetti-ball_24abaecf.json",
  crystal: "manus-storage/crystal-ball_caa07fa6.json",
  gem: "manus-storage/gem-stone_ec7df8a2.json",
  planet: "manus-storage/planet_d46f3b64.json",
  gift: "manus-storage/wrapped-gift_583fd0c9.json",
  warning: "manus-storage/warning_6d5118cd.json",
  ruler: "manus-storage/ruler_b38abce0.json",
  scale: "manus-storage/scale_ad8b1c6c.json",
  bottle: "manus-storage/bottle_45eb9433.json",
  clock: "manus-storage/clock_5c3c8e80.json",
  stopwatch: "manus-storage/stopwatch_3cfb6d59.json",
  calculator: "manus-storage/calculator_24c4bc67.json",
  abacus: "manus-storage/abacus_363f759e.json",
} as const;

export type BubbleMotionIconName = keyof typeof ICON_SOURCES;

const iconDataCache = new Map<string, string>();
const iconLoaders = new Map<string, Promise<string>>();

function loadIconData(source: string) {
  const cached = iconDataCache.get(source);
  if (cached) return Promise.resolve(cached);
  const pending = iconLoaders.get(source);
  if (pending) return pending;
  const loader = fetch(source)
    .then((response) => {
      if (!response.ok) throw new Error(`Unable to load motion icon: ${response.status}`);
      return response.text();
    })
    .then((data) => {
      iconDataCache.set(source, data);
      return data;
    })
    .finally(() => iconLoaders.delete(source));
  iconLoaders.set(source, loader);
  return loader;
}

export default function BubbleMotionIcon({
  name,
  label,
  className = "",
  size = 48,
  speed = 0.82,
  decorative = false,
}: {
  name: BubbleMotionIconName;
  label?: string;
  className?: string;
  size?: number;
  speed?: number;
  decorative?: boolean;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const source = ICON_SOURCES[name];
  const [animationData, setAnimationData] = useState(() => iconDataCache.get(source) ?? null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let mounted = true;
    setAnimationData(iconDataCache.get(source) ?? null);
    void loadIconData(source).then((data) => { if (mounted) setAnimationData(data); }).catch(() => undefined);
    return () => { mounted = false; };
  }, [source]);

  return <span
    className={`bp-motion-icon ${className}`}
    style={{ width: size, height: size } as React.CSSProperties}
    data-icon-name={name}
    data-motion={reducedMotion ? "static" : "animated"}
    role={decorative ? undefined : "img"}
    aria-label={decorative ? undefined : label ?? `${name} animated game icon`}
    aria-hidden={decorative ? true : undefined}
  >
    {animationData ? <DotLottieReact data={animationData} autoplay={!reducedMotion} loop={!reducedMotion} speed={speed} renderConfig={{ devicePixelRatio: 1, autoResize: true }} /> : <span className="bp-motion-icon-loading" aria-hidden="true" />}
  </span>;
}
