# StatLocker App Rules (React Native + Expo)

## Architecture
- **Feature-first folders** (Dashboard, Stats, Recruiting, Skills)
- **Zustand for state**; services wrap Firebase calls
- **No business logic in screens**; keep in store/services
- **Only use Expo-supported libs**
- **Side effects only in services or store actions**

## Code Style
- **TypeScript everywhere** (.tsx files)
- **snake_case for files**, PascalCase for components
- **Use theme tokens** from `theme/tokens.ts`
- **No inline hex colors**; no hardcoded fonts
- **No hardcoded colors/fonts**; always use tokens or tailwind classes
- **Types everywhere**; Zod for runtime validation at boundaries

## UX Guidelines
- **48px min touch targets**
- **Graceful empty states** everywhere
- **expo-haptics** for primary presses
- **Password policy**: ≥8 chars, upper, lower, number

## Data & Performance
- **Firebase Auth/Firestore/Storage** (JS SDK)
- **Batch writes** when possible; paginate queries
- **Derived stats computed locally** in `utils/math.ts`

## Security & Privacy
- **Security Rules**: user can only read/write their own data
- **No PII in analytics**
- **Never commit secrets**; use app config / env

## Testing
- **Test with each feature** (unit + RTL)
- **Include critical E2E flows** in Detox (onboarding, log game, dashboard updates)
- **CI blocks merges** on failing tests or lint errors

## Analytics (Light)
- **`*_view`** on screens; **`*_tap`** for primary actions
- **Name events listed in specs**; no adhoc names

## AI Prompting Rules (VS Code/Windsurf)
- **Start each task** by pasting the spec file name + acceptance criteria
- **Ask for smallest diff** with exact file paths
- **No new libraries** without approval
- **Tests first** (or alongside)
- **Follow Expo Router, NativeWind, Zustand patterns**
- **Never remove empty/error states**; never hardcode secrets

## State Management Rules
- **Zustand stores per domain** (dashboard.store.ts, stats.store.ts)
- **Global stores under `/state`**
- **Per-feature stores inside feature folders**

## Styling Rules
- **Always use NativeWind** for styling
- **Always wrap animations** in Reanimated/Moti, not raw Animated
- **Never push unstyled placeholder UI**

## Development Flow
- **Always connect features step-by-step** following specs + scenarios
- **Reference spec files before coding**
- **Request minimal diffs with exact file paths**
- **Use npm** (not pnpm - not available in this environment)
