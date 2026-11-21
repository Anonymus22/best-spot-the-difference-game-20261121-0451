// audio.js - tiny WebAudio sounds, synthesised on the fly, no audio files.
// The context is created lazily on the first user gesture, so the game stays
// silent (and error-free) in headless screenshot runs.

let audioCtx = null;

function context() {
  if (audioCtx) return audioCtx;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  } catch (e) {
    audioCtx = null;
  }
  return audioCtx;
}

function tone(freq, startAt, dur, type, gain) {
  const ac = context();
  if (!ac) return;
  try {
    if (ac.state === 'suspended') ac.resume();
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
    g.gain.exponentialRampToValueAtTime(gain, ac.currentTime + startAt + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + dur);
    osc.connect(g);
    g.connect(ac.destination);
    osc.start(ac.currentTime + startAt);
    osc.stop(ac.currentTime + startAt + dur + 0.05);
  } catch (e) {
    // Sound is garnish: never let it break the game.
  }
}

// A bright two-note chime when a difference is found.
export function playFoundChime() {
  tone(880, 0, 0.18, 'sine', 0.18);
  tone(1318.5, 0.09, 0.28, 'sine', 0.18);
}

// A low dull thud for a wrong click.
export function playWrongThud() {
  tone(160, 0, 0.16, 'triangle', 0.16);
  tone(110, 0.05, 0.2, 'triangle', 0.12);
}

// A soft sparkle when a hint is used.
export function playHintSparkle() {
  tone(1567.98, 0, 0.12, 'sine', 0.1);
  tone(2093, 0.08, 0.2, 'sine', 0.1);
}

// A little rising fanfare for a finished level.
export function playLevelFanfare() {
  tone(523.25, 0, 0.16, 'triangle', 0.16);
  tone(659.25, 0.12, 0.16, 'triangle', 0.16);
  tone(783.99, 0.24, 0.3, 'triangle', 0.18);
}
