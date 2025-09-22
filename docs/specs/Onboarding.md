# Onboarding Flow

## Objective
First-time users complete a 5-step wizard: Welcome → Basic Info → Team → Goals → Review. Data validates locally, persists to Firestore on Finish, and navigates to Dashboard.

## Data
- **profile**: name, gradYear, position, sport, school, club, gpa (optional), avatarURL (later)
- **goals**: season targets (e.g., savePctTarget, seasonSavesTarget)

## Must Haves
- Inline validation with friendly messages (Zod)
- "Next/Back" consistent
- Progress indicator (step x/5)
- Finish writes users/{uid} in Firestore

## Gherkin
```gherkin
Feature: Onboarding
  Scenario: Complete onboarding successfully
    Given I open the app for the first time
    When I tap "Get Started"
    And I enter valid Basic Info and tap "Next"
    And I enter Team Info and tap "Next"
    And I set Goals and tap "Finish"
    Then my profile document exists in Firestore
    And I land on the Dashboard with a welcome state
```

## Acceptance Criteria
- Required fields prevent Next until valid
- Firestore document contains profile + goals
- Error surfaces as toast/sheet and never blocks navigation permanently (retry allowed)

## Tests
- **Unit**: Zod schemas; onboarding store actions
- **RTL**: flow renders, disabled/enabled Next logic, error text visible
- **Integration**: Firebase emulator writes on finish; redirect to Dashboard
