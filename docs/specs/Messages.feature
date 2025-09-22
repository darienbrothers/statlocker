Feature: Messages (Phase Later)
  Basic thread list and message send (future)

  Scenario: View threads
    When I open Messages
    Then I see a list of threads with latest message previews

  Scenario: Send a message (future)
    When I type a message and tap Send
    Then it appears in the thread with a pending state
    And confirms when delivered
