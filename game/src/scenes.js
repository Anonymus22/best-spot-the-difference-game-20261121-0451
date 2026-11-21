// scenes.js - the three hand-drawn vector scenes, drawn with canvas shapes only.
// Every scene is drawn twice: once for the left panel (mods empty, the
// original) and once for the right panel (mods holding every difference id).
// A difference id in `mods` changes exactly one small thing in the picture,
// so the two panels look near-identical until you study them.

function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function line(ctx, x1, y1, x2, y2, width, colour) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = width;
  ctx.strokeStyle = colour;
  ctx.stroke();
}

function poly(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function cloudShape(ctx, x, y, s, colour) {
  circle(ctx, x, y, 22 * s, colour);
  circle(ctx, x + 24 * s, y - 8 * s, 18 * s, colour);
  circle(ctx, x + 48 * s, y, 20 * s, colour);
  ellipse(ctx, x + 24 * s, y + 8 * s, 40 * s, 14 * s, colour);
}

function flowerShape(ctx, x, y, petal, centre) {
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    ellipse(ctx, x + Math.cos(a) * 16, y + Math.sin(a) * 16, 11, 11, petal);
  }
  circle(ctx, x, y, 10, centre);
  line(ctx, x, y + 8, x, y + 46, 4, '#3f7d3a');
  ellipse(ctx, x + 10, y + 34, 12, 5, '#4c8a45');
}

function birdShape(ctx, x, y, s, colour) {
  ctx.beginPath();
  ctx.arc(x, y, 14 * s, Math.PI * 1.1, Math.PI * 1.9);
  ctx.strokeStyle = colour;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 24 * s, y, 14 * s, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
}

// ---------------------------------------------------------------------------
// Level 1 - Sunny Garden. Panel space is 610 x 560.
// ---------------------------------------------------------------------------
export function drawSunnyGarden(ctx, mods) {
  const sky = ctx.createLinearGradient(0, 0, 0, 560);
  sky.addColorStop(0, '#aee3f5');
  sky.addColorStop(0.6, '#dff3e3');
  sky.addColorStop(1, '#cfe8b8');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 610, 560);

  // Sun, top left. Right panel: rays gone, sun turned orange.
  const sunColour = mods.has('sun-rays') ? '#f59e0b' : '#ffd93b';
  circle(ctx, 92, 84, 44, sunColour);
  if (!mods.has('sun-rays')) {
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      line(ctx, 92 + Math.cos(a) * 52, 84 + Math.sin(a) * 52,
        92 + Math.cos(a) * 68, 84 + Math.sin(a) * 68, 5, '#f5b301');
    }
  }

  // Clouds. Right panel: the middle cloud is gone.
  cloudShape(ctx, 210, 64, 1, '#ffffff');
  if (!mods.has('cloud')) cloudShape(ctx, 330, 70, 0.85, '#ffffff');
  cloudShape(ctx, 470, 52, 0.7, '#ffffff');

  // Birds. Right panel: one extra bird.
  birdShape(ctx, 380, 110, 1, '#334155');
  if (mods.has('bird')) birdShape(ctx, 430, 120, 0.8, '#334155');

  // Hills.
  ellipse(ctx, 140, 600, 260, 110, '#8fce6e');
  ellipse(ctx, 480, 610, 280, 120, '#7cc45f');

  // Tree on the right. Right panel: one apple is missing.
  rect(ctx, 492, 300, 22, 110, '#7a4a21');
  circle(ctx, 470, 260, 46, '#3f7d3a');
  circle(ctx, 540, 260, 46, '#4c8a45');
  circle(ctx, 505, 220, 48, '#57a047');
  circle(ctx, 462, 300, 12, '#e5484d');
  circle(ctx, 540, 296, 12, '#e5484d');
  if (!mods.has('apple')) circle(ctx, 508, 322, 12, '#e5484d');

  // Wooden fence across the middle. Right panel: one post is missing.
  rect(ctx, 20, 348, 570, 10, '#a9804f');
  rect(ctx, 20, 372, 570, 8, '#a9804f');
  const posts = [50, 150, 250, 350, 450, 550];
  for (const px of posts) {
    if (mods.has('fence-post') && px === 150) continue;
    rect(ctx, px - 6, 336, 12, 58, '#8a6a3f');
  }

  // Flower bed along the bottom. Right panel: middle flower turns purple.
  const flowerXs = [70, 135, 205, 275, 345];
  const flowerCols = ['#f472b6', '#f97316', '#f472b6', '#facc15', '#f472b6'];
  for (let i = 0; i < flowerXs.length; i++) {
    let petal = flowerCols[i];
    if (mods.has('flower') && flowerXs[i] === 205) petal = '#a78bfa';
    flowerShape(ctx, flowerXs[i], 452, petal, '#fff7cc');
  }

  // Butterfly. Right panel: wings turn blue.
  const wing = mods.has('butterfly') ? '#60a5fa' : '#fb923c';
  ellipse(ctx, 316, 392, 16, 10, wing);
  ellipse(ctx, 344, 392, 16, 10, wing);
  ellipse(ctx, 318, 410, 12, 8, wing);
  ellipse(ctx, 342, 410, 12, 8, wing);
  rect(ctx, 328, 388, 4, 26, '#3f3f46');

  // Pond, bottom left, with a lily pad.
  ellipse(ctx, 90, 520, 70, 18, '#7dd3fc');
  ellipse(ctx, 110, 518, 18, 8, '#4ade80');
  circle(ctx, 70, 516, 5, '#f472b6');
}

