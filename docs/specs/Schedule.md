# Schedule (Hamburger Menu)

## Objective
Show upcoming events; support CSV/manual add later. Purely read-only for MVP unless you opt-in manual add.

## Features
- **Upcoming List**: date, opponent, status (home/away)
- **Sources**: user-created or simple CSV import (post-MVP)
- **Event Detail**: notes, location

## Gherkin
```gherkin
Feature: Schedule List
  Scenario: No events
    Given I open Schedule
    Then I see an empty state with "Add event" CTA (if enabled)

  Scenario: With events
    Given I have events
    Then they appear sorted by date ascending
```

## Acceptance Criteria
- Sorted ascending by start date
- Empty state friendly CTA copy
- Optional "Add Event" writes users/{uid}/schedule/{id}

## Tests
- **Unit**: sort comparator
- **RTL**: empty vs populated list
- **Integration**: add event persists (if enabled)

## Analytics
- schedule_view
- event_add (if enabled)
