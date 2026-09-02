import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronRight, Heart, Lightbulb, LockKeyhole, Music2, Play, RotateCcw, Sparkles, Volume2, VolumeX } from "lucide-react";
import { AREA_LEVELS, type AreaLessonRouteId, type AreaLevelId, type AreaRouteId } from "@/game/areaMissionTypes";
import { getAreaMissionRoute } from "@/game/areaMissionCurriculum";
import { getAreaMissionQuestions } from "@/game/areaMissionQuestions";
import { createPresentationSeed, shuffledChoices, shuffledQuestions } from "@/game/answerFairness";
import { isAreaLevelUnlocked, readAreaMissionProgress, recordAreaMissionResult } from "@/game/areaMissionProgress";
import { selectMotivation, selectWrongMotivation, type Motivation, type WrongMotivation } from "@/game/motivation";
import { roundRushSound } from "@/game/sound";
import { awardPlayerScore } from "@/game/playerProfile";
import "./areaMission.css";

type Phase = "intro" | "playing" | "feedback" | "result";

const iconFor = (routeId: AreaRouteId) => routeId === "perimeter" ? "⌁" : routeId === "area" ? "▦" : routeId === "unknown-dimensions" ? "⌖" : routeId === "complex-shapes" ? "⌞" : "✦";
const canonicalMissionAnswer = (value: string) => value.normalize("NFC").replace(/\s+/g, " ").trim();

