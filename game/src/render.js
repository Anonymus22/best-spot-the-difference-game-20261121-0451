// render.js - everything the player sees: the two panels, the markers, the
// HUD (timer, counter, score, buttons) and the title / level / victory screens.
// It only draws; game state lives in main.js.

import {
  CANVAS_W, CANVAS_H, PANEL_W, PANEL_H, PANEL_Y, PANEL_LEFT_X, PANEL_RIGHT_X,
  HUD_H, FOOTER_Y, LEVELS, HINTS_PER_LEVEL,
} from './config.js';
import { SCENES } from './scenes.js';
import { differencesFor } from './differences.js';
import { BUTTONS } from './input.js';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, str, x, y, size, colour, align, weight) {
  ctx.fillStyle = colour;
  ctx.font = (weight || 'bold') + ' ' + size + 'px sans-serif';
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

function drawMarker(ctx, panelX, d, now, hint) {
  const x = panelX + d.x;
  const y = PANEL_Y + d.y;
  ctx.beginPath();
  ctx.arc(x, y, d.r + 5, 0, Math.PI * 2);
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#22c55e';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, d.r + 11, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(34,197,94,0.5)';
  ctx.stroke();
  // Tick inside the circle.
  ctx.beginPath();
  ctx.moveTo(x - d.r * 0.4, y);
  ctx.lineTo(x - d.r * 0.1, y + d.r * 0.35);
  ctx.lineTo(x + d.r * 0.45, y - d.r * 0.35);
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#16a34a';
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.lineCap = 'butt';
}

function drawHintPulse(ctx, panelX, d, now, until) {
  const frac = 1 - Math.max(0, until - now) / 2200;
  const pulse = 0.5 + 0.5 * Math.sin(now / 130);
  const r = d.r + 6 + frac * 26;
  const x = panelX + d.x;
  const y = PANEL_Y + d.y;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.lineWidth = 4 + pulse * 3;
  ctx.strokeStyle = 'rgba(245,179,1,' + (0.9 - frac * 0.5) + ')';
  ctx.stroke();
}

function drawPanelFrame(ctx, x, label, accent) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = '#fffdf5';
  ctx.fillRect(x - 4, PANEL_Y - 4, PANEL_W + 8, PANEL_H + 8);
  ctx.restore();
  text(ctx, label, x + 12, PANEL_Y - 12, 15, '#5b4a3a', 'left', 'bold');
}

function drawHud(ctx, state) {
  const level = LEVELS[state.levelIndex];
  const diffs = differencesFor(state.levelIndex);
  // Top bar.
  ctx.fillStyle = '#2e4a2f';
  ctx.fillRect(0, 0, CANVAS_W, HUD_H);
  text(ctx, 'Twin Garden Mysteries', 20, 26, 26, '#fef9c3');
  text(ctx, level.name + '  -  ' + level.sub, 20, 54, 15, '#d9f99d', 'left', 'normal');

  // Timer bar, centre.
  const barW = 320;
  const barX = 480;
  const frac = Math.max(0, state.timeLeft / level.seconds);
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  roundRect(ctx, barX, 18, barW, 20, 10);
  ctx.fill();
  ctx.fillStyle = frac > 0.25 ? '#4ade80' : '#ef4444';
  if (frac > 0) {
    roundRect(ctx, barX, 18, Math.max(20, barW * frac), 20, 10);
    ctx.fill();
  }
  const mm = Math.floor(state.timeLeft / 60);
  const ss = Math.floor(state.timeLeft % 60);
  const clock = mm + ':' + (ss < 10 ? '0' : '') + ss;
  text(ctx, clock, barX + barW / 2, 52, 20, '#ffffff');

  // Found counter, big and always visible.
  text(ctx, 'Found ' + state.found.size + ' / ' + diffs.length, 860, 26, 26, '#ffffff');
  text(ctx, 'Score ' + state.score, 860, 54, 15, '#d9f99d', 'left', 'normal');

  // Footer: how to play + buttons.
  ctx.fillStyle = '#efe7d3';
  ctx.fillRect(0, FOOTER_Y, CANVAS_W, CANVAS_H - FOOTER_Y);
  text(ctx, 'Click a difference on either picture.  H = hint   R = restart level',
    20, FOOTER_Y + 26, 16, '#5b4a3a', 'left', 'normal');
  if (state.lastFoundLabel) {
    text(ctx, 'Found: ' + state.lastFoundLabel + '  (+100)', 20, FOOTER_Y + 52, 15, '#16a34a');
  }
  drawButton(ctx, BUTTONS.hint, 'Hint (' + state.hintsLeft + ')', state.hintsLeft > 0);
  drawButton(ctx, BUTTONS.restart, 'Restart', true);
}

