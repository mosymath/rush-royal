/** Candy-Cloud Carnival sound kit: clearly audible reward chimes that sit above low-volume background music. */
import type { WrongMotivationClip } from "./motivation";
import { awardPlayerCoins, awardPlayerScore } from "./playerProfile";

export type MotivationClip = "perfect" | "wellDone" | "onARoll" | "brilliant";

class RoundRushSound {
  private context: AudioContext | null = null;
  private enabled = true;
  private hoverEnabled = false;
  private streak = 0;
  private readonly motivationClips = {
    perfect: "manus-storage/mosy-perfect_efd04be5.wav",
    wellDone: "manus-storage/mosy-well-done_591d5a0f.wav",
    onARoll: "manus-storage/mosy-on-a-roll_dcb0b07e.wav",
    brilliant: "manus-storage/mosy-brilliant_4f1568f4.wav",
  } as const;
  private readonly wrongMotivationClips: Record<WrongMotivationClip, string> = {
    keepGoing: "manus-storage/mosy-keep-going-bright_69bc9001.mp3",
    youWereClose: "manus-storage/mosy-you-were-close-bright_fe36bd04.mp3",
    tryAgain: "manus-storage/mosy-try-again-bright_57fa3da7.mp3",
    almostThere: "manus-storage/mosy-almost-there-bright_7501efe7.mp3",
  };

  setEnabled(enabled: boolean) { this.enabled = enabled; }

  unlock() {
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!this.context) this.context = new AudioContextClass();
    if (this.context.state === "suspended") void this.context.resume();
  }

  private note(frequency: number, start: number, duration: number, volume = 0.1, type: OscillatorType = "sine") {
    if (!this.enabled || !this.context) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  correct(profilePoints = 100) {
    this.unlock();
    if (profilePoints > 0) awardPlayerScore(profilePoints, "legacy-mission");
    this.streak += 1;
    if (this.streak >= 3) awardPlayerCoins(Math.min(this.streak, 10), "streak");
    if (!this.context) return;
    const now = this.context.currentTime;
    this.note(659.25, now, 0.13, 0.17, "triangle");
    this.note(783.99, now + 0.09, 0.15, 0.19, "triangle");
    this.note(987.77, now + 0.18, 0.2, 0.21, "sine");
    this.note(1318.51, now + 0.29, 0.3, 0.18, "sine");
  }

  enableHoverCues() { this.hoverEnabled = true; }

  hover() {
    if (!this.hoverEnabled) return;
    this.unlock();
    if (!this.context) return;
    const now = this.context.currentTime;
    this.note(880, now, 0.055, 0.028, "sine");
  }

  motivate(clip: MotivationClip) {
    if (!this.enabled || typeof Audio === "undefined") return;
    const audio = new Audio(this.motivationClips[clip]);
    audio.volume = 0.8;
    audio.preload = "auto";
    void audio.play().catch(() => undefined);
  }

  motivateWrong(clip: WrongMotivationClip) {
    if (!this.enabled || typeof Audio === "undefined") return;
    const audio = new Audio(this.wrongMotivationClips[clip]);
    audio.volume = 0.82;
    audio.preload = "auto";
    void audio.play().catch(() => undefined);
  }

  incorrect() {
    this.streak = 0;
    this.unlock();
    if (!this.context) return;
    const now = this.context.currentTime;
    this.note(277.18, now, 0.16, 0.07, "triangle");
    this.note(220, now + 0.12, 0.2, 0.06, "triangle");
  }

  launch() {
    this.unlock();
    if (!this.context) return;
    const now = this.context.currentTime;
    this.note(174.61, now, 0.13, 0.06, "triangle");
    this.note(220, now + 0.09, 0.13, 0.07, "triangle");
    this.note(293.66, now + 0.18, 0.15, 0.08, "triangle");
    this.note(392, now + 0.28, 0.2, 0.09, "sine");
  }

  victory() {
    this.unlock();
    if (!this.context) return;
    const now = this.context.currentTime;
    this.note(523.25, now, 0.13, 0.09, "triangle");
    this.note(659.25, now + 0.1, 0.15, 0.1, "triangle");
    this.note(783.99, now + 0.2, 0.17, 0.11, "triangle");
    this.note(1046.5, now + 0.32, 0.36, 0.13, "sine");
  }

  levelUp() {
    if (!this.enabled) return;
    this.unlock();
    if (!this.context) return;
    const now = this.context.currentTime;
    this.note(523.25, now, 0.1, 0.1, "triangle");
    this.note(659.25, now + 0.09, 0.12, 0.12, "triangle");
    this.note(783.99, now + 0.19, 0.15, 0.14, "sine");
    this.note(1046.5, now + 0.31, 0.34, 0.16, "sine");
  }
}

declare global { interface Window { webkitAudioContext?: typeof AudioContext; } }

export const roundRushSound = new RoundRushSound();
