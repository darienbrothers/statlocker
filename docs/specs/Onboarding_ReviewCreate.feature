Feature: Onboarding – Review & Create Account
  Summarize all choices and create an account with strong password rules

  Background:
    Given I completed the Goals screen

  Scenario: Summary shows all selections
    When the Review screen opens
    Then I see my Name, Sport, Gender, Position, Grad Year, High School, and Club (if any)
    And I see the 3 selected SMART goals with their targets

  Scenario: Strong password enforced
    When I enter an Email and Password "StatLocker1"
    Then the strength meter indicates "Pass"
    And the Create Account button is enabled

  Scenario: Weak password blocks
    When I enter Password "password"
    Then I see "Must be 8+ characters with upper, lower, and a number"
    And Create Account is disabled

  Scenario: Account creation success
    Given my inputs are valid
    When I tap "Create Account & Enter Locker"
    Then a Firestore user document is created
    And I see the Congratulations screen
