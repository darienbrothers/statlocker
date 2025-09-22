Feature: Dashboard
  Provide a motivating snapshot and fast actions

  Background:
    Given I am logged in

  Scenario: First-time empty state
    Given I have no games
    Then stat cards show 0.0 or 0
    And AI Insights shows locked with progress "0/3"
    And Goals progress bars show 0%

  Scenario: Populated dashboard
    Given I have 5 games logged
    Then stat cards display derived values
    And AI Insights preview is unlocked if I have at least 3 games
    And recent games list shows the latest games
    And upcoming events show in date order

  Scenario: Tap Log Game from hero
    When I tap "Log Game"
    Then I see the FAB modal or Post-Game screen