// ---------------------------------------------------------------------------
// Level 2 - Cozy Kitchen. Panel space is 610 x 560.
// ---------------------------------------------------------------------------
export function drawCozyKitchen(ctx, mods) {
  // Wall and floor.
  rect(ctx, 0, 0, 610, 400, '#f5e6c8');
  rect(ctx, 0, 400, 610, 160, '#b08954');
  for (let y = 420; y < 560; y += 34) line(ctx, 0, y, 610, y, 2, '#9a743f');

  // Window with curtains, left. Right panel: the right curtain is shorter.
  rect(ctx, 40, 60, 180, 190, '#bfe3f2');
  rect(ctx, 40, 60, 180, 190, 'rgba(255,255,255,0.25)');
  line(ctx, 130, 60, 130, 250, 4, '#8a5a2b');
  line(ctx, 40, 155, 220, 155, 4, '#8a5a2b');
  circle(ctx, 90, 100, 26, '#ffd93b');
  cloudShape(ctx, 160, 120, 0.5, '#ffffff');
  const curtainH = mods.has('curtain') ? 130 : 200;
  rect(ctx, 30, 50, 34, curtainH, '#e2725b');
  rect(ctx, 196, 50, 34, 200, '#e2725b');
  rect(ctx, 24, 44, 212, 14, '#8a5a2b');

  // Wall picture. Right panel: the sun in the frame becomes a moon.
  rect(ctx, 290, 56, 80, 66, '#8a5a2b');
  rect(ctx, 296, 62, 68, 54, '#fdf6e3');
  if (mods.has('picture')) {
    circle(ctx, 330, 90, 14, '#f5f0dc');
    circle(ctx, 326, 86, 12, '#fdf6e3');
  } else {
    circle(ctx, 330, 90, 14, '#f5b301');
    poly(ctx, [[300, 112], [312, 112], [306, 100]], '#3f7d3a');
    poly(ctx, [[322, 112], [336, 112], [329, 98]], '#3f7d3a');
  }

  // Clock. Right panel: hands move from 3 o'clock to 4:30.
  circle(ctx, 500, 84, 40, '#ffffff');
  ctx.beginPath();
  ctx.arc(500, 84, 40, 0, Math.PI * 2);
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#6b4423';
  ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    circle(ctx, 500 + Math.cos(a) * 32, 84 + Math.sin(a) * 32, 2, '#6b4423');
  }
  if (mods.has('clock')) {
    line(ctx, 500, 84, 516, 104, 4, '#1f2937'); // minute hand down-right
    line(ctx, 500, 84, 478, 92, 4, '#1f2937'); // hour hand left-down
  } else {
    line(ctx, 500, 84, 500, 58, 4, '#1f2937'); // minute hand up
    line(ctx, 500, 84, 524, 84, 4, '#1f2937'); // hour hand right
  }
  circle(ctx, 500, 84, 4, '#1f2937');

  // Shelf with three jars. Right panel: middle jar loses its label.
  rect(ctx, 100, 178, 220, 12, '#8a5a2b');
  const jars = [130, 190, 250];
  for (const jx of jars) {
    rect(ctx, jx, 128, 34, 50, '#cfe8d4');
    rect(ctx, jx - 3, 120, 40, 10, '#6b4423');
  }
  rect(ctx, 134, 146, 26, 18, '#f5b301');
  if (!mods.has('jar-label')) rect(ctx, 194, 146, 26, 18, '#e2725b');
  rect(ctx, 254, 146, 26, 18, '#60a5fa');

  // Plant on the sill. Right panel: one leaf is missing.
  rect(ctx, 82, 268, 44, 26, '#c2703d');
  ellipse(ctx, 104, 250, 8, 22, '#4c8a45');
  ellipse(ctx, 88, 254, 7, 18, '#57a047');
  if (!mods.has('plant-leaf')) ellipse(ctx, 120, 254, 7, 18, '#57a047');
  ellipse(ctx, 104, 238, 6, 16, '#3f7d3a');

  // Table with a cloth.
  rect(ctx, 180, 380, 300, 18, '#8a5a2b');
  rect(ctx, 196, 398, 12, 90, '#6b4423');
  rect(ctx, 452, 398, 12, 90, '#6b4423');
  poly(ctx, [[180, 380], [480, 380], [460, 430], [200, 430]], '#fde68a');

  // Teapot. Right panel: lid knob turns blue, and the steam is gone.
  ellipse(ctx, 268, 340, 52, 34, '#7c9cf5');
  circle(ctx, 268, 300, 16, '#7c9cf5');
  const knobColour = mods.has('knob') ? '#2563eb' : '#e5484d';
  circle(ctx, 268, 288, 8, knobColour);
  poly(ctx, [[214, 330], [196, 306], [214, 314]], '#7c9cf5');
  ctx.beginPath();
  ctx.arc(322, 340, 16, -Math.PI / 2, Math.PI / 2);
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#7c9cf5';
  ctx.stroke();
  if (!mods.has('steam')) {
    ctx.beginPath();
    ctx.moveTo(292, 268);
    ctx.quadraticCurveTo(284, 250, 294, 236);
    ctx.quadraticCurveTo(302, 224, 294, 210);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(148,163,184,0.9)';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(308, 268);
    ctx.quadraticCurveTo(316, 252, 308, 238);
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  // Two mugs. Right panel: the right mug loses its handle.
  rect(ctx, 330, 384, 44, 40, '#e2725b');
  ctx.beginPath();
  ctx.arc(378, 404, 12, -Math.PI / 2, Math.PI / 2);
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#e2725b';
  ctx.stroke();
  rect(ctx, 396, 384, 44, 40, '#4ade80');
  if (!mods.has('mug-handle')) {
    ctx.beginPath();
    ctx.arc(444, 404, 12, -Math.PI / 2, Math.PI / 2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#4ade80';
    ctx.stroke();
  }

  // Fruit bowl. Right panel: one apple is missing.
  ellipse(ctx, 400, 430, 46, 14, '#6b4423');
  circle(ctx, 384, 410, 12, '#e5484d');
  circle(ctx, 416, 410, 12, '#f59e0b');
  if (!mods.has('fruit')) circle(ctx, 400, 396, 12, '#e5484d');

  // Cat sitting on the floor. Right panel: tail points down instead of up.
  ellipse(ctx, 470, 500, 42, 26, '#f59e0b');
  circle(ctx, 452, 468, 20, '#f59e0b');
  poly(ctx, [[440, 452], [436, 436], [450, 446]], '#f59e0b');
  poly(ctx, [[462, 450], [468, 436], [470, 448]], '#f59e0b');
  circle(ctx, 446, 466, 3, '#1f2937');
  circle(ctx, 458, 466, 3, '#1f2937');
  if (mods.has('cat-tail')) {
    ctx.beginPath();
    ctx.arc(512, 500, 18, 0, Math.PI);
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(512, 496, 18, Math.PI, Math.PI * 2);
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();
  }
}

// ---------------------------------------------------------------------------
// Level 3 - Night Market. Panel space is 610 x 560.
// ---------------------------------------------------------------------------
function lantern(ctx, x, y, colour, lit) {
  rect(ctx, x - 4, y - 26, 8, 8, '#f5b301');
  ellipse(ctx, x, y, 22, 28, colour);
  line(ctx, x, y - 24, x, y + 24, 3, '#f5b301');
  rect(ctx, x - 4, y + 22, 8, 8, '#f5b301');
  if (lit) circle(ctx, x, y, 6, '#fef3c7');
}

export function drawNightMarket(ctx, mods) {
  const sky = ctx.createLinearGradient(0, 0, 0, 560);
  sky.addColorStop(0, '#1e1b4b');
  sky.addColorStop(0.55, '#312e81');
  sky.addColorStop(1, '#4c1d95');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 610, 560);

  // Stars. Right panel: one star is missing.
  const stars = [[60, 50], [140, 40], [250, 60], [360, 44], [460, 120], [90, 130], [580, 150], [200, 90]];
  for (const [sx, sy] of stars) {
    if (mods.has('star') && sx === 250 && sy === 60) continue;
    circle(ctx, sx, sy, 3, '#fef9c3');
    line(ctx, sx - 7, sy, sx + 7, sy, 1, '#fef9c3');
    line(ctx, sx, sy - 7, sx, sy + 7, 1, '#fef9c3');
  }

  // Moon. Right panel: the crater is gone, a plain pale moon.
  circle(ctx, 520, 80, 36, '#fef9c3');
  if (!mods.has('moon')) {
    circle(ctx, 508, 70, 7, '#e7e5a8');
    circle(ctx, 532, 90, 5, '#e7e5a8');
    circle(ctx, 528, 66, 4, '#e7e5a8');
  }

  // String lights across the top. Right panel: one bulb is dark.
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.quadraticCurveTo(305, 110, 610, 40);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#0f172a';
  ctx.stroke();
  const bulbXs = [60, 140, 220, 300, 380, 460, 540];
  for (const bx of bulbXs) {
    const t = bx / 610;
    const yb = 40 + 35 * Math.sin(Math.PI * t) + 14;
    const dark = mods.has('bulb') && bx === 420;
    circle(ctx, bx, yb, 8, dark ? '#475569' : '#fde047');
    if (!dark) circle(ctx, bx, yb, 12, 'rgba(253,224,71,0.25)');
  }

  // Ground.
  rect(ctx, 0, 440, 610, 120, '#3b2f5b');
  rect(ctx, 0, 440, 610, 8, '#2a2140');

  // Left stall with a sign. Right panel: the sign shows a dumpling, not a fish.
  rect(ctx, 60, 280, 200, 160, '#7c2d12');
  poly(ctx, [[50, 280], [270, 280], [250, 240], [70, 240]], '#dc2626');
  rect(ctx, 60, 280, 200, 10, '#f5b301');
  rect(ctx, 110, 300, 100, 56, '#fef3c7');
  ctx.fillStyle = '#7c2d12';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  if (mods.has('sign')) {
    circle(ctx, 160, 322, 14, '#7c2d12');
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('BUN', 160, 352);
  } else {
    ctx.fillText('FISH', 160, 328);
    poly(ctx, [[140, 340], [180, 340], [160, 352]], '#7c2d12');
  }
  // Goods on the left stall counter.
  circle(ctx, 100, 420, 10, '#f59e0b');
  circle(ctx, 130, 420, 10, '#f59e0b');
  circle(ctx, 160, 420, 10, '#f59e0b');

  // Right stall with a striped awning. Right panel: stripes turn blue.
  rect(ctx, 380, 280, 180, 160, '#14532d');
  const stripe = mods.has('awning') ? '#2563eb' : '#dc2626';
  for (let i = 0; i < 6; i++) {
    rect(ctx, 372 + i * 32, 240, 16, 40, i % 2 === 0 ? stripe : '#fef3c7');
  }
  rect(ctx, 380, 280, 180, 10, '#f5b301');
  // Steamed buns on the right stall. Right panel: one bun is missing.
  ellipse(ctx, 470, 420, 40, 10, '#d6d3d1');
  circle(ctx, 452, 406, 12, '#fef3c7');
  circle(ctx, 486, 406, 12, '#fef3c7');
  if (!mods.has('buns')) circle(ctx, 469, 398, 12, '#fef3c7');

  // Vendor behind the stalls. Right panel: hat turns red.
  circle(ctx, 300, 360, 26, '#f2c89b');
  rect(ctx, 272, 386, 56, 70, '#0e7490');
  const hatColour = mods.has('hat') ? '#dc2626' : '#f5b301';
  poly(ctx, [[262, 344], [338, 344], [300, 312]], hatColour);
  circle(ctx, 292, 356, 3, '#1f2937');
  circle(ctx, 308, 356, 3, '#1f2937');

  // Balloons tied to the right stall. Right panel: the balloon turns blue.
  line(ctx, 470, 240, 470, 190, 2, '#e5e7eb');
  const balloonColour = mods.has('balloon') ? '#60a5fa' : '#ef4444';
  ellipse(ctx, 470, 168, 18, 24, balloonColour);
  poly(ctx, [[462, 190], [478, 190], [470, 200]], balloonColour);

  // Lanterns hanging between the stalls. Right panel: one changes colour,
  // and the middle one disappears.
  lantern(ctx, 150, 150, mods.has('lantern-colour') ? '#22c55e' : '#ef4444', true);
  if (!mods.has('lantern-missing')) lantern(ctx, 330, 130, '#f59e0b', true);
  lantern(ctx, 520, 170, '#ec4899', true);

  // Crate with a cat. Right panel: the cat is gone.
  rect(ctx, 500, 470, 60, 40, '#92400e');
  line(ctx, 500, 490, 560, 490, 3, '#78350f');
  if (!mods.has('crate-cat')) {
    ellipse(ctx, 528, 468, 20, 12, '#1f2937');
    circle(ctx, 516, 452, 11, '#1f2937');
    poly(ctx, [[508, 444], [506, 434], [514, 442]], '#1f2937');
    poly(ctx, [[522, 442], [526, 434], [526, 444]], '#1f2937');
    ctx.beginPath();
    ctx.arc(544, 466, 10, Math.PI, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1f2937';
    ctx.stroke();
  }

  // Puddle with a lantern glow. Right panel: the glow is gone.
  ellipse(ctx, 200, 505, 70, 16, '#312e81');
  if (!mods.has('puddle')) {
    ellipse(ctx, 200, 505, 46, 9, 'rgba(239,68,68,0.55)');
    ellipse(ctx, 200, 505, 24, 5, 'rgba(253,224,71,0.7)');
  }
}

// Scene table used by render.js and main.js.
export const SCENES = [drawSunnyGarden, drawCozyKitchen, drawNightMarket];
