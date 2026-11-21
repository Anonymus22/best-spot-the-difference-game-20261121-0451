// differences.js - the difference sets for the three levels.
// Each difference lives in panel space (0..610 x 0..560) with a click radius.
// `label` is the short name shown when the difference is found.
// The scene draw code in scenes.js reads the same ids to change the right panel.

export const DIFFERENCES = [
  // Level 1 - Sunny Garden (7 differences)
  [
    { id: 'sun-rays',    x: 92,  y: 84,  r: 52, label: 'Sun rays' },
    { id: 'cloud',       x: 330, y: 70,  r: 42, label: 'Cloud' },
    { id: 'bird',        x: 430, y: 120, r: 30, label: 'Extra bird' },
    { id: 'flower',      x: 205, y: 452, r: 34, label: 'Flower colour' },
    { id: 'apple',       x: 508, y: 322, r: 26, label: 'Apple' },
    { id: 'butterfly',   x: 330, y: 400, r: 30, label: 'Butterfly' },
    { id: 'fence-post',  x: 150, y: 356, r: 26, label: 'Fence post' },
  ],
  // Level 2 - Cozy Kitchen (10 differences)
  [
    { id: 'clock',       x: 500, y: 84,  r: 40, label: 'Clock hands' },
    { id: 'knob',        x: 268, y: 300, r: 26, label: 'Teapot knob' },
    { id: 'jar-label',   x: 160, y: 150, r: 30, label: 'Jar label' },
    { id: 'cat-tail',    x: 470, y: 470, r: 34, label: 'Cat tail' },
    { id: 'plant-leaf',  x: 96,  y: 268, r: 26, label: 'Plant leaf' },
    { id: 'fruit',       x: 400, y: 400, r: 28, label: 'Fruit bowl' },
    { id: 'curtain',     x: 96,  y: 150, r: 40, label: 'Curtain' },
    { id: 'steam',       x: 300, y: 262, r: 30, label: 'Steam' },
    { id: 'mug-handle',  x: 352, y: 408, r: 24, label: 'Mug handle' },
    { id: 'picture',     x: 330, y: 90,  r: 36, label: 'Wall picture' },
  ],
  // Level 3 - Night Market (12 differences)
  [
    { id: 'lantern-colour', x: 150, y: 150, r: 30, label: 'Lantern colour' },
    { id: 'lantern-missing', x: 330, y: 130, r: 28, label: 'Lantern' },
    { id: 'moon',        x: 520, y: 80,  r: 42, label: 'Moon' },
    { id: 'star',        x: 250, y: 60,  r: 22, label: 'Star' },
    { id: 'sign',        x: 160, y: 300, r: 36, label: 'Shop sign' },
    { id: 'balloon',     x: 470, y: 220, r: 30, label: 'Balloon' },
    { id: 'hat',         x: 300, y: 330, r: 28, label: 'Vendor hat' },
    { id: 'bulb',        x: 420, y: 96,  r: 22, label: 'String light' },
    { id: 'awning',      x: 470, y: 268, r: 32, label: 'Awning stripe' },
    { id: 'crate-cat',   x: 520, y: 470, r: 30, label: 'Crate cat' },
    { id: 'puddle',      x: 200, y: 505, r: 36, label: 'Puddle glow' },
    { id: 'buns',        x: 380, y: 430, r: 28, label: 'Steamed buns' },
  ],
];

export function differencesFor(levelIndex) {
  return DIFFERENCES[levelIndex] || DIFFERENCES[0];
}

export function differenceCount(levelIndex) {
  return differencesFor(levelIndex).length;
}
