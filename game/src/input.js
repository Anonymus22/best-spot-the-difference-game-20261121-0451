// input.js - mouse and keyboard input for the game.
// Translates a click on the canvas into panel space, finds the nearest
// unfound difference, and reports hits, misses and button presses.
// The game logic itself lives in main.js; this file only reads input.

import { PANEL_W, PANEL_H, PANEL_Y, PANEL_LEFT_X, PANEL_RIGHT_X } from './config.js';

export const BUTTONS = {
  hint: { x: 1050, y: 668, w: 100, h: 52 },
  restart: { x: 1160, y: 668, w: 100, h: 52 },
};

// Which panel (0 left, 1 right) holds a canvas point, or -1 when it is outside
// both pictures. Returns the point in that panel's own 610x560 space too.
export function panelHit(canvasX, canvasY) {
  if (canvasY < PANEL_Y || canvasY > PANEL_Y + PANEL_H) return null;
  if (canvasX >= PANEL_LEFT_X && canvasX <= PANEL_LEFT_X + PANEL_W) {
    return { panel: 0, x: canvasX - PANEL_LEFT_X, y: canvasY - PANEL_Y };
  }
  if (canvasX >= PANEL_RIGHT_X && canvasX <= PANEL_RIGHT_X + PANEL_W) {
    return { panel: 1, x: canvasX - PANEL_RIGHT_X, y: canvasY - PANEL_Y };
  }
  return null;
}

// The nearest unfound difference within its click radius, or null.
export function nearestDifference(hit, differences, found) {
  let best = null;
  let bestDist = Infinity;
  for (let i = 0; i < differences.length; i++) {
    if (found.has(i)) continue;
    const d = differences[i];
    const dx = hit.x - d.x;
    const dy = hit.y - d.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= d.r && dist < bestDist) {
      best = i;
      bestDist = dist;
    }
  }
  return best;
}

export function buttonHit(canvasX, canvasY, button) {
  return canvasX >= button.x && canvasX <= button.x + button.w &&
    canvasY >= button.y && canvasY <= button.y + button.h;
}

// Canvas coordinates from a pointer event, honouring the canvas scale.
export function eventPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}
