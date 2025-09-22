# Game Logging via FAB (Cross-Cutting)

## Objective
Allow Post-Game entry first; Live tracking later. Update aggregates that feed Dashboard/Stats/Insights.

## Post-Game Fields
- date, opponent, isHome, shotsFaced, saves, goalsAgainst, notes, cards {yellow, red}
- Auto calc: savePct = saves / shotsFaced (handle divide by 0)

## Gherkin
```gherkin
Feature: Post-Game Logging
  Scenario: Create a valid post-game entry
    Given I open the FAB modal
    When I choose "Log a Post-Game"
    And I complete required fields and save
    Then a new game document is created
    And Dashboard stats reflect the new game
```

## Acceptance Criteria
- Required fields enforced
- Derived stats update Dashboard within 2 seconds
- Undo or edit available from recent game row (optional MVP)

## Tests
- **Unit**: validation; derived math; aggregations
- **RTL**: form enable/disable; save success path; error surfaces
- **Integration**: write doc; Dashboard refresh; Insights unlock after 3rd game

## Analytics
- game_create
- game_edit
- game_delete (if enabled)
