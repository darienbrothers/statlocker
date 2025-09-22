Feature: Onboarding – Sport, Gender, Position, Grad Year
  Users choose sport, gender, a position filtered by gender, and grad year

  Background:
    Given I completed the Name screen

  Scenario: Default sport and valid selection
    When the screen opens
    Then Sport defaults to "Lacrosse"
    And Gender is unselected
    And Position is disabled until Gender is selected

  Scenario: Boys → position list filters correctly
    When I select Gender "Boys"
    Then the Position list includes "Goalie, Attack, Midfield, Defense, LSM, FOGO"
    And it does not include positions exclusive to Girls

  Scenario: Girls → position list filters correctly
    When I select Gender "Girls"
    Then the Position list includes "Goalie, Attack, Midfield, Defense"
    And it does not include "LSM" or "FOGO"

  Scenario: Grad Year required
    When I select Sport, Gender, and Position
    And I leave Grad Year unset
    Then Next is disabled with message "Select your graduation year"

  Scenario: All fields valid continue
    When I select valid Sport, Gender, Position, and Grad Year
    Then Next is enabled
    And tapping Next saves the selections locally
