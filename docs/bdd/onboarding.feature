# Combined Onboarding Features

@onboarding
Feature: Complete Onboarding Flow
  As a new athlete user
  I want to complete a guided setup process
  So I can start using StatLocker with my profile configured

  Background:
    Given the app launches for the first time

  # Name Screen
  Scenario: Enter valid names
    When I tap "Get Started"
    And I type "Erica" in First Name
    And I type "Brothers" in Last Name
    Then the Next button is enabled

  # Sport/Position/Grad Screen  
  Scenario: Complete sport and position selection
    Given I completed the Name screen
    When I select Gender "Boys"
    And I select Position "Goalie"
    And I select Grad Year "2025"
    Then Next is enabled

  # Team Info Screen
  Scenario: Complete team information
    Given I completed the Sport/Gender/Position/Grad Year screen
    When I enter required high school information
    Then the Next button is enabled

  # Goals Screen
  Scenario: Select three SMART goals
    Given I completed the Team Information screen
    When I select exactly 3 position-tailored goals
    Then the Next button is enabled

  # Review & Create Account
  Scenario: Create account successfully
    Given I completed the Goals screen
    When I enter valid email and strong password
    And I tap "Create Account & Enter Locker"
    Then a Firestore user document is created
    And I see the Congratulations screen

  # Congratulations
  Scenario: Complete onboarding
    Given the account was created successfully
    When I tap "Enter Locker"
    Then I land on the Dashboard tab
    And onboarding is marked complete
