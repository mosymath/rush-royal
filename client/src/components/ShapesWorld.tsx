import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { ArrowLeft, Check, ChevronRight, CircleDot, Cuboid, Heart, Lightbulb, Maximize2, Play, RotateCcw, Sparkles, Star, Trophy, Volume2, VolumeX, X } from "lucide-react";
import ShapeStudioCanvas from "@/components/ShapeStudioCanvas";
import { getShape2D, getShape3D, SHAPE_QUESTIONS, SHAPES_2D, SHAPES_3D, TOKEN_TRAIL_QUESTIONS, type Shape2dId, type Shape3dId } from "@/game/shapes";
import { createPresentationSeed, shuffledQuestions } from "@/game/answerFairness";
import { shapesSound } from "@/game/shapesSound";
import { awardPlayerScore } from "@/game/playerProfile";
import "./shapesWorld.css";
import "./shapesWorldA11y.css";
import "./shapesWorldExpansion.css";
import "./shapesWorldRewards.css";
import "./shapesWorldMotion.css";
import "./shapesWorldPremium.css";

type ShapesScreen = "welcome" | "learnselect" | "playselect" | "learn2d" | "learn3d" | "play" | "results";
type QuestMode = "all" | "arcade" | "galaxy";

function ShapeMotionField() {
  return <div className="shapes-motion-field" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} className="shapes-motion-light" />)}</div>;
}

function OrbitLightDots({ className = "" }: { className?: string }) {
  return <div className={`shapes-orbit-light-system ${className}`} aria-hidden="true"><i className="shapes-orbit-line shapes-orbit-line-a" /><i className="shapes-orbit-line shapes-orbit-line-b" /><b className="shapes-orbit-dot shapes-orbit-dot-a" /><b className="shapes-orbit-dot shapes-orbit-dot-b" /></div>;
}

function ShapeGlyph({ id, className = "", decorative = false }: { id: Shape2dId; className?: string; decorative?: boolean }) {
  const isGlassLayer = className.includes("shapes-crystal");
  const glassId = `shape-glass-${id}-${className.replace(/[^a-z0-9]/gi, "-")}`;
  const common = { className: `shapes-glyph ${className}`, viewBox: "0 0 100 100", ...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": `${id} shape` }) };
  const glassDefs = isGlassLayer ? <defs><linearGradient id={glassId} x1="14" y1="7" x2="86" y2="93" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fff" stopOpacity=".98" /><stop offset=".13" stopColor="#fff" stopOpacity=".55" /><stop offset=".34" stopColor="var(--shape-color)" stopOpacity=".72" /><stop offset=".68" stopColor="var(--shape-color)" stopOpacity=".38" /><stop offset="1" stopColor="#ffffff" stopOpacity=".22" /></linearGradient></defs> : null;
  const fill = isGlassLayer ? `url(#${glassId})` : undefined;
  const shape = id === "circle" ? <circle cx="50" cy="50" r="35" fill={fill} /> : id === "oval" ? <ellipse cx="50" cy="50" rx="40" ry="27" fill={fill} /> : id === "triangle" ? <polygon points="50,12 91,84 9,84" fill={fill} /> : id === "square" ? <rect x="18" y="18" width="64" height="64" rx="3" fill={fill} /> : id === "rectangle" ? <rect x="10" y="28" width="80" height="44" rx="3" fill={fill} /> : id === "rhombus" ? <polygon points="50,10 88,50 50,90 12,50" fill={fill} /> : id === "trapezoid" ? <polygon points="27,20 73,20 92,80 8,80" fill={fill} /> : id === "parallelogram" ? <polygon points="30,18 90,18 70,82 10,82" fill={fill} /> : id === "kite" ? <polygon points="50,8 82,48 50,92 23,48" fill={fill} /> : id === "pentagon" ? <polygon points="50,9 89,38 74,85 26,85 11,38" fill={fill} /> : id === "hexagon" ? <polygon points="50,8 86,29 86,71 50,92 14,71 14,29" fill={fill} /> : id === "heptagon" ? <polygon points="50,7 82,22 92,57 72,86 37,92 10,69 15,34" fill={fill} /> : id === "octagon" ? <polygon points="32,7 68,7 93,32 93,68 68,93 32,93 7,68 7,32" fill={fill} /> : id === "nonagon" ? <polygon points="50,6 77,15 93,40 88,69 67,90 37,90 12,69 7,40 23,15" fill={fill} /> : id === "decagon" ? <polygon points="50,5 76,13 92,34 92,61 76,84 50,95 24,84 8,61 8,34 24,13" fill={fill} /> : id === "star" ? <polygon points="50,5 61,37 95,37 68,57 79,91 50,71 21,91 32,57 5,37 39,37" fill={fill} /> : <path d="M50 86C18 67 11 52 11 35C11 20 22 10 36 10C44 10 50 15 50 22C50 15 56 10 64 10C78 10 89 20 89 35C89 52 82 67 50 86Z" fill={fill} />;
  return <svg {...common}>{glassDefs}{shape}</svg>;
}

function CrystalShape({ id, className = "" }: { id: Shape2dId; className?: string }) {
  return <div className={`shapes-crystal-token is-${id} ${className}`}>
    <span className="shapes-crystal-aura" />
    <ShapeGlyph id={id} className="shapes-crystal-shadow" decorative />
    <ShapeGlyph id={id} className="shapes-crystal-back" decorative />
    <ShapeGlyph id={id} className="shapes-crystal-core" decorative />
    <ShapeGlyph id={id} className="shapes-crystal-reflection" decorative />
    <ShapeGlyph id={id} className="shapes-crystal-highlight" />
    <i className="shapes-crystal-glint shapes-crystal-glint-a" />
    <i className="shapes-crystal-glint shapes-crystal-glint-b" />
  </div>;
}

function RewardShardBurst() {
  return <div className="shapes-reward-shard-burst" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <i key={index} />)}</div>;
}

