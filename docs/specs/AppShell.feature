Feature: App Shell (Tabs + FAB)
  As an athlete
  I want a simple tab bar and a floating action button
  So I can navigate and log games quickly

  Background:
    Given the app is installed

  Scenario: App launches to Dashboard
    When the app launches
    Then the Dashboard tab is selected
    And the FAB is visible and enabled

  Scenario: Switching tabs preserves state
    Given I am on the Dashboard tab
    When I switch to the Stats tab
    And I switch back to the Dashboard tab
    Then the Dashboard content remains in its previous scroll position

  Scenario: Open FAB modal
    Given I am on any tab
    When I tap the FAB
    Then I feel haptic feedback
    And a modal shows options "Live Track a Game" and "Log a Post-Game"

  Scenario: Choose Post-Game from FAB
    Given the FAB modal is open
    When I tap "Log a Post-Game"
    Then the modal closes
    And I see the Post-Game screen

  Scenario: Choose Live Track from FAB
    Given the FAB modal is open
    When I tap "Live Track a Game"
    Then the modal closes
    And I see the Live Track screen (or a "Coming soon" stub)
