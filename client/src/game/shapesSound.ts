import { roundRushSound, type MotivationClip } from "./sound";
import type { WrongMotivationClip } from "./motivation";

class ShapesSound {
  private context: AudioContext | null = null;
  private enabled = true;
  private correctPhraseIndex = -1;
  private wrongPhraseIndex = -1;
  private lastTokenTrailFeedbackAudio = "none";
  private readonly correctPhrases: Array<{ text: string; clip: MotivationClip }> = [
    { text: "Perfect!", clip: "perfect" },
    { text: "Well done!", clip: "wellDone" },
    { text: "Brilliant!", clip: "brilliant" },
    { text: "You are on a roll!", clip: "onARoll" },
  ];
  private readonly wrongPhrases: Array<{ text: string; clip: WrongMotivationClip }> = [
    { text: "Keep going!", clip: "keepGoing" },
    { text: "You were close!", clip: "youWereClose" },
    { text: "Try again!", clip: "tryAgain" },
    { text: "Almost there!", clip: "almostThere" },
    { text: "Nice effort!", clip: "youWereClose" },
    { text: "Keep trying!", clip: "keepGoing" },
  ];

  unlock() {
    if (typeof AudioContext === "undefined") return;
    if (!this.context) this.context = new AudioContext();
    if (this.context.state === "suspended") void this.context.resume();
  }

  setEnabled(enabled: boolean) { this.enabled = enabled; }

  private tone(frequency: number, duration: number, type: OscillatorType = "sine", gain = 0.035, delay = 0) {
    if (!this.enabled) return;
    this.unlock();
    const context = this.context;
    if (!context) return;
    const oscillator = context.createOscillator();
    const volume = context.createGain();
    oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, context.currentTime + delay);
    volume.gain.setValueAtTime(0.0001, context.currentTime + delay);
    volume.gain.exponentialRampToValueAtTime(gain, context.currentTime + delay + 0.02);
    volume.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + delay + duration);
    oscillator.connect(volume); volume.connect(context.destination);
    oscillator.start(context.currentTime + delay); oscillator.stop(context.currentTime + delay + duration + 0.02);
  }

  select() { this.tone(420, 0.09, "triangle", 0.025); }
  rotate() { this.tone(300, 0.06, "sine", 0.018); }
  correct() { roundRushSound.correct(); }
  incorrect() { roundRushSound.incorrect(); }
  victory() { this.tone(523, 0.12, "triangle", 0.04); this.tone(659, 0.12, "triangle", 0.04, 0.12); this.tone(784, 0.24, "triangle", 0.05, 0.24); }

  questCorrect() {
    this.correctPhraseIndex = (this.correctPhraseIndex + 1) % this.correctPhrases.length;
    const praise = this.correctPhrases[this.correctPhraseIndex];
    this.lastTokenTrailFeedbackAudio = `round-rush-recorded-${praise.clip}`;
    roundRushSound.correct();
    if (typeof window !== "undefined") window.setTimeout(() => roundRushSound.motivate(praise.clip), 320);
    return praise.text;
  }

  questWrong() {
    this.wrongPhraseIndex = (this.wrongPhraseIndex + 1) % this.wrongPhrases.length;
    const retry = this.wrongPhrases[this.wrongPhraseIndex];
    this.lastTokenTrailFeedbackAudio = `round-rush-recorded-wrong-${retry.clip}-bright`;
    roundRushSound.incorrect();
    if (typeof window !== "undefined") window.setTimeout(() => roundRushSound.motivateWrong(retry.clip), 180);
    return retry.text;
  }

  get tokenTrailFeedbackAudio() { return this.lastTokenTrailFeedbackAudio; }
  tokenTrailCorrect() { return this.questCorrect(); }
  tokenTrailWrong() { return this.questWrong(); }
}

export const shapesSound = new ShapesSound();
