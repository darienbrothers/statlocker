# Recruiting Tab

## Objective
Help athletes organize their target schools (Reach / Realistic / Safe), manage simple tasks, and store transcript.

## Features
- **Lists**: three columns or segmented tabs for categories
- **School Card**: name, division, location; optional link
- **Checklist**: "Build resume", "Email intro", "Request transcript", etc.
- **Docs**: upload transcript (Storage URL in profile)
- **Roadmap**: season-based timeline suggestions (local logic)

## Gherkin
```gherkin
Feature: Recruiting Organizer
  Scenario: Add a school to a category
    Given I am on Recruiting
    When I tap "Add School"
    And I enter school info and choose "Realistic"
    Then the school appears in the Realistic list
```

## Acceptance Criteria
- Schools persist under users/{uid}/recruiting/schools/{schoolId}
- Moving a school between categories updates UI & doc
- Upload success shows preview or filename + size
- No third-party "matching AI" for MVP; purely user-driven

## Tests
- **Unit**: zod for school form; category transitions
- **RTL**: add/edit/move school; checklist toggle
- **Integration**: file upload mocked → URL saved

## Analytics
- recruiting_view
- school_add
- school_move
- doc_upload
