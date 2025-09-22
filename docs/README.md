# StatLocker Documentation

## 📁 Documentation Structure

```
/docs
├── /prd
│   └── ProductRequirements.md     # Complete PRD with tech stack, data model, success metrics
├── /specs
│   ├── AppShell.md               # Navigation shell with 4 tabs + FAB
│   ├── Dashboard.md              # Main dashboard with stats and insights
│   ├── Stats.md                  # Advanced analytics with charts
│   ├── Recruiting.md             # School organization and recruiting tasks
│   ├── Skills.md                 # Drill library with progress tracking
│   ├── Onboarding.md             # 5-step user onboarding flow
│   ├── AI-Insights.md            # Unlockable insights after 3 games
│   ├── Schedule.md               # Event management (read-only MVP)
│   ├── Messages.md               # Future messaging system (stubbed)
│   ├── Profile.md                # User profile management
│   ├── GameLogging.md            # Post-game entry via FAB
│   └── *.feature                 # Individual Gherkin feature files
├── /bdd
│   ├── onboarding.feature        # Combined onboarding scenarios
│   ├── dashboard.feature         # Dashboard behavior scenarios
│   ├── stats.feature             # Stats analysis scenarios
│   ├── recruiting.feature        # Recruiting organization scenarios
│   └── skills.feature            # Skills & drills scenarios
└── /guides
    ├── Instructions.md           # Step-by-step build instructions
    └── Rules.md                  # Development rules and guidelines
```

## 🎯 Current Status

### ✅ Completed
- **Dependencies installed**: All core packages (Expo Router, NativeWind, Zustand, Firebase, etc.)
- **Documentation structure**: Complete specs, BDD features, PRD, and guides
- **Tailwind configuration**: Properly configured with StatLocker brand colors
- **Package.json**: Updated with proper scripts for testing and linting

### 📋 Ready for Development
The project is now fully documented and ready for implementation following this order:

1. **App Shell** (tabs + FAB overlay)
2. **Onboarding Flow** (5-step wizard)
3. **Firebase Auth** integration
4. **Dashboard** with derived stats
5. **Game Logging** (post-game form)
6. **Stats Tab** with filters and charts
7. **Recruiting & Skills** tabs
8. **Drawer features** (AI Insights, Schedule, Messages, Profile)

## 🎨 Design System
- **Brand Primary**: #6E57FF (purple)
- **Accent**: #00E08A (green)
- **Typography**: Anton (display), Plus Jakarta Sans (body)
- **Minimum touch target**: 48px
- **Haptic feedback** on primary actions

## 🔧 Tech Stack
- **Framework**: React Native + Expo 54
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind CSS)
- **State**: Zustand
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Animations**: Reanimated + Moti
- **Testing**: Jest + React Native Testing Library + Detox

## 📱 Key Features
- **5-step onboarding** with profile creation
- **Game logging** with automatic stat calculations
- **AI insights** unlocked after 3 games
- **Recruiting organizer** with school categories
- **Skills library** with drill tracking
- **Performance analytics** with charts and trends

## 🚀 Next Steps
Follow the build order in `docs/guides/Instructions.md` and reference the individual spec files for detailed requirements and acceptance criteria.
