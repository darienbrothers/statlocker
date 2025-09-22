Feature: AI Insights (local calculations)
  Unlock after 3 games, show trends and recommendations

  Scenario: Locked state
    Given I have logged 2 games
    When I open AI Insights
    Then I see "Play 1 more game to unlock" with progress 2/3

  Scenario: Unlocked state
    Given I have logged 3 or more games
    When I open AI Insights
    Then I see trend cards with deltas and short explanations
    And I can tap "Why am I seeing this?" to view the calculation notes
