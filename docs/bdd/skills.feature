@skills
Feature: Skills & Drills Library
  As an athlete
  I want to access position-specific drills and track my progress
  So I can improve my skills systematically

  Background:
    Given I am logged in
    And I am on the Skills tab

  Scenario: Filter drills by position and type
    When I filter by Position "Goalie" and Type "Reflexes"
    Then I see only goalie reflex drills
    And other drills are hidden

  Scenario: Complete a drill
    Given I have selected a drill
    When I tap "Mark Complete"
    Then my weekly progress increases
    And the completion timestamp is saved
    And I see updated progress indicators

  Scenario: Empty state for filtered results
    Given I apply filters with no matching drills
    When the filter results are empty
    Then I see "No drills found. Try different filters."
    And I can clear or modify filters

  Scenario: Weekly target tracking
    Given I have completed drills this week
    When I view my weekly targets
    Then I see progress toward goals like "Wall Ball 3x/week"
    And completion percentages are accurate
