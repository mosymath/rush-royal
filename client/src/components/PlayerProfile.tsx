import { Pencil, Sparkles, Star } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { getAnyMosyAvatar, MOSY_AVATARS, MOSY_PREMIUM_AVATARS } from "@/game/playerAvatars";
import { getPlayerLevelProgress, getUnlockedMosyMilestoneRewards, MOSY_LEVEL_BASE_SCORE, MOSY_MILESTONE_REWARDS, nicknameError, normalizeNickname, type MosyMilestoneReward, type MosyPlayerProfile } from "@/game/playerProfile";
import { parseInventory } from "@shared/shop";
import "./playerProfile.css";
import "./playerLevel.css";
import "./playerIconAvatars.css";

type ProfileSetupProps = {
  initialProfile: MosyPlayerProfile | null;
  onSave: (nickname: string, avatarId: string) => void;
  onCancel?: () => void;
  teacherControls?: ReactNode;
};

function AvatarArt({ avatar, className = "" }: { avatar: ReturnType<typeof getAnyMosyAvatar>; className?: string }) {
  return avatar.image ? <img className={className} src={avatar.image} alt={`${avatar.name} character`} /> : <span className={`mosy-avatar-icon ${className}`} aria-hidden="true">{avatar.icon}</span>;
}

/** A small static key for the celebration flourish; previews stay calm even with reduced motion enabled. */
function RewardFlourishPreview({ reward }: { reward: MosyMilestoneReward }) {
  const frame: React.CSSProperties = { position: "relative", display: "grid", placeItems: "center", flex: "0 0 auto", width: "1.78rem", height: "1.78rem", borderRadius: ".58rem", background: "rgba(255,248,211,.72)", color: "#75563c", overflow: "hidden" };
  const main: React.CSSProperties = { position: "relative", zIndex: 1, fontSize: ".95rem", fontStyle: "normal", lineHeight: 1 };
  if (reward.effect === "starburst") return <span aria-hidden="true" title="Starburst flourish preview" style={frame}><i style={{ ...main, color: "#d79b3e" }}>✦</i><b style={{ position: "absolute", top: ".13rem", right: ".2rem", color: "#ffe18a", fontSize: ".45rem" }}>✦</b><b style={{ position: "absolute", bottom: ".12rem", left: ".21rem", color: "#fff0aa", fontSize: ".37rem" }}>✦</b></span>;
  if (reward.effect === "cometTrail") return <span aria-hidden="true" title="Comet trail flourish preview" style={frame}><i style={{ ...main, transform: "translateX(.2rem) rotate(-15deg)", color: "#dd8d57" }}>☄</i><b style={{ position: "absolute", left: ".1rem", top: ".9rem", width: ".9rem", height: ".11rem", borderRadius: "999px", background: "linear-gradient(90deg,transparent,#ffc77e)", transform: "rotate(-18deg)" }} /></span>;
  if (reward.effect === "orbitRings") return <span aria-hidden="true" title="Orbit rings flourish preview" style={frame}><i style={{ ...main, color: "#6aa6bf" }}>◉</i><b style={{ position: "absolute", width: "1.35rem", height: ".53rem", border: "1px solid rgba(110,192,219,.74)", borderRadius: "50%", transform: "rotate(-22deg)" }} /><b style={{ position: "absolute", width: "1.03rem", height: ".4rem", border: "1px solid rgba(165,225,239,.7)", borderRadius: "50%", transform: "rotate(22deg)" }} /></span>;
  return <span aria-hidden="true" title="Crown rays flourish preview" style={frame}><i style={{ ...main, color: "#cb9c36" }}>♛</i><b style={{ position: "absolute", top: ".16rem", left: ".4rem", width: ".07rem", height: ".45rem", background: "#ffe797", transform: "rotate(-28deg)" }} /><b style={{ position: "absolute", top: ".12rem", width: ".07rem", height: ".42rem", background: "#fff1ad" }} /><b style={{ position: "absolute", top: ".16rem", right: ".4rem", width: ".07rem", height: ".45rem", background: "#ffe797", transform: "rotate(28deg)" }} /></span>;
}

