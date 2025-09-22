Feature: Schedule
  View upcoming events and optionally add items

  Scenario: Empty schedule
    Given I have no events
    When I open Schedule
    Then I see an empty state with optional "Add Event"

  Scenario: Sorted events
    Given I have events
    When I open Schedule
    Then events are sorted by date ascending
