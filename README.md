# Tick ⏱️

A distraction-free countdown timer built with React and Capacitor.

## Features

- **Full-screen countdown** — goes immersive the moment you hit start
- **Auto landscape lock** — locks to landscape on mobile for a clean display
- **Quick presets** — jump to 15, 30, or 45 minutes in one tap
- **Soft audio tick** — a gentle tick every second to keep you present
- **Hours & minutes picker** — set any custom duration you need

## Tech stack

- React + TypeScript
- Capacitor (screen orientation + native mobile support)
- Tailwind CSS

## Getting started

```bash
# Install dependencies
npm install

# Run in browser
npm run dev

# Build for mobile
npm run build
npx cap sync
npx cap open ios      # or android
```

## Project structure

```
src/
├── App.tsx                  # Main timer component
├── ui/
│   └── button.tsx           # Button component
└── utils/
    └── format-time.ts       # Time formatting helper
public/
└── soft-tick.mp3            # Tick sound effect
```

## Usage

1. Set hours and minutes using the dropdowns, or tap a quick preset (15 / 30 / 45 min)
2. Tap **Start countdown** — the screen goes full-screen and locks to landscape
3. Tap **Stop** at any time to return to the picker

## License

MIT