@recruiting
Feature: Recruiting Organization
  As an athlete
  I want to organize target schools and manage recruiting tasks
  So I can stay on top of my college recruiting process

  Background:
    Given I am logged in
    And I am on the Recruiting tab

  Scenario: Add school to category
    When I tap "Add School"
    And I enter "Clemson University" 
    And I select category "Realistic"
    Then the school appears under the Realistic list
    And it's saved to Firestore

  Scenario: Move school between categories
    Given "Clemson University" exists in "Realistic"
    When I move it to "Reach" category
    Then it appears under Reach
    And it's removed from Realistic
    And the change is saved to Firestore

  Scenario: Upload transcript document
    When I tap "Upload Transcript"
    And I select a PDF file
    Then the file uploads to Firebase Storage
    And the URL is saved in my profile document
    And I see the filename displayed

  Scenario: Upload failure handling
    When I attempt to upload an invalid file
    Then I see "Couldn't upload. Try again or pick another file."
    And I can retry the upload
