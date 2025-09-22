Feature: Onboarding – Team Information
  Capture High School details and optional Club details

  Background:
    Given I completed the Sport/Gender/Position/Grad Year screen

  Scenario: High School required fields
    When I type "Duxbury High School" as School Name
    And I select "MA" as State
    And I type "Duxbury" as City
    Then the Next button is enabled

  Scenario: Optional jersey number
    When I enter jersey number "34"
    Then the value is saved but not required

  Scenario: Club toggle OFF hides club fields
    When I toggle "I also play Club" OFF
    Then Club Organization and Club Team fields are hidden

  Scenario: Club toggle ON shows and validates club fields
    When I toggle "I also play Club" ON
    Then Club Organization and Club Team fields appear
    And Club Jersey Number is optional

  Scenario: Preserve values when toggling
    Given I entered club fields
    When I toggle Club OFF and then ON again
    Then my previous club entries are restored
