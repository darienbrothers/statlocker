# App Shell (Tabs + FAB)

## Objective
Provide a stable navigation shell using Expo Router with 4 tabs (Dashboard, Stats, Recruiting, Skills) and a center FAB overlay that opens a modal: Live Track / Log Post-Game.

## Must Haves
- Launch to Dashboard tab
- Tab switch is instant (<100ms perceived)
- FAB sits centered, above the tab bar, with glow and haptic
- FAB tap → modal with 2 actions; each routes correctly
- Global tint = AccentColor (green); primary CTAs use BrandPrimary

## Gherkin
```gherkin
Feature: App Shell
  Scenario: App launches to Dashboard
    Given the app is installed and launched
    Then the Dashboard tab is selected
    And the FAB is visible and enabled

  Scenario: Open FAB modal
    Given I am on any tab
    When I tap the FAB
    Then I feel haptic feedback
    And I see options "Live Track a Game" and "Log a Post-Game"

  Scenario: Navigate from modal
    Given the FAB modal is open
    When I tap "Log a Post-Game"
    Then the modal closes
    And I see the Post-Game screen
```

## Acceptance Criteria
- Four tabs render with proper labels/icons
- FAB overlays all tabs and remains fixed on tab change
- Modal shows exactly two actions with correct navigation
- No redboxes; no uncaught promise rejections in console

## Tests
- **Unit/RTL**: TabBar renders; FAB press triggers modal; accessibility labels set
- **Integration/Detox**: Launch → Dashboard; FAB → modal; choose path navigations
- **Visual**: Storybook snapshots for TabBar, FAB states