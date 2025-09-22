Feature: Onboarding – Name Screen
  Users enter their first and last name with validation

  Background:
    Given the app launches for the first time
    And I tap "Get Started"

  Scenario: Enter valid names
    When I type "Erica" in First Name
    And I type "Brothers" in Last Name
    Then the Next button is enabled

  Scenario: Missing first name blocks progress
    When I leave First Name empty
    And I type "Brothers" in Last Name
    Then the Next button is disabled
    And I see "First name is required"

  Scenario: Trim whitespace and capitalize
    When I type "  erica  " in First Name
    And I type "  BROTHERS " in Last Name
    And I tap Next
    Then my profile stores "Erica" and "Brothers"

  Scenario: Back from later step returns preserved values
    Given I completed the next step
    When I navigate Back to the Name screen
    Then the fields show my previous entries
