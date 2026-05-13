# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npx expo start              # Start dev server (press a/i/w for platform)
npx expo start --lan        # Start with LAN access (for phone on same WiFi)
npx expo start --tunnel     # Start with ngrok tunnel (requires @expo/ngrok)
npm run lint                # ESLint via expo lint
npx tsc --noEmit            # Type check (no build output)
npx expo install <pkg>      # Install SDK-compatible packages (prefer over npm install)
```

## Architecture

**Expo Router file-based routing** — screens live in `app/`. The `(tabs)/` group creates bottom tab navigation. Root layout (`app/_layout.tsx`) applies the navigation theme; tab layout (`app/(tabs)/_layout.tsx`) configures tabs and wraps children in `HabitProvider`.

**State management** — React Context via `contexts/habit-context.tsx`. The `HabitProvider` persists daily habit completions to AsyncStorage using date-keyed entries (`habits-YYYY-MM-DD`). Both tabs share state through this context. Use `useHabits()` to access `completedIds`, `toggleHabit()`, and `weekData`.

**Theming** — Dual light/dark mode with a golf-green palette (`#2D6A4F` primary, `#52B788` accent). Colors defined in `constants/theme.ts`. Use `useColors()` hook to get the full color object for the current scheme. Navigation theme overrides are in the root layout.

**Icon system** — `components/ui/icon-symbol.tsx` maps SF Symbol names to MaterialIcons for Android/web. The `.ios.tsx` variant uses native SF Symbols. When adding new tab icons, add the mapping to both files.

## Key Conventions

- **Path alias:** `@/` maps to project root (e.g., `@/components/habit-row`)
- **Habits are defined in `constants/habits.ts`** — the `Habit` interface and `HABITS` array
- **Platform-specific files** use `.ios.tsx` / `.web.ts` suffixes (Expo resolves automatically)
- **Haptic feedback** is iOS-only, guarded by `process.env.EXPO_OS === 'ios'`
- **TypeScript strict mode** is enabled; typed routes and React Compiler experiments are on

## Tech Stack

Expo 54, React Native 0.81, React 19, Expo Router 6, TypeScript 5.9, react-native-reanimated 4, AsyncStorage for persistence.
