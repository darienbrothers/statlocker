@stats
Feature: Stats Analysis
  As an athlete
  I want to analyze my performance with filters and trends
  So I can identify areas for improvement

  Background:
    Given I am logged in

  Scenario: Default season view
    Given I have multiple games logged
    When I open the Stats tab
    Then the filter "Season" is selected by default
    And charts render season aggregates
    And I see performance trends

  Scenario: Filter by recent games
    Given I have multiple games logged
    When I choose "Last 5" filter
    Then charts and aggregates update to show last 5 games
    And I see deltas compared to season averages

  Scenario: Empty state guidance
    Given I have no games logged
    When I open the Stats tab
    Then I see "Log your first game to unlock charts"
    And charts are hidden or show placeholder state