function drawButton(ctx, b, label, enabled) {
  ctx.fillStyle = enabled ? '#3f7d3a' : '#9ca3af';
  roundRect(ctx, b.x, b.y, b.w, b.h, 10);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 17px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, b.x + b.w / 2, b.y + b.h / 2 + 1);
}

function drawPlay(ctx, state, now) {
  const level = LEVELS[state.levelIndex];
  const diffs = differencesFor(state.levelIndex);
  const allMods = new Set(diffs.map(function (d) { return d.id; }));
  const emptyMods = new Set();

  // Wrong-click shake: both panels jump a few pixels for a moment.
  let shakeX = 0;
  let shakeY = 0;
  if (now < state.shakeUntil) {
    shakeX = Math.round(Math.sin(now / 18) * 5);
    shakeY = Math.round(Math.cos(now / 23) * 3);
  }

  drawHud(ctx, state);

  ctx.save();
  ctx.translate(shakeX, shakeY);
  drawPanelFrame(ctx, PANEL_LEFT_X, 'Picture A - original', level.accent);
  drawPanelFrame(ctx, PANEL_RIGHT_X, 'Picture B - changed', level.accent);
  ctx.save();
  ctx.beginPath();
  ctx.rect(PANEL_LEFT_X, PANEL_Y, PANEL_W, PANEL_H);
  ctx.clip();
  ctx.translate(PANEL_LEFT_X, PANEL_Y);
  SCENES[state.levelIndex](ctx, emptyMods);
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.rect(PANEL_RIGHT_X, PANEL_Y, PANEL_W, PANEL_H);
  ctx.clip();
  ctx.translate(PANEL_RIGHT_X, PANEL_Y);
  SCENES[state.levelIndex](ctx, allMods);
  ctx.translate(-PANEL_RIGHT_X, -PANEL_Y);
  ctx.restore();

  // Green markers on every found difference, on both pictures.
  for (const i of state.found) {
    const d = diffs[i];
    drawMarker(ctx, PANEL_LEFT_X, d, now, false);
    drawMarker(ctx, PANEL_RIGHT_X, d, now, false);
  }
  // A hint pulse, when one is running.
  if (state.hintPulse && now < state.hintPulse.until) {
    const d = diffs[state.hintPulse.index];
    drawHintPulse(ctx, PANEL_LEFT_X, d, now, state.hintPulse.until);
    drawHintPulse(ctx, PANEL_RIGHT_X, d, now, state.hintPulse.until);
  }
  ctx.restore();
}

