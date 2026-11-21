# Twin Garden Mysteries

A spot-the-difference game: two near-identical hand-drawn pictures side by
side, find every change before the clock runs out. Three original vector
scenes, all art drawn in code with canvas shapes, all sounds synthesised
with WebAudio. No external assets, no network requests.

[![Competition](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![Rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Anonymus22/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![Reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Anonymus22/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

## How to play

- Open `game/index.html` in a desktop browser (or serve `game/` with
  `node serve.ts` and open http://localhost:8080).
- Click a difference on either picture to mark it with a green circle.
  A wrong click costs 5 seconds and shakes the pictures.
- The counter at the top always shows how many differences are found
  and how many remain.
- Each level has a countdown timer and 3 hints. The Hint button (or the
  H key) briefly pulses one difference you have not found yet.
- Find them all to finish the level and earn a time bonus, then move on.
- R restarts the current level.

## Levels

1. **Sunny Garden** - 7 differences, 120 seconds
2. **Cozy Kitchen** - 10 differences, 150 seconds
3. **Night Market** - 12 differences, 180 seconds

29 differences in all. Finding one plays a chime; finishing a level
plays a fanfare.

## Screenshot states

The game reads `?shot=` from the URL for deterministic screenshots:

- `?shot=start` - title screen
- `?shot=play&level=1..3&seed=N` - mid-level, some differences already
  marked, the timer frozen
- `?shot=end` - victory screen

## Files

- `game/index.html` - page and canvas
- `game/src/config.js` - constants, levels, scoring
- `game/src/differences.js` - the difference sets for the three levels
- `game/src/scenes.js` - the three hand-drawn vector scenes
- `game/src/input.js` - mouse and keyboard input, hit-testing
- `game/src/render.js` - panels, markers, HUD, title and end screens
- `game/src/audio.js` - WebAudio chimes and fanfares
- `game/src/main.js` - game state, main loop, screenshot states
- `main.ts` - hands the entry in (copies `game/` and `screenshots/`,
  writes `dossier.json`)

## Handing it in

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This is an entry for the make.fun competition
`best-spot-the-difference-game-20261121-0451`.
