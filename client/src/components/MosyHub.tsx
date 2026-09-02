/**
 * Mosy Math Adventure hub: animated entry, game library, and the dependable return point for every learning booth.
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import "./mosyHub.css";
import "./multiplicationTablesMenu.css";
import "./mosyWarmFireflies.css";
import "./mosyGradeSelector.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ArrowRight, Gamepad2, GraduationCap, LockKeyhole, Music2, Play, ShieldCheck, ShoppingBag, Sparkles, Star, Volume2, VolumeX } from "lucide-react";
import BubblePopChapter from "@/components/BubblePopChapter";
import BubbleMotionIcon from "@/components/BubbleMotionIcon";
import AreaMissionChapter from "@/components/AreaMissionChapter";
import MultiplicationMissionChapter from "@/components/MultiplicationMissionChapter";
import MultiplicationTablesWorld from "@/components/MultiplicationTablesWorld";
import FactorsMissionChapter from "@/components/FactorsMissionChapter";
import MdPart1Chapter from "@/components/MdPart1Chapter";
import MdPart2Chapter from "@/components/MdPart2Chapter";
import OrderMissionChapter from "@/components/OrderMissionChapter";
import LevelUpCelebration from "@/components/LevelUpCelebration";
import TeacherProfileControls from "@/components/TeacherProfileControls";
import AnswerFairnessGuard from "@/components/AnswerFairnessGuard";
import Shop from "@/components/Shop";
import AdminPanel from "@/components/AdminPanel";
import { PlayerProfileBadge, PlayerProfileSetup } from "@/components/PlayerProfile";
import GameCanvas, { type RoundRushLaunch } from "@/components/GameCanvas";
import ShapesWorld from "@/components/ShapesWorld";
import { CHALLENGE_LEVELS, PLACES } from "@/game/rounding";
import { roundRushSound } from "@/game/sound";
import { applyPlayerCoinsAward, applyPlayerScoreAward, clearPlayerProfile, createPlayerProfile, getNewlyReachedPlayerLevel, getPlayerLevelProgress, getPlayerProfileKey, readPlayerProfile, writePlayerProfile, writePlayerProfileFromBackend, type MosyPlayerProfile, type PlayerCoinsAward, type PlayerScoreAward } from "@/game/playerProfile";
import { trpc } from "@/lib/trpc";
import type { ChallengeLevel, GameMode, PlaceId } from "@/game/types";

const ASTRONAUT_LOTTIE = "manus-storage/astronaut-floating_5009485d.lottie";
const MUSIC_TRACK = "manus-storage/mosy-math-round-rush-background_f189fba7.wav";
const SCHOOL_YEARS = [
  { id: "KG", label: "Kindergarten", active: false },
  { id: "G1", label: "Grade 1", active: false },
  { id: "G2", label: "Grade 2", active: false },
  { id: "G3", label: "Grade 3", active: false },
  { id: "G4", label: "Grade 4", active: true },
  { id: "G5", label: "Grade 5", active: false },
  { id: "G6", label: "Grade 6", active: false },
] as const;

type HubScreen = "entry" | "profile" | "grades" | "menu" | "rounding" | "shapes" | "bubble" | "area" | "multiply" | "tables" | "factors" | "md-part1" | "md-part2" | "order" | "shop" | "admin";

export default function MosyHub() {
  const [screen, setScreen] = useState<HubScreen>(() => {
    if (typeof window === "undefined") return "entry";
    const params = new URLSearchParams(window.location.search);
    if (params.get("world") === "shapes") return "shapes";
    if (params.get("world") === "bubble") return "bubble";
    if (params.get("world") === "area") return "area";
    if (params.get("world") === "multiply") return "multiply";
    if (params.get("world") === "tables") return "tables";
    if (params.get("world") === "factors") return "factors";
    if (params.get("world") === "md-part1") return "md-part1";
    if (params.get("world") === "md-part2") return "md-part2";
    if (params.get("world") === "order") return "order";
    if (params.get("screen") === "grades") return "grades";
    return params.get("screen") === "menu" ? "menu" : "entry";
  });
  // The current library keeps an intentional, offline-friendly catalog of active game worlds.
  // does not depend on the optional online lesson-catalog service.
  const activeLessonCount = 10;
  const [roundRushMode, setRoundRushMode] = useState<GameMode>("route");
  const [roundRushPlace, setRoundRushPlace] = useState<PlaceId>("10");
  const [roundRushLevel, setRoundRushLevel] = useState<ChallengeLevel>(1);
  const [launchConfig, setLaunchConfig] = useState<RoundRushLaunch>({ mode: "route", place: "10", level: 1 });
  const [shapeLaunch, setShapeLaunch] = useState<"welcome" | "learnselect" | "playselect" | "learn2d" | "play">("welcome");
  const [unlockedLevel, setUnlockedLevel] = useState<ChallengeLevel>(() => {
    if (typeof window === "undefined") return 1;
    const stored = Number(window.localStorage.getItem("mosy-math-round-rush-unlocked-level"));
    return stored === 2 || stored === 3 ? stored : 1;
  });
  const [musicOn, setMusicOn] = useState(true);
  const isDirectOfflineDocument = typeof window !== "undefined" && window.location.protocol === "file:";
  const profileKey = useMemo(() => getPlayerProfileKey(), []);
  const [playerProfile, setPlayerProfile] = useState<MosyPlayerProfile | null>(() => readPlayerProfile());
  const [levelCelebration, setLevelCelebration] = useState<ReturnType<typeof getNewlyReachedPlayerLevel>>(null);
  const [profileReturnScreen, setProfileReturnScreen] = useState<HubScreen>("menu");
  const lastProfileSyncRef = useRef<string | null>(null);
  const hubMusicRef = useRef<HTMLAudioElement>(null);
  const hoveredControlRef = useRef<Element | null>(null);
  const savedProfileQuery = trpc.player.get.useQuery({ profileKey }, { enabled: !isDirectOfflineDocument, retry: false, staleTime: 300_000 });
  const catalogQuery = trpc.catalog.list.useQuery(undefined, { enabled: !isDirectOfflineDocument, retry: false, staleTime: 60_000 });
  const unitStatusMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const lesson of catalogQuery.data?.lessons ?? []) map[lesson.id] = lesson.status;
    return map;
  }, [catalogQuery.data]);
  const showUnit = (id: string) => isDirectOfflineDocument || unitStatusMap[id] === undefined || unitStatusMap[id] === "active";
  const saveProfileMutation = trpc.player.save.useMutation();
  const awardProfileMutation = trpc.player.award.useMutation();
  const teacherRenameMutation = trpc.player.teacherRename.useMutation();
  const teacherResetMutation = trpc.player.teacherReset.useMutation();

  useEffect(() => {
    if (playerProfile || !savedProfileQuery.data) return;
    const restored = writePlayerProfileFromBackend(savedProfileQuery.data);
    setPlayerProfile(restored);
  }, [playerProfile, profileKey, savedProfileQuery.data]);

  useEffect(() => {
    if (isDirectOfflineDocument || !playerProfile || savedProfileQuery.isLoading) return;
    const saved = savedProfileQuery.data;
    const backendAlreadyCurrent = saved && saved.nickname === playerProfile.nickname && saved.avatarId === playerProfile.avatarId && saved.totalScore >= playerProfile.totalScore && saved.coins === playerProfile.coins && saved.inventory === playerProfile.inventory && saved.effectId === playerProfile.effectId && saved.themeId === playerProfile.themeId;
    if (backendAlreadyCurrent) return;
    const syncSignature = `${playerProfile.profileKey}:${playerProfile.nickname}:${playerProfile.avatarId}:${playerProfile.totalScore}:${playerProfile.coins}:${playerProfile.inventory}:${playerProfile.effectId}:${playerProfile.themeId}`;
    if (lastProfileSyncRef.current === syncSignature) return;
    lastProfileSyncRef.current = syncSignature;
    saveProfileMutation.mutate({ profileKey: playerProfile.profileKey, nickname: playerProfile.nickname, avatarId: playerProfile.avatarId, totalScore: playerProfile.totalScore, coins: playerProfile.coins, inventory: playerProfile.inventory, effectId: playerProfile.effectId, themeId: playerProfile.themeId }, { onError: () => { lastProfileSyncRef.current = null; } });
  }, [isDirectOfflineDocument, playerProfile, savedProfileQuery.data, savedProfileQuery.isLoading, saveProfileMutation]);

  useEffect(() => {
    const onAward = (event: Event) => {
      const award = (event as CustomEvent<PlayerScoreAward>).detail;
      if (!award) return;
      const result = applyPlayerScoreAward(award);
      if (!result.applied || !result.profile) return;
      setPlayerProfile(result.profile);
      const previousTotal = Math.max(0, result.profile.totalScore - Math.round(award.points));
      const newlyReachedLevel = getNewlyReachedPlayerLevel(previousTotal, result.profile.totalScore);
      if (newlyReachedLevel) {
        setLevelCelebration(newlyReachedLevel);
        if (musicOn) roundRushSound.levelUp();
      }
      // The database keeps an optional backup; gameplay remains available while offline.
      if (!isDirectOfflineDocument) awardProfileMutation.mutate({ profileKey: result.profile.profileKey, points: award.points });
    };
    window.addEventListener("mosy:score-award", onAward);
    return () => window.removeEventListener("mosy:score-award", onAward);
  }, [awardProfileMutation, isDirectOfflineDocument, musicOn]);

  useEffect(() => {
    const onCoins = (event: Event) => {
      const award = (event as CustomEvent<PlayerCoinsAward>).detail;
      if (!award) return;
      const result = applyPlayerCoinsAward(award);
      if (!result.applied || !result.profile) return;
      setPlayerProfile(result.profile);
    };
    window.addEventListener("mosy:coins-award", onCoins);
    return () => window.removeEventListener("mosy:coins-award", onCoins);
  }, []);

  const playHubMusic = () => {
    const track = hubMusicRef.current;
    if (!track) return;
    track.volume = 0.16;
    void track.play().catch(() => undefined);
  };

  useEffect(() => () => { hubMusicRef.current?.pause(); }, []);

  useEffect(() => {
    if (!musicOn) return;
    const frame = window.requestAnimationFrame(playHubMusic);
    return () => window.cancelAnimationFrame(frame);
  // Playback is intentionally retried after returning to the rendered external menu.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, musicOn]);

  useEffect(() => {
    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target = event.target instanceof Element ? event.target : null;
      const control = target?.closest("button:not(:disabled), [data-mosy-hover-sound]");
      if (!control || control === hoveredControlRef.current) return;
      hoveredControlRef.current = control;
      roundRushSound.hover();
    };
    const onPointerOut = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const control = target?.closest("button:not(:disabled), [data-mosy-hover-sound]");
      if (!control) return;
      const next = event.relatedTarget;
      if (!(next instanceof Node) || !control.contains(next)) hoveredControlRef.current = null;
    };
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    return () => { document.removeEventListener("pointerover", onPointerOver); document.removeEventListener("pointerout", onPointerOut); };
  }, []);

  const toggleHubMusic = () => {
    roundRushSound.enableHoverCues();
    const track = hubMusicRef.current;
    if (musicOn) {
      track?.pause();
      setMusicOn(false);
    } else {
      setMusicOn(true);
      window.requestAnimationFrame(playHubMusic);
    }
  };

  const launchRoundRush = () => { roundRushSound.enableHoverCues(); setLaunchConfig({ mode: roundRushMode, place: roundRushPlace, level: roundRushLevel }); setScreen("rounding"); };
  const returnToMenu = () => {
    const stored = Number(window.localStorage.getItem("mosy-math-round-rush-unlocked-level"));
    setUnlockedLevel(stored === 2 || stored === 3 ? stored : 1);
    setScreen("menu");
  };
  const openProfileEditor = (returnScreen: HubScreen = screen) => { setProfileReturnScreen(returnScreen); setScreen("profile"); };
  const saveProfile = (nickname: string, avatarId: string) => {
    const saved = createPlayerProfile(nickname, avatarId);
    setPlayerProfile(saved);
    if (!isDirectOfflineDocument) saveProfileMutation.mutate({ profileKey: saved.profileKey, nickname: saved.nickname, avatarId: saved.avatarId, totalScore: saved.totalScore });
    setScreen(profileReturnScreen);
  };
  const teacherRenameProfile = async (nickname: string) => {
    if (!playerProfile) return;
    const saved = await teacherRenameMutation.mutateAsync({ profileKey: playerProfile.profileKey, nickname });
    if (!saved) throw new Error("Backend profile was not available.");
    setPlayerProfile(writePlayerProfile({ ...playerProfile, nickname: saved.nickname, avatarId: saved.avatarId, totalScore: saved.totalScore, updatedAt: Date.now() }));
  };
  const teacherResetProfile = async () => {
    if (!playerProfile) return;
    const result = await teacherResetMutation.mutateAsync({ profileKey: playerProfile.profileKey });
    if (!result.success) throw new Error("Backend profile reset did not complete.");
    clearPlayerProfile(); setPlayerProfile(null); setLevelCelebration(null); setScreen("entry");
  };
  const playerBadge = <PlayerProfileBadge profile={playerProfile} onEdit={() => openProfileEditor()} className={screen === "menu" ? "mosy-player-badge--menu" : screen === "entry" ? "" : "mosy-player-badge--world"} />;
  const levelCelebrationOverlay = levelCelebration ? <LevelUpCelebration level={levelCelebration} onComplete={() => setLevelCelebration(null)} /> : null;
  const worldShell = (world: ReactNode) => <><audio ref={hubMusicRef} src={MUSIC_TRACK} loop preload="auto" />{playerBadge}{levelCelebrationOverlay}<AnswerFairnessGuard />{world}</>;
  const musicControl = <button className={`mosy-ambient-control ${musicOn ? "" : "is-muted"}`} onClick={toggleHubMusic} aria-label={musicOn ? "Turn Mosy Math Adventure background music off" : "Turn Mosy Math Adventure background music on"} data-mosy-hover-sound>{musicOn ? <Volume2 size={17} /> : <VolumeX size={17} />}<span>{musicOn ? "MUSIC ON" : "MUSIC OFF"}</span></button>;

  if (screen === "rounding") return worldShell(<GameCanvas onExit={returnToMenu} externalLaunch={launchConfig} musicOn={musicOn} onToggleMusic={toggleHubMusic} />);
  if (screen === "shapes") return worldShell(<ShapesWorld onExit={returnToMenu} musicOn={musicOn} onToggleMusic={toggleHubMusic} initialScreen={shapeLaunch} />);
  if (screen === "bubble") return worldShell(<BubblePopChapter onExit={returnToMenu} musicOn={musicOn} onToggleMusic={toggleHubMusic} />);
  if (screen === "area") return worldShell(<AreaMissionChapter onExit={returnToMenu} musicOn={musicOn} onToggleMusic={toggleHubMusic} />);
  if (screen === "multiply") return worldShell(<MultiplicationMissionChapter onExit={returnToMenu} musicOn={musicOn} onToggleMusic={toggleHubMusic} />);
  if (screen === "tables") return worldShell(<MultiplicationTablesWorld onExit={returnToMenu} musicOn={musicOn} onToggleMusic={toggleHubMusic} />);
  if (screen === "factors") return worldShell(<FactorsMissionChapter onExit={returnToMenu} musicOn={musicOn} onToggleMusic={toggleHubMusic} />);
  if (screen === "md-part1") return worldShell(<MdPart1Chapter onExit={returnToMenu} musicOn={musicOn} onToggleMusic={toggleHubMusic} />);
  if (screen === "md-part2") return worldShell(<MdPart2Chapter onExit={returnToMenu} musicOn={musicOn} onToggleMusic={toggleHubMusic} />);
  if (screen === "order") return worldShell(<OrderMissionChapter onExit={returnToMenu} musicOn={musicOn} onToggleMusic={toggleHubMusic} />);

  if (screen === "shop") return <><audio ref={hubMusicRef} src={MUSIC_TRACK} loop preload="auto" />{playerBadge}<Shop profile={playerProfile} onUpdateProfile={setPlayerProfile} onExit={returnToMenu} musicOn={musicOn} onToggleMusic={toggleHubMusic} /></>;

  if (screen === "admin") return <><audio ref={hubMusicRef} src={MUSIC_TRACK} loop preload="auto" /><AdminPanel onExit={returnToMenu} musicOn={musicOn} onToggleMusic={toggleHubMusic} /></>;

  if (screen === "grades") {
    return <><audio ref={hubMusicRef} src={MUSIC_TRACK} loop preload="auto" />{playerProfile ? playerBadge : null}<main className="mosy-grades" aria-labelledby="mosy-grades-title">
      <header className="mosy-grades-header"><button className="mosy-grades-back" onClick={() => setScreen("entry")} data-mosy-hover-sound><ArrowRight size={16} style={{ transform: "rotate(180deg)" }} /> START MENU</button><div className="mosy-grades-brand"><span><GraduationCap size={20} /></span><div><small>MOSY MATH ADVENTURE</small><b>SCHOOL YEARS</b></div></div><button className={`mosy-grades-music ${musicOn ? "" : "is-muted"}`} onClick={toggleHubMusic} aria-label={musicOn ? "Turn Mosy Math Adventure background music off" : "Turn Mosy Math Adventure background music on"} data-mosy-hover-sound>{musicOn ? <Volume2 size={16} /> : <VolumeX size={16} />}<span>{musicOn ? "MUSIC ON" : "MUSIC OFF"}</span></button></header>
      <section className="mosy-grades-content"><p className="mosy-grades-eyebrow">CHOOSE YOUR LEARNING YEAR</p><h1 id="mosy-grades-title" className="mosy-grades-title">Pick your <span>school year.</span></h1><p className="mosy-grades-intro">Your learning arcade is organized by school year. G4 is ready now with every Mosy Math Adventure world you have already built.</p><div className="mosy-grade-trail" aria-hidden="true">{SCHOOL_YEARS.map((year) => <span key={`trail-${year.id}`} className={year.active ? "is-active" : ""}>{year.id}</span>)}</div><div className="mosy-grade-grid" aria-label="Mosy Math Adventure school years">{SCHOOL_YEARS.map((year) => year.active ? <article className="mosy-grade-card is-active" key={year.id}><div className="mosy-grade-card-top"><div className="mosy-grade-mark">{year.id}</div><Star size={20} color="#e99545" fill="#ffd35e" /></div><small>ACTIVE LEARNING ARCADE</small><h2>{year.label}</h2><p>{activeLessonCount} ready-to-play Mosy Math Adventure worlds, including Rounding, Shapes, Bubble Pop, Area, Multiplication, Tables, Factors, MD Computation, and Order of Operations.</p><button onClick={() => setScreen("menu")} data-mosy-hover-sound>ENTER G4 LIBRARY <ArrowRight size={17} /></button></article> : <article className="mosy-grade-card is-locked" key={year.id} aria-label={`${year.label}, coming soon`}><div className="mosy-grade-card-top"><div className="mosy-grade-mark">{year.id}</div><LockKeyhole className="mosy-grade-lock" size={19} /></div><small>COMING SOON</small><h2>{year.label}</h2><p>This learning arcade will open when its lessons are ready.</p><div className="mosy-grade-unlock"><LockKeyhole size={13} /> FUTURE MOSY WORLD</div></article>)}</div><p className="mosy-grades-footnote"><b>G4 is open.</b> New school-year worlds will be added here one lesson at a time.</p></section>
    </main></>;
  }

  if (screen === "profile") return <><audio ref={hubMusicRef} src={MUSIC_TRACK} loop preload="auto" /><PlayerProfileSetup initialProfile={playerProfile} onSave={saveProfile} onCancel={playerProfile ? () => setScreen(profileReturnScreen) : undefined} teacherControls={playerProfile && !isDirectOfflineDocument ? <TeacherProfileControls profile={playerProfile} onRename={teacherRenameProfile} onReset={teacherResetProfile} /> : null} /></>;

  if (screen === "entry") {
    return <><audio ref={hubMusicRef} src={MUSIC_TRACK} loop preload="auto" />{playerProfile ? playerBadge : null}{levelCelebrationOverlay}<main className="mosy-entry" aria-labelledby="mosy-entry-title">
      <div className="mosy-entry-sound">{musicControl}</div>
      <div className="mosy-entry-stars" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className="mosy-entry-glow" aria-hidden="true" />
      <section className="mosy-entry-card">
        <div className="mosy-astronaut-wrap" aria-label="Floating astronaut guide"><DotLottieReact src={ASTRONAUT_LOTTIE} autoplay loop speed={0.72} backgroundColor="#00000000" renderConfig={{ devicePixelRatio: 1, autoResize: true }} /></div>
        <div className="mosy-brand-shine" aria-hidden="true"><Sparkles size={18} /></div>
        <p className="mosy-entry-kicker">A BRIGHTER WAY TO LEARN</p>
        <h1 id="mosy-entry-title"><span>Mosy</span> Math Adventure</h1>
        <p className="mosy-entry-copy">Play your way through beautiful math worlds, one sparkling skill at a time.</p>
        <button className="mosy-entry-start" onClick={() => { roundRushSound.enableHoverCues(); playHubMusic(); playerProfile ? setScreen("grades") : openProfileEditor("grades"); }} data-mosy-hover-sound><Play size={20} fill="currentColor" /> START <ArrowRight size={19} /></button>
        <p className="mosy-entry-note">{playerProfile ? <>Continue as <b>{playerProfile.nickname}</b> · Level {getPlayerLevelProgress(playerProfile.totalScore).level.level} · {playerProfile.totalScore.toLocaleString()} sparks</> : "Tap Start to explore your learning arcade."}</p>
      </section>
    </main></>;
  }

  return <><audio ref={hubMusicRef} src={MUSIC_TRACK} loop preload="auto" />{playerBadge}{levelCelebrationOverlay}<main className="mosy-menu" aria-labelledby="mosy-menu-title">
    <header className="mosy-menu-header">
      <button className="mosy-menu-brand" onClick={() => setScreen("entry")} aria-label="Return to the Mosy Math Adventure welcome screen" data-mosy-hover-sound><span className="mosy-menu-brand-orb">✦</span><span><b>Mosy</b> Math Adventure<small>LEARNING ARCADE</small></span></button>
      <div className="mosy-menu-header-actions"><button className="mosy-shop-button" onClick={() => { roundRushSound.enableHoverCues(); setScreen("shop"); }} data-mosy-hover-sound><ShoppingBag size={16} /> SHOP</button><button className="mosy-admin-button" onClick={() => { roundRushSound.enableHoverCues(); setScreen("admin"); }} aria-label="Open admin panel" data-mosy-hover-sound><ShieldCheck size={16} /></button><div className="mosy-menu-header-note"><Sparkles size={15} /> Your game library</div>{musicControl}</div>
    </header>
    <section className="mosy-menu-hero">
      <div><p className="mosy-menu-eyebrow">PICK YOUR CARNIVAL BOOTH</p><h1 id="mosy-menu-title">Pick a route.<br /><span>Start the rush.</span></h1><p>Choose a math world, grab a route ticket, and chase your next sparkling score.</p></div>
      <div className="mosy-menu-hero-visual" aria-hidden="true"><div className="mosy-menu-orbit" /><div className="mosy-menu-number-card">10<span>ACTIVE WORLDS</span></div><div className="mosy-menu-spark">✦</div></div>
    </section>
    <section className="mosy-library" aria-label="Mosy Math Adventure lesson library">
      <div className="mosy-library-fireflies" aria-hidden="true">{Array.from({ length: 104 }, (_, index) => <i key={`mosy-firefly-${index}`} style={{ left: `${((index * 29 + 7) % 92) + 3}%`, top: `${((index * 47 + 5) % 89) + 4}%`, animationDelay: `-${((index * 1.37) % 9.2).toFixed(2)}s` }} />)}</div>
      <div className="mosy-library-heading"><div><p>ACTIVE NOW</p><h2>Learning worlds</h2></div><span>{activeLessonCount} READY TO PLAY</span></div>
      <article className="mosy-lesson-card mosy-rounding-card" hidden={!showUnit("round-rush")}>
        <div className="mosy-roundrush3d-visual" aria-hidden="true"><div className="mosy-roundrush3d-orbit mosy-roundrush3d-orbit-a" /><div className="mosy-roundrush3d-orbit mosy-roundrush3d-orbit-b" /><div className="mosy-roundrush3d-road"><i /></div><div className="mosy-roundrush3d-ticket mosy-roundrush3d-ticket-a">4</div><div className="mosy-roundrush3d-ticket mosy-roundrush3d-ticket-b">7</div><div className="mosy-roundrush3d-ticket mosy-roundrush3d-ticket-c">6</div><div className="mosy-roundrush3d-ticket mosy-roundrush3d-ticket-d">8</div><div className="mosy-roundrush3d-pod mosy-roundrush3d-pod-a"><i /></div><div className="mosy-roundrush3d-pod mosy-roundrush3d-pod-b"><i /></div><div className="mosy-roundrush3d-pod mosy-roundrush3d-pod-c"><i /></div><i className="mosy-roundrush3d-spark mosy-roundrush3d-spark-a">✦</i><i className="mosy-roundrush3d-spark mosy-roundrush3d-spark-b">✦</i><i className="mosy-roundrush3d-spark mosy-roundrush3d-spark-c">✦</i></div>
        <div className="mosy-lesson-copy"><span className="mosy-card-status"><Star size={13} fill="currentColor" /> READY TO PLAY</span><p className="mosy-card-topic">ROUND RUSH · SUGAR ROAD</p><h3><span className="mosy-rush-wordmark">ROUND RUSH</span> Rounding Numbers</h3><p>Pick your ticket, then land on the closest pod to keep your score sparkling.</p><div className="mosy-launch-board"><p className="mosy-launch-label">CHOOSE YOUR RUSH TICKET</p><div className="mosy-launch-modes"><button className={roundRushMode === "route" ? "is-selected" : ""} onClick={() => setRoundRushMode("route")} data-mosy-hover-sound>Rush Route<small>10 questions · Choose a place</small></button><button className={roundRushMode === "challenge" ? "is-selected" : ""} onClick={() => setRoundRushMode("challenge")} data-mosy-hover-sound>Challenge<small>Easy → Normal → Hard</small></button><button className={roundRushMode === "random" ? "is-selected" : ""} onClick={() => setRoundRushMode("random")} data-mosy-hover-sound>Random Mix<small>10 questions · All places</small></button></div>{roundRushMode === "route" ? <div className="mosy-launch-places" aria-label="Choose a rounding place">{PLACES.map((place) => <button key={place.id} onClick={() => setRoundRushPlace(place.id)} className={roundRushPlace === place.id ? "is-selected" : ""} data-mosy-hover-sound>{place.compactLabel}</button>)}</div> : null}{roundRushMode === "challenge" ? <div className="mosy-launch-levels">{CHALLENGE_LEVELS.map((level) => { const locked = level.level > unlockedLevel; return <button key={level.level} disabled={locked} className={roundRushLevel === level.level ? "is-selected" : ""} onClick={() => setRoundRushLevel(level.level)} data-mosy-hover-sound>{locked ? <LockKeyhole size={12} /> : <span>{level.rewardLabel.slice(0, 1)}</span>} <b>{level.rewardLabel}</b><small>{level.questionCount} questions · {level.scoreMultiplier}× points</small></button>; })}</div> : null}{roundRushMode === "random" ? <p className="mosy-launch-note">A surprise rounding place appears on every one of your 10 tickets.</p> : null}</div><button className="mosy-play-lesson" onClick={launchRoundRush} data-mosy-hover-sound>{roundRushMode === "challenge" ? `PLAY ${CHALLENGE_LEVELS.find((level) => level.level === roundRushLevel)?.rewardLabel ?? "EASY"} LEVEL` : roundRushMode === "random" ? "PLAY RANDOM MIX" : `PLAY NEAREST ${PLACES.find((place) => place.id === roundRushPlace)?.compactLabel ?? "10"}`} <ArrowRight size={18} /></button></div>
      </article>
      <article className="mosy-lesson-card mosy-shapes-card" hidden={!showUnit("shapes")}>
        <div className="mosy-shapes-visual" aria-hidden="true"><i className="mosy-shapes-light-field" /><div className="mosy-shapes-cube"><i /><i /><i /><b /><em>◇</em></div><div className="mosy-shapes-orb"><i /><b /></div><div className="mosy-shapes-tile mosy-shapes-tile-one"><span className="mosy-glass-triangle" /></div><div className="mosy-shapes-tile mosy-shapes-tile-two"><span className="mosy-glass-hexagon" /></div><div className="mosy-shapes-trace" /><i className="mosy-shapes-spark mosy-shapes-spark-a" /><i className="mosy-shapes-spark mosy-shapes-spark-b" /><i className="mosy-shapes-spark mosy-shapes-spark-c" /></div>
        <div className="mosy-lesson-copy"><span className="mosy-card-status mosy-shapes-status"><Sparkles size={13} fill="currentColor" /> NEW · READY TO PLAY</span><p className="mosy-card-topic">SHAPE STUDIO · GLOW GEOMETRY LAB</p><h3><span className="mosy-shapes-wordmark">SHAPE STUDIO</span> 2D &amp; 3D Shapes</h3><p>Trace flat shapes, turn bright solids around, then take on a sparkling Shapes Play quest.</p><div className="mosy-shapes-launch"><span><b>LEARN</b> 2D &amp; 3D</span><span><b>PLAY</b> 2 QUEST WORLDS</span><span><b>TURN</b> 3D models</span></div><div className="mosy-shapes-actions"><button className="mosy-play-lesson mosy-play-shapes" onClick={() => { roundRushSound.enableHoverCues(); setShapeLaunch("learnselect"); setScreen("shapes"); }} data-mosy-hover-sound>LEARN SHAPES <ArrowRight size={18} /></button><button className="mosy-shapes-play-action" onClick={() => { roundRushSound.enableHoverCues(); setShapeLaunch("playselect"); setScreen("shapes"); }} data-mosy-hover-sound><Play size={16} fill="currentColor" /> PLAY QUEST</button></div></div>
      </article>
      <article className="mosy-lesson-card mosy-bubble-card" hidden={!showUnit("bubble-pop")}>
        <div className="mosy-bubble-visual" aria-hidden="true"><div className="mosy-bubble-measure-orbit" /><div className="mosy-bubble-motion-main"><BubbleMotionIcon name="bubbles" size={142} decorative /></div><div className="mosy-bubble-motion-orb mosy-bubble-motion-one"><BubbleMotionIcon name="gem" size={52} decorative /></div><div className="mosy-bubble-motion-orb mosy-bubble-motion-two"><BubbleMotionIcon name="coin" size={48} decorative /></div><i className="mosy-bubble-glint mosy-bubble-glint-a" /><i className="mosy-bubble-glint mosy-bubble-glint-b" /><i className="mosy-bubble-glint mosy-bubble-glint-c" /></div>
        <div className="mosy-lesson-copy"><span className="mosy-card-status mosy-bubble-status"><Sparkles size={13} fill="currentColor" /> 7 LESSONS · READY TO PLAY</span><p className="mosy-card-topic">MEASUREMENT CHAPTER · BUBBLE POP</p><h3><span className="mosy-bubble-wordmark">BUBBLE POP</span> Measurement Missions</h3><p>Pop bright answer bubbles through Length, Mass, Capacity, Time, measurement missions, and the final Master Chapter Challenge.</p><div className="mosy-bubble-launch"><span><b>7</b> LESSON GAMES</span><span><b>3</b> LEVELS EACH</span><span><b>1</b> MASTER CHALLENGE</span></div><button className="mosy-play-lesson mosy-play-bubble" onClick={() => { roundRushSound.enableHoverCues(); setScreen("bubble"); }} data-mosy-hover-sound><Gamepad2 size={18} /> OPEN BUBBLE POP CHAPTER <ArrowRight size={18} /></button></div>
      </article>
      <article className="mosy-lesson-card mosy-area3d-card" hidden={!showUnit("area")}>
        <div className="mosy-area3d-visual" aria-hidden="true"><div className="mosy-area3d-grid" /><div className="mosy-area3d-board"><i /><b /><em /><span /></div><div className="mosy-area3d-ruler">8 m</div><div className="mosy-area3d-token mosy-area3d-token-a">▦</div><div className="mosy-area3d-token mosy-area3d-token-b">m²</div><i className="mosy-area3d-spark mosy-area3d-spark-a">✦</i><i className="mosy-area3d-spark mosy-area3d-spark-b">✦</i></div>
        <div className="mosy-lesson-copy"><span className="mosy-card-status mosy-area3d-status"><Sparkles size={13} fill="currentColor" /> UNIT 4 · READY TO PLAY</span><p className="mosy-card-topic">MISSION EXPLORE AREA · AREA &amp; PERIMETER</p><h3><span className="mosy-area3d-wordmark">MISSION EXPLORE AREA</span> Area &amp; Perimeter</h3><p>Trace garden trails, cover tiled spaces, unlock missing sides, and conquer complex-shape missions.</p><div className="mosy-area3d-launch"><span><b>4</b> LESSON MISSIONS</span><span><b>30</b> QUESTIONS EACH</span><span><b>10</b> PER LEVEL</span></div><button className="mosy-play-lesson mosy-play-area3d" onClick={() => { roundRushSound.enableHoverCues(); setScreen("area"); }} data-mosy-hover-sound><Gamepad2 size={18} /> OPEN MISSION EXPLORE AREA <ArrowRight size={18} /></button></div>
      </article>
      <article className="mosy-lesson-card mosy-multiply3d-card" hidden={!showUnit("multiply")}>
        <div className="mosy-multiply3d-visual" aria-hidden="true"><div className="mosy-multiply3d-ring mosy-multiply3d-ring-a" /><div className="mosy-multiply3d-ring mosy-multiply3d-ring-b" /><div className="mosy-multiply3d-core">×</div><div className="mosy-multiply3d-cube mosy-multiply3d-cube-a">3</div><div className="mosy-multiply3d-cube mosy-multiply3d-cube-b">4</div><div className="mosy-multiply3d-result">12</div><i className="mosy-multiply3d-spark mosy-multiply3d-spark-a">✦</i><i className="mosy-multiply3d-spark mosy-multiply3d-spark-b">✦</i></div>
        <div className="mosy-lesson-copy"><span className="mosy-card-status mosy-multiply3d-status"><Sparkles size={13} fill="currentColor" /> UNIT 5 · READY TO PLAY</span><p className="mosy-card-topic">MULTIPLY &amp; CONQUER · MULTIPLICATION ARENA</p><h3><span className="mosy-multiply3d-wordmark">MULTIPLY &amp; CONQUER</span> Multiplication Missions</h3><p>Build comparisons, forge equations, collect property badges, and launch through powerful multiplication patterns.</p><div className="mosy-multiply3d-launch"><span><b>7</b> LESSON MISSIONS</span><span><b>3</b> LEVELS EACH</span><span><b>1</b> MASTER EXAM</span></div><button className="mosy-play-lesson mosy-play-multiply3d" onClick={() => { roundRushSound.enableHoverCues(); setScreen("multiply"); }} data-mosy-hover-sound><Gamepad2 size={18} /> OPEN MULTIPLY &amp; CONQUER <ArrowRight size={18} /></button></div>
      </article>
      <article className="mosy-lesson-card mosy-tables3d-card" hidden={!showUnit("tables")}>
        <div className="mosy-tables3d-visual" aria-hidden="true"><div className="mosy-tables3d-cloud mosy-tables3d-cloud-one" /><div className="mosy-tables3d-cloud mosy-tables3d-cloud-two" /><div className="mosy-tables3d-group mosy-tables3d-group-one"><i /><i /><i /></div><div className="mosy-tables3d-group mosy-tables3d-group-two"><i /><i /><i /></div><div className="mosy-tables3d-equation"><b>2</b><span>×</span><b>3</b><em>= 6</em></div><i className="mosy-tables3d-star mosy-tables3d-star-a">✦</i><i className="mosy-tables3d-star mosy-tables3d-star-b">✦</i></div>
        <div className="mosy-lesson-copy"><span className="mosy-card-status mosy-tables3d-status"><Sparkles size={13} fill="currentColor" /> NEW · 1–12 TABLES</span><p className="mosy-card-topic">BALLOON TIMES TOWN · EARLY MULTIPLICATION</p><h3><span className="mosy-tables3d-wordmark">BALLOON TIMES TOWN</span> Multiplication Tables</h3><p>Count bright balloon groups, clear every table arcade, and fly through two separate all-tables master challenges.</p><div className="mosy-tables3d-launch"><span><b>12</b> TABLES</span><span><b>3</b> PLAY PATHS</span><span><b>2</b> MASTERS</span></div><button className="mosy-play-lesson mosy-play-tables3d" onClick={() => { roundRushSound.enableHoverCues(); setScreen("tables"); }} data-mosy-hover-sound><Gamepad2 size={18} /> OPEN BALLOON TIMES TOWN <ArrowRight size={18} /></button></div>
      </article>
      <article className="mosy-lesson-card mosy-factors3d-card" hidden={!showUnit("factors")}>
        <div className="mosy-factors3d-visual" aria-hidden="true"><div className="mosy-factors3d-ring" /><div className="mosy-factors3d-link mosy-factors3d-link-a" /><div className="mosy-factors3d-link mosy-factors3d-link-b" /><div className="mosy-factors3d-gem mosy-factors3d-gem-a">1</div><div className="mosy-factors3d-gem mosy-factors3d-gem-b">2</div><div className="mosy-factors3d-core">×</div><div className="mosy-factors3d-gem mosy-factors3d-gem-c">6</div><div className="mosy-factors3d-gem mosy-factors3d-gem-d">12</div><i className="mosy-factors3d-spark mosy-factors3d-spark-a">✦</i><i className="mosy-factors3d-spark mosy-factors3d-spark-b">✦</i></div>
        <div className="mosy-lesson-copy"><span className="mosy-card-status mosy-factors3d-status"><Sparkles size={13} fill="currentColor" /> UNIT 6 · READY TO PLAY</span><p className="mosy-card-topic">MISSION FACTORS &amp; MULTIPLES · FACTOR ARENA</p><h3><span className="mosy-factors3d-wordmark">MISSION FACTORS &amp; MULTIPLES</span> Factor Missions</h3><p>Trace factor pairs, light up prime gems, cross common multiple lanes, and conquer every number connection.</p><div className="mosy-factors3d-launch"><span><b>6</b> LESSON MISSIONS</span><span><b>3</b> LEVELS EACH</span><span><b>1</b> MASTER EXAM</span></div><button className="mosy-play-lesson mosy-play-factors3d" onClick={() => { roundRushSound.enableHoverCues(); setScreen("factors"); }} data-mosy-hover-sound><Gamepad2 size={18} /> OPEN FACTORS &amp; MULTIPLES <ArrowRight size={18} /></button></div>
      </article>
      <article className="mosy-lesson-card mosy-md1-card" hidden={!showUnit("md-part1")}>
        <div className="mosy-md1-visual" aria-hidden="true"><div className="mosy-md1-orbit" /><div className="mosy-md1-calculator"><i className="mosy-md1-display">12</i><b>×</b><span>6</span><span>4</span><span>9</span><span>0</span><em>=</em></div><div className="mosy-md1-product">24</div><i className="mosy-md1-spark mosy-md1-spark-a">✦</i><i className="mosy-md1-spark mosy-md1-spark-b">✦</i></div>
        <div className="mosy-lesson-copy"><span className="mosy-card-status mosy-md1-status"><Sparkles size={13} fill="currentColor" /> UNIT 7 · PART 1</span><p className="mosy-card-topic">MISSION MULTIPLICATION &amp; DIVISION · COMPUTATION ARENA</p><h3><span className="mosy-md1-wordmark">MULTIPLICATION &amp; DIVISION</span> Part 1 Missions</h3><p>Build area models, forge products, power zero patterns, and solve remainder rallies in six verified missions.</p><div className="mosy-md1-launch"><span><b>6</b> LESSON MISSIONS</span><span><b>3</b> LEVELS EACH</span><span><b>1</b> PART 1 MASTER</span></div><button className="mosy-play-lesson mosy-play-md1" onClick={() => { roundRushSound.enableHoverCues(); setScreen("md-part1"); }} data-mosy-hover-sound><Gamepad2 size={18} /> OPEN UNIT 7 · PART 1 <ArrowRight size={18} /></button></div>
      </article>
      <article className="mosy-lesson-card mosy-md2-card" hidden={!showUnit("md-part2")}>
        <div className="mosy-md2-visual" aria-hidden="true"><div className="mosy-md2-lane mosy-md2-lane-one" /><div className="mosy-md2-lane mosy-md2-lane-two" /><div className="mosy-md2-portal"><b>÷</b><i /><i /></div><div className="mosy-md2-orb mosy-md2-orb-one">Q</div><div className="mosy-md2-orb mosy-md2-orb-two">R</div><div className="mosy-md2-orb mosy-md2-orb-three">5</div><i className="mosy-md2-star">✦</i></div>
        <div className="mosy-lesson-copy"><span className="mosy-card-status mosy-md2-status"><Sparkles size={13} fill="currentColor" /> UNIT 7 · PART 2</span><p className="mosy-card-topic">MISSION MULTIPLICATION &amp; DIVISION · DIVISION ARENA</p><h3><span className="mosy-md2-wordmark">DIVIDE &amp; CONQUER</span> Part 2 Missions</h3><p>Discover division patterns, build quotient models, and conquer five source-only strategy missions.</p><div className="mosy-md2-launch"><span><b>5</b> LESSON MISSIONS</span><span><b>3</b> LEVELS EACH</span><span><b>1</b> PART 2 MASTER</span></div><button className="mosy-play-lesson mosy-play-md2" onClick={() => { roundRushSound.enableHoverCues(); setScreen("md-part2"); }} data-mosy-hover-sound><Gamepad2 size={18} /> OPEN UNIT 7 · PART 2 <ArrowRight size={18} /></button></div>
      </article>
      <article className="mosy-lesson-card mosy-order-card" hidden={!showUnit("order")}>
        <div className="mosy-order-visual" aria-hidden="true"><div className="mosy-order-ring mosy-order-ring-one" /><div className="mosy-order-ring mosy-order-ring-two" /><div className="mosy-order-console"><b>()</b><span>×</span><span>÷</span><span>+</span><span>−</span></div><div className="mosy-order-glow">1</div><i className="mosy-order-spark mosy-order-spark-a">✦</i><i className="mosy-order-spark mosy-order-spark-b">✦</i></div>
        <div className="mosy-lesson-copy"><span className="mosy-card-status mosy-order-status"><Sparkles size={13} fill="currentColor" /> UNIT 8 · READY TO PLAY</span><p className="mosy-card-topic">ORDER OF OPERATIONS · OPERATION ARENA</p><h3><span className="mosy-order-wordmark">ORDER OF OPERATIONS</span> Operation Missions</h3><p>Follow the correct math order, solve expressions, and conquer story-problem paths.</p><div className="mosy-order-launch"><span><b>2</b> LESSON MISSIONS</span><span><b>15</b> QUESTIONS PER LEVEL</span><span><b>1</b> MASTER</span></div><button className="mosy-play-lesson mosy-play-order" onClick={() => { roundRushSound.enableHoverCues(); setScreen("order"); }} data-mosy-hover-sound><Gamepad2 size={18} /> OPEN ORDER OF OPERATIONS <ArrowRight size={18} /></button></div>
      </article>
      <div className="mosy-library-heading mosy-upcoming-heading"><div><p>COMING NEXT</p><h2>More booths opening soon</h2></div><span>OWNER-GUIDED EXPANSION</span></div>
      <div className="mosy-upcoming-grid">
        <article className="mosy-upcoming-card"><div className="mosy-upcoming-icon mosy-place-icon"><GraduationCap size={29} /></div><div><p>PLACE VALUE</p><h3>Digit Builders</h3><span>New lesson world coming soon</span></div><LockKeyhole size={17} /></article>
        <article className="mosy-upcoming-card"><div className="mosy-upcoming-icon mosy-bubble-icon"><Gamepad2 size={29} /></div><div><p>GAME LAB</p><h3>More Arcade Games</h3><span>New game type coming soon</span></div><LockKeyhole size={17} /></article>
      </div>
    </section>
    <footer className="mosy-menu-footer">Mosy Math Adventure <span>•</span> Next stop: more carnival booths and sparkling math skills.</footer>
  </main></>;
}
