// main.js - game state, the main loop, and the deterministic screenshot states.
// Wires input.js, render.js, audio.js and the scene data together.
// URL query: ?shot=start|play|end&seed=N&level=1..3
//   start: title screen. play: mid-level with some differences already marked
//   and the timer frozen. end: victory screen. seed picks which differences
//   start marked, so screenshots are reproducible.

import { CANVAS_W, CANVAS_H, LEVELS, POINTS_PER_FIND, WRONG_CLICK_SECONDS, HINTS_PER_LEVEL, HINT_PULSE_MS, SHOT_FOUND_COUNT, SHOT_TIME_LEFT } from './config.js';
import { differencesFor } from './differences.js';
import { panelHit, nearestDifference, buttonHit, eventPoint, BUTTONS } from './input.js';
import { render } from './render.js';
import { playFoundChime, playWrongThud, playHintSparkle, playLevelFanfare } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Small seeded RNG (mulberry32) so ?shot=play picks the same pre-marked
// differences for a given seed.
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot') || '';
const seed = Number(params.get('seed') || '1') || 1;
const shotLevel = Math.min(3, Math.max(1, Number(params.get('level') || '1') || 1));

const state = {
  screen: 'title', // title | play | levelComplete | victory | gameOver
  levelIndex: 0,
  found: new Set(),
  differences: differencesFor(0),
  timeLeft: LEVELS[0].seconds,
  score: 0,
  levelScore: 0,
  levelBonus: 0,
  hintsLeft: HINTS_PER_LEVEL,
  hintPulse: null,
  shakeUntil: 0,
  lastFoundLabel: '',
  shotMode: false,
};

function startLevel(index) {
  state.levelIndex = index;
  state.differences = differencesFor(index);
  state.found = new Set();
  state.timeLeft = LEVELS[index].seconds;
  state.levelScore = 0;
  state.levelBonus = 0;
  state.hintsLeft = HINTS_PER_LEVEL;
  state.hintPulse = null;
  state.shakeUntil = 0;
  state.lastFoundLabel = '';
  state.screen = 'play';
}

function finishLevel() {
  state.levelBonus = Math.ceil(state.timeLeft) * 5;
  state.levelScore = state.found.size * POINTS_PER_FIND + state.levelBonus;
  state.score += state.levelBonus;
  state.screen = 'levelComplete';
  playLevelFanfare();
}

function useHint() {
  if (state.screen !== 'play' || state.hintsLeft <= 0) return;
  const remaining = state.differences.map(function (d, i) { return i; })
    .filter(function (i) { return !state.found.has(i); });
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.hintPulse = { index: pick, until: performance.now() + HINT_PULSE_MS };
  playHintSparkle();
}

function handleFound(index) {
  state.found.add(index);
  state.score += POINTS_PER_FIND;
  state.lastFoundLabel = state.differences[index].label;
  playFoundChime();
  if (state.found.size === state.differences.length) finishLevel();
}

function handleWrongClick() {
  state.timeLeft = Math.max(0, state.timeLeft - WRONG_CLICK_SECONDS);
  state.shakeUntil = performance.now() + 320;
  state.lastFoundLabel = '';
  playWrongThud();
}

function onCanvasClick(event) {
  const p = eventPoint(canvas, event);
  if (state.screen === 'title') {
    startLevel(0);
    return;
  }
  if (state.screen === 'victory') {
    state.score = 0;
    startLevel(0);
    return;
  }
  if (state.screen === 'levelComplete') {
    if (state.levelIndex + 1 < LEVELS.length) startLevel(state.levelIndex + 1);
    else state.screen = 'victory';
    return;
  }
  if (state.screen === 'gameOver') {
    startLevel(state.levelIndex);
    return;
  }
  if (state.screen !== 'play') return;

  if (buttonHit(p.x, p.y, BUTTONS.hint)) { useHint(); return; }
  if (buttonHit(p.x, p.y, BUTTONS.restart)) { startLevel(state.levelIndex); return; }

  const hit = panelHit(p.x, p.y);
  if (!hit) return;
  const foundIndex = nearestDifference(hit, state.differences, state.found);
  if (foundIndex === null) handleWrongClick();
  else handleFound(foundIndex);
}

function onKey(event) {
  if (event.key === 'h' || event.key === 'H') useHint();
  if (event.key === 'r' || event.key === 'R') {
    if (state.screen === 'play' || state.screen === 'gameOver') startLevel(state.levelIndex);
  }
  if (event.key === 'Enter' && state.screen === 'title') startLevel(0);
}

canvas.addEventListener('click', onCanvasClick);
window.addEventListener('keydown', onKey);

// Deterministic screenshot states, for the maker's own screenshots.
function applyShotState() {
  if (shot === 'start') {
    state.screen = 'title';
    state.shotMode = true;
    return;
  }
  if (shot === 'end') {
    state.screen = 'victory';
    state.score = 2450;
    state.shotMode = true;
    return;
  }
  if (shot === 'play') {
    const levelIndex = shotLevel - 1;
    startLevel(levelIndex);
    const rng = mulberry32(seed * 7919 + levelIndex * 131);
    const total = state.differences.length;
    const want = Math.min(SHOT_FOUND_COUNT[levelIndex], total);
    const picked = new Set();
    while (picked.size < want) picked.add(Math.floor(rng() * total));
    state.found = picked;
    state.score = picked.size * POINTS_PER_FIND;
    state.timeLeft = SHOT_TIME_LEFT[levelIndex];
    state.shotMode = true;
  }
}

applyShotState();

// Test hook: lets an automated play-test drive the game (click, hint, state).
window.TWIN = {
  state: state,
  startLevel: startLevel,
  useHint: useHint,
  clickAt: function (x, y) {
    const rect = canvas.getBoundingClientRect();
    const clientX = rect.left + (x / canvas.width) * rect.width;
    const clientY = rect.top + (y / canvas.height) * rect.height;
    canvas.dispatchEvent(new MouseEvent('click', { clientX: clientX, clientY: clientY }));
    return state;
  },
};

// Main loop: tick the countdown only while really playing, then draw.
let lastNow = performance.now();
function frame(now) {
  const dt = Math.min(0.25, (now - lastNow) / 1000);
  lastNow = now;
  if (state.screen === 'play' && !state.shotMode) {
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.screen = 'gameOver';
    }
  }
  render(ctx, state, now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
