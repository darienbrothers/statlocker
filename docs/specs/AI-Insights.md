# AI Insights (Hamburger Menu)

## Objective
Display unlocked insights (after ≥3 games) with friendly language and upgrade preview slots for locked advanced items (post-paywall).

## Insight Types (local calculations)
- **Performance Trends** (e.g., save% trend vs season avg)
- **Comparisons** (last 5 vs season)
- **Strengths/Weaknesses** (consistency bands)
- **Goal Tracking** (pace to target)
- **Recommendations** (drill suggestions based on weaknesses)

## Gherkin
```gherkin
Feature: Insights Unlock
  Scenario: Insufficient games
    Given I have 2 games
    Then Insights shows "Play 1 more game to unlock" with progress 2/3

  Scenario: Insights unlocked
    Given I have 3 games
    Then Insights items render with explanations
```

## Acceptance Criteria
- Gate opens at ≥3 games
- Each insight shows metric, delta, and plain-language summary
- "Why am I seeing this?" info panel available

## Tests
- **Unit**: insight computation functions and thresholds
- **RTL**: locked vs unlocked rendering
- **Integration**: E2E after logging 3rd game

## Analytics
- insights_view
- insight_expand
- insight_learn_more
