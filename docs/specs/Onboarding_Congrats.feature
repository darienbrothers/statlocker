Feature: Onboarding – Congratulations
  Delight the user and route to the Dashboard

  Scenario: Show confetti and CTA
    Given the account was created successfully
    Then I see a "Congratulations" message with subtle animation
    And a button "Enter Locker"

  Scenario: Navigate to Dashboard
    When I tap "Enter Locker"
    Then I land on the Dashboard tab
    And onboarding is marked complete
