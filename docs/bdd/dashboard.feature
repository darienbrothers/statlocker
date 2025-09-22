@dashboard
Feature: Dashboard
  As an athlete
  I want to see my performance snapshot and quick actions
  So I can stay motivated and log games easily

  Background:
    Given I am logged in

  Scenario: First-time empty state
    Given I have no games logged
    When I open the Dashboard
    Then stat cards show 0.0 or 0
    And AI Insights shows locked with progress "0/3"
    And Goals progress bars show 0%
    And I see "No games logged yet. Tap Log Game to get started."

  Scenario: Populated dashboard after logging games
    Given I have 5 games logged
    When I open the Dashboard
    Then stat cards display derived values
    And AI Insights preview is unlocked if I have at least 3 games
    And recent games list shows the latest games
    And upcoming events show in date order

  Scenario: Quick game logging from hero
    Given I am on the Dashboard
    When I tap "Log Game" from the hero section
    Then I see the FAB modal or Post-Game screen
