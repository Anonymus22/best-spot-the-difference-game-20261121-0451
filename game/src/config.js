// config.js - static tuning for Twin Garden Mysteries: canvas, panels, levels, scoring.
// Plain data and constants only; no drawing or game logic lives here.

export const CANVAS_W = 1280;
export const CANVAS_H = 760;

// Two picture panels, side by side.
export const PANEL_W = 610;
export const PANEL_H = 560;
export const PANEL_Y = 100;
export const PANEL_LEFT_X = 20;
export const PANEL_RIGHT_X = 650;
export const PANEL_GAP = 20;

// HUD layout.
export const HUD_H = 76;
export const FOOTER_Y = 668;
export const FOOTER_H = 76;

// Scoring and penalties.
export const POINTS_PER_FIND = 100;
export const WRONG_CLICK_SECONDS = 5;
export const HINTS_PER_LEVEL = 3;
export const HINT_PULSE_MS = 2200;

// Level table: name, time limit, how many differences, accent colour.
export const LEVELS = [
  { name: 'Sunny Garden', sub: 'Level 1 - morning in the garden', seconds: 120, accent: '#3f7d3a' },
  { name: 'Cozy Kitchen', sub: 'Level 2 - tea time at home', seconds: 150, accent: '#8a5a2b' },
  { name: 'Night Market', sub: 'Level 3 - lanterns after dark', seconds: 180, accent: '#5b4a8a' },
];

// Deterministic pre-marked finds for the ?shot=play screenshots.
// seed picks which differences start already found, so a cover shot always
// shows markers on some differences and several still unfound.
export const SHOT_FOUND_COUNT = [3, 4, 5];
export const SHOT_TIME_LEFT = [87, 104, 131];
