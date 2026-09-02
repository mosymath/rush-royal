/**
 * Mosy Math Adventure Candy-Cloud Carnival frame: a full rounding game with focused routes, progressive challenges,
 * random mixed-place runs, a low-volume original music bed, and deliberately strong correct-answer rewards.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Engine } from "@babylonjs/core/Engines/engine";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ArrowLeft, Check, ChevronRight, Crown, Flag, Heart, LockKeyhole, Music2, Play, RotateCcw, Shuffle, Sparkles, Star, Trophy, Volume2, VolumeX, Zap } from "lucide-react";
import { createGameScene, type GameHandle } from "@/game/scene";
import { CHALLENGE_LEVELS, createQuestion, formatPlaceInstruction, getChallengeLevel, getRunLength, pickModePlace, PLACES } from "@/game/rounding";
import { shouldShowRoundingHints } from "@/game/hints";
import { selectMotivation, selectWrongMotivation, type Motivation, type WrongMotivation } from "@/game/motivation";
import { roundRushSound } from "@/game/sound";
import { awardPlayerScore } from "@/game/playerProfile";
import type { AnswerFeedback, ChallengeLevel, GameMode, GamePhase, PlaceId, RoundQuestion, RoundStatus } from "@/game/types";

const ASTRONAUT_LOTTIE = "manus-storage/astronaut-floating_5009485d.lottie";
const modeLabel: Record<GameMode, string> = { route: "Rush Route", challenge: "Challenge", random: "Random Mix" };
const modeHint: Record<GameMode, string> = { route: "Focused place practice", challenge: "Level campaign", random: "All places in play" };

export type RoundRushLaunch = { mode: GameMode; place: PlaceId; level: ChallengeLevel };

function LogoMark({ className = "", label }: { className?: string; label?: string }) {
  return <span className={`rr-logo-mark ${className}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} />;
}

function PipMark({ className = "", label }: { className?: string; label?: string }) {
  return <div className={`rr-mascot-mark ${className}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}><span className="rr-pip-hand rr-pip-hand-left" /><span className="rr-pip-hand rr-pip-hand-right" /><span className="rr-pip-body"><i className="rr-pip-eye rr-pip-eye-left" /><i className="rr-pip-eye rr-pip-eye-right" /><b className="rr-pip-smile" /><em className="rr-pip-star">★</em></span><span className="rr-pip-feet" /></div>;
}

function NumberRibbon({ question }: { question: RoundQuestion }) {
  const digits = String(question.number).split("");
  return <div className="rr-number-ribbon" aria-label={`The number is ${question.number.toLocaleString()}`}>{digits.map((digit, index) => {
    const afterDigits = digits.length - index - 1;
    const highlight = index === question.highlightedDigitIndex ? "is-rounding" : index === question.decidingDigitIndex ? "is-deciding" : "";
    return <span className="rr-digit-cluster" key={`${digit}-${index}`}><span className={`rr-number-digit ${highlight}`}>{digit}</span>{afterDigits > 0 && afterDigits % 3 === 0 ? <span className="rr-comma">,</span> : null}</span>;
  })}</div>;
}

function RouteDots({ activeRoute, completed = 0 }: { activeRoute: number; completed?: number }) {
  return <div className="rr-route-dots" aria-label={`Route ${activeRoute} of six`}>{PLACES.map((place) => <span className={`rr-route-dot ${place.route < activeRoute ? "is-finished" : ""} ${place.route === activeRoute ? "is-active" : ""}`} key={place.id}>{place.route < activeRoute ? <Check size={12} strokeWidth={3} /> : place.route}</span>)}<span className="sr-only">{completed} questions complete</span></div>;
}

export default function GameCanvas({ onExit, externalLaunch, musicOn = true, onToggleMusic }: { onExit?: () => void; externalLaunch?: RoundRushLaunch; musicOn?: boolean; onToggleMusic?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedRef = useRef(false);
  const lastMotivationRef = useRef<Motivation | null>(null);
  const lastWrongMotivationRef = useRef<WrongMotivation | null>(null);
  const isDemo = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("demo");
  const initialMode: GameMode = externalLaunch?.mode ?? "route";
  const initialLevel: ChallengeLevel = externalLaunch?.level ?? 1;
  const initialPlace: PlaceId = isDemo ? "100" : externalLaunch?.place ?? "10";
  const [phase, setPhase] = useState<GamePhase>(isDemo || externalLaunch ? "playing" : "welcome");
  const [selectedPlace, setSelectedPlace] = useState<PlaceId>(initialPlace);
  const [selectedMode, setSelectedMode] = useState<GameMode>(initialMode);
  const [gameMode, setGameMode] = useState<GameMode>(initialMode);
  const [selectedLevel, setSelectedLevel] = useState<ChallengeLevel>(initialLevel);
  const [activeLevel, setActiveLevel] = useState<ChallengeLevel>(initialLevel);
  const [unlockedLevel, setUnlockedLevel] = useState<ChallengeLevel>(() => {
    if (typeof window === "undefined") return 1;
    const stored = Number(window.localStorage.getItem("mosy-math-round-rush-unlocked-level"));
    return stored === 2 || stored === 3 ? stored : 1;
  });
  const [question, setQuestion] = useState<RoundQuestion>(() => createQuestion(isDemo ? initialPlace : pickModePlace(initialMode, initialLevel, initialPlace), isDemo ? 425 : undefined));
  const [status, setStatus] = useState<RoundStatus>("ready");
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [feedbackAudio, setFeedbackAudio] = useState("none");
  const [questionNumber, setQuestionNumber] = useState(isDemo ? 3 : 1);
  const [score, setScore] = useState(isDemo ? 1240 : 0);
  const [hearts, setHearts] = useState(isDemo ? 4 : 5);
  const [combo, setCombo] = useState(isDemo ? 3 : 0);
  const [sugarRush, setSugarRush] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [endedEarly, setEndedEarly] = useState(false);
  const [unlockedReward, setUnlockedReward] = useState<ChallengeLevel | null>(null);
  const [burst, setBurst] = useState(0);
  const [launchSequence, setLaunchSequence] = useState(0);
  const [introducedPlaces, setIntroducedPlaces] = useState<PlaceId[]>([question.target.id]);
  const [isFirstInSection, setIsFirstInSection] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || startedRef.current) return;
    startedRef.current = true;
    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, adaptToDeviceRatio: true });
    let handle: GameHandle | null = null;
    createGameScene(engine, canvas).then((sceneHandle) => { handle = sceneHandle; engine.runRenderLoop(() => sceneHandle.scene.render()); });
    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); handle?.dispose(); engine.dispose(); startedRef.current = false; };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(query.matches);
    syncPreference(); query.addEventListener("change", syncPreference);
    return () => query.removeEventListener("change", syncPreference);
  }, []);

  useLayoutEffect(() => {
    if (!externalLaunch || isDemo) return;
    roundRushSound.unlock();
    roundRushSound.launch();
    setLaunchSequence(1);
  // The selected menu configuration is intentionally captured on game mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runLength = getRunLength(gameMode, activeLevel);
  const showRoundingHints = shouldShowRoundingHints({ gameMode, activeLevel, isFirstInSection });
  const makeModeQuestion = (mode: GameMode, level: ChallengeLevel, routePlace: PlaceId) => createQuestion(pickModePlace(mode, level, routePlace));
  const startRoute = (mode: GameMode = selectedMode) => {
    if (mode === "challenge" && selectedLevel > unlockedLevel) return;
    roundRushSound.unlock(); roundRushSound.enableHoverCues(); roundRushSound.launch();
    const firstQuestion = makeModeQuestion(mode, selectedLevel, selectedPlace);
    setGameMode(mode); setActiveLevel(selectedLevel); setQuestion(firstQuestion); setSelectedPlace(firstQuestion.target.id);
    lastMotivationRef.current = null;
    lastWrongMotivationRef.current = null;
    setIntroducedPlaces([firstQuestion.target.id]); setIsFirstInSection(true);
    setQuestionNumber(1); setScore(0); setHearts(5); setCombo(0); setSugarRush(false); setFeedback(null); setFeedbackAudio("none"); setStatus("ready"); setEndedEarly(false); setUnlockedReward(null); setLaunchSequence((current) => current + 1); setPhase("playing");
  };
  const finishRoute = (ranOutOfHearts = false) => {
    setEndedEarly(ranOutOfHearts); setUnlockedReward(null); setFeedback(null); setStatus("ready"); setPhase("routeComplete");
    if (!ranOutOfHearts) {
      roundRushSound.victory();
      if (gameMode === "challenge" && activeLevel < 3 && unlockedLevel === activeLevel) {
        const nextLevel = (activeLevel + 1) as ChallengeLevel;
        setUnlockedLevel(nextLevel); setUnlockedReward(nextLevel); window.localStorage.setItem("mosy-math-round-rush-unlocked-level", String(nextLevel));
      }
    }
  };
  const advanceRound = () => {
    if (questionNumber >= runLength || hearts <= 0) { finishRoute(hearts <= 0); return; }
    const next = makeModeQuestion(gameMode, activeLevel, selectedPlace);
    const startsNewSection = !introducedPlaces.includes(next.target.id);
    if (startsNewSection) setIntroducedPlaces((current) => [...current, next.target.id]);
    setIsFirstInSection(startsNewSection);
    setQuestion(next); setSelectedPlace(next.target.id); setQuestionNumber((current) => current + 1); setFeedback(null); setFeedbackAudio("none"); setStatus("ready");
  };
  const chooseAnswer = (choice: number) => {
    if (phase !== "playing" || status !== "ready") return;
    roundRushSound.unlock();
    const correct = choice === question.correctAnswer;
    const nextCombo = correct ? combo + 1 : 0;
    const nextSugarRush = correct && nextCombo >= 5;
    if (correct) {
      const multiplier = gameMode === "challenge" ? getChallengeLevel(activeLevel).scoreMultiplier : 1;
      const basePoints = 100 + combo * 20 + (nextSugarRush || sugarRush ? 120 : 0);
      const points = Math.round(basePoints * multiplier);
      const encouragement = selectMotivation({ questionNumber, combo: nextCombo, last: lastMotivationRef.current });
      lastMotivationRef.current = encouragement;
      setFeedback({ selected: choice, correct, points, motivation: encouragement.text }); setFeedbackAudio(soundOn ? `round-rush-recorded-${encouragement.clip}` : "round-rush-recorded-muted"); setStatus("feedback"); setScore((current) => current + points); awardPlayerScore(points, "round-rush"); setCombo(nextCombo); setSugarRush(nextSugarRush || sugarRush); setBurst((current) => current + 1); roundRushSound.correct(0);
      if (soundOn) window.setTimeout(() => roundRushSound.motivate(encouragement.clip), 320);
    } else {
      const encouragement = selectWrongMotivation(questionNumber, lastWrongMotivationRef.current);
      lastWrongMotivationRef.current = encouragement;
      setFeedback({ selected: choice, correct, motivation: encouragement.text }); setFeedbackAudio(`round-rush-recorded-wrong-${encouragement.clip}-bright`); setStatus("feedback"); setHearts((current) => Math.max(0, current - 1)); setCombo(0); setSugarRush(false); roundRushSound.incorrect();
      if (soundOn) window.setTimeout(() => roundRushSound.motivateWrong(encouragement.clip), 180);
    }
  };
  useEffect(() => {
    if (phase !== "playing" || status !== "feedback" || !feedback) return;
    const timeout = window.setTimeout(advanceRound, feedback.correct ? 1650 : 2400);
    return () => window.clearTimeout(timeout);
    // Visible resolution controls the intentional feedback window.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, status, feedback?.correct, question.id]);
  useEffect(() => {
    if (!isDemo || phase !== "playing" || status !== "ready") return;
    const timeout = window.setTimeout(() => chooseAnswer(question.correctAnswer), 1050);
    return () => window.clearTimeout(timeout);
    // Deterministic demo answers create screenshot evidence without changing normal play.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo, phase, status, question.id]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (phase !== "playing" || status !== "ready") return;
      const choiceIndex = Number(event.key) - 1;
      if (choiceIndex >= 0 && choiceIndex < question.choices.length) { event.preventDefault(); chooseAnswer(question.choices[choiceIndex]); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // Keyboard input exists only during an active answer state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, status, question.id]);

  const target = question.target;
  const progress = Math.min(100, ((questionNumber - 1) / runLength) * 100);
  const stars = hearts >= 4 && !endedEarly ? 3 : hearts >= 2 && !endedEarly ? 2 : 1;
  const challenge = getChallengeLevel(selectedLevel);
  const activeChallenge = getChallengeLevel(activeLevel);
  const currentModeLabel = gameMode === "challenge" ? `${activeChallenge.rewardLabel} · LEVEL ${activeLevel}` : modeLabel[gameMode];

  return <main className={`rr-game-shell ${showRoundingHints ? "has-rounding-hints" : "no-rounding-hints"}`}>
    {onExit ? <button className="rr-library-exit" onClick={onExit}><ArrowLeft size={17} /> MAIN MENU</button> : null}
    <canvas ref={canvasRef} className="rr-sparkle-canvas" aria-hidden="true" /><div className="rr-cloud-wash" aria-hidden="true" />
    {phase === "welcome" ? <section className="rr-welcome" aria-labelledby="round-rush-title">
      <div className="rr-welcome-brand">
        <div className="rr-logo-lockup"><LogoMark className="rr-logo-icon" /><div><p className="rr-eyebrow">NUMBER-SENSE CARNIVAL</p><h1 id="round-rush-title">ROUND<br /><span>RUSH</span></h1><div className="rr-mosy-owner"><span>AN ORIGINAL GAME BY</span><strong>Mosy<i>•</i>Math</strong></div></div></div>
        <div className="rr-welcome-copy"><p className="rr-hero-line">Aim for the closest landing spot.</p><p className="rr-body-copy">Build a brilliant rounding streak across six sparkly routes — from tens all the way to millions.</p></div>
        <div className="rr-start-panel">
          <div className="rr-panel-heading"><Sparkles size={19} /> Choose your game style</div>
          <div className="rr-mode-hub" aria-label="Choose a game mode">
            <button className={`rr-mode-card is-route ${selectedMode === "route" ? "is-active" : ""}`} onClick={() => setSelectedMode("route")}><Flag size={20} /><span><b>Rush Route</b><small>Choose one place</small></span></button>
            <button className={`rr-mode-card is-challenge ${selectedMode === "challenge" ? "is-active" : ""}`} onClick={() => setSelectedMode("challenge")}><Crown size={20} /><span><b>Challenge</b><small>Unlock levels</small></span></button>
            <button className={`rr-mode-card is-random ${selectedMode === "random" ? "is-active" : ""}`} onClick={() => setSelectedMode("random")}><Shuffle size={20} /><span><b>Random Mix</b><small>All places</small></span></button>
          </div>
          {selectedMode === "route" ? <><div className="rr-panel-subheading">PICK A ROUNDING PLACE</div><div className="rr-place-selector" role="list" aria-label="Select the rounding place value">{PLACES.map((place) => <button className={`rr-place-chip ${selectedPlace === place.id ? "is-selected" : ""}`} key={place.id} onClick={() => setSelectedPlace(place.id)} role="listitem" style={{ "--chip-accent": place.accent } as React.CSSProperties}><span>{place.compactLabel}</span><small>{place.label}</small></button>)}</div></> : null}
          {selectedMode === "challenge" ? <div className="rr-level-board"><div className="rr-panel-subheading">CLIMB THE DIFFICULTY LADDER</div><div className="rr-level-selector">{CHALLENGE_LEVELS.map((level) => { const locked = level.level > unlockedLevel; return <button key={level.level} disabled={locked} onClick={() => setSelectedLevel(level.level)} className={`rr-level-chip ${selectedLevel === level.level ? "is-selected" : ""} ${locked ? "is-locked" : ""}`}>{locked ? <LockKeyhole size={13} /> : <span>L{level.level}</span>}<b>{level.rewardLabel} · {level.name}</b><small>{level.questionCount} questions · {level.scoreMultiplier}× points</small></button>; })}</div><p className="rr-mode-helper"><strong>{challenge.rewardLabel} LEVEL</strong> · {challenge.questionCount} questions · {challenge.name} mixes {challenge.places.length} rounding places.</p></div> : null}
          {selectedMode === "random" ? <div className="rr-random-note"><Shuffle size={19} /><div><b>Every question can change the rounding place.</b><span>Ten, hundred, thousand, all the way to million.</span></div></div> : null}
          <button className="rr-primary-action" onClick={() => startRoute()}><Play size={21} fill="currentColor" /> {selectedMode === "challenge" ? `START LEVEL ${selectedLevel}` : selectedMode === "random" ? "START RANDOM MIX" : "START THE RUSH"} <ChevronRight size={20} /></button><p className="rr-keyboard-note">Music starts after you tap Start. Then tap an answer or use <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd></p>
        </div>
      </div>
      <div className="rr-welcome-stage" aria-label="Round Rush game preview"><div className="rr-nebula-glow" aria-hidden="true" /><div className="rr-space-orbit rr-orbit-one" aria-hidden="true" /><div className="rr-space-orbit rr-orbit-two" aria-hidden="true" /><div className="rr-floating-badge rr-badge-one"><Star size={15} fill="currentColor" /> 3,820 XP</div><div className="rr-floating-badge rr-badge-two">3 <span>MODES</span></div><div className="rr-preview-plaque"><span>ROUND</span><strong>4,768</strong><small>NEAREST HUNDRED</small></div><div className="rr-preview-road"><span className="rr-preview-pod rr-preview-pod-a">4,700</span><span className="rr-preview-pod rr-preview-pod-b">4,800</span><span className="rr-preview-pod rr-preview-pod-c">5,000</span></div><div className="rr-lottie-orb rr-astronaut-orb" aria-label="A floating astronaut guest above the carnival route"><DotLottieReact src={ASTRONAUT_LOTTIE} autoplay={!reducedMotion} loop={!reducedMotion} speed={0.72} backgroundColor="#00000000" renderConfig={{ devicePixelRatio: 1, autoResize: true }} /></div><PipMark className="rr-mascot rr-welcome-mascot" label="Pip, the Round Rush guide character" /><div className="rr-welcome-sparkles" aria-hidden="true"><i /><i /><i /><i /></div></div>
    </section> : null}
    {phase === "playing" ? <section className="rr-play" aria-label="Round Rush playfield">
      {launchSequence > 0 && !reducedMotion ? <div className="rr-candy-launch-burst" key={`launch-${launchSequence}`} aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <i key={`launch-candy-${index}`} style={{ "--i": index } as React.CSSProperties} />)}</div> : null}
      <header className="rr-dashboard"><div className="rr-brand-mini"><LogoMark label="Round Rush" /><div><strong>ROUND RUSH</strong><span>{currentModeLabel}</span><b>MOSY MATH ADVENTURE</b></div></div><div className="rr-dashboard-center"><div className="rr-route-caption"><span>{gameMode === "challenge" ? `${activeChallenge.rewardLabel} · ${activeChallenge.scoreMultiplier}× SCORE` : modeHint[gameMode].toUpperCase()}</span><b>{questionNumber} / {runLength}</b></div><div className="rr-progress-track"><span style={{ width: `${progress}%` }} /></div>{gameMode === "route" ? <RouteDots activeRoute={target.route} completed={questionNumber - 1} /> : <div className="rr-mode-progress"><span>{gameMode === "challenge" ? `${activeChallenge.rewardLabel} · ${activeChallenge.name.toUpperCase()} · ${activeChallenge.questionCount} QUESTIONS` : "MIXED ROUNDING PLACES · 10 QUESTIONS"}</span></div>}</div><div className="rr-dashboard-actions"><div className="rr-score"><Star size={18} fill="currentColor" /><strong>{score.toLocaleString()}</strong><span>PTS</span></div><div className="rr-hearts" aria-label={`${hearts} hearts left`}>{Array.from({ length: 5 }, (_, index) => <Heart key={index} size={19} fill={index < hearts ? "currentColor" : "transparent"} className={index < hearts ? "is-full" : ""} />)}</div><button className={`rr-icon-button ${musicOn ? "" : "is-muted"}`} onClick={onToggleMusic} aria-label={musicOn ? "Turn background music off" : "Turn background music on"}><Music2 size={19} /></button><button className={`rr-icon-button ${soundOn ? "" : "is-muted"}`} onClick={() => { const next = !soundOn; setSoundOn(next); roundRushSound.setEnabled(next); roundRushSound.enableHoverCues(); }} aria-label={soundOn ? "Turn sound effects off" : "Turn sound effects on"}>{soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}</button></div></header>
      <div className="rr-play-grid"><div className="rr-challenge-side"><div className="rr-route-mark"><span>{gameMode === "route" ? `ROUTE ${target.route}` : currentModeLabel.toUpperCase()}</span><strong>Nearest<br />{target.label}</strong></div><div className="rr-question-plaque"><p className="rr-eyebrow">{question.sourceLabel ? `TEACHER QUEST · ${question.sourceLabel.toUpperCase()}` : "PICK THE CLOSEST LANDING SPOT"}</p>{question.context ? <p className="rr-question-context">{question.context}</p> : null}<h2>{formatPlaceInstruction(question)}</h2>{question.strategy === "inverse" ? <div className="rr-place-prism"><span className="rr-prism-label">ROUNDING TARGET</span><b>{question.targetResult?.toLocaleString()}</b><span className="rr-prism-arrow">NEAREST <ChevronRight size={16} /></span><strong>{target.label}</strong></div> : <><NumberRibbon question={question} /><div className="rr-place-prism"><span className="rr-prism-label">ROUNDING PLACE</span><b>{String(question.number)[question.highlightedDigitIndex]}</b><span className="rr-prism-arrow">LOOK RIGHT <ChevronRight size={16} /></span><strong>{question.decidingDigit}</strong></div></>}</div><div className={`rr-combo-card ${combo >= 2 ? "is-hot" : ""}`}><Zap size={22} fill="currentColor" /><div><span>COMBO</span><strong>x{Math.max(1, combo)}</strong></div>{sugarRush ? <em>SUGAR RUSH!</em> : <small>{Math.max(0, 5 - combo)} to rush</small>}</div></div>
        <div className="rr-answer-side"><div className="rr-answer-header"><span>CHOOSE A POD</span><p>Press <kbd>1</kbd>, <kbd>2</kbd>, or <kbd>3</kbd> to land.</p></div><div className="rr-sugar-road" aria-hidden="true" /><div className={`rr-answer-row ${feedback?.correct ? "has-correct" : ""}`}>{question.choices.map((choice, index) => { const wasSelected = feedback?.selected === choice; const isCorrect = choice === question.correctAnswer; const state = status === "feedback" ? (isCorrect ? "is-correct" : wasSelected ? "is-wrong" : "") : ""; return <button key={`${question.id}-${choice}`} className={`rr-answer-pod rr-answer-pod-${index + 1} ${state}`} onClick={() => chooseAnswer(choice)} disabled={status !== "ready"} aria-label={`Choice ${index + 1}, ${choice.toLocaleString()}`}><span className="rr-choice-key">{index + 1}</span><strong>{choice.toLocaleString()}</strong><small>{choice < question.number ? "LOWER LANDING" : "UPPER LANDING"}</small>{status === "feedback" && isCorrect ? <span className="rr-pod-check"><Check size={24} strokeWidth={4} /></span> : null}</button>; })}</div><PipMark className="rr-mascot rr-play-mascot" label="Pip points to the answer choices" /><div className="rr-lantern-path" aria-hidden="true">{Array.from({ length: runLength }, (_, index) => <span className={index < questionNumber ? "is-lit" : ""} key={index} />)}</div></div></div>
      {feedback ? <div className={`rr-feedback ${feedback.correct ? "is-correct" : "is-wrong"}`} data-feedback-audio={feedbackAudio} role="status"><div className="rr-feedback-icon">{feedback.correct ? <Check size={25} strokeWidth={4} /> : <span>!</span>}</div><div><strong>{feedback.motivation ?? (feedback.correct ? "Brilliant landing!" : "You are close — check the digit on the right.")}</strong><p>{feedback.correct ? `+${feedback.points ?? 0} points. ${question.explanation}` : question.ruleHint}</p>{feedback.correct ? <span className="rr-feedback-sparkle">{gameMode === "challenge" ? `${activeChallenge.rewardLabel} REWARD!` : "SPARKLE BONUS!"}</span> : null}</div><button onClick={advanceRound}>{questionNumber >= runLength || hearts <= 0 ? "SEE RESULTS" : "NEXT"} <ChevronRight size={17} /></button></div> : null}
      {burst > 0 && feedback?.correct ? <div className="rr-confetti" key={`reward-confetti-${burst}`} aria-hidden="true">{Array.from({ length: 34 }, (_, index) => <i key={`reward-piece-${index}`} style={{ "--i": index } as React.CSSProperties} />)}</div> : null}
    </section> : null}
    {phase === "routeComplete" ? <section className="rr-results" aria-labelledby="results-title"><div className="rr-results-card"><div className="rr-results-topline"><Trophy size={22} fill="currentColor" /> {endedEarly ? "PRACTICE PIT STOP" : `${currentModeLabel.toUpperCase()} COMPLETE`}</div><LogoMark className="rr-results-logo" /><h2 id="results-title">{endedEarly ? "Refuel and rush again!" : unlockedReward === 2 ? "Normal mode unlocked!" : unlockedReward === 3 ? "Hard mode unlocked!" : gameMode === "challenge" && activeLevel === 3 ? "Hard mode mastered!" : "That was a brilliant run!"}</h2><p>{endedEarly ? "The route is waiting whenever you are ready. Review the digit on the right, then chase a fresh combo." : gameMode === "challenge" ? `You cleared all ${activeChallenge.questionCount} ${activeChallenge.rewardLabel.toLowerCase()} questions in ${activeChallenge.name} with ${hearts} hearts still glowing.` : `You cleared this ten-question ${modeLabel[gameMode].toLowerCase()} with ${hearts} hearts still glowing.`}</p><div className="rr-earned-stars" aria-label={`${stars} stars earned`}>{Array.from({ length: 3 }, (_, index) => <Star key={index} fill={index < stars ? "currentColor" : "transparent"} className={index < stars ? "is-earned" : ""} />)}</div><div className="rr-results-stats"><div><span>SCORE</span><strong>{score.toLocaleString()}</strong></div><div><span>BEST COMBO</span><strong>x{Math.max(1, combo)}</strong></div><div><span>MODE</span><strong>{gameMode === "challenge" ? activeChallenge.rewardLabel : gameMode === "random" ? "MIX" : target.compactLabel}</strong></div></div><div className="rr-results-actions"><button className="rr-primary-action" onClick={() => startRoute(gameMode)}><RotateCcw size={20} /> PLAY AGAIN</button><button className="rr-secondary-action" onClick={() => { if (onExit) onExit(); else setPhase("welcome"); }}>{onExit ? "MAIN MENU" : "CHOOSE A NEW MODE"} <ChevronRight size={18} /></button></div></div></section> : null}
  </main>;
}
