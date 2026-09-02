import { Sparkles, Star } from "lucide-react";
import { useEffect } from "react";
import { getNewMosyMilestoneReward, getPlayerLevelCelebrationMessage, type MosyMilestoneReward, type MOSY_PLAYER_LEVELS } from "@/game/playerProfile";
import "./levelUpCelebration.css";

type ReachedLevel = (typeof MOSY_PLAYER_LEVELS)[number];

const rewardFlourishStyles = `
.mosy-reward-flourish{position:absolute;inset:0;pointer-events:none;overflow:hidden}.mosy-reward-flourish>*{position:absolute;font-style:normal;line-height:1}.mosy-reward-flourish--starburst i{color:#ffe58d;animation:mosy-reward-star 1.25s cubic-bezier(.23,1,.32,1) both}.mosy-reward-flourish--starburst i:nth-child(1){right:9%;top:10%;font-size:1.2rem}.mosy-reward-flourish--starburst i:nth-child(2){right:22%;top:22%;font-size:.72rem;animation-delay:.09s}.mosy-reward-flourish--starburst i:nth-child(3){right:5%;top:37%;font-size:.64rem;animation-delay:.16s}.mosy-reward-flourish--starburst i:nth-child(4){right:27%;top:43%;font-size:.5rem;animation-delay:.22s}.mosy-reward-flourish--cometTrail i{right:7%;top:14%;color:#ffcf90;font-size:1.65rem;animation:mosy-reward-comet 1.35s cubic-bezier(.23,1,.32,1) both}.mosy-reward-flourish--cometTrail b{right:17%;top:30%;width:2.5rem;height:.16rem;border-radius:999px;background:linear-gradient(90deg,transparent,rgba(255,203,138,.8));transform:rotate(-22deg);animation:mosy-reward-trail 1.25s ease-out both}.mosy-reward-flourish--cometTrail b:nth-child(3){right:23%;top:38%;width:1.7rem;animation-delay:.12s}.mosy-reward-flourish--orbitRings i{right:10%;top:12%;color:#aee9ff;font-size:1.45rem;animation:mosy-reward-goggle 1.35s cubic-bezier(.23,1,.32,1) both}.mosy-reward-flourish--orbitRings b{right:6%;top:8%;width:2.6rem;height:1.05rem;border:1px solid rgba(149,224,255,.76);border-radius:50%;transform:rotate(-21deg);animation:mosy-reward-orbit 1.45s linear both}.mosy-reward-flourish--orbitRings b:nth-child(3){right:9%;top:15%;width:2.1rem;animation-delay:.12s}.mosy-reward-flourish--crownRays i{right:9%;top:10%;color:#ffe797;font-size:1.55rem;animation:mosy-reward-crown 1.15s cubic-bezier(.23,1,.32,1) both}.mosy-reward-flourish--crownRays b{right:17%;top:18%;width:.12rem;height:1.1rem;background:linear-gradient(#fff4ba,transparent);transform-origin:bottom;animation:mosy-reward-ray 1.1s ease-out both}.mosy-reward-flourish--crownRays b:nth-child(3){right:9%;top:16%;transform:rotate(28deg);animation-delay:.08s}.mosy-reward-flourish--crownRays b:nth-child(4){right:26%;top:20%;transform:rotate(-28deg);animation-delay:.15s}@keyframes mosy-reward-star{0%{opacity:0;transform:scale(.35) rotate(-25deg)}55%{opacity:1;transform:scale(1.18) rotate(12deg)}100%{opacity:.55;transform:scale(.92) rotate(20deg)}}@keyframes mosy-reward-comet{0%{opacity:0;transform:translate(-2.4rem,1rem) rotate(-22deg)}55%{opacity:1;transform:translate(.15rem,-.05rem) rotate(-22deg)}100%{opacity:.7;transform:translate(.4rem,-.16rem) rotate(-22deg)}}@keyframes mosy-reward-trail{0%{opacity:0;transform:translate(-1.2rem,.5rem) rotate(-22deg)}100%{opacity:.72;transform:translate(.1rem,0) rotate(-22deg)}}@keyframes mosy-reward-goggle{0%{opacity:0;transform:scale(.4) rotate(-18deg)}60%{opacity:1;transform:scale(1.13) rotate(12deg)}100%{opacity:.7;transform:scale(.96) rotate(0)}}@keyframes mosy-reward-orbit{0%{opacity:0;transform:scale(.45) rotate(-45deg)}100%{opacity:.72;transform:scale(1) rotate(34deg)}}@keyframes mosy-reward-crown{0%{opacity:0;transform:translateY(.8rem) scale(.5)}60%{opacity:1;transform:translateY(-.08rem) scale(1.16)}100%{opacity:.76;transform:translateY(0) scale(1)}}@keyframes mosy-reward-ray{0%{opacity:0;transform:scaleY(.15)}100%{opacity:.65;transform:scaleY(1)}}@media (prefers-reduced-motion:reduce){.mosy-reward-flourish *{animation:none!important}}
`;

function RewardFlourish({ effect }: { effect: MosyMilestoneReward["effect"] }) {
  if (effect === "starburst") return <span className="mosy-reward-flourish mosy-reward-flourish--starburst" aria-hidden="true">{Array.from({ length: 4 }, (_, index) => <i key={index}>✦</i>)}</span>;
  if (effect === "cometTrail") return <span className="mosy-reward-flourish mosy-reward-flourish--cometTrail" aria-hidden="true"><i>☄</i><b /><b /></span>;
  if (effect === "orbitRings") return <span className="mosy-reward-flourish mosy-reward-flourish--orbitRings" aria-hidden="true"><i>◉</i><b /><b /></span>;
  return <span className="mosy-reward-flourish mosy-reward-flourish--crownRays" aria-hidden="true"><i>♛</i><b /><b /><b /></span>;
}

export default function LevelUpCelebration({ level, onComplete }: { level: ReachedLevel; onComplete: () => void }) {
  const reward = getNewMosyMilestoneReward(level.level);
  useEffect(() => {
    const timeout = window.setTimeout(onComplete, 3_600);
    return () => window.clearTimeout(timeout);
  }, [onComplete]);

  return <div className="mosy-level-up" role="status" aria-live="assertive" aria-atomic="true"><style>{rewardFlourishStyles}</style>
    <div className="mosy-level-up-sparks" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} style={{ "--spark-index": index } as React.CSSProperties}>✦</i>)}</div>
    <div className="mosy-level-up-card" style={{ position: "relative", overflow: "hidden" }}>{reward ? <RewardFlourish effect={reward.effect} /> : null}
      <span className="mosy-level-up-icon"><Star size={25} fill="currentColor" /><Sparkles size={15} /></span>
      <div><p>LEVEL UP!</p><h2>Level {level.level} · {level.title}</h2><span>{getPlayerLevelCelebrationMessage(level.level)}</span>{reward ? <small style={{ display: "inline-flex", alignItems: "center", gap: ".3rem", marginTop: ".45rem", borderRadius: "999px", padding: ".26rem .48rem", background: "rgba(255,244,196,.7)", color: "#805c32", fontWeight: 900, fontSize: ".62rem", letterSpacing: ".04em" }}><i aria-hidden="true" style={{ fontStyle: "normal", fontSize: ".82rem" }}>{reward.icon}</i> {reward.name.toUpperCase()} UNLOCKED</small> : null}</div>
    </div>
  </div>;
}
