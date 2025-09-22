# Skills Tab

## Objective
A library of drills with filters, progress tracking, and weekly targets (manually logged).

## Features
- **Filters**: Position, Skill Type, Difficulty, Time
- **DrillCard**: title, reps/sets, time estimate, level
- **Progress**: mark as done; streaks visible (later)
- **Weekly Target**: e.g., "Wall Ball 3x/week"

## Gherkin
```gherkin
Feature: Skills Library
  Scenario: Filter and complete a drill
    Given I open Skills
    When I filter by "Goalie" and "Reflexes"
    Then I see goalie reflex drills
    When I mark a drill complete
    Then my weekly progress increases
```

## Acceptance Criteria
- Filter chips persist until changed
- Completed drills timestamp stored (local or Firestore)
- Weekly targets compute from timestamps

## Tests
- **Unit**: filter predicates; weekly target math
- **RTL**: drill complete updates progress UI
- **Integration**: persistence to Firestore (optional MVP local-first)

## Analytics
- skills_view
- drill_complete
- skills_filter_change
