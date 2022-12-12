# Tetris game

Small tetris game implementation. Vanilla TS was used, so game hasn't runtime dependencies. Use arrow keys and have a fun!

![Settings page](/img/settings.png)

## Installation

Just copy `index.html` and `tetris_frontend.js` from dist directory into local destination folder.

## Development

Required node.js v16 or highter.
Install dependencies

```console
git clone https://github.com/cybernextgen/tetris.git
cd tetris
npm install
```

Run tests

```console
npm test
```

Build bundle

```console
npx rollup --config frontend.rollup3.config.mjs
```

## Customization

Game constants are defined in ![settings_loader.ts](/src/frontend/ts/utils/settings_loader.ts) file. Default values:

```js
GAME_FIELD_BACKGROUND_COLOR = '161f27'
/**
 * Colors for figures (HEX RGB strings). Zero indexed color are game field background color
 */
FIGURE_COLORS = [
  GAME_FIELD_BACKGROUND_COLOR,
  'FFD498',
  '047C51',
  'FE5825',
  '700414',
  'DF3D2E',
  'FEFEFE',
  '668BC4',
  '335495'
]
/**
 * Available game modes. Key - game mode code, value - human readable representation
 */
GAME_MODES = {
  EASY: 'Easy mode',
  MEDIUM: 'Medium mode',
  HARD: 'Hard mode'
}
GAME_FIELD_HEIGHT_IN_CELLS = 20
GAME_FIELD_WIDTH_IN_CELLS = 10
/**
 * Rows collapse effect color
 */
EFFECT_COLOR = 'ffffff'
/**
 * Effect color for tetris (4 rows collapse)
 */
TETRIS_EFFECT_COLOR = 'ff0000'
/**
 * Levels speed settings, keys are count of rows, values are clock intervals
 */
LEVELS = {
  0: 770,
  15: 730,
  30: 680,
  45: 620,
  60: 550,
  75: 470,
  90: 380,
  100: 280,
  110: 160,
  120: 100
}
```

Figure shapes defined in ![figure_randomizer.ts](/src/frontend/ts/utils/figure_randomizer.ts) file. For each game mode you can add different figures, for example:

```js
if (mode === this.settings.GAME_MODES['HARD']) {
  this.figures.push(
    new Cells([
      [1, 0, 1],
      [1, 1, 1]
    ])
  )
}
```

Also, you can use ![style.css](/src/frontend/css/style.css) file for styling HTML content.
