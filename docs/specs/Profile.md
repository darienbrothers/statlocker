# Profile (Hamburger Menu)

## Objective
Let users view/edit profile, preferences, and manage auth session.

## Features
- **Profile View**: avatar, name, position, grad year, school, club
- **Edit**: basic info with validation
- **Account**: change password, sign out
- **Preferences**: notifications, theme (if added)

## Gherkin
```gherkin
Feature: Profile Edit
  Scenario: Update profile successfully
    Given I open Profile
    When I edit my name and save
    Then I see a success toast
    And the Firestore doc reflects the new name
```

## Acceptance Criteria
- Edit validates; success toast on save
- Auth sign out returns to Auth screen
- Errors show recoverable prompts

## Tests
- **Unit**: zod schemas; profile update service
- **RTL**: edit-save flow; sign out routes correctly
- **Integration**: emulator write/read profile

## Analytics
- profile_view
- profile_update
- sign_out
