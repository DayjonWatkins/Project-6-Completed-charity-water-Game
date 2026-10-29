# charity: water – Water Drop Game (React Rewrite)

An interactive React web game inspired by charity: water's mission to bring clean and safe drinking water to every person on the planet.

## Overview

In this fast-paced game, players collect as many falling clean water drops as possible within a 30-second time limit while avoiding contaminated drops.

- **Clean Water Drops (+1 pt):** Catch falling blue drops to provide clean water.
- **Contaminated Drops (-1 pt):** Avoid muddy drops that decrease your score.
- **Winning Condition:** Score 20 or more points within 30 seconds to earn a victory message and celebration!
- **Sound Effects:** Built-in Web Audio API synthesizers for water droplets, collection ripples, and win/lose fanfares with toggle control.
- **Accessibility:** Full keyboard control (Tab to focus, Space/Enter to collect) and touch/pointer support.
- **Personal Best:** Tracks and saves high scores locally.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS + charity: water Brand Color Palette
  - Yellow: `#FFC907`
  - Blue: `#2E9DF7`
  - Light Blue: `#8BD1CB`
  - Green: `#4FCB53`
  - Dark Green: `#159A48`
  - Orange: `#FF902A`
  - Red: `#F5402C`
- **Effects:** Web Audio API sound synthesizers & canvas-confetti

## Development

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```
