Feature: Stats
  Analyze performance with filters and trends

  Background:
    Given I have multiple games logged

  Scenario: Default Season filter
    When I open Stats
    Then the filter "Season" is selected
    And charts render season aggregates

  Scenario: Switch to Last 5
    When I choose "Last 5"
    Then charts and aggregates update
    And I see deltas compared to season averages

  Scenario: Empty state guidance
    Given I have no games
    When I open Stats
    Then I see "Log your first game to unlock charts"
