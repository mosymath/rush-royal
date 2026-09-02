import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, Check, ChevronRight, Crown, Heart, Lightbulb, LockKeyhole, Music2, Play, RotateCcw, Sparkles, Star, Volume2, VolumeX } from "lucide-react";
import {
  TABLE_NUMBERS,
  createMasterChallenge,
  createMultiplicationFact,
  createTableChallenge,
  isMultiplicationTablesMasterUnlocked,
  readMultiplicationTablesProgress,
  recordMultiplicationTableResult,
  saveMultiplicationTablesProgress,
  type MultiplicationFact,
  type MultiplicationPlayMode,
  type MultiplicationRouteTable,
  type TableChallengeQuestion,
  type TableNumber,
} from "@/game/multiplicationTables";
import { createPresentationSeed } from "@/game/answerFairness";
import { selectMotivation, selectWrongMotivation, type Motivation, type WrongMotivation } from "@/game/motivation";
import { awardPlayerScore } from "@/game/playerProfile";
import { roundRushSound } from "@/game/sound";
import "./multiplicationTables.css";

const HERO_ART = "manus-storage/multiplication-tables-visual-target_862e74dc.png";
const BALLOON_COLORS = ["#ff6f8e", "#ffc94f", "#5dd9b0", "#69baff", "#b88bff", "#ff9c60"];

type WorldScreen = "welcome" | "explorer" | "tables" | "play" | "result";
type PlayPhase = "playing" | "feedback";

function BalloonGroups({ fact, decorative = false }: { fact: MultiplicationFact; decorative?: boolean }) {
  const balloonSize = fact.product > 96 ? "is-tiny" : fact.product > 54 ? "is-small" : "";
  return <div className={`tt-balloon-groups ${balloonSize}`} aria-label={`${fact.table} groups of ${fact.multiplier} balloons, ${fact.product} balloons altogether`}>
    {fact.balloonGroups.map((group, groupIndex) => <div className="tt-balloon-group" key={group.id} aria-label={group.label}>
      <strong>{groupIndex + 1}</strong>
      <div className="tt-balloon-cluster">
        {group.balloonIds.map((balloonId, balloonIndex) => <i key={balloonId} className="tt-balloon" aria-hidden="true" style={{ "--balloon-color": BALLOON_COLORS[(groupIndex * fact.multiplier + balloonIndex) % BALLOON_COLORS.length] } as CSSProperties}><b /></i>)}
      </div>
      {!decorative ? <span>{fact.multiplier} balloons</span> : null}
    </div>)}
  </div>;
}

function TableBadge({ table, completed, bestScore }: { table: TableNumber; completed: boolean; bestScore?: number }) {
  return <span className={`tt-table-badge ${completed ? "is-complete" : ""}`}><b>{table}</b><small>{completed ? <><Check size={12} /> CLEARED</> : bestScore ? `${bestScore} SPARKS` : "READY"}</small></span>;
}

function SkyCarnivalDecorations() {
  return <div className="tt-sky-carnival-decor" aria-hidden="true">
    <span className="tt-flying-number tt-flying-number-one">1</span>
    <span className="tt-flying-number tt-flying-number-two">×2</span>
    <span className="tt-flying-number tt-flying-number-three">3</span>
    <span className="tt-flying-number tt-flying-number-four">+4</span>
    <i className="tt-sky-balloon tt-sky-balloon-pink" />
    <i className="tt-sky-balloon tt-sky-balloon-yellow" />
    <i className="tt-sky-balloon tt-sky-balloon-mint" />
    <i className="tt-sky-balloon tt-sky-balloon-lilac" />
    <b className="tt-sky-spark tt-sky-spark-one">✦</b>
    <b className="tt-sky-spark tt-sky-spark-two">✧</b>
    <b className="tt-sky-spark tt-sky-spark-three">✦</b>
  </div>;
}

