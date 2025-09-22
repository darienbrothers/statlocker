# StatLocker – Product Requirements Document (React Native + Expo)

## 1) Product Overview
StatLocker is a mobile-first app for athletes to log games, track goals, unlock insights, and prepare for recruiting.  
It's built with **React Native + Expo 54** using **TypeScript**, **Firebase**, and **Zustand** for state.  
The app emphasizes a modern dark UI with BrandPrimary purple, Accent green, smooth animations, and athlete-first UX.

### Users
- **Primary:** High school/club athletes (starting with Lacrosse: Attack, Midfield, Defense, Goalie, LSM, FOGO).
- **Secondary (later):** Parents (read-only), Coaches (feedback, recruiting dashboards).

---

## 2) Scope & Objectives (MVP)
- **Onboarding** → guided 5-step profile wizard (Name → Sport/Gender/Position/Grad → Team Info → Goals → Review/Create → Congrats).
- **Dashboard** → Hero, Stat Cards, AI Insights (locked until ≥3 games), Recent Games, Upcoming, Goal Progress, FAB.
- **Game Logging** → FAB → Post-game form → Firebase write → Derived stats update.
- **Tabs** → Dashboard, Stats, Recruiting, Skills.
- **Drawer (later)** → AI Insights, Schedule, Messages, Profile.
- **Auth** → Firebase Email/Password (Google/Apple later).
- **Monetization** → RevenueCat paywall (Pro + Family).
- **Notifications (later)** → Push via expo-notifications.

---

## 3) Tech Stack
- **UI/Navigation:** React Native, Expo Router, NativeWind (Tailwind).
- **State:** Zustand for global & per-feature stores.
- **Backend:** Firebase (Auth, Firestore, Storage).
- **Animations/Haptics:** Reanimated, Moti, expo-haptics.
- **Icons:** @expo/vector-icons.
- **Payments:** RevenueCat.
- **Push:** expo-notifications.
- **Testing:** Jest + React Native Testing Library; Detox for E2E.

---

## 4) Information Architecture
- **App Root:** Expo Router layouts
- **Bottom Tabs:** Dashboard, Stats, Recruiting, Skills
- **FAB:** Overlay in (tabs)/_layout.tsx → Modal (Live vs Post-game)
- **Drawer:** AI Insights, Schedule, Messages, Profile

---

## 5) Data Model (Firestore)

### users/{uid}
- **profile:** { firstName, lastName, sport, gender, position, gradYear, hs:{name,city,state,jersey}, club?:{org,team,jersey} }
- **goals:** [ { id, title, target, unit, positionScope } ]
- **settings:** { notifications, theme }

### users/{uid}/games/{gameId}
{ date, opponent, isHome, shotsFaced, saves, goalsAgainst, notes, cards:{yellow,red} }

### users/{uid}/recruiting/schools/{id}
{ name, division, location, category }

### users/{uid}/schedule/{id}
{ startAt, opponent, isHome, notes }

---

## 6) Visual & Interaction Design
- **Colors:** BrandPrimary (#6E57FF), AccentColor (#00E08A), Surface, OnSurface, Muted, Danger, Warning, Success.
- **Typography:** Anton (display), Plus Jakarta Sans (body).
- **Components:** FAB (glow + haptic), Stat Cards, Progress Bars, Locked Insights, ESPN-style list cells.

---

## 7) Implementation Plan
**Phase 1:** App Shell → Tabs + FAB overlay (done first)  
**Phase 2:** Onboarding flow screens → local state → Firestore save  
**Phase 3:** Firebase Auth → persist onboarding  
**Phase 4:** Game Logging (post-game) → Dashboard aggregates  
**Phase 5:** Stats filters + charts  
**Phase 6:** Recruiting + Skills tabs  
**Phase 7:** Drawer features → AI Insights, Schedule, Messages, Profile  
**Phase 8:** Paywall (RevenueCat)  
**Phase 9:** Push + Email  

---

## 8) Engineering Guidelines
- Feature-first folder structure
- Use Zustand stores per domain (dashboard.store.ts, stats.store.ts)
- Theme tokens (colors/typography) via NativeWind
- Async calls: Firebase SDK w/ try/catch
- Always return typed data (TS interfaces in `features/*/types.ts`)
- Animations: Reanimated/Moti; Haptics: expo-haptics
- Min touch area: 48x48

---

## 9) Success Metrics
- ≥80% onboarding completion
- ≥50% log ≥3 games in first season
- Free→Paid conversion 8–12%
- WAU growth + retention by cohort
