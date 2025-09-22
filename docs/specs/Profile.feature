Feature: Profile
  View and edit profile; manage session

  Scenario: View profile
    When I open Profile
    Then I see my avatar, name, position, grad year, HS/Club info

  Scenario: Edit name
    When I change my name and tap Save
    Then I see "Profile updated"
    And my Firestore profile reflects the new name

  Scenario: Sign out
    When I tap "Sign Out"
    Then I return to the Auth screen
