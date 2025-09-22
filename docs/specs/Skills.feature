Feature: Skills & Drills
  Filter, complete, and track weekly targets

  Scenario: Filter by position and type
    When I filter Position "Goalie" and Type "Reflexes"
    Then I see goalie reflex drills only

  Scenario: Complete a drill
    When I open a drill and tap "Mark Complete"
    Then my weekly progress increases
    And the completion timestamp is saved

  Scenario: Empty state
    Given there are no drills for a filter combo
    Then show "No drills found. Try different filters."