function drawTitle(ctx, state) {
  ctx.fillStyle = '#2e4a2f';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  // Little garden strip at the bottom.
  ctx.fillStyle = '#3f7d3a';
  ctx.fillRect(0, 620, CANVAS_W, 140);
  for (let x = 40; x < CANVAS_W; x += 110) {
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(x, 660, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(x, 660, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  text(ctx, 'TWIN GARDEN', 640, 190, 72, '#fef9c3', 'center');
  text(ctx, 'MYSTERIES', 640, 270, 72, '#fef9c3', 'center');
  text(ctx, 'A spot-the-difference hunt in three hand-drawn worlds', 640, 350, 22, '#d9f99d', 'center', 'normal');
  text(ctx, 'Two pictures side by side. Find every change before the clock runs out.',
    640, 386, 18, '#e7e5d5', 'center', 'normal');
  text(ctx, 'Level 1 Sunny Garden (7)    Level 2 Cozy Kitchen (10)    Level 3 Night Market (12)',
    640, 440, 18, '#ffffff', 'center', 'normal');
  // Start button.
  ctx.fillStyle = '#f5b301';
  roundRect(ctx, 490, 490, 300, 64, 14);
  ctx.fill();
  text(ctx, 'START THE HUNT', 640, 523, 26, '#3f3f1d', 'center');
  text(ctx, 'Click to start  -  mouse to mark, H for a hint, R to restart a level',
    640, 580, 15, '#d9f99d', 'center', 'normal');
}

function drawOverlayPanel(ctx, title, lines, accent) {
  ctx.fillStyle = 'rgba(20,30,20,0.55)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#fffdf5';
  roundRect(ctx, 340, 170, 600, 380, 18);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.fillRect(340, 170, 600, 8);
  text(ctx, title, 640, 240, 40, '#2e4a2f', 'center');
  let y = 300;
  for (const line of lines) {
    text(ctx, line, 640, y, 20, '#374151', 'center', 'normal');
    y += 36;
  }
  text(ctx, 'Click to continue', 640, 500, 17, '#6b7280', 'center', 'normal');
}

function drawLevelComplete(ctx, state) {
  drawPlay(ctx, state, performance.now());
  const level = LEVELS[state.levelIndex];
  const lines = [
    level.name + ' complete!',
    'Time left: ' + Math.ceil(state.timeLeft) + 's   Time bonus: +' + state.levelBonus,
    'Level score: ' + state.levelScore + '   Total score: ' + state.score,
    state.levelIndex + 1 < LEVELS.length
      ? 'Next up: ' + LEVELS[state.levelIndex + 1].name
      : 'That was the last level!',
  ];
  drawOverlayPanel(ctx, 'LEVEL COMPLETE', lines, '#22c55e');
}

function drawVictory(ctx, state) {
  ctx.fillStyle = '#2e4a2f';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#f5b301';
  for (let i = 0; i < 5; i++) {
    const x = 340 + i * 150;
    const y = 150 + (i % 2) * 40;
    ctx.beginPath();
    ctx.moveTo(x, y - 22);
    ctx.lineTo(x + 7, y - 7);
    ctx.lineTo(x + 23, y - 7);
    ctx.lineTo(x + 11, y + 4);
    ctx.lineTo(x + 16, y + 20);
    ctx.lineTo(x, y + 10);
    ctx.lineTo(x - 16, y + 20);
    ctx.lineTo(x - 11, y + 4);
    ctx.lineTo(x - 23, y - 7);
    ctx.lineTo(x - 7, y - 7);
    ctx.closePath();
    ctx.fill();
  }
  text(ctx, 'YOU FOUND THEM ALL!', 640, 300, 56, '#fef9c3', 'center');
  text(ctx, 'Every difference in all three worlds is marked.', 640, 360, 21, '#d9f99d', 'center', 'normal');
  text(ctx, 'Final score: ' + state.score, 640, 420, 30, '#ffffff', 'center');
  text(ctx, 'Sunny Garden 7  -  Cozy Kitchen 10  -  Night Market 12  =  29 differences',
    640, 468, 18, '#e7e5d5', 'center', 'normal');
  text(ctx, 'Click to play again', 640, 540, 18, '#d9f99d', 'center', 'normal');
}

function drawGameOver(ctx, state) {
  drawPlay(ctx, state, performance.now());
  const level = LEVELS[state.levelIndex];
  const lines = [
    'Time ran out in ' + level.name + '.',
    'You found ' + state.found.size + ' of ' + differencesFor(state.levelIndex).length + ' differences.',
    'Score so far: ' + state.score,
    'Press R or click to try this level again.',
  ];
  drawOverlayPanel(ctx, 'TIME UP', lines, '#ef4444');
}

export function render(ctx, state, now) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  if (state.screen === 'title') drawTitle(ctx, state);
  else if (state.screen === 'play') drawPlay(ctx, state, now);
  else if (state.screen === 'levelComplete') drawLevelComplete(ctx, state);
  else if (state.screen === 'victory') drawVictory(ctx, state);
  else if (state.screen === 'gameOver') drawGameOver(ctx, state);
}
