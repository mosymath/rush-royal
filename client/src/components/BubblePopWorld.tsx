import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronRight, Heart, Lightbulb, LockKeyhole, Music2, Play, RotateCcw, Sparkles, Volume2, VolumeX } from "lucide-react";
import BubbleMotionIcon from "@/components/BubbleMotionIcon";
import { BUBBLE_LEVELS, type BubbleLessonRouteId, type BubbleLevelId, type BubbleQuestion, type BubbleRouteId } from "@/game/bubblePopTypes";
import { getBubbleRoute } from "@/game/bubblePopCurriculum";
import { getBubbleQuestions } from "@/game/bubblePopQuestions";
import { createPresentationSeed, shuffledChoices, shuffledQuestions } from "@/game/answerFairness";
import { isBubbleLevelUnlocked, readBubbleProgress, recordBubbleRouteResult, saveBubbleProgress } from "@/game/bubblePopProgress";
import { selectMotivation, selectWrongMotivation, type Motivation, type WrongMotivation } from "@/game/motivation";
import { roundRushSound } from "@/game/sound";
import { awardPlayerScore } from "@/game/playerProfile";
import "./bubblePop.css";

type PlayPhase = "intro" | "playing" | "feedback" | "result";

export default function BubblePopWorld({ routeId, onBack, onExit, musicOn, onToggleMusic }: { routeId: BubbleRouteId; onBack: () => void; onExit: () => void; musicOn: boolean; onToggleMusic: () => void }) {
  const route = getBubbleRoute(routeId);
  const isMaster = Boolean(route.isMaster);
  const lessonRouteId: BubbleLessonRouteId | null = routeId === "master-challenge" ? null : routeId;
  const isDemo = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("demo");
  const [progress, setProgress] = useState(() => readBubbleProgress());
  const [level, setLevel] = useState<BubbleLevelId>("easy");
  const [runSeed, setRunSeed] = useState(createPresentationSeed);
  const [phase, setPhase] = useState<PlayPhase>(isDemo ? "playing" : "intro");
  const questions = useMemo(() => shuffledQuestions(getBubbleQuestions(routeId, isMaster ? undefined : level), runSeed).map((question) => ({ ...question, choices: shuffledChoices(question.id, question.choices, runSeed) })), [routeId, level, isMaster, runSeed]);
  const [questionIndex, setQuestionIndex] = useState(isDemo ? 1 : 0);
  const [hearts, setHearts] = useState(isDemo ? 4 : 5);
  const [score, setScore] = useState(isDemo ? 860 : 0);
  const [combo, setCombo] = useState(isDemo ? 2 : 0);
  const [bestCombo, setBestCombo] = useState(isDemo ? 2 : 0);
  const [selected, setSelected] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackAudio, setFeedbackAudio] = useState("none");
  const [lastCorrect, setLastCorrect] = useState<Motivation | null>(null);
  const [lastWrong, setLastWrong] = useState<WrongMotivation | null>(null);
  const [burst, setBurst] = useState(0);
  const resultSavedRef = useRef(false);
  const activeQuestion = questions[Math.min(questionIndex, questions.length - 1)];
  const activeLevel = BUBBLE_LEVELS.find((candidate) => candidate.id === level) ?? BUBBLE_LEVELS[0];

  const restart = (nextLevel = level) => {
    roundRushSound.unlock(); roundRushSound.enableHoverCues(); roundRushSound.launch();
    setLevel(nextLevel); setRunSeed(createPresentationSeed()); setQuestionIndex(0); setHearts(5); setScore(0); setCombo(0); setBestCombo(0); setSelected(null); setFeedbackText(""); setFeedbackAudio("none"); setLastCorrect(null); setLastWrong(null); setBurst(0); resultSavedRef.current = false; setPhase("playing");
  };

  const finish = (completed: boolean) => {
    if (lessonRouteId && !resultSavedRef.current) {
      const updated = recordBubbleRouteResult(progress, lessonRouteId, level, score, completed);
      saveBubbleProgress(updated); setProgress(updated); resultSavedRef.current = true;
    }
    if (completed) roundRushSound.victory();
    setPhase("result");
  };

  const advance = () => {
    if (hearts <= 0 || questionIndex >= questions.length - 1) { finish(hearts > 0); return; }
    setQuestionIndex((current) => current + 1); setSelected(null); setFeedbackText(""); setFeedbackAudio("none"); setPhase("playing");
  };

  const answer = (choice: string) => {
    if (phase !== "playing") return;
    roundRushSound.unlock();
    const correct = choice === activeQuestion.correctChoice;
    setSelected(choice);
    if (correct) {
      const nextCombo = combo + 1;
      const encouragement = selectMotivation({ questionNumber: questionIndex + 1, combo: nextCombo, last: lastCorrect });
      const points = Math.round((100 + combo * 25) * (isMaster ? 1.5 : activeLevel.multiplier));
      setLastCorrect(encouragement); setFeedbackText(`${encouragement.text} +${points} points. ${activeQuestion.explanation}`); setFeedbackAudio(soundOn ? `round-rush-recorded-${encouragement.clip}` : "round-rush-recorded-muted"); setScore((current) => current + points); awardPlayerScore(points, "bubble-pop"); setCombo(nextCombo); setBestCombo((current) => Math.max(current, nextCombo)); setBurst((current) => current + 1); roundRushSound.correct(0); if (soundOn) window.setTimeout(() => roundRushSound.motivate(encouragement.clip), 250);
    } else {
      const encouragement = selectWrongMotivation(questionIndex + 1, lastWrong);
      setLastWrong(encouragement); setFeedbackText(`${encouragement.text} ${activeQuestion.explanation}`); setFeedbackAudio(`round-rush-recorded-wrong-${encouragement.clip}-bright`); setHearts((current) => Math.max(0, current - 1)); setCombo(0); roundRushSound.incorrect(); if (soundOn) window.setTimeout(() => roundRushSound.motivateWrong(encouragement.clip), 160);
    }
    setPhase("feedback");
  };

  useEffect(() => {
    if (phase !== "feedback") return;
    const timeout = window.setTimeout(advance, selected === activeQuestion.correctChoice ? 1750 : 2600);
    return () => window.clearTimeout(timeout);
  // The feedback duration is intentionally tied to the resolved question.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, selected, activeQuestion.id]);

  useEffect(() => {
    if (!isDemo || phase !== "playing") return;
    const timeout = window.setTimeout(() => answer(activeQuestion.correctChoice), 900);
    return () => window.clearTimeout(timeout);
  // Demo mode intentionally chooses the known correct answer.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo, phase, activeQuestion.id]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { const index = Number(event.key) - 1; if (phase === "playing" && index >= 0 && index < activeQuestion.choices.length) { event.preventDefault(); answer(activeQuestion.choices[index]); } };
    window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown);
  // Keyboard selection is available only during active play.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, activeQuestion.id]);

  const progressWidth = Math.min(100, (questionIndex / questions.length) * 100);
  const routeProgress = lessonRouteId ? progress[lessonRouteId] : null;
  const completed = hearts > 0 && questionIndex >= questions.length - 1;

  if (phase === "intro") return <main className={`bp-world-shell bp-theme-${route.theme}`} style={{ "--bp-accent": route.accent, "--bp-soft": route.accentSoft } as React.CSSProperties}><header className="bp-world-topbar"><button className="bp-back-button" onClick={onBack}><ArrowLeft size={17} /> CHAPTER</button><div className="bp-world-brand"><BubbleMotionIcon name={isMaster ? "crystal" : "bubbles"} size={35} decorative /><span>{route.lesson}<b>{route.title}</b></span></div><button className={`bp-icon-control ${musicOn ? "" : "is-muted"}`} onClick={onToggleMusic}>{musicOn ? <Music2 size={18} /> : <VolumeX size={18} />}<span>{musicOn ? "MUSIC" : "MUTED"}</span></button></header><section className="bp-route-intro"><div className="bp-intro-orb"><BubbleMotionIcon name={isMaster ? "crystal" : "bubbles"} size={168} label={`${route.title} animated game icon`} /><i /><i /><em>✦</em></div><div><p className="bp-eyebrow"><Sparkles size={15} /> {route.subtitle.toUpperCase()}</p><h1>{route.title}</h1><p>{route.description}</p>{isMaster ? <div className="bp-master-intro-note"><BubbleMotionIcon name="planet" size={25} decorative /> 10 mixed assessment-style bubbles. Every Measurement skill is in play.</div> : <div className="bp-level-picker" aria-label="Choose difficulty">{BUBBLE_LEVELS.map((candidate) => { const unlocked = isBubbleLevelUnlocked(routeProgress!, candidate.id); return <button key={candidate.id} disabled={!unlocked} onClick={() => setLevel(candidate.id)} className={level === candidate.id ? "is-selected" : ""}>{unlocked ? <span>{candidate.id.slice(0, 1).toUpperCase()}</span> : <LockKeyhole size={15} />}<div><b>{candidate.label}</b><small>{candidate.hint}</small></div><em>{candidate.multiplier}×</em></button>; })}</div>}<button className="bp-start-route" onClick={() => restart()}><Play size={20} fill="currentColor" /> {isMaster ? "START THE MASTER CHALLENGE" : `START ${activeLevel.label.toUpperCase()} BUBBLES`} <ChevronRight size={19} /></button><p className="bp-intro-keyboard">Pop a bubble with your pointer or press <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd>.</p></div></section></main>;

  if (phase === "result") return <main className={`bp-world-shell bp-theme-${route.theme}`} style={{ "--bp-accent": route.accent, "--bp-soft": route.accentSoft } as React.CSSProperties}><header className="bp-world-topbar"><button className="bp-back-button" onClick={onBack}><ArrowLeft size={17} /> CHAPTER</button><div className="bp-world-brand"><BubbleMotionIcon name={completed ? "confettiBall" : "gift"} size={35} decorative /><span>{route.lesson}<b>{route.shortTitle}</b></span></div><button className={`bp-icon-control ${musicOn ? "" : "is-muted"}`} onClick={onToggleMusic}>{musicOn ? <Music2 size={18} /> : <VolumeX size={18} />}<span>{musicOn ? "MUSIC" : "MUTED"}</span></button></header><section className="bp-result"><div className={`bp-result-reward ${completed ? "is-won" : ""}`}><BubbleMotionIcon name={completed ? (isMaster ? "crystal" : "confettiBall") : "gift"} size={108} label={completed ? "Animated route completion reward" : "Animated retry reward"} /><span>{completed ? "✦" : "…"}</span></div><p>{completed ? "ROUTE COMPLETE" : "PRACTICE PIT STOP"}</p><h1>{completed ? isMaster ? "You are a Measurement Master!" : `${route.reward.name} won!` : "Your next bubble is waiting."}</h1><div className="bp-result-copy">{completed ? <p>You cleared {questions.length} {isMaster ? "mixed-skill" : activeLevel.label.toLowerCase()} bubbles with {hearts} hearts still glowing.</p> : <p>Try again when you are ready. Read the unit, choose your operation, and keep your math brain growing.</p>}</div><div className="bp-result-stats"><div><span>SCORE</span><b>{score.toLocaleString()}</b></div><div><span>BEST COMBO</span><b>×{Math.max(1, bestCombo)}</b></div><div><span>HEARTS</span><b>{hearts} / 5</b></div></div><div className="bp-result-actions"><button className="bp-start-route" onClick={() => restart()}><RotateCcw size={18} /> PLAY AGAIN</button><button className="bp-secondary-route" onClick={onBack}>CHOOSE A ROUTE <ChevronRight size={17} /></button></div></section></main>;

  return <main className={`bp-world-shell bp-theme-${route.theme}`} style={{ "--bp-accent": route.accent, "--bp-soft": route.accentSoft } as React.CSSProperties}><div className="bp-play-stars" aria-hidden="true"><i /><i /><i /><i /></div><header className="bp-play-hud"><button className="bp-back-button" onClick={onBack}><ArrowLeft size={17} /> CHAPTER</button><div className="bp-play-heading"><BubbleMotionIcon name={isMaster ? "crystal" : "bubbles"} size={35} decorative /><div><span>{route.lesson} · {isMaster ? "MASTER WAVE" : `${activeLevel.label.toUpperCase()} WAVE`}</span><b>{route.shortTitle}</b></div></div><div className="bp-play-progress"><span>{questionIndex + 1} / {questions.length}</span><i><b style={{ width: `${progressWidth}%` }} /></i></div><div className="bp-hud-stats"><div className="bp-score"><BubbleMotionIcon name="coin" size={24} decorative /><b>{score.toLocaleString()}</b></div><div className="bp-hearts" aria-label={`${hearts} hearts left`}>{Array.from({ length: 5 }, (_, index) => <Heart key={index} size={17} fill={index < hearts ? "currentColor" : "transparent"} className={index < hearts ? "is-full" : ""} />)}</div><button className={`bp-sound-button ${soundOn ? "" : "is-muted"}`} onClick={() => { const next = !soundOn; setSoundOn(next); roundRushSound.setEnabled(next); }}>{soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}</button><button className={`bp-sound-button ${musicOn ? "" : "is-muted"}`} onClick={onToggleMusic}><Music2 size={18} /></button></div></header><section className="bp-playfield" aria-label="Bubble Pop playfield"><aside className={`bp-combo-card ${combo > 1 ? "is-hot" : ""}`}><BubbleMotionIcon name="comet" size={27} decorative /><span>COMBO</span><b>×{Math.max(1, combo)}</b></aside><div className="bp-question-card"><p>{activeQuestion.skill.toUpperCase()}</p><h1>{activeQuestion.prompt}</h1><span><Lightbulb size={15} /> Pop the best answer bubble.</span></div><div className={`bp-bubble-arena ${phase === "feedback" ? "is-resolving" : ""}`}>{activeQuestion.choices.map((choice, index) => { const isCorrect = choice === activeQuestion.correctChoice; const state = phase === "feedback" ? (isCorrect ? "is-correct" : selected === choice ? "is-wrong" : "") : ""; return <button key={`${activeQuestion.id}-${choice}`} onClick={() => answer(choice)} disabled={phase !== "playing"} className={`bp-answer-bubble bp-answer-${index + 1} ${state}`} style={{ "--bubble-delay": `${index * -1.1}s` } as React.CSSProperties}><span>{index + 1}</span><b>{choice}</b>{phase === "feedback" && isCorrect ? <i><Check size={23} strokeWidth={4} /></i> : null}</button>; })}</div>{phase === "feedback" ? <div className={`bp-feedback ${selected === activeQuestion.correctChoice ? "is-correct" : "is-wrong"}`} data-feedback-audio={feedbackAudio} role="status"><i><BubbleMotionIcon name={selected === activeQuestion.correctChoice ? "clap" : "warning"} size={31} decorative /></i><div><b>{selected === activeQuestion.correctChoice ? "Brilliant pop!" : "Keep growing!"}</b><p>{feedbackText}</p></div><button onClick={advance}>{hearts <= 0 || questionIndex >= questions.length - 1 ? "RESULTS" : "NEXT"}<ChevronRight size={17} /></button></div> : null}{burst > 0 && selected === activeQuestion.correctChoice ? <div className="bp-pop-confetti" key={`pop-${burst}`} aria-hidden="true">{Array.from({ length: 22 }, (_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}</div> : null}</section></main>;
}
