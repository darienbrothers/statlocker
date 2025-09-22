Feature: Post-Game Logging
  Quickly capture stats after a game and update aggregates

  Background:
    Given I am on the Post-Game screen from the FAB

  Scenario: Save valid game
    When I fill Date, Opponent, Home/Away
    And I enter Shots Faced "20", Saves "13", Goals Against "7"
    And I tap Save
    Then a game document is created
    And the Dashboard updates within 2 seconds

  Scenario: Division by zero handled
    When I enter Shots Faced "0" and Saves "0"
    Then Save% displays 0% and no error is thrown

  Scenario: Add notes and cards (optional)
    When I add a note "Windy conditions"
    And I set Yellow cards "1"
    Then these fields are saved with the game

  Scenario: Validation blocks missing required fields
    When I leave Opponent empty
    Then the Save button is disabled
    And I see "Opponent is required"