export function PlayerProfileSetup({ initialProfile, onSave, onCancel, teacherControls }: ProfileSetupProps) {
  const [nickname, setNickname] = useState(initialProfile?.nickname ?? "");
  const [avatarId, setAvatarId] = useState(initialProfile?.avatarId ?? MOSY_AVATARS[0]!.id);
  const error = useMemo(() => nicknameError(nickname), [nickname]);
  const selected = getAnyMosyAvatar(avatarId);
  const ownedIds = useMemo(() => parseInventory(initialProfile?.inventory ?? ""), [initialProfile?.inventory]);
  const levelProgress = useMemo(() => getPlayerLevelProgress(initialProfile?.totalScore ?? 0), [initialProfile?.totalScore]);
  const unlockedRewards = useMemo(() => getUnlockedMosyMilestoneRewards(initialProfile?.totalScore ?? 0), [initialProfile?.totalScore]);
  const submit = () => { if (!error) onSave(normalizeNickname(nickname), avatarId); };

  return <main className="mosy-profile-setup" aria-labelledby="player-setup-title">
    <div className="mosy-profile-stars" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
    <section className="mosy-profile-card">
      <div className="mosy-profile-heading"><p><Sparkles size={16} /> YOUR MOSY PLAYER</p><h1 id="player-setup-title">Pick your play spark.</h1><span>Your nickname, character, and score stay on this device—ready for the next game.</span></div>
      <div className="mosy-profile-current" style={{ "--avatar-glow": selected.hue } as React.CSSProperties}>
        <div className="mosy-profile-current-image"><AvatarArt avatar={selected} /></div>
        <div><p>YOUR CHARACTER</p><b>{selected.name}</b><span>Ready to make math glow.</span></div>
      </div>
      <section className="mosy-level-card" aria-label={`Level ${levelProgress.level.level} player progress`}>
        <div><span>LEVEL {levelProgress.level.level} · {levelProgress.level.title.toUpperCase()}</span><b>{(initialProfile?.totalScore ?? 0).toLocaleString()} TOTAL SPARKS</b></div>
        <i><b style={{ width: `${levelProgress.progressPercent}%` }} /></i>
        <small>{levelProgress.nextLevel ? `${levelProgress.scoreToNextLevel.toLocaleString()} more sparks to Level ${levelProgress.nextLevel.level} · ${levelProgress.nextLevel.title}` : "Level 10 Mosy Math Adventure Master unlocked!"}</small>{unlockedRewards.length ? <div aria-label={`Unlocked rewards: ${unlockedRewards.map((reward) => reward.name).join(", ")}`} style={{ display: "flex", flexWrap: "wrap", gap: ".32rem", marginTop: ".6rem" }}>{unlockedRewards.map((reward) => <span key={reward.level} title={reward.description} style={{ display: "inline-flex", alignItems: "center", gap: ".24rem", borderRadius: "999px", padding: ".24rem .42rem", background: "rgba(255,248,211,.8)", color: "#785a45", fontSize: ".58rem", fontWeight: 900, letterSpacing: ".03em" }}><i aria-hidden="true" style={{ fontStyle: "normal" }}>{reward.icon}</i>{reward.name}</span>)}</div> : null}
      </section>
      <section aria-labelledby="mosy-rewards-gallery-title" style={{ marginTop: ".72rem", padding: ".68rem", border: "1px solid rgba(117,88,144,.18)", borderRadius: ".88rem", background: "linear-gradient(135deg,rgba(255,249,225,.76),rgba(248,241,255,.72))" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: ".5rem", marginBottom: ".5rem" }}><div><p style={{ margin: 0, color: "#7c5f91", fontSize: ".58rem", fontWeight: 950, letterSpacing: ".1em" }}>COSMETIC MILESTONES</p><h2 id="mosy-rewards-gallery-title" style={{ margin: ".1rem 0 0", color: "#513c65", fontSize: ".96rem" }}>Rewards gallery</h2></div><span style={{ color: "#8a7185", fontSize: ".57rem", fontWeight: 800 }}>{unlockedRewards.length}/{MOSY_MILESTONE_REWARDS.length} EARNED</span></div><div role="list" aria-label="Milestone reward gallery" style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: ".38rem" }}>{MOSY_MILESTONE_REWARDS.map((reward) => { const earned = levelProgress.level.level >= reward.level; return <article key={reward.level} role="listitem" aria-label={`${reward.name}: ${earned ? "unlocked" : `unlocks at Level ${reward.level}`}; ${reward.effect} flourish preview`} style={{ display: "flex", alignItems: "center", gap: ".4rem", minWidth: 0, padding: ".38rem", borderRadius: ".6rem", background: earned ? "rgba(255,255,255,.82)" : "rgba(255,255,255,.4)", border: earned ? "1px solid rgba(229,182,79,.4)" : "1px solid rgba(132,112,144,.13)", opacity: earned ? 1 : .62 }}><RewardFlourishPreview reward={reward} /><span style={{ minWidth: 0, display: "grid", gap: ".04rem" }}><b style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#5b4669", fontSize: ".62rem" }}>{reward.name}</b><small style={{ color: earned ? "#9a7544" : "#897987", fontSize: ".5rem", fontWeight: 900, letterSpacing: ".035em" }}>{earned ? "UNLOCKED" : `LEVEL ${reward.level}`}</small></span></article>; })}</div><p style={{ margin: ".5rem 0 0", color: "#7d6c80", fontSize: ".58rem", fontWeight: 700 }}>{unlockedRewards.length < MOSY_MILESTONE_REWARDS.length ? `Next reward: ${MOSY_MILESTONE_REWARDS.find((reward) => reward.level > levelProgress.level.level)?.name ?? "Keep collecting sparks"}.` : "Every milestone reward is unlocked—what a collection!"}</p></section>
      <p className="mosy-score-logic">Score-only level rule: <b>X = {MOSY_LEVEL_BASE_SCORE.toLocaleString()} sparks</b>, the score of 10 standard correct answers. Level 2 begins at X, Level 3 at 2X, and every bonus still counts toward the same total.</p>
      <label className="mosy-nickname-field"><span>NICKNAME</span><input value={nickname} onChange={(event) => setNickname(event.target.value.slice(0, 18))} placeholder="Type a fun nickname" autoComplete="nickname" maxLength={18} onKeyDown={(event) => { if (event.key === "Enter") submit(); }} aria-invalid={!!error && nickname.length > 0} />{error && nickname.length > 0 ? <small role="alert">{error}</small> : <small>2–18 characters · no real name needed.</small>}</label>
      <div className="mosy-avatar-grid" aria-label="Choose a character">{MOSY_AVATARS.map((avatar) => <button type="button" key={avatar.id} className={avatar.id === avatarId ? "is-selected" : ""} onClick={() => setAvatarId(avatar.id)} aria-pressed={avatar.id === avatarId} style={{ "--avatar-glow": avatar.hue } as React.CSSProperties}><AvatarArt avatar={avatar} /><span>{avatar.name}</span><i>✓</i></button>)}{MOSY_PREMIUM_AVATARS.map((avatar) => { const owned = ownedIds.includes(avatar.id); const isSelected = avatar.id === avatarId; return <button type="button" key={avatar.id} className={`${isSelected ? "is-selected" : ""} ${owned ? "is-owned" : "is-locked"}`} onClick={() => owned && setAvatarId(avatar.id)} aria-pressed={isSelected} disabled={!owned} title={owned ? avatar.name : "Unlock this character in the shop"} style={{ "--avatar-glow": avatar.hue } as React.CSSProperties}><AvatarArt avatar={avatar} /><span>{owned ? avatar.name : "LOCKED"}</span><i>{owned ? "✓" : "🔒"}</i></button>; })}</div>
      <div className="mosy-profile-actions">{onCancel ? <button className="mosy-profile-cancel" onClick={onCancel}>CANCEL</button> : null}<button className="mosy-profile-save" disabled={!!error} onClick={submit}>LET’S PLAY <Star size={17} fill="currentColor" /></button></div>
      {teacherControls}
    </section>
  </main>;
}

export function PlayerProfileBadge({ profile, onEdit, className = "" }: { profile: MosyPlayerProfile | null; onEdit: () => void; className?: string }) {
  const avatar = getAnyMosyAvatar(profile?.avatarId);
  const levelProgress = getPlayerLevelProgress(profile?.totalScore ?? 0);
  const unlockedRewards = getUnlockedMosyMilestoneRewards(profile?.totalScore ?? 0);
  const latestReward = unlockedRewards.at(-1);
  return <button className={`mosy-player-badge ${className}`} onClick={onEdit} aria-label={`Edit Mosy player profile${latestReward ? `, latest unlocked reward: ${latestReward.name}` : ""}`} style={{ "--avatar-glow": avatar.hue } as React.CSSProperties}>
    <span className="mosy-player-badge-avatar" style={{ position: "relative" }}><AvatarArt avatar={avatar} />{latestReward ? <i aria-hidden="true" title={latestReward.name} style={{ position: "absolute", right: "-.22rem", bottom: "-.18rem", display: "grid", placeItems: "center", width: "1.08rem", height: "1.08rem", borderRadius: "50%", background: "#fff3ac", boxShadow: "0 2px 6px rgba(103,70,38,.24)", color: "#725137", fontSize: ".72rem", fontStyle: "normal" }}>{latestReward.icon}</i> : null}</span>
    <span className="mosy-player-badge-copy"><b>{profile?.nickname ?? "Player"}</b><small><Star size={12} fill="currentColor" /> {profile?.totalScore?.toLocaleString() ?? "0"} · LV {levelProgress.level.level} <i className="mosy-badge-coin" aria-hidden="true">🪙</i> {profile?.coins?.toLocaleString() ?? "0"}</small></span>
    <Pencil size={13} aria-hidden="true" />
  </button>;
}
