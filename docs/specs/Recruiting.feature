Feature: Recruiting Organizer
  Manage Reach, Realistic, and Safe schools plus checklist and transcript

  Scenario: Add a school to Realistic
    When I tap "Add School"
    And I enter "Clemson University" and select "Realistic"
    Then the school appears under Realistic

  Scenario: Move a school between lists
    Given "Clemson University" is Realistic
    When I move it to "Reach"
    Then it appears under Reach and is removed from Realistic

  Scenario: Upload transcript
    When I upload a PDF transcript
    Then the file uploads to Storage
    And the URL is saved in my profile document