function ShapeFacts({ shapeId }: { shapeId: Shape2dId }) {
  const shape = getShape2D(shapeId);
  return <div className="shapes-fact-grid" aria-label={`${shape.label} facts`}><div><b>{shape.sides || "—"}</b><span>{shape.sides ? "SIDES" : "STRAIGHT SIDES"}</span></div><div><b>{shape.vertices || "—"}</b><span>{shape.vertices ? "CORNERS" : "VERTICES"}</span></div><div><b>2D</b><span>FLAT SHAPE</span></div></div>;
}

export default function ShapesWorld({ onExit, musicOn, onToggleMusic, initialScreen = "welcome" }: { onExit: () => void; musicOn: boolean; onToggleMusic: () => void; initialScreen?: "welcome" | "learnselect" | "playselect" | "learn2d" | "learn3d" | "play" }) {
  const [screen, setScreen] = useState<ShapesScreen>(() => {
    if (typeof window === "undefined") return "welcome";
    const requested = new URLSearchParams(window.location.search).get("shapes");
    return requested === "learnselect" || requested === "playselect" || requested === "learn2d" || requested === "learn3d" || requested === "play" ? requested : initialScreen;
  });
  const [questMode, setQuestMode] = useState<QuestMode>(() => {
    if (typeof window === "undefined") return "all";
    const requested = new URLSearchParams(window.location.search).get("quest");
    return requested === "arcade" || requested === "galaxy" ? requested : "all";
  });
  const [selected2d, setSelected2d] = useState<Shape2dId>("triangle");
  const [selected3d, setSelected3d] = useState<Shape3dId>("cube");
  const [resetKey, setResetKey] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questRunSeed, setQuestRunSeed] = useState(createPresentationSeed);
  const [score, setScore] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [combo, setCombo] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [status, setStatus] = useState<"ready" | "correct" | "wrong">("ready");
  const [feedbackPhrase, setFeedbackPhrase] = useState("");
  const [feedbackAudio, setFeedbackAudio] = useState("none");
  const selected2dShape = getShape2D(selected2d);
  const selected3dShape = getShape3D(selected3d);
  const activeQuestions = useMemo(() => {
    const galaxyQuestions = SHAPE_QUESTIONS.filter((item) => SHAPES_3D.some((shape) => shape.id === item.visualShape));
    if (questMode === "arcade") return shuffledQuestions(TOKEN_TRAIL_QUESTIONS, questRunSeed);
    if (questMode === "galaxy") return shuffledQuestions(galaxyQuestions, questRunSeed);
    return shuffledQuestions([...TOKEN_TRAIL_QUESTIONS, ...galaxyQuestions], questRunSeed);
  }, [questMode, questRunSeed]);
  const question = activeQuestions[questionIndex] ?? activeQuestions[0];
  const question2dShape = question && SHAPES_2D.find((shape) => shape.id === question.visualShape);
  const playQuestionCount = activeQuestions.length;
  const isDemo = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("demo") && new URLSearchParams(window.location.search).get("world") === "shapes";
  const questTitle = questMode === "arcade" ? "TOKEN TRAIL" : questMode === "galaxy" ? "GALAXY QUEST" : "SHAPE QUEST";
  const questAccent = questMode === "arcade" ? "2D ARCADE" : questMode === "galaxy" ? "3D GALAXY" : "ALL SHAPES";

  useEffect(() => {
    if (!isDemo || screen !== "play" || status !== "ready" || !question) return;
    const timer = window.setTimeout(() => chooseAnswer(question.correctAnswer), 850);
    return () => window.clearTimeout(timer);
    // The deterministic preview deliberately resolves the current mission correctly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo, screen, status, question?.id]);

  const enter = (next: ShapesScreen) => { shapesSound.unlock(); shapesSound.select(); setScreen(next); };
  const startQuest = (mode: QuestMode = "all") => { shapesSound.unlock(); shapesSound.select(); setQuestMode(mode); setQuestRunSeed(createPresentationSeed()); setQuestionIndex(0); setScore(0); setTokens(0); setCombo(0); setHearts(5); setStatus("ready"); setFeedbackPhrase(""); setFeedbackAudio("none"); setScreen("play"); };
  const chooseAnswer = (choice: string) => {
    if (!question || status !== "ready") return;
    const correct = choice === question.correctAnswer;
    setStatus(correct ? "correct" : "wrong");
    if (correct) { const points = 150 + questionIndex * 20 + combo * 25; setCombo((value) => value + 1); setTokens((value) => value + 1); setScore((value) => value + points); awardPlayerScore(points, "shape-studio"); const phrase = shapesSound.questCorrect(); setFeedbackPhrase(phrase); setFeedbackAudio(shapesSound.tokenTrailFeedbackAudio); }
    else { setCombo(0); setHearts((value) => Math.max(0, value - 1)); const phrase = shapesSound.questWrong(); setFeedbackPhrase(phrase); setFeedbackAudio(shapesSound.tokenTrailFeedbackAudio); }
  };
  const nextQuestion = () => {
    if (questionIndex >= playQuestionCount - 1 || hearts <= 0) { if (hearts > 0) shapesSound.victory(); setScreen("results"); return; }
    setQuestionIndex((value) => value + 1); setStatus("ready"); setFeedbackPhrase(""); setFeedbackAudio("none");
  };
  const select2d = (id: Shape2dId) => { shapesSound.unlock(); shapesSound.select(); setSelected2d(id); };
  const select3d = (id: Shape3dId) => { shapesSound.unlock(); shapesSound.select(); setSelected3d(id); setResetKey((value) => value + 1); };
  const facts = [{ label: "FLAT FACES", value: selected3dShape.faces }, { label: "EDGES", value: selected3dShape.edges }, { label: "VERTICES", value: selected3dShape.vertices }, { label: "CURVED SURFACES", value: selected3dShape.curvedSurfaces }];
  const correctCopy = questMode === "arcade" ? `${feedbackPhrase || "Perfect!"} Token captured! +1 token${combo >= 3 ? ` · ${combo} streak boost!` : ""}` : questMode === "galaxy" ? `${feedbackPhrase || "Brilliant!"} Galaxy spark collected! +1 spark${combo >= 3 ? ` · ${combo} orbit combo!` : ""}` : `${feedbackPhrase || "Well done!"} Shape Star unlocked! +1 token${combo >= 3 ? ` · ${combo} combo boost!` : ""}`;
  const wrongCopy = questMode === "arcade" ? `${feedbackPhrase || "Keep going!"} Check the shape clue and try the next token.` : questMode === "galaxy" ? `${feedbackPhrase || "Try again!"} Recharge and launch the next solid.` : `${feedbackPhrase || "Keep going!"} Recharge and keep playing!`;

  return <main className="shapes-world">
    <div className="shapes-background" aria-hidden="true"><i /><i /><i /><b /></div>
    <ShapeMotionField />
    <header className="shapes-topbar"><button className="shapes-back-button" onClick={onExit}><ArrowLeft size={17} /> MAIN MENU</button><div className="shapes-mini-brand"><span className="shapes-mini-orb">◇</span><div><b>SHAPE</b><strong>STUDIO</strong><small>MOSY MATH ADVENTURE</small></div></div><button className={`shapes-music ${musicOn ? "" : "is-muted"}`} onClick={onToggleMusic} aria-label={musicOn ? "Turn background music off" : "Turn background music on"}>{musicOn ? <Volume2 size={18} /> : <VolumeX size={18} />} {musicOn ? "MUSIC ON" : "MUSIC OFF"}</button></header>

    {screen === "welcome" ? <section className="shapes-welcome shapes-world-launch" aria-labelledby="shapes-title"><div className="shapes-welcome-copy"><p className="shapes-eyebrow">CHOOSE YOUR SHAPE WORLD</p><h1 id="shapes-title">SHAPE<br /><span>STUDIO</span></h1><p>Race through the 2D Shape Arcade or spin into the 3D Shape Galaxy. Collect bright shape badges, build a streak, and become a Shape Star.</p><div className="shapes-world-doors"><button className="shapes-world-door shapes-arcade-door" onClick={() => enter("learn2d")}><span className="shapes-door-icon"><ShapeGlyph id="star" /></span><strong>2D SHAPE<br />ARCADE</strong><small>Tokens · streaks · shape races</small><ChevronRight size={20} /></button><button className="shapes-world-door shapes-galaxy-door" onClick={() => enter("learn3d")}><span className="shapes-door-icon"><Cuboid size={34} /></span><strong>3D SHAPE<br />GALAXY</strong><small>Orbit · sparks · solid missions</small><ChevronRight size={20} /></button></div><button className="shapes-play-link" onClick={() => enter("playselect")}><Play size={17} fill="currentColor" /> CHOOSE A SHAPE QUEST</button></div><div className="shapes-hero-stage" aria-label="Glowing 2D arcade and 3D galaxy preview"><div className="shapes-hero-orbit shapes-hero-orbit-a" /><div className="shapes-hero-orbit shapes-hero-orbit-b" /><div className="shapes-hero-cube"><i /><i /><i /><b>◇</b></div><div className="shapes-hero-sphere" /><div className="shapes-hero-cone" /><div className="shapes-hero-card shapes-hero-card-one"><ShapeGlyph id="star" /><span>PRIZE TOKEN</span></div><div className="shapes-hero-card shapes-hero-card-two"><ShapeGlyph id="decagon" /><span>10 SIDES</span></div><div className="shapes-hero-badge"><Sparkles size={16} /> 360° ORBIT</div></div></section> : null}

    {screen === "learnselect" ? <section className="shapes-learn-selector" aria-labelledby="learn-shapes-selector-title"><div className="shapes-selector-heading"><button className="shapes-lesson-back" onClick={() => setScreen("welcome")}><ArrowLeft size={16} /> SHAPE STUDIO</button><p className="shapes-eyebrow">LEARN SHAPES</p><h1 id="learn-shapes-selector-title">CHOOSE YOUR<br /><span>SHAPE WORLD</span></h1><p>Start with bright flat shapes or explore glowing solids from every angle.</p></div><div className="shapes-learn-world-stack"><button className="shapes-learn-world-choice is-2d" onClick={() => enter("learn2d")}><OrbitLightDots className="is-selector-orbit" /><span className="shapes-selector-icon"><ShapeGlyph id="hexagon" decorative /></span><span className="shapes-selector-copy"><small>WORLD 1 · SHAPE TRAIL</small><strong>2D SHAPES</strong><em>Explore sides, corners, and flat shape tokens.</em></span><ChevronRight size={24} /></button><button className="shapes-learn-world-choice is-3d" onClick={() => enter("learn3d")}><OrbitLightDots className="is-selector-orbit" /><span className="shapes-selector-icon shapes-selector-solid"><Cuboid size={54} /></span><span className="shapes-selector-copy"><small>WORLD 2 · SOLID MISSION</small><strong>3D SHAPES</strong><em>Turn glowing solids and inspect faces, edges, and vertices.</em></span><ChevronRight size={24} /></button></div></section> : null}

    {screen === "playselect" ? <section className="shapes-learn-selector shapes-play-selector" aria-labelledby="play-shapes-selector-title"><div className="shapes-selector-heading"><button className="shapes-lesson-back" onClick={() => setScreen("welcome")}><ArrowLeft size={16} /> SHAPE STUDIO</button><p className="shapes-eyebrow">PLAY QUEST</p><h1 id="play-shapes-selector-title">CHOOSE YOUR<br /><span>QUEST WORLD</span></h1><p>Practice one shape world at a time, chase a bright streak, and collect the rewards you earn.</p></div><div className="shapes-learn-world-stack"><button className="shapes-learn-world-choice is-2d" onClick={() => startQuest("arcade")}><OrbitLightDots className="is-selector-orbit" /><span className="shapes-selector-icon"><ShapeGlyph id="star" decorative /></span><span className="shapes-selector-copy"><small>WORLD 1 · TOKEN PRACTICE</small><strong>2D TOKEN TRAIL</strong><em>Identify flat shapes, count sides, and spot corners.</em></span><Play size={24} fill="currentColor" /></button><button className="shapes-learn-world-choice is-3d" onClick={() => startQuest("galaxy")}><OrbitLightDots className="is-selector-orbit" /><span className="shapes-selector-icon shapes-selector-solid"><Cuboid size={54} /></span><span className="shapes-selector-copy"><small>WORLD 2 · ORBIT PRACTICE</small><strong>3D GALAXY QUEST</strong><em>Practice faces, edges, vertices, and solid names.</em></span><Play size={24} fill="currentColor" /></button></div></section> : null}

    {screen === "learn2d" ? <section className="shapes-learn-shell shapes-arcade-shell" aria-labelledby="shapes-2d-heading"><aside className="shapes-lesson-sidebar"><button className="shapes-lesson-back" onClick={() => setScreen("welcome")}><ArrowLeft size={16} /> SHAPE STUDIO</button><p className="shapes-eyebrow">WORLD 1 · TOKEN TRAIL</p><h2 id="shapes-2d-heading">2D SHAPE<br />ARCADE</h2><p>Pick a glowing token, spot its sides and corners, then keep your Shape Star streak alive.</p><div className="shapes-nav-list shapes-token-grid">{SHAPES_2D.map((shape) => <button key={shape.id} className={selected2d === shape.id ? "is-selected" : ""} onClick={() => select2d(shape.id)}><ShapeGlyph id={shape.id} /><span>{shape.label}</span><ChevronRight size={14} /></button>)}</div><button className="shapes-sidebar-play" onClick={() => startQuest("arcade")}><Play size={16} fill="currentColor" /> PLAY TOKEN TRAIL</button></aside><div className="shapes-2d-stage"><div className="shapes-lesson-heading"><div><p>ACTIVE TOKEN · +25 STARS</p><h3>{selected2dShape.label}</h3></div><span className="shapes-dimension-badge"><Maximize2 size={15} /> 2D ARCADE</span></div><div className="shapes-arcade-hud"><span>✦ TOKEN {SHAPES_2D.findIndex((shape) => shape.id === selected2d) + 1}/{SHAPES_2D.length}</span><span>● SHAPE STREAK READY</span><span>⌁ BONUS ZONE</span></div><div className="shapes-2d-model" style={{ "--shape-color": selected2dShape.color } as CSSProperties}><OrbitLightDots className="is-model-orbit" /><CrystalShape key={selected2d} id={selected2d} className="is-large" /><span className="shapes-side-tag">{selected2dShape.sides ? `${selected2dShape.sides} STRAIGHT SIDES` : "1 CURVED BOUNDARY"}</span><span className="shapes-corner-tag">{selected2dShape.vertices ? `${selected2dShape.vertices} CORNERS` : "NO CORNERS"}</span><i className="shapes-model-spark shapes-model-spark-a" /><i className="shapes-model-spark shapes-model-spark-b" /></div><ShapeFacts shapeId={selected2d} /><article className="shapes-expert-note"><Lightbulb size={22} /><div><p>SHAPE COACH SAYS</p><strong>{selected2dShape.description}</strong><span>Real-world shape clue: <b>{selected2dShape.everydayExample}</b>.</span></div></article><div className="shapes-bottom-actions"><button onClick={() => enter("learn3d")}><Cuboid size={18} /> UNLOCK 3D GALAXY <ChevronRight size={17} /></button><button className="is-quiet" onClick={() => startQuest("arcade")}><Play size={17} fill="currentColor" /> PLAY TOKEN TRAIL</button></div></div></section> : null}

    {screen === "learn3d" ? <section className="shapes-learn-shell shapes-3d-shell shapes-galaxy-shell" aria-labelledby="shapes-3d-heading"><aside className="shapes-lesson-sidebar shapes-3d-sidebar"><button className="shapes-lesson-back" onClick={() => setScreen("welcome")}><ArrowLeft size={16} /> SHAPE STUDIO</button><p className="shapes-eyebrow">WORLD 2 · ORBIT MISSION</p><h2 id="shapes-3d-heading">3D SHAPE<br />GALAXY</h2><p>Launch a solid pod, orbit it 360 degrees, collect gold vertex sparks, and complete the mission.</p><div className="shapes-nav-list shapes-solid-list">{SHAPES_3D.map((shape) => <button key={shape.id} className={selected3d === shape.id ? "is-selected" : ""} onClick={() => select3d(shape.id)}><span className="shapes-solid-dot" style={{ background: shape.color }} /><span>{shape.label}</span><ChevronRight size={14} /></button>)}</div><button className="shapes-sidebar-play" onClick={() => startQuest("galaxy")}><Play size={16} fill="currentColor" /> LAUNCH GALAXY QUEST</button></aside><div className="shapes-3d-stage"><div className="shapes-lesson-heading"><div><p>ORBIT MISSION · +50 SPARKS</p><h3>{selected3dShape.label}</h3></div><span className="shapes-dimension-badge"><Cuboid size={15} /> 3D GALAXY</span></div><div className="shapes-galaxy-hud"><span>✦ SOLID POD {SHAPES_3D.findIndex((shape) => shape.id === selected3d) + 1}/{SHAPES_3D.length}</span><span>◌ 360° ORBIT ACTIVE</span><span>● VERTEX SPARKS</span></div><div className="shapes-studio-wrap"><OrbitLightDots className="is-studio-orbit" /><ShapeStudioCanvas shapeId={selected3d} accent={selected3dShape.color} resetKey={resetKey} onInteract={() => shapesSound.rotate()} /><div className="shapes-drag-prompt"><RotateCcw size={17} /> 360° DRAG TO ORBIT</div><button className="shapes-reset-view" onClick={() => { shapesSound.select(); setResetKey((value) => value + 1); }}><RotateCcw size={17} /> RESET VIEW</button></div><p className="shapes-access-note">Gold dots mark vertices. Drag all the way around for a full 360° orbit, use arrow keys on the model, or use the orbit buttons.</p><div className="shapes-solid-facts">{facts.map((fact) => <div key={fact.label}><b>{fact.value}</b><span>{fact.label}</span></div>)}</div><article className="shapes-expert-note shapes-3d-note"><Lightbulb size={22} /><div><p>MISSION CONTROL SAYS</p><strong>{selected3dShape.description}</strong><span>Real-world shape clue: <b>{selected3dShape.everydayExample}</b>.</span></div></article><div className="shapes-bottom-actions"><button onClick={() => startQuest("galaxy")}><Play size={17} fill="currentColor" /> LAUNCH GALAXY QUEST <ChevronRight size={17} /></button><button className="is-quiet" onClick={() => enter("learn2d")}><CircleDot size={17} /> RETURN TO 2D ARCADE</button></div></div></section> : null}

    {screen === "play" && question ? <section className="shapes-play-shell" aria-labelledby="shapes-play-heading"><header className="shapes-play-hud"><div><p>{questAccent} · {question.level}</p><h2 id="shapes-play-heading">{questTitle}</h2></div><div className="shapes-play-progress"><span>MISSION {questionIndex + 1} / {playQuestionCount}</span><i><b style={{ width: `${((questionIndex + 1) / playQuestionCount) * 100}%` }} /></i></div><div className="shapes-hud-stats"><span><Star size={17} fill="currentColor" /> {score}</span><span className="shapes-token-counter">◇ {tokens} {questMode === "galaxy" ? "SPARKS" : "TOKENS"}</span><span className={`shapes-combo-counter ${combo >= 3 ? "is-hot" : ""}`}>⚡ {combo} COMBO</span><span className="shapes-hearts">{Array.from({ length: 5 }, (_, index) => <Heart key={index} size={18} fill={index < hearts ? "currentColor" : "transparent"} />)}</span></div></header><div className="shapes-play-arena"><div className="shapes-question-visual" style={question2dShape ? { "--shape-color": question2dShape.color } as CSSProperties : undefined} aria-hidden="true"><OrbitLightDots className="is-quest-orbit" />{SHAPES_2D.some((shape) => shape.id === question.visualShape) ? <CrystalShape key={question.id} id={question.visualShape as Shape2dId} className="is-quest-shape" /> : <div className="shapes-mini-solid shapes-galaxy-emblem"><i className="shapes-emblem-ring shapes-emblem-ring-a" /><i className="shapes-emblem-ring shapes-emblem-ring-b" /><span className="shapes-emblem-core"><b /><em /><strong>◇</strong></span><Cuboid size={90} /></div>}</div><div className="shapes-question-panel"><p className="shapes-eyebrow">{question.cue}</p><h3>{question.prompt}</h3><div className="shapes-answer-grid">{question.choices.map((choice, index) => <button key={choice} className={status !== "ready" && choice === question.correctAnswer ? "is-correct" : ""} disabled={status !== "ready"} onClick={() => chooseAnswer(choice)}><span>{index + 1}</span>{choice}{status !== "ready" && choice === question.correctAnswer ? <Check size={20} /> : null}</button>)}</div></div></div>{status !== "ready" ? <div className={`shapes-feedback ${status === "correct" ? "is-correct" : "is-wrong"}`} data-feedback-audio={feedbackAudio}>{status === "correct" ? <RewardShardBurst /> : null}<div>{status === "correct" ? <Check size={24} strokeWidth={4} /> : <X size={24} strokeWidth={4} />}</div><section><strong>{status === "correct" ? correctCopy : wrongCopy}</strong><p>{question.explanation}</p></section><button onClick={nextQuestion}>{questionIndex >= playQuestionCount - 1 || hearts <= 0 ? "CLAIM REWARD" : "NEXT MISSION"} <ChevronRight size={16} /></button></div> : null}</section> : null}

    {screen === "results" ? <section className="shapes-results" aria-labelledby="shapes-results-heading"><div className="shapes-results-card"><div className="shapes-trophy-orb"><Trophy size={44} fill="currentColor" /></div><p className="shapes-eyebrow">{questTitle} COMPLETE</p><h2 id="shapes-results-heading">{questMode === "arcade" ? "Token Trail conquered!" : questMode === "galaxy" ? "Galaxy mission complete!" : "You made the worlds glow!"}</h2><p>{questMode === "arcade" ? "Your 2D shape token collection is sparkling." : questMode === "galaxy" ? "Your 3D orbit sparks are shining across the galaxy." : "You collected arcade tokens and galaxy sparks."} {hearts} hearts are still shining.</p><div className="shapes-earned-stars">{Array.from({ length: 3 }, (_, index) => <Star key={index} fill={index < (hearts >= 4 ? 3 : hearts >= 2 ? 2 : 1) ? "currentColor" : "transparent"} />)}</div><div className="shapes-result-stats"><div><span>SPARK SCORE</span><b>{score}</b></div><div><span>{questMode === "galaxy" ? "SPARKS" : "TOKENS"}</span><b>{tokens}</b></div><div><span>MISSIONS</span><b>{Math.min(questionIndex + 1, playQuestionCount)}</b></div><div><span>HEARTS</span><b>{hearts}</b></div></div><div className="shapes-result-actions"><button className="shapes-primary" onClick={() => startQuest(questMode)}><RotateCcw size={18} /> PLAY AGAIN</button><button className="shapes-secondary" onClick={() => enter(questMode === "arcade" ? "learn2d" : "learn3d")}><Cuboid size={18} /> {questMode === "arcade" ? "ARCADE LOBBY" : "EXPLORE GALAXY"}</button><button className="shapes-menu-action" onClick={onExit}>MAIN MENU <ChevronRight size={17} /></button></div></div></section> : null}
  </main>;
}
