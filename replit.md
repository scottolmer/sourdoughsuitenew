# Sourdough Suite

A comprehensive sourdough baking companion app built with React Native (Expo), running as a web app in Replit via Expo Web.

## App Overview

Sourdough Suite is a feature-rich mobile-first app for sourdough bakers, including:
- **Home**: Dashboard with quick links to all features
- **Tools**: 11 professional calculators (Baker's %, Hydration, Timeline, Scaling, Temperature, Levain Builder, Starter %, Preferment, Dough Weight, Recipe Rescue, Flour Blend)
- **Starters**: Track and manage sourdough starters with feeding logs
- **Recipes**: Save and manage sourdough recipes
- **Learn**: Sourdough academy content
- **Profile**: User settings, FAQ, About, Privacy, Terms

## Architecture

- **Framework**: React Native with Expo (~54.0.0)
- **Navigation**: `@react-navigation/native` with bottom tabs + native stack
- **State**: React Query (@tanstack/react-query) + AsyncStorage for local persistence
- **Icons**: `@expo/vector-icons` (MaterialCommunityIcons)
- **Fonts**: Inter + Playfair Display (expo-google-fonts)
- **Web Support**: `react-native-web`, `react-dom`, `@expo/metro-runtime`
- **Bundler**: Metro (Expo's Metro config)

## Running the App

- **Workflow**: "Start application" — runs `BROWSER=none npx expo start --web --port 5000`
- **Workflow**: "Start Backend" — runs `node server/index.js` on port 3001
- **Port**: 5000 (web preview), 3001 (Express API)

## Key Files

- `App.tsx` — Root component, font loading, navigation container
- `index.js` — Entry point (`registerRootComponent`)
- `app.json` — Expo config (includes `"web": { "bundler": "metro" }`)
- `src/navigation/MainTabNavigator.tsx` — Bottom tab + stack navigation
- `src/theme/` — Colors, typography, spacing
- `src/screens/` — All screen components organized by tab
- `src/components/` — Shared UI components
- `src/services/` — API service (axios-based), auth service, storage utilities
- `src/hooks/useAuth.tsx` — Auth context and hook
- `src/utils/` — sourdoughCalculations.ts, starterHealth.ts

## Notable Customizations for Web

- Replaced `react-native-vector-icons` with `@expo/vector-icons` for web compatibility
- Replaced `@react-native-community/datetimepicker` in TimelineCalculatorScreen with a text input
- Replaced `@react-native-picker/picker` in RecipeRescueCalculatorScreen with custom button-group selectors
- All calculators are purely client-side (no backend required)

## API Backend

Express backend runs on port 3001. Key files:
- `server/index.js` — Express entry point, CORS, health route
- `server/gemini.js` — Gemini API helper with validation
- `server/routes/photoRescue.js` — POST /api/photo-rescue/analyze

### Routes
- `GET /api/health` — returns `{ ok, service, geminiConfigured }`
- `POST /api/photo-rescue/analyze` — analyzes sourdough photo via Gemini; returns fallback if `GEMINI_API_KEY` is not set

### Environment Variables
- `GEMINI_API_KEY` — required for real Photo Rescue (set via Replit Secrets)
- `GEMINI_MODEL` — optional, defaults to `gemini-2.0-flash`
- `PORT` — Express port, defaults to 3001

### API URL Resolution
`src/constants/api.ts` auto-detects the Replit dev domain and routes to port 3001. On `*.replit.dev` hosts, it rewrites the port prefix. Falls back to `http://localhost:3001/api`.

## Package Manager

npm (uses `package-lock.json`). Install with `npm install --legacy-peer-deps` due to React 19.1.0 peer dependency constraints.
