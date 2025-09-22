# StatLocker Build Instructions (React Native + Expo)

## 1. Prerequisites
- Install Node 18+, Expo CLI, npm/yarn
- VS Code with TypeScript/ESLint plugins
- Xcode/Android Studio as needed

## 2. Setup
- Clone repo: `git clone ... && cd statlocker`
- Run `npm install`

## 3. Expo Config
- Fonts in `/assets/fonts/` (put ttf files here)
- Use `app/_layout.tsx` to load fonts
- Colors in `theme/tokens.ts`
- Tailwind config & tokens in `theme/`

## 4. Navigation (Expo Router)
- Bottom tabs via `app/(tabs)/_layout.tsx`
- Modal routes live in `app/(modals)/*.tsx`
- Onboarding stack in `app/onboarding/_layout.tsx`

## 5. State Management
- Zustand stores under `/features/*/store`
- Global stores under `/state`

## 6. Firebase Setup
- Setup via `firebase.app.ts`
- Auth: Email/Password (later: Apple/Google)
- Firestore for users/games/goals
- Storage for file uploads

## 7. Build Order (Follow Specs)
1. **App Shell** (tabs + FAB) - `AppShell.md`
2. **Onboarding** flow - `Onboarding_*.feature` files
   - Name → Sport/Gender/Position/Grad → Team → Goals → Review/Create → Congrats
3. **Auth + Firestore** - persist onboarding to `users/{uid}`
4. **Post-Game logging** - form → write `users/{uid}/games/{id}`
5. **Dashboard** derived stats - `utils/math.ts` + zustand stores
6. **Insights** unlock at ≥3 games
7. **Stats** filters + charts
8. **Recruiting/Skills** tabs
9. **Drawer items** - AI Insights, Schedule, Messages (stub), Profile

## 8. Run Development
```bash
npm start   # press i or a to launch simulator
```

## 9. Testing
- Unit tests with Jest + React Native Testing Library
- E2E with Detox for critical flows
- Run `npm test` before commits

## 10. CI/CD (Later)
- GitHub Actions: run eslint + jest
- EAS Build & Update flows

## 11. Key Files Structure
```
/app
  /(tabs)/_layout.tsx     # Bottom tabs + FAB
  /(modals)/              # Post-game, Live track modals
  /onboarding/            # 5-step wizard
/features
  /dashboard/             # Dashboard components, store
  /stats/                 # Stats components, store
  /recruiting/            # Recruiting components, store
  /skills/                # Skills components, store
/theme
  tokens.ts               # Colors, typography tokens
/utils
  math.ts                 # Derived stats calculations
/state
  auth.store.ts           # Global auth state
```
