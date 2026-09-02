import { useState } from "react";
import { ArrowLeft, ChevronRight, LockKeyhole, Music2, Play, Sparkles, Star, Volume2, VolumeX } from "lucide-react";
import BubbleMotionIcon, { type BubbleMotionIconName } from "@/components/BubbleMotionIcon";
import BubblePopWorld from "@/components/BubblePopWorld";
import { BUBBLE_ROUTES } from "@/game/bubblePopCurriculum";
import { isMasterChapterUnlocked, readBubbleProgress } from "@/game/bubblePopProgress";
import type { BubbleProgressState, BubbleRouteId } from "@/game/bubblePopTypes";
import "./bubblePop.css";

const CHAPTER_CREST = "manus-storage/bubble-pop-measurement-chapter-crest_1743656d.png";
const MASTER_CREST = "manus-storage/bubble-pop-master-challenge-crest_d24830b0.png";

const ROUTE_ICON_BY_ID: Record<Exclude<BubbleRouteId, "master-challenge">, BubbleMotionIconName> = {
  length: "ruler",
  mass: "scale",
  capacity: "bottle",
  time: "clock",
  "elapsed-time": "stopwatch",
  "add-subtract": "calculator",
  "multiply-divide": "abacus",
};

export default function BubblePopChapter({ onExit, musicOn, onToggleMusic }: { onExit: () => void; musicOn: boolean; onToggleMusic: () => void }) {
  const [activeRoute, setActiveRoute] = useState<BubbleRouteId | null>(() => {
    if (typeof window === "undefined") return null;
    const requestedRoute = new URLSearchParams(window.location.search).get("route") as BubbleRouteId | null;
    return requestedRoute && BUBBLE_ROUTES.some((route) => route.id === requestedRoute) ? requestedRoute : null;
  });
  const [progress, setProgress] = useState<BubbleProgressState>(() => readBubbleProgress());
  const masterUnlocked = isMasterChapterUnlocked(progress);

  if (activeRoute) {
    return <BubblePopWorld routeId={activeRoute} musicOn={musicOn} onToggleMusic={onToggleMusic} onBack={() => { setProgress(readBubbleProgress()); setActiveRoute(null); }} onExit={onExit} />;
  }

  return <main className="bp-chapter-shell" aria-labelledby="bubble-pop-chapter-title">
    <div className="bp-chapter-cloud bp-chapter-cloud-one" aria-hidden="true" /><div className="bp-chapter-cloud bp-chapter-cloud-two" aria-hidden="true" /><div className="bp-chapter-stars" aria-hidden="true"><i /><i /><i /><i /><i /></div>
    <header className="bp-chapter-topbar"><button className="bp-back-button" onClick={onExit}><ArrowLeft size={17} /> MAIN MENU</button><div className="bp-chapter-brand"><BubbleMotionIcon name="bubbles" size={35} decorative /><div><b>BUBBLE POP</b><small>MOSY MATH ADVENTURE · MEASUREMENT CHAPTER</small></div></div><button className={`bp-icon-control ${musicOn ? "" : "is-muted"}`} onClick={onToggleMusic} aria-label={musicOn ? "Turn background music off" : "Turn background music on"}>{musicOn ? <Music2 size={18} /> : <VolumeX size={18} />}<span>{musicOn ? "MUSIC" : "MUTED"}</span></button></header>
    <section className="bp-chapter-hero"><div className="bp-chapter-crest-wrap"><img src={CHAPTER_CREST} alt="Glowing measurement chapter crest" /><span className="bp-crest-orbit bp-crest-orbit-one" /><span className="bp-crest-orbit bp-crest-orbit-two" /></div><div><p className="bp-eyebrow"><Sparkles size={15} /> MEASUREMENT ARCADE</p><h1 id="bubble-pop-chapter-title">Pop your way through<br /><span>the Measurement chapter.</span></h1><p>Seven bright lesson worlds are ready. Master each crystal, then unlock the final Unit Three challenge.</p><div className="bp-chapter-stat-row"><span><b>7</b> LESSON GAMES</span><span><b>{BUBBLE_ROUTES.filter((route) => !route.isMaster).reduce((total, route) => total + progress[route.id as keyof BubbleProgressState].completedLevels.length, 0)}</b> CRYSTALS WON</span></div></div></section>
    <section className="bp-route-section" aria-labelledby="bubble-lessons-title"><div className="bp-section-heading"><div><p>PLAY IN ORDER</p><h2 id="bubble-lessons-title">Choose a Bubble Pop route</h2></div><span>Easy → Normal → Hard</span></div><div className="bp-route-grid">{BUBBLE_ROUTES.filter((route) => !route.isMaster).map((route) => { const routeProgress = progress[route.id as keyof BubbleProgressState]; const routeIcon = ROUTE_ICON_BY_ID[route.id as Exclude<BubbleRouteId, "master-challenge">]; return <article className={`bp-route-card bp-theme-${route.theme}`} style={{ "--bp-accent": route.accent, "--bp-soft": route.accentSoft } as React.CSSProperties} key={route.id}><div className="bp-route-card-top"><span>{route.lesson}</span><BubbleMotionIcon name={routeIcon} size={28} decorative /></div><div className="bp-route-icon"><BubbleMotionIcon name={routeIcon} size={60} label={`${route.shortTitle} animated route icon`} /><em>✦</em></div><p className="bp-route-subtitle">{route.subtitle}</p><h3>{route.shortTitle}</h3><p className="bp-route-description">{route.description}</p><div className="bp-route-crystals" aria-label={`${routeProgress.completedLevels.length} of 3 difficulty crystals earned`}><BubbleMotionIcon name="gem" size={28} decorative /><span>{routeProgress.completedLevels.length} / 3 CRYSTALS</span></div><button onClick={() => setActiveRoute(route.id)}><Play size={15} fill="currentColor" /> PLAY {route.shortTitle.toUpperCase()} <ChevronRight size={16} /></button></article>; })}</div></section>
    <section className={`bp-master-card ${masterUnlocked ? "is-unlocked" : "is-locked"}`} aria-labelledby="master-challenge-title"><div className="bp-master-crest"><BubbleMotionIcon name="crystal" size={104} label="Animated Master Chapter crystal" /></div><div><p>{masterUnlocked ? "FINAL ROUTE UNLOCKED" : "FINAL ROUTE · LOCKED"}</p><h2 id="master-challenge-title">Master Chapter Challenge</h2><span>Mixed Unit Three assessment skills: convert, compare, tell time, and solve mission problems.</span><div className="bp-master-crystals" aria-label={`${BUBBLE_ROUTES.filter((route) => !route.isMaster && progress[route.id as keyof BubbleProgressState].completedLevels.includes("hard")).length} of 7 lesson routes mastered`}><BubbleMotionIcon name="planet" size={31} decorative /><b>{BUBBLE_ROUTES.filter((route) => !route.isMaster && progress[route.id as keyof BubbleProgressState].completedLevels.includes("hard")).length} / 7 ROUTES MASTERED</b></div></div><button disabled={!masterUnlocked} onClick={() => setActiveRoute("master-challenge")}>{masterUnlocked ? <><Star size={17} fill="currentColor" /> PLAY FINAL CHALLENGE</> : <><LockKeyhole size={16} /> MASTER {BUBBLE_ROUTES.filter((route) => !route.isMaster).filter((route) => progress[route.id as keyof BubbleProgressState].completedLevels.includes("hard")).length} / 7</>}</button></section>
  </main>;
}
