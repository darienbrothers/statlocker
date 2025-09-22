# Stats Tab

## Objective
Deeper analysis with filters (season, last 5), charts, simple trends, and export (later).

## Features
- **FiltersBar**: season selector, range: Last 5 / Last 10 / All
- **Trends**: line/area charts (react-native-svg + Victory Native or similar)
- **Breakdowns**: per-game table, min/max highlights
- **Simple Insights** (local):
  - "Save% last 5 games ↑ 6% vs season avg"
  - "High shots against correlates with lower save%"

## Gherkin
```gherkin
Feature: Stats Filters
  Scenario: Change range
    Given default range is "Season"
    When I change to "Last 5"
    Then the chart and stats update accordingly
```

## Acceptance Criteria
- Filters are sticky per session
- Chart renders without frame drops
- Empty state instructs to log games

## Tests
- **Unit**: filter selectors; aggregations; trend deltas
- **RTL**: filter changes re-render data; empty state visible
- **Integration**: emulator with seeded games → correct numbers

## Analytics
- stats_view
- stats_filter_change
- stats_export_tap (later)