export default function AreaMissionWorld({ routeId, onBack, musicOn, onToggleMusic }: { routeId: AreaRouteId; onBack: () => void; musicOn: boolean; onToggleMusic: () => void }) {
  const route = getAreaMissionRoute(routeId);
  const isMaster = Boolean(route.isMaster);
  const lessonId: AreaLessonRouteId | null = isMaster ? null : routeId as AreaLessonRouteId;
  const isDemo = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("demo");
  const [progress, setProgress] = useState(readAreaMissionProgress);
  const [level, setLevel] = useState<AreaLevelId>("easy");
  const [runSeed, setRunSeed] = useState(createPresentationSeed);
  const [phase, setPhase] = useState<Phase>(isDemo ? "playing" : "intro");
  const questions = useMemo(() => shuffledQuestions(getAreaMissionQuestions(routeId, isMaster ? undefined : level), runSeed).map((question) => ({ ...question, choices: shuffledChoices(question.id, question.choices, runSeed) })), [routeId, isMaster, level, runSeed]);
  const [index, setIndex] = useState(isDemo ? 1 : 0);
  const [hearts, setHearts] = useState(isDemo ? 4 : 5);
  const [score, setScore] = useState(isDemo ? 860 : 0);
  const [combo, setCombo] = useState(isDemo ? 2 : 0);
  const [bestCombo, setBestCombo] = useState(isDemo ? 2 : 0);
  const [selected, setSelected] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [lastCorrect, setLastCorrect] = useState<Motivation | null>(null);
  const [lastWrong, setLastWrong] = useState<WrongMotivation | null>(null);
  const saved = useRef(false);
  const question = questions[Math.min(index, questions.length - 1)]!;
  const selectedLevel = AREA_LEVELS.find((item) => item.id === level) ?? AREA_LEVELS[0]!;

  const restart = (nextLevel = level) => { roundRushSound.unlock(); roundRushSound.enableHoverCues(); roundRushSound.launch(); if (musicOn) void document.querySelector("audio")?.play().catch(() => undefined); setLevel(nextLevel); setRunSeed(createPresentationSeed()); setIndex(0); setHearts(5); setScore(0); setCombo(0); setBestCombo(0); setSelected(null); setFeedback(""); saved.current = false; setPhase("playing"); };
  const finish = (completed: boolean) => { if (lessonId && !saved.current) { const next = recordAreaMissionResult(progress, lessonId, level, score, completed); setProgress(next); saved.current = true; } if (completed) roundRushSound.victory(); setPhase("result"); };
  const advance = () => { if (hearts <= 0 || index >= questions.length - 1) { finish(hearts > 0); return; } setIndex((value) => value + 1); setSelected(null); setFeedback(""); setPhase("playing"); };
  const answer = (choice: string) => {
    if (phase !== "playing") return;
    roundRushSound.unlock(); setSelected(choice);
    if (canonicalMissionAnswer(choice) === canonicalMissionAnswer(question.correctChoice)) {
      const nextCombo = combo + 1; const note = selectMotivation({ questionNumber: index + 1, combo: nextCombo, last: lastCorrect }); const points = Math.round((100 + combo * 25) * (isMaster ? 1.5 : selectedLevel.multiplier));
      setLastCorrect(note); setFeedback(`${note.text} +${points} points. ${question.explanation}`); setScore((value) => value + points); awardPlayerScore(points, "area-mission"); setCombo(nextCombo); setBestCombo((value) => Math.max(value, nextCombo)); roundRushSound.correct(0); if (soundOn) window.setTimeout(() => roundRushSound.motivate(note.clip), 250);
    } else {
      const note = selectWrongMotivation(index + 1, lastWrong); setLastWrong(note); setFeedback(`${note.text} ${question.explanation}`); setHearts((value) => Math.max(0, value - 1)); setCombo(0); roundRushSound.incorrect(); if (soundOn) window.setTimeout(() => roundRushSound.motivateWrong(note.clip), 160);
    }
    setPhase("feedback");
  };
  useEffect(() => { if (phase !== "feedback") return; const timeout = window.setTimeout(advance, canonicalMissionAnswer(selected ?? "") === canonicalMissionAnswer(question.correctChoice) ? 1750 : 2600); return () => window.clearTimeout(timeout); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, selected, question.id]);
  useEffect(() => { if (!isDemo || phase !== "playing") return; const timeout = window.setTimeout(() => answer(question.correctChoice), 900); return () => window.clearTimeout(timeout); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo, phase, question.id]);
  useEffect(() => { const handler = (event: KeyboardEvent) => { const option = Number(event.key) - 1; if (phase === "playing" && option >= 0 && option < 4) answer(question.choices[option]!); }; window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, question.id]);
  const completed = hearts > 0 && index >= questions.length - 1;

  if (phase === "intro") return <main className="am-world" style={{ "--am-accent": route.accent, "--am-soft": route.accentSoft } as React.CSSProperties}><header className="am-topbar"><button onClick={onBack}><ArrowLeft size={17} /> MISSION MAP</button><strong><i>{iconFor(routeId)}</i>{route.lesson}<b>{route.title}</b></strong><button onClick={onToggleMusic} aria-label={musicOn ? "Turn background music off" : "Turn background music on"}>{musicOn ? <Music2 size={18} /> : <VolumeX size={18} />} {musicOn ? "MUSIC" : "MUTED"}</button></header><section className="am-intro"><div className="am-route-emblem"><i>{iconFor(routeId)}</i><span /><span /></div><div><p><Sparkles size={15} /> {route.subtitle.toUpperCase()}</p><h1>{route.title}</h1><h2>{route.description}</h2>{isMaster ? <div className="am-master-note">✦ 12 mixed expedition questions from the whole Unit 4 map.</div> : <div className="am-levels">{AREA_LEVELS.map((item) => { const unlocked = isAreaLevelUnlocked(progress, lessonId!, item.id); return <button disabled={!unlocked} onClick={() => setLevel(item.id)} key={item.id} className={level === item.id ? "is-active" : ""}>{unlocked ? <i>{item.id[0]!.toUpperCase()}</i> : <LockKeyhole size={15} />}<span><b>{item.label}</b><small>{item.hint} · 10 questions</small></span><em>{item.multiplier}×</em></button>; })}</div>}<button className="am-primary" onClick={() => restart()}><Play size={19} fill="currentColor" /> {isMaster ? "START AREA EXPLORER MISSION" : `START ${selectedLevel.label.toUpperCase()} MISSION`}<ChevronRight size={18} /></button><small className="am-keyboard">Choose a tile with your pointer or press <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd>.</small></div></section></main>;

  if (phase === "result") return <main className="am-world" style={{ "--am-accent": route.accent, "--am-soft": route.accentSoft } as React.CSSProperties}><header className="am-topbar"><button onClick={onBack}><ArrowLeft size={17} /> MISSION MAP</button><strong><i>✦</i>{route.lesson}<b>{route.shortTitle}</b></strong><button onClick={onToggleMusic}>{musicOn ? <Music2 size={18} /> : <VolumeX size={18} />} {musicOn ? "MUSIC" : "MUTED"}</button></header><section className="am-result"><div className="am-result-medal">{completed ? "✦" : "…"}</div><p>{completed ? "MISSION COMPLETE" : "EXPEDITION PAUSED"}</p><h1>{completed ? `${route.reward.name} won!` : "Your next trail is waiting."}</h1><span>{completed ? `You cleared ${questions.length} ${isMaster ? "mixed" : selectedLevel.label.toLowerCase()} mission questions.` : "Try again when you are ready. Trace the known information, then take one step at a time."}</span><div><b>SCORE<em>{score.toLocaleString()}</em></b><b>BEST COMBO<em>×{Math.max(1, bestCombo)}</em></b><b>HEARTS<em>{hearts} / 5</em></b></div><button className="am-primary" onClick={() => restart()}><RotateCcw size={18} /> PLAY AGAIN</button><button className="am-secondary" onClick={onBack}>CHOOSE A MISSION <ChevronRight size={17} /></button></section></main>;

  return <main className="am-world am-playing" style={{ "--am-accent": route.accent, "--am-soft": route.accentSoft } as React.CSSProperties}><header className="am-hud"><button onClick={onBack}><ArrowLeft size={17} /> MAP</button><strong><i>{iconFor(routeId)}</i><span>{route.lesson} · {isMaster ? "FINAL EXPEDITION" : `${selectedLevel.label.toUpperCase()} EXPEDITION`}<b>{route.shortTitle}</b></span></strong><div className="am-progress"><span>{index + 1} / {questions.length}</span><i><b style={{ width: `${Math.min(100, (index / questions.length) * 100)}%` }} /></i></div><div className="am-stats"><b>✦ {score}</b><span>{Array.from({ length: 5 }, (_, heart) => <Heart key={heart} size={17} fill={heart < hearts ? "currentColor" : "transparent"} />)}</span><button onClick={() => { const next = !soundOn; setSoundOn(next); roundRushSound.setEnabled(next); }}>{soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}</button><button onClick={onToggleMusic}><Music2 size={17} /></button></div></header><section className="am-playfield"><aside><span>COMBO</span><b>×{Math.max(1, combo)}</b><i>✦</i></aside><div className="am-shape-board" aria-hidden="true"><span className="am-shape-a" /><span className="am-shape-b" /><i>m</i><i>m</i><i>m</i></div><article className="am-question"><p>{question.skill.toUpperCase()}</p>{question.sourceLabels.length ? <div className="am-source-labels">{question.sourceLabels.map((label) => <b key={label}>[{label}]</b>)}</div> : null}<h1>{question.prompt}</h1><span><Lightbulb size={15} /> Follow the mission clues, then choose the best answer.</span></article><div className={`am-answer-grid ${phase === "feedback" ? "is-resolving" : ""}`}>{question.choices.map((choice, choiceIndex) => { const correct = canonicalMissionAnswer(choice) === canonicalMissionAnswer(question.correctChoice); const selectedIsCorrect = canonicalMissionAnswer(selected ?? "") === canonicalMissionAnswer(question.correctChoice); const state = phase === "feedback" ? correct ? "is-correct" : selected === choice ? "is-wrong" : "" : ""; return <button onClick={() => answer(choice)} disabled={phase !== "playing"} className={state} key={`${question.id}-${choice}`}><i>{choiceIndex + 1}</i><b>{choice}</b>{phase === "feedback" && correct ? <Check size={21} /> : null}</button>; })}</div>{phase === "feedback" ? <div className={`am-feedback ${canonicalMissionAnswer(selected ?? "") === canonicalMissionAnswer(question.correctChoice) ? "is-correct" : "is-wrong"}`} role="status"><i>{canonicalMissionAnswer(selected ?? "") === canonicalMissionAnswer(question.correctChoice) ? "✦" : "↗"}</i><div><b>{canonicalMissionAnswer(selected ?? "") === canonicalMissionAnswer(question.correctChoice) ? "Mission spark!" : "Keep exploring!"}</b><p>{feedback}</p></div><button onClick={advance}>{hearts <= 0 || index >= questions.length - 1 ? "RESULTS" : "NEXT"}<ChevronRight size={17} /></button></div> : null}</section></main>;
}
