# Messages (Hamburger Menu)

## Objective
(Phase later) Athlete-only group threads or coach feedback DMs. MVP can stub UI.

## Features (later)
- **Threads list**; Thread view; compose; unread badges
- **Roles**: athlete → team group; coach → broadcast or DM

## Acceptance Criteria (when built)
- Messages load paginated
- Sending updates view instantly (optimistic) then confirms

## Tests
- **Unit**: message shaping, pagination cursors
- **RTL**: thread rendering, send flow with pending status
- **Integration**: emulator or mock server

## Analytics
- messages_view
- message_send
- thread_open
