Feature: Onboarding – SMART Goals (position-tailored)
  User selects 3 recommended SMART goals shown with preview progress bars

  Background:
    Given I completed the Team Information screen

  Scenario: Show tailored recommendations for Goalie
    Given my position is "Goalie"
    When the Goals screen opens
    Then I see suggestions like "Season Save% target", "Total Saves", "Weekly Reflex Drills"

  Scenario: Select exactly three goals
    When I select 1 goal
    And I select a 2nd goal
    And I select a 3rd goal
    Then additional goals are disabled
    And I see "3/3 selected"

  Scenario: Edit a goal target
    Given I selected "Season Save% target"
    When I set target to "58%"
    Then validation ensures the value is between 0% and 100%

  Scenario: Cannot proceed with fewer than three
    When I have fewer than three goals selected
    Then the Next button is disabled with "Choose 3 goals"