export default function MultiplicationTablesWorld({ onExit, musicOn, onToggleMusic }: { onExit: () => void; musicOn: boolean; onToggleMusic: () => void }) {
  const [screen, setScreen] = useState<WorldScreen>("welcome");
  const [mode, setMode] = useState<MultiplicationPlayMode>("arcade");
  const [routeTable, setRouteTable] = useState<MultiplicationRouteTable>(1);
  const [explorerTable, setExplorerTable] = useState<TableNumber>(2);
  const [explorerMultiplier, setExplorerMultiplier] = useState<TableNumber>(3);
  const [progress, setProgress] = useState(readMultiplicationTablesProgress);
  const [runSeed, setRunSeed] = useState(createPresentationSeed);
  const [playPhase, setPlayPhase] = useState<PlayPhase>("playing");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [lastCorrect, setLastCorrect] = useState<Motivation | null>(null);
  const [lastWrong, setLastWrong] = useState<WrongMotivation | null>(null);
  const savedResult = useRef(false);

  const explorerFact = useMemo(() => createMultiplicationFact(explorerTable, explorerMultiplier), [explorerTable, explorerMultiplier]);
  const questions = useMemo<TableChallengeQuestion[]>(() => routeTable === "master" ? createMasterChallenge(runSeed) : createTableChallenge(routeTable, runSeed), [routeTable, runSeed]);
  const question = questions[Math.min(questionIndex, questions.length - 1)]!;
  const masterUnlocked = isMultiplicationTablesMasterUnlocked(progress, mode);
  const routeName = routeTable === "master" ? "All-Tables Master" : `Table ${routeTable}`;
  const routeSubtitle = routeTable === "master" ? "One brave fact from every table" : `${routeTable} × 1 through ${routeTable} × 12`;

  const startRoute = (nextMode: MultiplicationPlayMode, nextRoute: MultiplicationRouteTable) => {
    if (nextRoute === "master" && !isMultiplicationTablesMasterUnlocked(progress, nextMode)) return;
    roundRushSound.unlock(); roundRushSound.enableHoverCues(); roundRushSound.launch();
    setMode(nextMode); setRouteTable(nextRoute); setRunSeed(createPresentationSeed()); setQuestionIndex(0); setHearts(5); setScore(0); setCombo(0); setBestCombo(0); setSelected(null); setFeedback(""); setLastCorrect(null); setLastWrong(null); savedResult.current = false; setPlayPhase("playing"); setScreen("play");
  };

  const completeRoute = (completed: boolean) => {
    if (routeTable !== "master" && !savedResult.current) {
      const nextProgress = recordMultiplicationTableResult(progress, mode, routeTable, score, completed);
      saveMultiplicationTablesProgress(nextProgress); setProgress(nextProgress); savedResult.current = true;
    }
    if (completed) roundRushSound.victory();
    setScreen("result");
  };

  const nextQuestion = () => {
    if (hearts <= 0 || questionIndex >= questions.length - 1) { completeRoute(hearts > 0); return; }
    setQuestionIndex((value) => value + 1); setSelected(null); setFeedback(""); setPlayPhase("playing");
  };

  const answer = (choice: string) => {
    if (screen !== "play" || playPhase !== "playing") return;
    roundRushSound.unlock(); setSelected(choice);
    if (choice === question.correctChoice) {
      const nextCombo = combo + 1;
      const encouragement = selectMotivation({ questionNumber: questionIndex + 1, combo: nextCombo, last: lastCorrect });
      const points = 100;
      setLastCorrect(encouragement); setFeedback(`${encouragement.text} +${points} sparks. ${question.explanation}`); setScore((value) => value + points); setCombo(nextCombo); setBestCombo((value) => Math.max(value, nextCombo)); awardPlayerScore(points, "multiplication-tables"); roundRushSound.correct(0); if (soundOn) window.setTimeout(() => roundRushSound.motivate(encouragement.clip), 220);
    } else {
      const encouragement = selectWrongMotivation(questionIndex + 1, lastWrong);
      setLastWrong(encouragement); setFeedback(`${encouragement.text} ${question.explanation}`); setHearts((value) => Math.max(0, value - 1)); setCombo(0); roundRushSound.incorrect(); if (soundOn) window.setTimeout(() => roundRushSound.motivateWrong(encouragement.clip), 150);
    }
    setPlayPhase("feedback");
  };

  useEffect(() => {
    if (screen !== "play" || playPhase !== "feedback") return;
    const timeout = window.setTimeout(nextQuestion, selected === question.correctChoice ? 1650 : 2500);
    return () => window.clearTimeout(timeout);
  // Feedback time belongs to the resolved question and blocks duplicate answers.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, playPhase, selected, question.id]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const choiceIndex = Number(event.key) - 1;
      if (screen === "play" && playPhase === "playing" && choiceIndex >= 0 && choiceIndex < question.choices.length) { event.preventDefault(); answer(question.choices[choiceIndex]!); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  // Keyboard mapping intentionally follows the current shuffled visible choice positions.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, playPhase, question.id]);

  const BackButton = ({ children = "LIBRARY", onClick = onExit }: { children?: string; onClick?: () => void }) => <button className="tt-back" onClick={onClick}><ArrowLeft size={17} /> {children}</button>;
  const MusicButton = () => <button className={`tt-music ${musicOn ? "" : "is-muted"}`} onClick={onToggleMusic}>{musicOn ? <Music2 size={17} /> : <VolumeX size={17} />}<span>{musicOn ? "MUSIC" : "MUTED"}</span></button>;

  if (screen === "explorer") return <main className="tt-world tt-explorer-world"><SkyCarnivalDecorations /><header className="tt-topbar"><BackButton children="TIMES TOWN" onClick={() => setScreen("welcome")} /><div className="tt-top-brand"><span>🎈</span><div><small>BALLOON TIMES TOWN</small><b>Tables Explorer</b></div></div><MusicButton /></header><section className="tt-explorer"><div className="tt-explorer-intro"><p><Sparkles size={15} /> TAP, COUNT, AND SEE THE GROUPS</p><h1>Meet your <span>multiplication teams.</span></h1><p>Choose how many balloon groups you have, then choose how many balloons belong in every group.</p></div><div className="tt-explorer-controls"><div><span>GROUPS</span><div className="tt-number-row" aria-label="Choose number of groups">{TABLE_NUMBERS.map((table) => <button key={`group-${table}`} className={explorerTable === table ? "is-selected" : ""} onClick={() => setExplorerTable(table)}>{table}</button>)}</div></div><div><span>BALLOONS IN EACH GROUP</span><div className="tt-number-row" aria-label="Choose balloons per group">{TABLE_NUMBERS.map((multiplier) => <button key={`each-${multiplier}`} className={explorerMultiplier === multiplier ? "is-selected" : ""} onClick={() => setExplorerMultiplier(multiplier)}>{multiplier}</button>)}</div></div></div><article className="tt-explorer-board"><div className="tt-equation-ribbon"><span>{explorerTable}</span><i>×</i><span>{explorerMultiplier}</span><i>=</i><strong>{explorerFact.product}</strong></div><div className="tt-explorer-words"><b>{explorerTable} groups</b><span>of</span><b>{explorerMultiplier} balloons</b><span>make</span><strong>{explorerFact.product} altogether!</strong></div><BalloonGroups fact={explorerFact} /></article><button className="tt-primary" onClick={() => { setMode("arcade"); setScreen("tables"); }}><Play size={18} fill="currentColor" /> PLAY WITH THESE TABLES <ChevronRight size={18} /></button></section></main>;

  if (screen === "tables") {
    const completedTables = mode === "arcade" ? progress.arcadeCompleted : progress.choiceCompleted;
    const bestScores = mode === "arcade" ? progress.arcadeBestScores : progress.choiceBestScores;
    const isArcade = mode === "arcade";
    return <main className={`tt-world tt-table-select ${isArcade ? "is-arcade" : "is-choice"}`}><SkyCarnivalDecorations /><header className="tt-topbar"><BackButton children="TIMES TOWN" onClick={() => setScreen("welcome")} /><div className="tt-top-brand"><span>{isArcade ? "🎈" : "⭐"}</span><div><small>{isArcade ? "BALLOON ARCADE" : "CHOICE QUEST"}</small><b>{isArcade ? "Pick a table to pop" : "Pick a table to solve"}</b></div></div><MusicButton /></header><section className="tt-table-landing"><div className="tt-landing-copy"><p><Sparkles size={15} /> {isArcade ? "COUNT, POP, AND POWER UP" : "CHOOSE, CHECK, AND SHINE"}</p><h1>{isArcade ? <>Every table is a <span>balloon level.</span></> : <>Every table is a <span>choice quest.</span></>}</h1><p>{isArcade ? "Clear a table to earn its balloon badge. Finish all twelve to open the mixed master flight." : "Choose the correct product on every quest. Clear all twelve tables to open the mixed master crown."}</p></div><div className="tt-table-grid" aria-label={`Choose a multiplication ${isArcade ? "arcade" : "choice quest"} table`}>{TABLE_NUMBERS.map((table) => <button key={table} className="tt-table-card" onClick={() => startRoute(mode, table)}><TableBadge table={table} completed={completedTables.includes(table)} bestScore={bestScores[table]} /><span>{isArcade ? "POP THIS TABLE" : "START QUEST"}</span><ChevronRight size={17} /></button>)}<button className={`tt-master-card ${masterUnlocked ? "is-open" : "is-locked"}`} disabled={!masterUnlocked} onClick={() => startRoute(mode, "master")}><div>{masterUnlocked ? <Crown size={29} /> : <LockKeyhole size={27} />}<span><b>ALL-TABLES MASTER</b><small>{masterUnlocked ? "12 mixed facts · ready for launch" : `${completedTables.length} / 12 tables cleared`}</small></span></div><ChevronRight size={20} /></button></div></section></main>;
  }

  if (screen === "result") {
    const completed = hearts > 0 && questionIndex >= questions.length - 1;
    return <main className={`tt-world tt-result-world tt-${mode}`}><SkyCarnivalDecorations /><header className="tt-topbar"><BackButton children="TIMES TOWN" onClick={() => setScreen("welcome")} /><div className="tt-top-brand"><span>{completed ? "🏆" : "🎈"}</span><div><small>{routeTable === "master" ? "ALL-TABLES MASTER" : `${mode === "arcade" ? "BALLOON ARCADE" : "CHOICE QUEST"} · ${routeName.toUpperCase()}`}</small><b>{completed ? "Bright work!" : "Your next try is waiting."}</b></div></div><MusicButton /></header><section className="tt-result"><div className={`tt-result-medal ${completed ? "is-won" : ""}`}>{completed ? routeTable === "master" ? "♛" : "★" : "…"}</div><p>{completed ? "ROUTE COMPLETE" : "PRACTICE PIT STOP"}</p><h1>{completed ? routeTable === "master" ? "You are an All-Tables Star!" : `${routeName} is glowing!` : "Take a breath. Then try again."}</h1><span>{completed ? `You cleared ${questions.length} multiplication facts and kept ${hearts} hearts shining.` : "Use the balloon groups or a table card, then come back for another try."}</span><div className="tt-result-stats"><b><small>SPARKS</small>{score.toLocaleString()}</b><b><small>BEST COMBO</small>×{Math.max(1, bestCombo)}</b><b><small>HEARTS</small>{hearts} / 5</b></div><div className="tt-result-actions"><button className="tt-primary" onClick={() => startRoute(mode, routeTable)}><RotateCcw size={18} /> PLAY AGAIN</button><button className="tt-secondary" onClick={() => setScreen("tables")}>CHOOSE A TABLE <ChevronRight size={17} /></button></div></section></main>;
  }

  if (screen === "play") {
    const correct = selected === question.correctChoice;
    const isArcade = mode === "arcade";
    return <main className={`tt-world tt-play-world tt-${mode}`}><SkyCarnivalDecorations /><header className="tt-play-hud"><BackButton children="TABLES" onClick={() => setScreen("tables")} /><div className="tt-play-title"><span>{routeTable === "master" ? <Crown size={23} /> : isArcade ? "🎈" : "⭐"}</span><div><small>{routeTable === "master" ? "ALL-TABLES MASTER" : `${isArcade ? "BALLOON ARCADE" : "CHOICE QUEST"} · TABLE ${routeTable}`}</small><b>{routeName}</b></div></div><div className="tt-progress"><span>{questionIndex + 1} / {questions.length}</span><i><b style={{ width: `${Math.round((questionIndex / questions.length) * 100)}%` }} /></i></div><div className="tt-hud-stat"><b>✦ {score}</b><span aria-label={`${hearts} hearts left`}>{Array.from({ length: 5 }, (_, index) => <Heart key={index} size={16} fill={index < hearts ? "currentColor" : "transparent"} />)}</span><button onClick={() => { const next = !soundOn; setSoundOn(next); roundRushSound.setEnabled(next); }}>{soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}</button><MusicButton /></div></header><section className="tt-playfield"><div className={`tt-combo ${combo > 1 ? "is-hot" : ""}`}><Sparkles size={18} /><span>COMBO</span><b>×{Math.max(1, combo)}</b></div><div className="tt-question-shell"><p>{routeTable === "master" ? `TABLE ${question.table} SURPRISE` : `${routeName.toUpperCase()} FACT`}</p><h1>{question.prompt}</h1><span><Lightbulb size={15} /> {isArcade ? "Pop the balloon with the correct total." : "Choose the product card with the correct answer."}</span></div>{isArcade ? <div className={`tt-arcade-answers tt-free-balloons ${playPhase === "feedback" ? "is-resolving" : ""}`}>{question.choices.map((choice, index) => { const answerState = playPhase === "feedback" ? choice === question.correctChoice ? "is-correct" : choice === selected ? "is-wrong" : "" : ""; return <button key={`${question.id}-${choice}`} className={`tt-answer-balloon ${answerState}`} onClick={() => answer(choice)} disabled={playPhase !== "playing"} style={{ "--balloon-color": BALLOON_COLORS[index] } as CSSProperties}><i>{index + 1}</i><b>{choice}</b>{playPhase === "feedback" && choice === question.correctChoice ? <Check size={25} strokeWidth={4} /> : null}</button>; })}</div> : <div className={`tt-choice-answers ${playPhase === "feedback" ? "is-resolving" : ""}`}>{question.choices.map((choice, index) => { const answerState = playPhase === "feedback" ? choice === question.correctChoice ? "is-correct" : choice === selected ? "is-wrong" : "" : ""; return <button key={`${question.id}-${choice}`} className={answerState} onClick={() => answer(choice)} disabled={playPhase !== "playing"}><span>{index + 1}</span><b>{choice}</b>{playPhase === "feedback" && choice === question.correctChoice ? <Check size={24} strokeWidth={4} /> : <ChevronRight size={19} />}</button>; })}</div>}{playPhase === "feedback" ? <div className={`tt-feedback ${correct ? "is-correct" : "is-wrong"}`} role="status"><i>{correct ? "✦" : "↗"}</i><div><b>{correct ? "Balloon power!" : "Keep counting!"}</b><p>{feedback}</p></div><button onClick={nextQuestion}>{hearts <= 0 || questionIndex >= questions.length - 1 ? "RESULTS" : "NEXT"}<ChevronRight size={17} /></button></div> : null}</section></main>;
  }

  return <main className="tt-world tt-welcome"><SkyCarnivalDecorations /><header className="tt-topbar"><BackButton /><div className="tt-top-brand"><span>🎈</span><div><small>NEW MOSY MATH ADVENTURE WORLD</small><b>Balloon Times Town</b></div></div><MusicButton /></header><section className="tt-welcome-hero"><div className="tt-welcome-copy"><p><Sparkles size={16} /> 1–12 TABLES · BIG COLORFUL STEPS</p><h1>Count the balloons.<br /><span>Own the tables.</span></h1><p>Learn multiplication by seeing friendly groups, then fly through table games and all-tables master challenges.</p><div className="tt-welcome-pills"><span><b>12</b> TABLES</span><span><b>2</b> MASTER RUNS</span><span><b>∞</b> REPLAYS</span></div></div><div className="tt-hero-art"><img src={HERO_ART} alt="" /><div className="tt-hero-balloon tt-hero-balloon-one" /><div className="tt-hero-balloon tt-hero-balloon-two" /><i>×</i></div></section><section className="tt-path-grid" aria-label="Choose a Balloon Times Town activity"><article className="tt-path-card tt-path-explorer"><div className="tt-path-icon">2 × 3</div><p>LEARN</p><h2>Tables Explorer</h2><span>Watch 1–12 tables become real groups of colorful balloons.</span><button onClick={() => setScreen("explorer")}>EXPLORE TABLES <ChevronRight size={17} /></button></article><article className="tt-path-card tt-path-arcade"><div className="tt-path-icon">🎈</div><p>PLAY</p><h2>Balloon Arcade</h2><span>Choose one table at a time, pop totals, then unlock the mixed master flight.</span><button onClick={() => { setMode("arcade"); setScreen("tables"); }}>OPEN ARCADE <ChevronRight size={17} /></button></article><article className="tt-path-card tt-path-choice"><div className="tt-path-icon">★</div><p>QUEST</p><h2>Choice Quest</h2><span>Practice clear multiple-choice facts, then earn the separate master crown.</span><button onClick={() => { setMode("choice"); setScreen("tables"); }}>START QUEST <ChevronRight size={17} /></button></article></section></main>;
}
