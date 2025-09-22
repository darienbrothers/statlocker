# Dashboard Tab

## Objective
Give athletes a fast, motivating snapshot: greeting/hero, stat cards, AI Insights preview (locked until 3 games), recent games, upcoming schedule, goals progress, FAB.

## Sections
- **Hero**: name, position, quick action ("Log Game")
- **Stat Cards** (goalie example): Save %, Saves, Shots Faced, Goals Against
  - Shows 0.0 when empty; animates once data arrives
- **AI Insights Preview**: lock overlay with "Unlocked after 3 games" + progress 0/3
- **Recent Games**: ESPN-style list, top 3 stats per game
- **Upcoming Events**: compact schedule cards (date, opponent, location)
- **Goals Progress**: gradient bars with current/target

## Gherkin
```gherkin
Feature: Dashboard Snapshot
  Scenario: First-time state
    Given I have no games
    Then stat cards show 0.0
    And Insights show a lock with "0/3 games"
    And Goals progress bars show 0%

  Scenario: After logging games
    Given I have 3 or more games
    Then the Insights card shows a preview button (unlocked)
```

## Acceptance Criteria
- Empty state copy appears when no data
- Derived stats computed correctly (save% = saves / shotsFaced)
- Insights lock clears at ≥3 games
- Lists are paginated/lazy to avoid jank

## Tests
- **Unit**: math for derived stats, goal progress %
- **RTL**: empty vs populated rendering, lock/unlock behavior
- **Detox**: navigate → FAB → log post-game → dashboard updates in <2s

## Analytics
- dashboard_view
- tap_log_game
- insights_preview_tap (locked/unlocked)
