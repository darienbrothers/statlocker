# StatLocker 🥍

> A mobile-first sports analytics app for athletes to log games, track goals, unlock insights, and prepare for recruiting.

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0.9-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-~5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-^12.3.0-orange.svg)](https://firebase.google.com/)

## 📱 About

StatLocker is designed for high school and club athletes (starting with Lacrosse) to:
- **Track Performance**: Log games and automatically calculate derived stats
- **Set & Monitor Goals**: Position-tailored SMART goals with progress tracking
- **Unlock AI Insights**: Performance trends and recommendations (after 3+ games)
- **Organize Recruiting**: Manage target schools (Reach/Realistic/Safe) and tasks
- **Improve Skills**: Access drill library with progress tracking

## 🚀 Quick Start

### Prerequisites
- **Node.js**: 18+ 
- **npm**: 8+ (we use npm, not pnpm)
- **Expo CLI**: `npm install -g @expo/cli`
- **iOS Simulator** (Mac) or **Android Studio** (for Android development)

### Installation

```bash
# Clone the repository
git clone git@github.com:darienbrothers/statlocker.git
cd statlocker

# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS simulator (Mac only)
npm run ios

# Run on Android emulator
npm run android
```

## 🏗️ Architecture

### Tech Stack
- **Framework**: React Native + Expo 54
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Animations**: Reanimated + Moti
- **Haptics**: expo-haptics
- **Charts**: Victory Native + react-native-svg
- **Testing**: Jest + React Native Testing Library + Detox

### Project Structure

```
statlocker/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Bottom tab navigation
│   │   ├── _layout.tsx          # Tab layout with FAB
│   │   ├── index.tsx            # Dashboard tab
│   │   ├── stats.tsx            # Stats tab
│   │   ├── recruiting.tsx       # Recruiting tab
│   │   └── skills.tsx           # Skills tab
│   ├── (modals)/                # Modal screens
│   │   ├── post-game.tsx        # Post-game logging
│   │   └── live-track.tsx       # Live game tracking
│   ├── onboarding/              # 5-step onboarding flow
│   │   ├── _layout.tsx          # Onboarding stack
│   │   ├── name.tsx             # Step 1: Name
│   │   ├── sport-position.tsx   # Step 2: Sport/Position/Grad
│   │   ├── team-info.tsx        # Step 3: Team information
│   │   ├── goals.tsx            # Step 4: SMART goals
│   │   ├── review.tsx           # Step 5: Review & create account
│   │   └── congrats.tsx         # Congratulations screen
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable UI components
│   ├── ui/                      # Base UI components
│   └── forms/                   # Form components
├── features/                     # Feature-specific modules
│   ├── dashboard/               # Dashboard feature
│   │   ├── components/          # Dashboard components
│   │   ├── store/               # Dashboard state
│   │   └── types.ts             # Dashboard types
│   ├── stats/                   # Stats feature
│   ├── recruiting/              # Recruiting feature
│   ├── skills/                  # Skills feature
│   └── auth/                    # Authentication feature
├── state/                       # Global state stores
│   ├── auth.store.ts           # Authentication state
│   └── user.store.ts           # User profile state
├── services/                    # External service integrations
│   ├── firebase.ts             # Firebase configuration
│   ├── auth.service.ts         # Authentication service
│   └── firestore.service.ts    # Firestore operations
├── utils/                       # Utility functions
│   ├── math.ts                 # Derived stats calculations
│   ├── validation.ts           # Zod schemas
│   └── constants.ts            # App constants
├── theme/                       # Design system
│   ├── tokens.ts               # Design tokens
│   └── colors.ts               # Color definitions
├── assets/                      # Static assets
│   ├── fonts/                  # Custom fonts
│   └── images/                 # Images and icons
└── docs/                        # Documentation
    ├── specs/                  # Feature specifications
    ├── bdd/                    # Behavior-driven development scenarios
    ├── prd/                    # Product requirements
    └── guides/                 # Development guides
```

## 🎨 Design System

### Colors
```typescript
const colors = {
  brandPrimary: '#6E57FF',  // Purple - primary actions
  accent: '#00E08A',        // Green - success, CTAs
  surface: '#1A1A1A',      // Dark surface
  onSurface: '#FFFFFF',    // Text on dark surface
  muted: '#6B7280',        // Secondary text
  danger: '#EF4444',       // Error states
  warning: '#F59E0B',      // Warning states
  success: '#10B981',      // Success states
}
```

### Typography
- **Display**: Anton (headings, hero text)
- **Body**: Plus Jakarta Sans (body text, UI)

### Key Principles
- **48px minimum touch targets**
- **Haptic feedback** on primary actions
- **Graceful empty states** with actionable copy
- **Consistent spacing** using Tailwind scale

## 🔥 Firebase Configuration

### Services Used
- **Authentication**: Email/Password (Google/Apple planned)
- **Firestore**: User profiles, games, goals, recruiting data
- **Storage**: File uploads (transcripts, avatars)

### Data Structure
```
users/{uid}/
├── profile: { firstName, lastName, sport, position, gradYear, ... }
├── goals: [{ id, title, target, unit, positionScope }]
├── games/{gameId}: { date, opponent, stats, ... }
├── recruiting/schools/{schoolId}: { name, category, ... }
└── schedule/{eventId}: { date, opponent, location, ... }
```

## 🧪 Testing Strategy

### Unit Testing
```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
```

### E2E Testing (Detox)
```bash
# iOS
npm run detox:ios:build
npm run detox:ios:test

# Android  
npm run detox:android:build
npm run detox:android:test
```

### Test Coverage
- **Unit tests**: Components, utilities, stores
- **Integration tests**: Firebase operations, navigation flows
- **E2E tests**: Critical user journeys (onboarding, game logging, dashboard updates)

## 📊 Key Features

### 1. Onboarding Flow
5-step guided setup:
1. **Name**: First/last name with validation
2. **Sport Details**: Sport, gender, position (filtered), graduation year
3. **Team Info**: High school + optional club information
4. **Goals**: Select 3 position-tailored SMART goals
5. **Account**: Create Firebase account with strong password

### 2. Dashboard
- **Hero Section**: Greeting, position, quick "Log Game" action
- **Stat Cards**: Save%, Saves, Shots Faced, Goals Against (position-specific)
- **AI Insights Preview**: Locked until 3+ games, shows unlock progress
- **Recent Games**: ESPN-style list with key stats
- **Upcoming Events**: Schedule preview
- **Goals Progress**: Visual progress bars toward targets

### 3. Game Logging (FAB)
- **Floating Action Button**: Overlays all tabs with haptic feedback
- **Post-Game Entry**: Date, opponent, home/away, core stats, notes
- **Auto-calculations**: Save% = saves/shotsFaced (handles division by zero)
- **Real-time Updates**: Dashboard reflects new data within 2 seconds

### 4. Stats Analysis
- **Filters**: Season, Last 5, Last 10, All games
- **Charts**: Line/area charts using Victory Native
- **Trends**: Performance deltas vs averages
- **Breakdowns**: Per-game table with min/max highlights

### 5. Recruiting Organizer
- **School Categories**: Reach, Realistic, Safe
- **Task Management**: Checklist for recruiting activities
- **Document Upload**: Transcript storage via Firebase Storage
- **Roadmap**: Season-based timeline suggestions

### 6. Skills Library
- **Drill Filters**: Position, skill type, difficulty, duration
- **Progress Tracking**: Mark drills complete, view streaks
- **Weekly Targets**: e.g., "Wall Ball 3x/week"

### 7. AI Insights (Unlockable)
- **Unlock Requirement**: 3+ games logged
- **Insight Types**: Performance trends, comparisons, strengths/weaknesses
- **Recommendations**: Drill suggestions based on performance gaps
- **Plain Language**: Human-readable explanations with "Why?" info panels

## 🔧 Development Workflow

### Getting Started
1. **Read the specs**: Start with `/docs/specs/` for feature requirements
2. **Check BDD scenarios**: Review `/docs/bdd/` for behavior expectations  
3. **Follow build order**: See `/docs/guides/Instructions.md`
4. **Reference rules**: Follow guidelines in `/docs/guides/Rules.md`

### Code Standards
- **TypeScript everywhere**: All files use `.tsx` extension
- **Feature-first organization**: Group by feature, not file type
- **Zustand for state**: Per-feature stores + global stores
- **NativeWind for styling**: Use Tailwind classes, no inline styles
- **Zod for validation**: Runtime validation at boundaries
- **Error boundaries**: Graceful error handling with user-friendly messages

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/dashboard-stats

# Make changes, test locally
npm test
npm run lint
npm run type-check

# Commit with conventional commits
git commit -m "feat(dashboard): add stat cards with derived calculations"

# Push and create PR
git push origin feature/dashboard-stats
```

## 🚦 Build Phases

### Phase 1: Foundation ✅
- [x] Project setup and dependencies
- [x] Documentation and specifications
- [x] Design system and Tailwind configuration

### Phase 2: Core Navigation 🚧
- [ ] App Shell with bottom tabs
- [ ] FAB overlay with modal
- [ ] Basic routing structure

### Phase 3: Onboarding 📋
- [ ] 5-step wizard implementation
- [ ] Form validation with Zod
- [ ] Firebase Auth integration
- [ ] Profile creation in Firestore

### Phase 4: Game Logging 🎯
- [ ] Post-game form with validation
- [ ] Firestore game document creation
- [ ] Derived stats calculations
- [ ] Dashboard real-time updates

### Phase 5: Analytics 📈
- [ ] Dashboard stat cards
- [ ] Stats tab with filters
- [ ] Charts with Victory Native
- [ ] AI Insights unlock logic

### Phase 6: Extended Features 🎓
- [ ] Recruiting organizer
- [ ] Skills library
- [ ] Schedule management
- [ ] Profile management

### Phase 7: Polish 🎨
- [ ] Animations and micro-interactions
- [ ] Push notifications
- [ ] RevenueCat paywall
- [ ] App Store optimization

## 🐛 Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
npm start -- --reset-cache
```

**iOS simulator not opening:**
```bash
npx expo run:ios
```

**Android build failures:**
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

**Firebase connection issues:**
- Check `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
- Verify Firebase project configuration
- Ensure Firestore rules allow authenticated access

## 📚 Resources

- **[Expo Documentation](https://docs.expo.dev/)**
- **[React Navigation](https://reactnavigation.org/docs/getting-started)**
- **[NativeWind](https://www.nativewind.dev/)**
- **[Zustand](https://github.com/pmndrs/zustand)**
- **[Firebase for React Native](https://rnfirebase.io/)**
- **[Victory Native](https://commerce.nearform.com/open-source/victory-native/)**

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow the specs**: Reference `/docs/specs/` for requirements
4. **Write tests**: Include unit and integration tests
5. **Commit changes**: Use conventional commit format
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

**Built with ❤️ for athletes by athletes**

For questions or support, contact the development team.
